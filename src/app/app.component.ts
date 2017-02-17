import {Component, ViewChild} from "@angular/core";
import {Events, Platform, MenuController, Nav} from "ionic-angular";
import {Splashscreen, Deeplinks} from "ionic-native";
import {LoginComponent, LogoutComponent} from "../pages/auth/auth";
import {AwsUtil} from "../providers/aws.service";
import {VoterBallotListPage} from "../pages/voter-ballot-list/voter-ballot-list";
import {ManageBallotsPage} from "../pages/manage-ballots/manage-ballots";
import {UserLoginService} from "../providers/cognito.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl;

  public loginPage = LoginComponent;
  public homePage = VoterBallotListPage;
  public logoutPage = LogoutComponent;
  public manageBallots = ManageBallotsPage;

  public rootPage:any;


  constructor(public platform:Platform,
              public menu:MenuController,
              public events:Events,
              public awsUtil:AwsUtil,
              public userLogin:UserLoginService) {
    console.log("In MyApp constructor");

    this.platform.ready().then(() => {

      this.awsUtil.initAwsService();

      this.userLogin.isAuthenticated().then((loggedIn) => {
        if(loggedIn){
          this.rootPage = this.homePage;
        }else{
          this.rootPage = this.loginPage;
        }
        console.log("Hiding splash screen");
        Splashscreen.hide();
      }).catch((err) => {
        this.rootPage = this.loginPage;
      });
      this.listenToLoginEvents();
    });

  }

  ngOnInit() {
    console.log("MyApp: ngAfterViewInit called");
    this.platform.ready().then(() => {
      Deeplinks.routeWithNavController(this.navCtrl, {
        '/ballot/:ballotId': VoterBallotListPage
      }).subscribe((match) => {
        console.log('Successfully matched route route=', JSON.stringify(match));

        var ballotId = match.$link.path.substring(1);
        console.log("deep loading ballot: "+ballotId);
        if(this.navCtrl != undefined) {
          this.navCtrl.setRoot(VoterBallotListPage, {"ballotId": ballotId});
        }else{
          console.error("this.nav is undefined!")
        }

      }, (nomatch) => {
        // nomatch.$link - the full link data
        console.error('Got a deeplink that didn\'t match', nomatch);
      });
    });
  }

  openPage(page) {
    // Reset the nav controller to have just this page
    // we wouldn't want the back button to show in this scenario
    console.log("setting page to "+(typeof page));
    this.navCtrl.setRoot(page);

    // close the menu when clicking a link from the menu
    this.menu.close();
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });


    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
  }

}
