import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Http, Headers, RequestOptions} from '@angular/http';
import {_NETVOTE_API_ENDPOINT, _ENV_NAME, _NETVOTE_API_KEY} from "./properties.service";
import {CognitoUtil} from './cognito.service';
/*
 Generated class for the VoteService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */




@Injectable()
export class VoteService {

    constructor(public cognito: CognitoUtil, public http: Http) {}

    getAdminBallots(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getApi("/admin/ballot").then((data) => {
                console.log(JSON.stringify(data));
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getAdminBallot(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getApi("/admin/ballot/"+id).then((data) => {
                console.log(JSON.stringify(data));
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getBallotResults(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getApi("/admin/ballot/"+id+"/results").then((data) => {
                console.log(JSON.stringify(data));
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    createBallot(ballot): Promise<any> {
        return new Promise((resolve, reject) => {
            this.postApi("/admin/ballot", ballot).then((data) => {
                console.log(JSON.stringify(data));
                resolve(data.ballot);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    shareBallot(ballotId, smsList, emailList): Promise<any> {
        return new Promise((resolve, reject) => {

            let payload = {
                "sms": smsList,
                "email": emailList
            };

            this.postApi("/admin/ballot/"+ballotId+"/share", payload).then((data) => {
                console.log(JSON.stringify(data));
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    deleteBallot(ballotId): Promise<any> {
        return new Promise((resolve, reject) => {
            this.deleteApi("/admin/ballot/"+ballotId).then((data) => {
                console.log(JSON.stringify(data));
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getVoterBallots(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getApi("/vote/ballot").then((data) => {
                console.log(JSON.stringify(data));
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getVoterBallot(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getApi("/vote/ballot/"+id).then((data) => {
                console.log("result="+JSON.stringify(data));
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    castVote(vote): Promise<any> {
        return new Promise((resolve, reject) => {
            this.postApi("/vote/ballot/"+vote.ballotId, vote.decisions).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    addVoterBallot(id) {
        //adds ballot id to my list
    }

    private deleteApi(path): Promise<any> {
        return this.voteApiRequest("DELETE", path, null)
    }

    private postApi(path, data): Promise<any> {
        return this.voteApiRequest("POST", path, data)
    }

    private getApi(path): Promise<any> {
        return this.voteApiRequest("GET", path, null)
    }

    private voteApiRequest(method, path, body): Promise<any>{
        return this.cognito.getIdToken().then((idtoken) => {
            return new Promise((resolve, reject) => {

                let opt: RequestOptions
                let myHeaders: Headers = new Headers
                myHeaders.set('Authorization', idtoken);
                myHeaders.set('x-api-key', _NETVOTE_API_KEY);
                myHeaders.append('Content-type', 'application/json')

                opt = new RequestOptions({
                    method: method,
                    headers: myHeaders,
                    body: body
                });

                path = this.apiUrl(path);

                console.log(method+": "+path);
                console.log("payload: "+JSON.stringify(body));

                this.http.request(path, opt).map(res => res.json()).subscribe(data => {
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




}
