import { Component, OnInit } from '@angular/core';
import { ScoreboardsService } from '../scoreboards.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/events/events.service';
import { NoticesService } from 'src/app/services/notices.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NetworkService } from 'src/app/services/network.service';
import { Scoreboard } from '../scoreboard.model';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Score } from '../score.model';
import { Event } from 'src/app/events/event.model';

@Component({
  selector: 'app-shoot-off',
  templateUrl: './shoot-off.page.html',
  styleUrls: ['./shoot-off.page.scss'],
})
export class ShootOffPage implements OnInit {

  constructor(
    private scoreboardService: ScoreboardsService,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private notice: NoticesService,
    private http: HttpClient,
    private router: Router,
    private network: NetworkService
  ) { }

  scores: Score[];
  noScores = true;
  scoresLoaded = false;
  scoresSub;

  eventID = null;
  eventSub;
  eventLoaded = false;
  event: Event;

  squadSort = false;
  domain = environment.domain;
  scoreForm: FormGroup;
  scoreGroup: FormGroup;
  shootOffData = {
    APIMode: 'Shoot Off',
    eventID: null,
    scores: [],
  };
  ngOnInit() {

    this.eventID = this.route.snapshot.paramMap.get('eventID');
    this.scoreGroup = new FormGroup({
      userID: new FormControl(),
      initials: new FormControl(),
      surname: new FormControl(),
      class: new FormControl(),
      category: new FormControl(),
      grandTotal: new FormControl(),
      squadNumber: new FormControl(),
    });
    this.scoreForm = new FormGroup({
      scores: new FormArray([]),
    });

    this.scoresSub = this.scoreboardService.scoresUpdated.subscribe(
      (scores: Score[]) => {
        this.scoresLoaded = true;
        console.log(scores);
        if (scores !== null) {
          scores.forEach(score => {
            const scoresArr = this.scoreForm.get('scores') as FormArray;
            const scoreGroup = new FormGroup({
              userID: new FormControl(score.userID, Validators.required),
              initials: new FormControl(score.initials, Validators.required),
              surname: new FormControl(score.surname, Validators.required),
              category: new FormControl(score.category),
              class: new FormControl(score.class),
              member: new FormControl(score.surname + ', ' + score.initials + '.', Validators.required),
              grandTotal: new FormControl(score.grandTotal,
                Validators.compose([Validators.min(0), Validators.max(25), Validators.pattern('^[0-9]*$')])),
              squadNumber: new FormControl(score.squadNumber)
            });
            scoresArr.push(scoreGroup);
          });
          console.log(this.scoreForm);
          this.scores = scores;
          this.noScores = false;
        } else {
          this.noScores = true;
        }
      }
    );
    this.eventSub = this.eventsService.eventUpdated.subscribe(
      (event: Event) => {
        this.eventLoaded = true;
        this.event = event;
      }
    );

  }
  getScoreControls() {
    return (this.scoreForm.get('scores') as FormArray).controls;
  }
  save() {
    //TODO Offline Mode
    if (!this.scoreForm.invalid) {
      this.notice.presentLoader();
      this.shootOffData.eventID = this.eventID;
      this.getScoreControls().forEach(score => {
        console.log(score);
        this.shootOffData.scores.push({ 'userID': score.value.userID, 'score': score.value.grandTotal });
      });
      console.log(this.shootOffData);
      this.http.post(this.domain + '/api/v2/scoreboards', this.shootOffData).subscribe(
        (resp: any) => {
          this.notice.dismissLoader();
          this.notice.presentToast('Added to Shoot Off', 'success');
          this.router.navigate(['/scoreboard-capture-scores', this.eventID]);
        },
        (error: HttpErrorResponse) => {
          this.notice.dismissLoader();
          this.notice.presentToast('Unable to add to Shoot Off', 'danger');
        }
      );
    } else {
      this.notice.presentToast('You have not completed all the required fields.', 'danger');
    }
  }

  ionViewDidEnter() {
    this.loadScoreboard();

  }
  loadScoreboard() {
    this.scoreboardService.fetchShootOffScores(this.eventID);
    this.eventsService.fetchEvent(this.eventID);
  }

  ionViewDidLeave() {
    this.scoresSub.unsubscribe();
    this.eventSub.unsubscribe();
  }

}
