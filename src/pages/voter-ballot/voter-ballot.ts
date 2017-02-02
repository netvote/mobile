import { Component } from '@angular/core';
import {NavController, NavParams, LoadingController, Loading, AlertController} from 'ionic-angular';
import {VoteService} from "../../providers/vote.service";
import {VoterBallotListPage} from "../voter-ballot-list/voter-ballot-list";
/*
  Generated class for the VoterBallot page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-voter-ballot',
  templateUrl: 'voter-ballot.html'
})
export class VoterBallotPage {

  ballot: any = {};
  ballotId: string;
  loader: Loading;
  decisions: any = [];
  voterDecisions: any = {};

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public navParam:NavParams, public voteService: VoteService) {
    this.ballotId = navParam.get("ballotId")
  }

  ionViewDidLoad() {
    console.log('Hello VoterBallotPage Page');
    this.loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "loading ballot..."
    });
    this.loader.present();
    this.voteService.getVoterBallot(this.ballotId).then((ballot) => {
      var decisions = ballot.Decisions;
      this.ballot = ballot.Ballot;
      if(decisions.length == 0){
        this.loader.dismiss();
        let prompt = this.alertCtrl.create({
          title: 'Already Voted',
          message: "You have already voted for this ballot. Thanks!",
          buttons: [
            {
              text: 'Ok',
              handler: data => {
                this.navCtrl.setRoot(VoterBallotListPage)
              }
            }
          ]
        });
        prompt.present();
      }else {
        this.decisions = decisions;
        this.loader.dismiss();
        console.log("loaded ballots: " + this.decisions);
      }
    })
  }

  getDecisionScores(){
    let scores = [];
    console.log("voterDecisions = "+JSON.stringify(this.voterDecisions))
    for(let decisionId in this.voterDecisions){
      console.log("decisionId="+decisionId);
      if(this.voterDecisions.hasOwnProperty(decisionId)) {
        let score = {
          "DecisionId": decisionId,
          "Selections": {}
        };
        score.Selections[this.voterDecisions[decisionId]] = 1;
        scores.push(score);
      }
    }
    return scores;
  }

  castVote(){
    this.loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "casting vote..."
    });
    this.loader.present();

    let voterDecisions = this.getDecisionScores();

    this.voteService.castVote({
      ballotId: this.ballotId,
      decisions: voterDecisions
    }).then((result) => {
      setTimeout(() => {
        this.loader.dismiss();
        this.navCtrl.setRoot(VoterBallotListPage)
      }, 3000);
    })
  }



  isVoteDisabled(){
    for(var decision of this.decisions){
      if(this.voterDecisions[decision.Id] === undefined){
        return true;
      }
    }
    return false;
  }

}
