import { Component } from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import { VoteService } from "../../providers/vote.service";
import { VoterBallotPage } from "../voter-ballot/voter-ballot";


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

  ballots: any = [];

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public voteService: VoteService) {}

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "loading ballots..."
    });
    loader.present();
    console.log('Hello VoterBallotListPage Page');
    this.voteService.getVoterBallots().then((ballots) => {
      let tempBallots = [];
      console.log('ballots: '+JSON.stringify(ballots));
      for(var i=0; i<ballots.length; i++){
        if(ballots[i].Id != ""){
          tempBallots.push(ballots[i]);
        }
      }
      this.ballots = tempBallots;
      loader.dismiss();
      console.log("loaded ballots: "+this.ballots);
    }).catch((err) => {
      console.error(err);
    })
  }

  openBallot(ballotId:string){
    this.navCtrl.push(VoterBallotPage, {
      "ballotId": ballotId
    })
  }

}
