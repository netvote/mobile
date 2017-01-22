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

  ballot: any;
  decisions: any = [];
  voterDecisions: any = {};

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public navParam:NavParams, public voteService: VoteService) {
    this.ballot = navParam.get("ballot")
  }

  ionViewDidLoad() {
    console.log('Hello VoterBallotPage Page');
    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "loading ballot..."
    });
    loader.present();
    this.voteService.getVoterBallotDecisions(this.ballot.Id).then((decisions) => {
      this.decisions = decisions;
      loader.dismiss();
      console.log("loaded ballots: "+this.decisions);
    })
  }

  castVote(){
    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "casting vote..."
    });
    loader.present();
    this.voteService.castVote({
      ballot: this.ballot,
      decision: this.decisions
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
