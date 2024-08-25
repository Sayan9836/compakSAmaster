import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from 'src/app/events/events.service';
import { Province } from 'src/app/provinces/province.model';
import { ProvincesService } from 'src/app/provinces/provinces.service';
import { Scoreboard } from '../scoreboard.model';
import { ScoreboardsService } from '../scoreboards.service';
import { Event } from 'src/app/events/event.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NoticesService } from 'src/app/services/notices.service';
import { ProvincialTeamsService } from 'src/app/provincialTeams/provincial-teams.service';
import { TeamMember } from 'src/app/provincialTeams/teamMember.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-scoreboard-teams',
  templateUrl: './scoreboard-teams.page.html',
  styleUrls: ['./scoreboard-teams.page.scss'],
})
export class ScoreboardTeamsPage implements OnInit {

  constructor(
    private provincesService: ProvincesService,
    private scoreboardService: ScoreboardsService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private notice: NoticesService,
    private provincialTeamsService: ProvincialTeamsService,
    private location: Location
  ) { }

  // Provinces
  provinces: Province[];
  loadingProvinces = false;

  // Scoreboard
  scoreboard: Scoreboard;
  scoreboardLoaded = false;
  scoreForm: FormGroup;
  scoreGroup: FormGroup;
  noScoreboard = false;

  // Teams
  teamMembers: TeamMember[];
  loadingTeams = false;

  // Events
  eventID = null;
  eventLoaded = false;
  event: Event;

  // General
  subs = [];
  domain = environment.domain;
  saving = false;

  ngOnInit() {
    this.eventID = this.route.snapshot.paramMap.get('eventID');
    this.scoreGroup = new FormGroup({
      userID: new FormControl(),
      initials: new FormControl(),
      surname: new FormControl(),
      class: new FormControl(),
      category: new FormControl(),
      range1Score: new FormControl(),
      range2Score: new FormControl(),
      range3Score: new FormControl(),
      range4Score: new FormControl(),
      range5Score: new FormControl(),
      range6Score: new FormControl(),
      range7Score: new FormControl(),
      range8Score: new FormControl(),
      day1Total: new FormControl(),
      day2Total: new FormControl(),
      grandTotal: new FormControl(),
      highGunPercentage: new FormControl(),
      squadNumber: new FormControl(),
      shootOff: new FormControl()
    });
    this.scoreForm = new FormGroup({
      scores: new FormArray([]),
      overallLeaders: new FormArray([]),
      mensLeaders: new FormArray([this.scoreGroup]),
      seniorLeaders: new FormArray([this.scoreGroup]),
      veteranLeaders: new FormArray([this.scoreGroup]),
      mastersLeaders: new FormArray([this.scoreGroup]),
      ladiesLeaders: new FormArray([this.scoreGroup]),
      juniorLeaders: new FormArray([this.scoreGroup]),
      classALeaders: new FormArray([this.scoreGroup]),
      classBLeaders: new FormArray([this.scoreGroup]),
      classCLeaders: new FormArray([this.scoreGroup]),
      provinceLeaders: new FormArray([this.scoreGroup])
    });
  }
  loadTeams() {
    this.loadingTeams = true;
    this.provincialTeamsService.fetchTeams(this.eventID);
  }
  ionViewDidEnter() {
    this.loadProvinces();
    this.subs.push(
      this.provincesService.provincesLoaded.subscribe(
        (provinces: Province[]) => {
          this.loadingProvinces = false;
          this.provinces = provinces;
          console.log(provinces);
        }
      )
    );
    this.loadTeams();
    this.subs.push(
      this.provincialTeamsService.teamsLoaded.subscribe(
        (teamMembers: TeamMember[]) => {
          this.loadingTeams = false;
          this.teamMembers = teamMembers;
          console.log(teamMembers);
        }
      )
    );
    this.loadScoreboard();
    this.subs.push(
      this.scoreboardService.scoreboardUpdated.subscribe(
        (scoreboard: Scoreboard) => {
          this.scoreboardLoaded = true;
          console.log(scoreboard);
          this.scoreForm = new FormGroup({
            scores: new FormArray([]),
            overallLeaders: new FormArray([]),
            mensLeaders: new FormArray([this.scoreGroup]),
            seniorLeaders: new FormArray([this.scoreGroup]),
            veteranLeaders: new FormArray([this.scoreGroup]),
            mastersLeaders: new FormArray([this.scoreGroup]),
            ladiesLeaders: new FormArray([this.scoreGroup]),
            juniorLeaders: new FormArray([this.scoreGroup]),
            classALeaders: new FormArray([this.scoreGroup]),
            classBLeaders: new FormArray([this.scoreGroup]),
            classCLeaders: new FormArray([this.scoreGroup]),
            provinceLeaders: new FormArray([this.scoreGroup])
          });
          if (scoreboard !== null) {
            scoreboard.scores.forEach(score => {
              const scoresArr = this.scoreForm.get('scores') as FormArray;
              let province = null;
              this.teamMembers.forEach(teamMember => {
                if (teamMember.userID === String(score.userID)) {
                  province = String(teamMember.provinceID);
                }
              });
              const scoreGroup = new FormGroup({
                userID: new FormControl(score.userID, Validators.required),
                initials: new FormControl(score.initials, Validators.required),
                surname: new FormControl(score.surname, Validators.required),
                member: new FormControl(score.surname + ', ' + score.initials + '.', Validators.required),
                class: new FormControl(score.class, Validators.required),
                category: new FormControl(score.category, Validators.required),
                province: new FormControl(province)
              });
              scoresArr.push(scoreGroup);
            });
            console.log(this.scoreForm);
            this.scoreboard = scoreboard;
            // console.log(this.scoreForm);
            // console.log(this.scoreForm.controls.scores);
            this.noScoreboard = false;
          } else {
            this.noScoreboard = true;
          }
        }
      )
    );
    this.subs.push(
      this.eventsService.eventUpdated.subscribe(
        (event: Event) => {
          this.eventLoaded = true;
          this.event = event;
        }
      )
    );
  }
  save() {
    console.log(this.scoreForm);
    this.saving = true;
    let teamData = {
      members: []
    };
    this.scoreForm.value.scores.forEach(score => {
      if (score.province !== null) {
        teamData.members.push({
          eventID: this.eventID,
          userID: score.userID,
          provinceID: score.province
        });
      }
    });
    console.log(teamData);
    this.http.post(this.domain + '/api/v2/provincialTeams', teamData).subscribe(
      (resp: any) => {
        this.saving = false;
        this.notice.presentToast('Member added to team', 'success');
        this.location.back();
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.saving = false;
        this.notice.presentToast('A critical error occured.', 'danger');
      }
    );
  }
  confirmClear() {
    this.notice.presentAlertConfirm('You have chosen to clear the provincial teams override. This cannot be undone.', () => { this.clear(); });
  }
  clear() {
    this.saving = true;
    this.http.delete(this.domain + '/api/v2/provincialTeams/' + this.eventID).subscribe(
      (resp: any) => {
        this.saving = false;
        this.notice.presentToast('Provincial Team Override Removed', 'success');
        this.location.back();
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.saving = false;
        this.notice.presentToast('A critical error occured.', 'danger');
      }
    );
  }
  getScoreControls() {
    return (this.scoreForm.get('scores') as FormArray).controls;
  }
  loadScoreboard() {
    console.log('Loading Scoreboard');
    this.scoreboardService.fetchScoreboard(this.eventID, 'captureByShooter');
    this.eventsService.fetchEvent(this.eventID);
  }

  loadProvinces() {
    this.loadingProvinces = true;
    this.provincesService.fetchProvinces();
  }

  ionViewDidLeave() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
