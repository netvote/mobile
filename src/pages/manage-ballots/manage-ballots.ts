import { Component } from '@angular/core';
import {NavController, LoadingController, AlertController, ActionSheetController} from 'ionic-angular';
import { VoteService } from "../../providers/vote.service";
import {BallotResultsPage} from "../ballot-results/ballot-results";

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

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public voteService: VoteService, public alertCtrl: AlertController) {}

  doRefresh(refresher){
    this.voteService.getAdminBallots().then((ballots) => {
      refresher.complete();
      this.ballots = ballots;
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
    console.log('Hello ManageBallotsPage Page');
    this.voteService.getAdminBallots().then((ballots) => {
      loader.dismiss();
      this.ballots = ballots;
    }).catch((err) => {
      console.error(err);
    })
  }

  openMore(ballotId){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ballot Options',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteBallot(ballotId);
          }
        },{
          text: 'Share',
          handler: () => {
            this.shareBallot(ballotId)
          }
        },{
          text: 'Share to Me (dev)',
          handler: () => {
            this.sendShareBallot(ballotId, ["+16788965681"], ["steven.landers@gmail.com"])
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  openEditBallot(ballotId){

  }

  openResults(ballotId){
    this.navCtrl.push(BallotResultsPage, {
      "ballotId": ballotId
    })
  }

  shareBallot(ballotId){
    let prompt = this.alertCtrl.create({
      title: 'Enter Phone',
      message: "Enter a phone number to send this ballot to",
      inputs: [
        {
          name: 'phone',
          placeholder: 'Phone Number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Send',
          handler: data => {
            this.sendShareBallot(ballotId, ["+"+data.phone], [])
          }
        }
      ]
    });
    prompt.present();
  }

  private sendShareBallot(ballotId, phones, emails){
    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "sharing ballot..."
    });
    loader.present();
    this.voteService.shareBallot(ballotId, phones, emails).then((result) => {
      loader.dismiss();
    })
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
        "Requires2FA": false,
        "Attributes":{
          "Image": "http://www.biologicaldiversity.org/news/press_releases/2016/images/BaldEagle_RobinSilver.jpg"
        }
      },
      "Decisions": [{
        "Name": "What is your favorite color?",
        "Options": [{
          "Id": "red",
          "Name": "Red"
        }, {
          "Id": "blue",
          "Name": "Blue"
        },{
          "Id": "green",
          "Name": "Green"
        }]
      }, {
        "Name": "What is your favorite beer?",
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
