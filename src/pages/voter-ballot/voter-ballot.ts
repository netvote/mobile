import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {VoteService} from "../../providers/vote.service";
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

  constructor(public navCtrl: NavController, public navParam:NavParams, public voteService: VoteService) {
    this.ballot = navParam.get("ballot")
  }

  ionViewDidLoad() {
    console.log('Hello VoterBallotPage Page');
    this.voteService.getVoterBallotDecisions(this.ballot.Id).then((decisions) => {
      this.decisions = decisions;
      console.log("loaded ballots: "+this.decisions);
    })
  }

  castVoteDisabled(){
    for(var decision of this.decisions){
      if(this.voterDecisions[decision.Id] === undefined){
        return true;
      }
    }
    return false;
  }

}
