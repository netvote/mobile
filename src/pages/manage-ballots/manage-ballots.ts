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

  private createBallot(ballot){
    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "creating ballot..."
    });
    loader.present();
    this.voteService.createBallot(ballot).then((result) => {
      loader.dismiss();
      this.navCtrl.setRoot(ManageBallotsPage)
    })
  }

  openNewBallot(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ballot Options',
      buttons: [
        {
          text: 'One-Time',
          handler: () => {
            this.createBallot(this.getMockBallot(false))
          }
        },{
          text: 'One-Time 2FA',
          handler: () => {
            this.createBallot(this.getMockBallot(true))
          }
        },{
          text: 'Repeatable',
          handler: () => {
            this.createBallot(this.getMockRepeatableBallot())
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

  private getMockRepeatableBallot(){
    return {
      "Ballot": {
        "Name": "MLB All Star Ballot",
        "Description": "You may vote every 10 seconds for your MLB pick",
        "Requires2FA": false,
        "Attributes":{
          "Image": "https://upload.wikimedia.org/wikipedia/en/6/69/Mlb-asg-2017.png"
        }
      },
      "Decisions": [{
        "Name": "Who is your pick?",
        "Repeatable": true,
        "RepeatVoteDelaySeconds": 10,
        "Options": [{
          "Id": "john",
          "Name": "John"
        }, {
          "Id": "chris",
          "Name": "Chris"
        },{
          "Id": "sam",
          "Name": "Sam"
        }]
      }]
    };
  }

  private getMockBallot(has2Factor){
    return {
      "Ballot": {
        "Name": "Beer Choices",
        "Description": "Help us pick your beer."+(has2Factor? " This requires 2FA." : ""),
        "Requires2FA": has2Factor,
        "Attributes":{
          "Image": "https://rafflecreator.s3.amazonaws.com/2b3fc509-82bb-4d03-8d47-cfe0bd0bba3c.jpg"
        }
      },
      "Decisions": [{
        "Name": "What is your favorite beer color?",
        "Options": [{
          "Id": "red",
          "Name": "Red"
        }, {
          "Id": "gold",
          "Name": "Gold"
        },{
          "Id": "brown",
          "Name": "Brown"
        }]
      }, {
        "Name": "Do you like hops?",
        "Options": [{
          "Id": "yes",
          "Name": "Yes"
        }, {
          "Id": "no",
          "Name": "No"
        }, {
          "Id": "sometimes",
          "Name": "Sometimes"
        }]
      }]
    };
  }


}
