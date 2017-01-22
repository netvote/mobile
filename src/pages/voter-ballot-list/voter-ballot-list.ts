import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {VoteService} from "../../providers/vote.service";

/*
  Generated class for the VoterBallotList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-voter-ballot-list',
  templateUrl: 'voter-ballot-list.html'
})
export class VoterBallotListPage {

  constructor(public navCtrl: NavController, public voteService: VoteService) {}

  ionViewDidLoad() {
    console.log('Hello VoterBallotListPage Page');
  }

}
