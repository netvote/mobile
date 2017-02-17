import {Component, ViewChild} from '@angular/core';
import {
  NavController, LoadingController, ActionSheetController, AlertController, NavParams,
  Searchbar
} from 'ionic-angular';
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

  @ViewChild(Searchbar) searchBar;

  ballots: any = [];
  filteredBallots: any = [];
  searchText: string = null;
  ballotId: string = null;
  loader: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,  public actionSheetCtrl: ActionSheetController, public navParam:NavParams, public voteService: VoteService, public alertCtrl: AlertController) {
    this.ballotId = this.navParam.get("ballotId");
  }


  doRefresh(refresher){
    this.voteService.getVoterBallots().then((ballots) => {
      this.ballots = ballots;
      this.filterBallotsByString(this.searchBar.value);
      refresher.complete();
      console.log("loaded ballots: "+this.ballots);
    }).catch((err) => {
      console.error(err);
    })
  }

  filterBallots(ev: any) {
    this.filterBallotsByString(ev.target.value);
  }

  private filterBallotsByString(val: string){
    if(val && val.trim()) {
      this.filteredBallots = this.ballots.filter((b) => {
        return (b.Name+b.Description).toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    }else{
      this.filteredBallots = this.ballots;
    }
  }

  private initBallotListPage(){
    this.loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "loading ballots..."
    });
    this.loader.present();
    this.loadBallot().then((ballotName)=>{
      this.voteService.getVoterBallots().then((ballots) => {
        this.ballots = ballots;
        if(ballotName) {
          this.searchBar.value = ballotName;
          this.filterBallotsByString(ballotName)
        }else{
          this.searchBar.value = "";
          this.filteredBallots = ballots;
        }
        this.loader.dismiss();
        console.log("loaded ballots: "+this.ballots);
      }).catch((err) => {
        console.error(err);
      })
    })
  }

  ionViewDidEnter() {
    this.initBallotListPage();
  }

  loadBallot(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.ballotId == null){
        resolve(null);
      }else{
        this.voteService.getVoterBallot(this.ballotId).then((ballot) => {
          this.ballotId = null;
          if(ballot.Decisions.length == 0){
            this.loader.dismiss();

            let prompt = this.alertCtrl.create({
              title: 'Already Voted',
              message: "You have already voted for this ballot. Thanks!",
              buttons: [
                {
                  text: 'Ok',
                  handler: data => {
                    resolve(null)
                  }
                }
              ]
            });
            prompt.present();
          }else{
            resolve(ballot.Ballot.Name)
          }
        }).catch((err) => {
          if(err.status == 404){
            this.loader.dismiss();
            let prompt = this.alertCtrl.create({
              title: 'Ballot not available',
              message: "This ballot is not available.",
              buttons: [
                {
                  text: 'Ok',
                  handler: data => {
                    resolve(null)
                  }
                }
              ]
            });
            prompt.present();
          }else {
            reject(err);
          }
        });
      }
    });
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
                    this.ballotId = data.ballotId;
                    this.initBallotListPage();
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
        this.ballotId = ballotId;
        this.initBallotListPage();
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
