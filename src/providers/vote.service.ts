import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Http, Headers, RequestOptions} from '@angular/http';
import {_NETVOTE_API_ENDPOINT, _ENV_NAME} from "./properties.service";
import {CognitoUtil} from './cognito.service';
/*
 Generated class for the VoteService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */




@Injectable()
export class VoteService {

    constructor(public cognito: CognitoUtil, public http: Http) {
        console.log('Hello VoteService Provider 2');
        this.cognito.getAccessToken().then((accessToken: string) => {
            console.log("token = " + accessToken);
        }).catch((ex) => {
            console.log("ERROR!");
        });
    }

    getVoterBallots(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.httpGet("/vote/ballots").then((data) => {
                console.log(JSON.stringify(data));
                resolve(data.ballots);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getVoterBallotDecisions(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.httpGet("/vote/ballots/"+id).then((data) => {
                resolve(data.decisions);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    castVote(vote): Promise<any> {
        return new Promise((resolve, reject) => {
            this.httpPost("/vote/ballots/"+vote.ballot.Id, vote.decisions).then((data) => {
                resolve(data.result);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    private httpPost(path, data): Promise<any> {
        return this.voteApiRequest("POST", path, data)
    }

    private httpGet(path): Promise<any> {
        return this.voteApiRequest("GET", path, null)
    }

    private voteApiRequest(method, path, body): Promise<any>{
        return this.cognito.getIdToken().then((idtoken) => {
            console.log("id token = "+idtoken);
            return new Promise((resolve, reject) => {

                let opt: RequestOptions
                let myHeaders: Headers = new Headers
                myHeaders.set('Authorization', idtoken);
                myHeaders.append('Content-type', 'application/json')

                opt = new RequestOptions({
                    method: method,
                    headers: myHeaders,
                    body: body
                });

                this.http.request(this.apiUrl(path), opt).map(res => res.json()).subscribe(data => {
                    resolve(data);
                }, error => {
                    console.error("ERROR: "+JSON.stringify(error));
                    reject(error);
                });
            });
        });
    }

    private apiUrl(path): string{
        return _NETVOTE_API_ENDPOINT[_ENV_NAME]+path;
    }

    addVoterBallot(id) {
        //adds ballot id to my list
    }


}
