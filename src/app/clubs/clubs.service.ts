import { Injectable, EventEmitter } from "@angular/core";
import { Club } from "./club.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ClubsService {
  domain = environment.domain;
  clubsLoaded = new EventEmitter<Club[]>();
  clubLoaded = new EventEmitter<Club>();
  constructor(private http: HttpClient) {}
  // this.domain + '/api/v2/clubs'
  fetchClubs() {
    this.http
      .get<Club[]>("https://new.compaksa.co.za/wp-json/api/v2/clubs")
      .subscribe(
        (resp) => {
          // console.log(resp);
          this.clubsLoaded.emit(resp);
        },
        (error: HttpErrorResponse) => {
          console.log(error.status + " - " + error.statusText);
        },
      );
  }
  fetchClub(clubID) {
    //this.domain + "/api/v2/clubs/" + clubID
    this.http
      .get<Club>("https://new.compaksa.co.za/wp-json/api/v2/clubs/" + clubID)
      .subscribe(
        (resp) => {
          // console.log(resp);
          this.clubLoaded.emit(resp);
        },
        (error: HttpErrorResponse) => {
          console.log(error.status + " - " + error.statusText);
        },
      );
  }
}
