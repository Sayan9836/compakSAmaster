import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { MenusService } from './menus/menus.service';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { MenuGroup } from './menus/menuGroup.model';
import { NoticesService } from './services/notices.service';
import { DatabaseService } from './services/database.service';
import { NetworkService } from './services/network.service';
import { ScoreboardsService } from './scoreboards/scoreboards.service';
import { Capacitor, Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private menusService: MenusService,
    private authService: AuthService,
    private router: Router,
    private notice: NoticesService,
    private database: DatabaseService,
    private network: NetworkService,
    private scoreboardService: ScoreboardsService
  ) {
    this.initializeApp();
  }

  menuGroup: MenuGroup;
  menusLoaded = false;
  authenticated = false;
  offline = false;
  offlineToken = null;
  version = environment.deployVersion;
  initializeApp() {
    this.notice.createLoader();
    this.authService.autoLogin();
    // this.database.getObject('token').then(
    //   (offlineToken) => {
    //     if (offlineToken !== null) {
    //       console.log(offlineToken);
    //       this.authService.setToken(offlineToken);
    //       this.menusService.fetchMenus();
    //       this.authenticated = this.authService.isAuthenticated();
    //     }
    //   }
    // );
    this.network.networkChanges();
    this.network.connectionChange.subscribe(
      (connected) => {
        if (connected) {
          this.notice.presentToast("Syncing offline data", "success");
          this.scoreboardService.processUpdates();
        }
      }
    );
    this.database.getItem('sync').then(
      data => {
        if (data === 'true') {
          this.offline = true;
        } else {
          this.offline = false;
        }
      }
    );
    this.authService.authenticatedLogin.subscribe(
      (valid: boolean) => {
        console.log(valid);
        if (valid) {
          this.menusService.fetchMenus();
        } else {
          this.authService.logout('Unable to validate token');
        }
      }
    );
    this.menusService.menusLoaded.subscribe(
      (menuGroup: MenuGroup) => {
        this.menuGroup = menuGroup;
        this.menusLoaded = true;
        this.authenticated = this.authService.isAuthenticated();
      }
    );
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }
  toggleOffline() {
    this.database.offlineMode(!this.offline);
    // this.network.connected = !this.network.connected;
    if (!this.offline) {
      this.notice.presentToast('Offline mode activated. Any items you view now will be saved for offline usage.', 'success');
    } else {
      this.notice.presentToast('Offline mode de-activated. Items will no longer be accessible when offline', 'danger');
    }
  }
  logout() {
    // this.database.removeItem('token');
    this.authService.destroyAuth();
    this.router.navigate(['/']);
  }
}
