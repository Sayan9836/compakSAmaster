import { Injectable, EventEmitter } from "@angular/core";
import { User } from "./user.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  usersLoaded = new EventEmitter<User[]>();
  constructor(private http: HttpClient, private authService: AuthService) {}

  domain = environment.domain;
  fetchUsers(state, entriesPP, currentPage, search) {
    let query =
      state + "&entriesPP=" + entriesPP + "&currentPage=" + currentPage;
    if (search !== null) {
      query += "&search=" + search;
    } else {
      query = state + "&entriesPP=" + entriesPP + "&currentPage=" + currentPage;
    }
    console.log(this.domain + "/api/v1/accounts?state=" + query);
    this.http
      .get<User[]>(
        "https://new.compaksa.co.za/wp-json/api/v2/accounts/members?state=" +
          query,
      )
      .subscribe(
        (resp) => {
          // console.log(resp);
          this.usersLoaded.emit(resp);
        },
        (error: HttpErrorResponse) => {
          console.log(error.status + " - " + error.statusText);
        },
      );
  }
}
