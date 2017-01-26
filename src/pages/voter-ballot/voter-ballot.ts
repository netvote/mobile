import { Component } from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
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

  ballotId: string;
  decisions: any = [];
  voterDecisions: any = {};

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public navParam:NavParams, public voteService: VoteService) {
    this.ballotId = navParam.get("ballotId")
  }

  ionViewDidLoad() {
    console.log('Hello VoterBallotPage Page');
    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "loading ballot..."
    });
    loader.present();
    this.voteService.getVoterBallotDecisions(this.ballotId).then((decisions) => {
      this.decisions = decisions;
      loader.dismiss();
      console.log("loaded ballots: "+this.decisions);
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
    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "casting vote..."
    });
    loader.present();

    let voterDecisions = this.getDecisionScores();

    this.voteService.castVote({
      ballotId: this.ballotId,
      decisions: voterDecisions
    }).then((result) => {
        loader.dismiss();
        this.navCtrl.setRoot(VoterBallotListPage)
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
