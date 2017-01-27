import { Component } from '@angular/core';
import {NavController, LoadingController, NavParams} from 'ionic-angular';
import {VoteService} from "../../providers/vote.service";

/*
  Generated class for the BallotResults page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ballot-results',
  templateUrl: 'ballot-results.html'
})
export class BallotResultsPage {

  ballotId: string;
  ballot: any = {"Ballot":{},"Decisions":[]};
  results: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public navParams: NavParams, public voteService:VoteService) {
    this.ballotId = navParams.get("ballotId");
    this.voteService = voteService;
  }

  private updateDecisions(results){
    for(let i=0; i<this.ballot.Decisions.length; i++){
      let dResults = results.Results[this.ballot.Decisions[i].Id].Results.ALL;
      let dOptions = this.ballot.Decisions[i].Options;
      for (let j = 0; j < dOptions.length; j++) {
        let optionCount = dResults == undefined ? undefined : dResults[dOptions[j].Id];
        optionCount = optionCount ? optionCount : 0;
        this.ballot.Decisions[i].Options[j]["Results"] = optionCount;
      }
      this.ballot.Decisions[i].Options.sort((a, b) => {
        if (a.Results > b.Results) return -1;
        if (a.Results < b.Results) return 1;
        return 0
      })
    }
  }

  ionViewDidLoad() {
    console.log('Hello BallotResultsPage Page');

    let loader = this.loadingCtrl.create({
      spinner: "crescent",
      content: "loading results..."
    });
    loader.present();
    this.voteService.getAdminBallot(this.ballotId).then((ballot) => {
      this.ballot = ballot;
      console.log("ballot:"+ballot);
      return this.voteService.getBallotResults(this.ballotId)
    }).then((results) => {
      this.updateDecisions(results);
      this.results = results;
      console.log(JSON.stringify(this.ballot));
      loader.dismiss();
    }).catch((err) => {
      console.error(err.message)
    });
  }

}
