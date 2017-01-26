import { Component } from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import { VoteService } from "../../providers/vote.service";

/*
  Generated class for the ManageBallots page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-manage-ballots',
  templateUrl: 'manage-ballots.html'
})
export class ManageBallotsPage {

  ballots: any = [];

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public voteService: VoteService) {}

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "loading ballots..."
    });
    loader.present();
    console.log('Hello ManageBallotsPage Page');
    this.voteService.getAdminBallots().then((ballots) => {
      loader.dismiss();
      this.ballots = ballots;
    }).catch((err) => {
      console.error(err);
    })
  }

  openEditBallot(ballotId){

  }

  openResults(ballotId){

  }

  deleteBallot(ballotId){
    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "deleting ballot..."
    });
    loader.present();
    this.voteService.deleteBallot(ballotId).then((result) => {
      loader.dismiss();
      this.navCtrl.setRoot(ManageBallotsPage)
    })
  }

  openNewBallot(){
    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "creating ballot..."
    });
    loader.present();
    let ballot = this.getMockBallot();
    this.voteService.createBallot(ballot).then((result) => {
      loader.dismiss();
      this.navCtrl.setRoot(ManageBallotsPage)
    })
  }

  private getMockBallot(){
    return {
      "Ballot": {
        "Name": "Test Election",
        "Description": "This is for demoing basic functionality.",
        "Requires2FA": false
      },
      "Decisions": [{
        "Name": "What is your favorite color?",
        "Options": [{
          "Id": "red",
          "Name": "Red"
        }, {
          "Id": "blue",
          "Name": "Blue"
        }]
      }, {
        "Name": "Pick your two favorite beers",
        "Options": [{
          "Id": "ipa",
          "Name": "IPA"
        }, {
          "Id": "pils",
          "Name": "Pilsner"
        }]
      }]
    };
  }


}
