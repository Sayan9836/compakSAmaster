import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { User } from "../users/user.model";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  accountLoaded = new EventEmitter<User>();
  formTokenLoaded = new EventEmitter<string>();
  constructor(private http: HttpClient, private authService: AuthService) {}

  domain = environment.domain;
  fetchDetails(userID) {
    //this.domain + '/api/v1/accounts/' + userID
    //https://new.compaksa.co.za/wp-json/api/v2/user_details/` + userID
    this.http
      .get<User>(
        `https://new.compaksa.co.za/wp-json/api/v2/user_details/` + userID,
      )
      .subscribe(
        (resp) => {
          // console.log(resp);
          this.accountLoaded.emit(resp);
        },
        (error: HttpErrorResponse) => {
          console.log(error.status + " - " + error.statusText);
        },
      );
  }

  registerFormToken() {
    this.http
      .get<any>(this.domain + "/api/v1/accounts?APIMode=formToken")
      .subscribe(
        (resp) => {
          // console.log(resp);
          this.formTokenLoaded.emit(resp.token);
        },
        (error: HttpErrorResponse) => {
          console.log(error.status + " - " + error.statusText);
        },
      );
  }
}
