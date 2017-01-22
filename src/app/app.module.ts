import {NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {
  CognitoUtil,
  UserLoginService,
  UserParametersService,
  UserRegistrationService
} from "../providers/cognito.service";
import {AwsUtil} from "../providers/aws.service";
import {
  LoginComponent,
  LogoutComponent,
  RegisterComponent,
  ConfirmRegistrationComponent,
  ResendCodeComponent,
  ForgotPasswordStep1Component,
  ForgotPasswordStep2Component
} from "../pages/auth/auth";
import {VoterBallotListPage} from "../pages/voter-ballot-list/voter-ballot-list";
import {Storage} from "@ionic/storage";
import {EventsService} from "../providers/events.service";
import {VoteService} from "../providers/vote.service";
import {VoterBallotPage} from "../pages/voter-ballot/voter-ballot";

@NgModule({
  declarations: [
    MyApp,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    ConfirmRegistrationComponent,
    ResendCodeComponent,
    ForgotPasswordStep1Component,
    ForgotPasswordStep2Component,
    VoterBallotListPage,
    VoterBallotPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    ConfirmRegistrationComponent,
    ResendCodeComponent,
    ForgotPasswordStep1Component,
    ForgotPasswordStep2Component,
    VoterBallotListPage,
    VoterBallotPage
  ],
  providers: [CognitoUtil,
    AwsUtil,
    UserLoginService,
    UserParametersService,
    UserRegistrationService,
    VoteService,
    Storage,
    EventsService]
})

export class AppModule {
}
