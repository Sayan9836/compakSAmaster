import { Injectable, EventEmitter } from "@angular/core";
import { MenuGroup } from "./menuGroup.model";
import { environment } from "src/environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AlertController } from "@ionic/angular";
import { DatabaseService } from "../services/database.service";
import { NetworkService } from "../services/network.service";
import { NoticesService } from "../shared/services/notices.service";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class MenusService {
  domain = environment.domain;
  version = environment.version;
  menusLoaded = new EventEmitter<MenuGroup[]>();
  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private database: DatabaseService,
    private network: NetworkService,
    private notice: NoticesService,
    private auth: AuthService,
  ) {}

  fetchMenus() {
    if (this.network.connected) {
      //this.domain + '/api/v1/menus?type=App&version=' + this.version
      // https://new.compaksa.co.za/wp-json/api/v2/menus?type=App&version=` + this.version,

      this.http
        .get<MenuGroup[]>(
          `https://new.compaksa.co.za/wp-json/api/v2/menus?type=App&version=` +
            this.version,
        )
        .subscribe(
          (resp) => {
            // console.log(resp);
            this.menusLoaded.emit(resp);
            if (this.database.sync) {
              this.syncMenus(resp);
            }
          },
          (error: HttpErrorResponse) => {
            console.log("Menu error to follow:");
            console.log(error);
            this.auth.logout("Unable to load menus. Logging out.");
          },
        );
    } else {
      this.database.getObject("menus").then((resp) => {
        this.menusLoaded.emit(resp);
        // console.log('Offline Data Provided');
      });
    }
  }

  syncMenus(resp) {
    this.database.setObject("menus", resp);
  }
}
