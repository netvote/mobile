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

    this.verify2FA().then((code) => {
      this.loader = this.loadingCtrl.create({
        spinner: "crescent",
        content: "casting vote..."
      });
      this.loader.present();

      let voterDecisions = this.getDecisionScores();

      this.voteService.castVote({
        ballotId: this.ballotId,
        decisions: voterDecisions
      }, code).then((result) => {
        setTimeout(() => {
          this.loader.dismiss();
          this.navCtrl.setRoot(VoterBallotListPage)
        }, 3000);
      }).catch((err)=>{
        let title = "Error";
        let message = "Something went wrong";
        if(err.status == 401) {
          message = (this.ballot.Requires2FA) ? "The code is invalid." : "Unauthorized";
        }
          let prompt = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
              {
                text: 'Ok',
                handler: data => {}
              }
            ]
          });
          prompt.present();
          this.loader.dismiss();
      })
    }).catch((err)=>{});

  }

  private verify2FA():Promise<any>{
    return new Promise((resolve, reject) => {
      if(this.ballot.Requires2FA){
        this.voteService.sendSMSCode("+16788965681").then((resp) =>{
          let prompt = this.alertCtrl.create({
            title: 'Enter Two-Factor Code',
            message: "Enter code from SMS",
            inputs: [
              {
                name: 'code',
                placeholder: 'Code'
              },
            ],
            buttons: [
              {
                text: 'Cancel',
                handler: data => {
                  reject();
                }
              },
              {
                text: 'Send',
                handler: data => {
                  resolve(data.code);
                }
              }
            ]
          });
          prompt.present();
        });
      }else{
        resolve(null)
      }
    });
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
