import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {CognitoUtil} from './cognito.service';
/*
  Generated class for the VoteService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

  export const MOCK_BALLOT_LIST = [{
        "Id":"ba0d6eee-6f45-4a0c-b3f7-2f8659b72c2b",
        "Name":"Holiday Party",
        "Description": "What sort of holiday party should we have?",
        "Image": "/assets/img/eagle.jpg"
  }];

  export const MOCK_BALLOT_DECISIONS =[{
    "Id": "favorite-color",
    "Name": "What is your favorite color?",
    "BallotId": "ba0d6eee-6f45-4a0c-b3f7-2f8659b72c2b",
    "Options": [{
        "Id": "red",
        "Name": "The Color Red",
        "Props": {
            "key": "value"
        }
    }, {
        "Id": "blue",
        "Name": "The Color Blue",
        "Props": {
            "key": "value"
        }
    }],
    "Props": {
        "key": "value"
    },
    "Repeatable": false,
    "RepeatVoteDelayNS": 0,
    "ResponsesRequired": 1
}, {
    "Id": "favorite-beer",
    "Name": "What is your favorite beer?",
    "BallotId": "47db9c36-af07-4383-baaf-0e143c4cb232",
    "Options": [{
        "Id": "IPA",
        "Name": "IPA",
        "Props": {
            "key": "value"
        }
    }, {
        "Id": "pils",
        "Name": "Pilsner",
        "Props": {
            "key": "value"
        }
    }],
    "Props": {
        "key": "value"
    },
    "Repeatable": false,
    "RepeatVoteDelayNS": 0,
    "ResponsesRequired": 1
}];





@Injectable()
export class VoteService {

  constructor(public cognito: CognitoUtil) {
    console.log('Hello VoteService Provider 2');
    this.cognito.getAccessToken().then((accessToken:string) => {
	   console.log("token = "+accessToken);
    }).catch((ex)=>{
   	    console.log("ERROR!");
    });
  }

  getVoterBallots(): Promise<any>{
      return new Promise((resolve, reject) => {
          resolve(MOCK_BALLOT_LIST);
      });
  }

  getVoterBallotDecisions(id): Promise<any>{
      return new Promise((resolve, reject) => {
          resolve(MOCK_BALLOT_DECISIONS);
      });
  }

  castVote(vote){

  }

  addVoterBallot(id){
	//adds ballot id to my list
  }


}
