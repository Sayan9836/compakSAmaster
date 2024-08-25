import { Injectable, EventEmitter } from "@angular/core";
import { User } from "../users/user.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  usersLoaded = new EventEmitter<any[]>();
  constructor(private http: HttpClient) {}

  domain = environment.domain;
  loadPaidMembersByProvince() {
    //${this.domain}/api/v2/reports/paidMembersByProvince
    this.http
      .get<any[]>(`https://new.compaksa.co.za/wp-json/api/v2/paid/province`)
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
  loadPaidMembersByClub() {
    //${this.domain}/api/v2/reports/paidMembersByClub
    this.http
      .get<any[]>(`https://new.compaksa.co.za/wp-json/api/v2/paid/clubs`)
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
  loadMembersRegisteredForEvent(eventID) {
    this.http
      .get<any[]>(
        `https://new.compaksa.co.za/wp-json/api/v2/reports?type=registeredForEvent&eventID=${eventID}`,
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
