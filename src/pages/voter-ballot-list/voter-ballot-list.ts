import { Component } from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import { VoteService } from "../../providers/vote.service";
import { VoterBallotPage } from "../voter-ballot/voter-ballot";
import {BarcodeScanner} from "ionic-native";


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


  doRefresh(refresher){
    this.voteService.getVoterBallots().then((ballots) => {
      this.ballots = ballots;
      refresher.complete();
      console.log("loaded ballots: "+this.ballots);
    }).catch((err) => {
      console.error(err);
    })
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "loading ballots..."
    });
    loader.present();
    console.log('Hello VoterBallotListPage Page');
    this.voteService.getVoterBallots().then((ballots) => {
      this.ballots = ballots;
      loader.dismiss();
      console.log("loaded ballots: "+this.ballots);
    }).catch((err) => {
      console.error(err);
    })
  }

  scan(){
    BarcodeScanner.scan().then((barcodeData) => {
      console.log("barcode = "+JSON.stringify(barcodeData));
      if(barcodeData && barcodeData.text) {
        var ballotId = barcodeData.text.substring(barcodeData.text.lastIndexOf("/") + 1);
        this.openBallot(ballotId);
      }
    }, (err) => {
      console.error("bardcode error: "+err);
      // An error occurred
    });
  }


  openBallot(ballotId:string){
    this.navCtrl.push(VoterBallotPage, {
      "ballotId": ballotId
    })
  }

}
