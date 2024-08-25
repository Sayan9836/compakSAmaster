import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TeamMember } from './teamMember.model';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProvincialTeamsService {

  domain = environment.domain;
  teamsLoaded = new EventEmitter<TeamMember[]>();
  constructor(
    private http: HttpClient
  ) { }

  fetchTeams(eventID) {
    this.http.get<TeamMember[]>(this.domain + '/api/v2/provincialTeams/' + eventID).subscribe(
      resp => {
        console.log(resp);
        this.teamsLoaded.emit(resp);
      },
      (error: HttpErrorResponse) => {
        console.log(error.status + ' - ' + error.statusText);
      }
    );
  }
}
