import { Injectable, EventEmitter } from "@angular/core";
import { environment } from "src/environments/environment";
import { Province } from "./province.model";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ProvincesService {
  domain = environment.domain;
  provincesLoaded = new EventEmitter<Province[]>();
  constructor(private http: HttpClient) {}

  fetchProvinces() {
    this.http.get<Province[]>(this.domain + "/api/v1/provinces").subscribe(
      (resp) => {
        // console.log(resp);
        this.provincesLoaded.emit(resp);
      },
      (error: HttpErrorResponse) => {
        console.log(error.status + " - " + error.statusText);
      },
    );
  }
}
