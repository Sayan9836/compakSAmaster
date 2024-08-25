import { Injectable, EventEmitter } from "@angular/core";
import { JwtHelper } from "angular2-jwt";
import { Plugins } from "@capacitor/core";
import { map } from "rxjs/operators";
import { from } from "rxjs";
import { NoticesService } from "../shared/services/notices.service";
import { Router } from "@angular/router";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private jwtHelper: JwtHelper = new JwtHelper();

  authenticatedLogin = new EventEmitter<boolean>();
  token: string;
  permissions = [];

  public isAuthenticated(): boolean {
    console.log(this.token);
    return this.token != null && !this.jwtHelper.isTokenExpired(this.token);
  }

  public isValid(token): boolean {
    return !this.jwtHelper.isTokenExpired(token);
  }

  public decodeToken() {
    // console.log(this.jwtHelper.decodeToken(this.token));
    return this.jwtHelper.decodeToken(this.token);
  }

  public setToken(token: string) {
    console.log("HERE IS THE NEW TOKEN:" + token);
    this.token = token;
    const decodedToken = this.decodeToken();
    console.log("decodedToken => ", decodedToken);

    this.permissions = decodedToken.permissions;
    this.storeAuthData(token);
  }

  public getToken() {
    return this.token;
  }
  public getUserID() {
    const decodedToken = this.decodeToken();
    console.log(decodedToken);
    return decodedToken.data.user.id;
  }

  public destroyAuth() {
    this.token = null;
    Plugins.Storage.remove({ key: "token" });
  }
  public logout(msg) {
    if (msg !== null) {
      this.notice.presentToast(msg, "danger");
    }
    this.destroyAuth();
    this.router.navigate(["/"]);
  }
  public storeAuthData(token: string) {
    console.log("Store:" + token);
    Plugins.Storage.set({ key: "token", value: token });
  }

  public async autoLogin() {
    const token = await Plugins.Storage.get({ key: "token" });
    if (token.value !== null) {
      this.setToken(token.value);
      if (this.isAuthenticated()) {
        this.authenticatedLogin.emit(true);
      } else {
        this.logout("Invalid Token");
      }
    } else {
      this.logout("Redirecting to Login");
    }
    // this.token = token.value;
    // console.log(token);
    return token;
  }

  constructor(private notice: NoticesService, private router: Router) {}
}
