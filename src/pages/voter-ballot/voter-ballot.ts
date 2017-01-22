import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public voteService: VoteService) {}

  ionViewDidLoad() {
    console.log('Hello VoterBallotPage Page');
  }

}
