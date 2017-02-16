import { Component } from '@angular/core';
import {NavController, LoadingController, ActionSheetController, AlertController} from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,  public actionSheetCtrl: ActionSheetController, public voteService: VoteService, public alertCtrl: AlertController) {}


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

  add(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Add Ballot',
      buttons: [
        {
          icon: "qr-scanner",
          text: 'Scan QR Code',
          handler: () => {
            this.scan()
          }
        },{
          icon: 'add',
          text: 'Enter Code',
          handler: () => {
            let prompt = this.alertCtrl.create({
              title: 'Enter Ballot Code',
              message: "Enter the ballot code",
              inputs: [
                {
                  name: 'ballotId',
                  placeholder: 'Ballot Code'
                },
              ],
              buttons: [
                {
                  text: 'Cancel',
                  handler: data => {
                  }
                },
                {
                  text: 'Add',
                  handler: data => {
                    this.openBallot(data.ballotId);
                  }
                }
              ]
            });
            prompt.present();
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
