import { Component, OnInit } from '@angular/core';
import { AccountService } from './account.service';
import { AuthService } from '../auth/auth.service';
import { ScoreboardsService } from '../scoreboards/scoreboards.service';
import { Document } from '../documents/document.model';
import { User } from '../users/user.model';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private scoreboardsService: ScoreboardsService
  ) { }

  accountLoaded = false;
  noAccount = true;
  accountSub;
  user: User;
  userID = null;
  eventHistory: Document;
  scoreboardsSub;
  noEventHistory = true;

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.userID = this.authService.getUserID();
    this.accountSub = this.accountService.accountLoaded.subscribe(
      (resp) => {
        console.log(resp);
        if (resp !== null) {
          this.user = resp;
          this.noAccount = false;
        } else {
          this.noAccount = true;
        }
        this.accountLoaded = true;
      }
    );
    this.accountService.fetchDetails(this.userID);
    this.scoreboardsSub = this.scoreboardsService.eventHistoryUpdated.subscribe(
      (eventHistory) => {
        console.log(eventHistory);
        this.eventHistory = eventHistory;
        if (eventHistory === null) {
          this.noEventHistory = true;
        } else {
          this.noEventHistory = false;
        }
      }
    );
    this.scoreboardsService.fetchHistory();
  }
  loadEventHistory() {
    window.open(this.eventHistory.location, '_system');
  }
  //TODO Test on App that certificates open in browser
  async memberCert() {
    console.log('member cert');
    await Browser.open({ toolbarColor: "#f4dc41", url: 'https://www.compaksa.co.za/memberCertificate.php?userid=' + this.userID });
    // window.open('https://www.compaksa.co.za/memberCertificate.php?userid=' + this.userID, '_system');
  }
  async memberCard() {
    console.log('member cert');
    await Browser.open({ toolbarColor: "#f4dc41", url: 'https://www.compaksa.co.za/membershipCard.php?userid=' + this.userID });
    // window.open('https://www.compaksa.co.za/membershipCard.php?userid=' + this.userID, '_system');
  }
  async shooterCert() {
    console.log('member cert');
    await Browser.open({ toolbarColor: "#f4dc41", url: 'https://www.compaksa.co.za/dedicatedShooterCertificate.php?userid=' + this.userID });
    // window.open('https://www.compaksa.co.za/dedicatedShooterCertificate.php?userid=' + this.userID, '_system');
  }
  ionViewDidLeave(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.accountSub.unsubscribe();
    this.scoreboardsSub.unsubscribe();
  }
}
