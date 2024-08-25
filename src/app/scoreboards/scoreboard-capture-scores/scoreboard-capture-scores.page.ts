import { Component, OnInit } from '@angular/core';
import { ScoreboardsService } from '../scoreboards.service';
import { Scoreboard } from '../scoreboard.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/events/events.service';
import { Event } from 'src/app/events/event.model';
import { FormGroup, FormArray, FormControl, Validators, Form } from '@angular/forms';
import { NoticesService } from 'src/app/services/notices.service';
import { Score } from '../score.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatabaseService } from 'src/app/services/database.service';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-scoreboard-capture-scores',
  templateUrl: './scoreboard-capture-scores.page.html',
  styleUrls: ['./scoreboard-capture-scores.page.scss'],
})
export class ScoreboardCaptureScoresPage implements OnInit {

  constructor(
    private scoreboardService: ScoreboardsService,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private notice: NoticesService,
    private http: HttpClient,
    private router: Router,
    private database: DatabaseService,
    private network: NetworkService
  ) { }

  scoreboard: Scoreboard;
  noScoreboard = true;
  scoreboardLoaded = false;
  scoreboardSub;

  loading = false;
  eventID = null;
  eventSub;
  eventLoaded = false;
  event: Event;

  squadSort = false;
  domain = environment.domain;
  scoreForm: FormGroup;
  scoreGroup: FormGroup;
  scoreData = {
    APIMode: "Save Scoreboard",
    eventID: null,
    event: null,
    date: null,
    scores: [],
    overallLeaders: [],
    mensLeaders: [],
    seniorLeaders: [],
    veteranLeaders: [],
    mastersLeaders: [],
    ladiesLeaders: [],
    juniorLeaders: [],
    classALeaders: [],
    classBLeaders: [],
    classCLeaders: [],
    provinceLeaders: []
  }
  shootOffData = {
    APIMode: 'Shoot Off',
    eventID: null,
    scores: []
  };
  ngOnInit() {

    this.eventID = this.route.snapshot.paramMap.get("eventID");
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
  shootOff(userID, event) {
    //TODO offline shoot off
    if (!event.target.checked) {
      this.shootOffData.eventID = this.eventID;
      this.shootOffData.scores.push({ 'userID': userID, 'score': 0 });
      this.http.post(this.domain + '/api/v2/scoreboards', this.shootOffData).subscribe(
        (resp: any) => {
          this.notice.presentToast('Added to Shoot Off', 'success');
        },
        (error: HttpErrorResponse) => {
          this.notice.presentToast('Unable to add to Shoot Off', 'danger');
        }
      );
      console.log(this.shootOffData);
    } else {
      this.http.delete(this.domain + '/api/v2/scoreboards/' + this.eventID + '/&APIMode=shootOff&userID=' + userID).subscribe(
        (resp: any) => {
          this.notice.presentToast('Removed from Shoot Off', 'success');
        },
        (error: HttpErrorResponse) => {
          this.notice.presentToast('Unable to remove from Shoot Off', 'danger');
        }
      );
    }
  }
  calculateClasses() {
    this.loading = true;
    this.http.get<any>(`${this.domain}/api/v2/classCalculator/${this.eventID}`).subscribe(
      resp => {
        this.loading = false;
        this.loadScoreboard();
        this.notice.presentToast('Scoreboard calculation completed', 'success');
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.notice.presentToast('Scoreboard calculation completed', 'success');
        this.loading = false;
        // this.notice.presentToast('Unable to calculate scoreboard', 'danger');
      }
    );
  }
  getScoreControls() {
    return (this.scoreForm.get('scores') as FormArray).controls;
  }
  save() {
    if (!this.scoreForm.invalid) {
      this.updateScore(0);
      this.notice.presentLoader();
      this.scoreData.eventID = this.eventID;
      this.scoreData.event = this.scoreboard.event;
      this.scoreData.date = this.scoreboard.date;
      this.scoreData.scores = [];
      this.scoreData.overallLeaders = [];
      this.scoreData.mensLeaders = [];
      this.scoreData.seniorLeaders = [];
      this.scoreData.veteranLeaders = [];
      this.scoreData.mastersLeaders = [];
      this.scoreData.ladiesLeaders = [];
      this.scoreData.juniorLeaders = [];
      this.scoreData.classALeaders = [];
      this.scoreData.classBLeaders = [];
      this.scoreData.classCLeaders = [];
      this.scoreData.provinceLeaders = [];

      const scoresArr = this.scoreForm.get('scores') as FormArray;
      scoresArr.value.sort(
        (a, b) => (a.surname > b.surname) ? 1 : -1
      );
      this.scoreData.scores = [];
      scoresArr.value.forEach(score => {
        this.scoreData.scores.push(score);
      });
      const overallLeaders = this.scoreForm.get('overallLeaders') as FormArray;
      overallLeaders.value.forEach(score => {
        this.scoreData.overallLeaders.push(score);
      });
      const mensLeaders = this.scoreForm.get('mensLeaders') as FormArray;
      mensLeaders.value.forEach(score => {
        this.scoreData.mensLeaders.push(score);
      });
      const seniorLeaders = this.scoreForm.get('seniorLeaders') as FormArray;
      seniorLeaders.value.forEach(score => {
        this.scoreData.seniorLeaders.push(score);
      });
      const veteranLeaders = this.scoreForm.get('veteranLeaders') as FormArray;
      veteranLeaders.value.forEach(score => {
        this.scoreData.veteranLeaders.push(score);
      });
      const mastersLeaders = this.scoreForm.get('mastersLeaders') as FormArray;
      mastersLeaders.value.forEach(score => {
        this.scoreData.mastersLeaders.push(score);
      });
      const ladiesLeaders = this.scoreForm.get('ladiesLeaders') as FormArray;
      ladiesLeaders.value.forEach(score => {
        this.scoreData.ladiesLeaders.push(score);
      });
      const juniorLeaders = this.scoreForm.get('juniorLeaders') as FormArray;
      juniorLeaders.value.forEach(score => {
        this.scoreData.juniorLeaders.push(score);
      });
      const classALeaders = this.scoreForm.get('classALeaders') as FormArray;
      classALeaders.value.forEach(score => {
        this.scoreData.classALeaders.push(score);
      });
      const classBLeaders = this.scoreForm.get('classBLeaders') as FormArray;
      classBLeaders.value.forEach(score => {
        this.scoreData.classBLeaders.push(score);
      });
      const classCLeaders = this.scoreForm.get('classCLeaders') as FormArray;
      classCLeaders.value.forEach(score => {
        this.scoreData.classCLeaders.push(score);
      });
      const provinceLeaders = this.scoreForm.get('provinceLeaders') as FormArray;
      provinceLeaders.value.forEach(score => {
        this.scoreData.provinceLeaders.push(score);
      });
      console.log(this.scoreData);
      console.log(this.scoreForm);
      if (this.network.connected) {
        this.http.post(this.domain + '/api/v2/scoreboards', this.scoreData).subscribe(
          (resp: any) => {
            this.notice.presentToast('Successfully saved.', 'success');
            this.notice.dismissLoader();
            this.router.navigate(['/event-details', this.eventID]);
          },
          (error: HttpErrorResponse) => {
            console.log(error);
            this.notice.presentToast('A critical error occured.', 'danger');
            this.notice.dismissLoader();
          }
        );
      } else {
        this.scoreboardService.syncScoreboardDetails(this.scoreData);
        this.scoreboardService.storeUpdates(this.scoreData);
        // this.scoreboardService.processUpdates();
        console.log(this.scoreData);
        this.notice.presentToast('Saved offline', 'success');
        this.notice.dismissLoader();
      }
    } else {
      this.notice.presentToast('You have not completed all the required fields.', 'danger');
    }
  }

  updateScore(i) {
    const scoresArr = this.scoreForm.get('scores') as FormArray;
    // console.log(scoresArr);
    if (scoresArr.status === "VALID") {
      scoresArr.value[i].day1Total =
        Number(scoresArr.value[i].range1Score) +
        Number(scoresArr.value[i].range2Score) +
        Number(scoresArr.value[i].range3Score) +
        Number(scoresArr.value[i].range4Score);
      scoresArr.value[i].day2Total =
        Number(scoresArr.value[i].range5Score) +
        Number(scoresArr.value[i].range6Score) +
        Number(scoresArr.value[i].range7Score) +
        Number(scoresArr.value[i].range8Score);
      scoresArr.value[i].grandTotal = Number(scoresArr.value[i].day1Total) + Number(scoresArr.value[i].day2Total);
      scoresArr.value.sort(
        (a, b) => (a.grandTotal > b.grandTotal) ? -1 : 1
      );
      const highGun = scoresArr.value[0].grandTotal;
      scoresArr.value.forEach(score => {
        score.highGunPercentage = score.grandTotal / highGun;
      });

      //Calc and Store Overall Leaders
      (this.scoreForm.controls.overallLeaders as FormArray).clear();
      this.storeLeaders('overallLeaders', scoresArr.value);

      //Sort by Class and Score
      scoresArr.value.sort(function (a, b) {
        var aClass = a.class;
        var bClass = b.class;
        var aTotal = a.highGunPercentage;
        var bTotal = b.highGunPercentage;
        // console.log(aLow + " | " + bLow);

        if (aClass == bClass) {
          return (aTotal < bTotal) ? 1 : (aTotal > bTotal) ? -1 : 0;
        }
        else {
          return (aClass < bClass) ? -1 : 1;
        }
      });

      //Store Class Leaders
      const classA = scoresArr.value.filter(item => item.class === "A");
      const classB = scoresArr.value.filter(item => item.class === "B");
      const classC = scoresArr.value.filter(item => item.class === "C");
      (this.scoreForm.controls.classALeaders as FormArray).clear();
      (this.scoreForm.controls.classBLeaders as FormArray).clear();
      (this.scoreForm.controls.classCLeaders as FormArray).clear();
      this.storeLeaders('classALeaders', classA);
      this.storeLeaders('classBLeaders', classB);
      this.storeLeaders('classCLeaders', classC);

      //Sort by Category and Score
      scoresArr.value.sort(function (a, b) {
        var aCategory = a.category;
        var bCategory = b.category;
        var aTotal = a.highGunPercentage;
        var bTotal = b.highGunPercentage;
        // console.log(aLow + " | " + bLow);

        if (aCategory == bCategory) {
          return (aTotal < bTotal) ? 1 : (aTotal > bTotal) ? -1 : 0;
        }
        else {
          return (aCategory < bCategory) ? -1 : 1;
        }
      });

      //Store Category Leaders
      const mens = scoresArr.value.filter(item => item.category === "Men");
      const seniors = scoresArr.value.filter(item => item.category === "Senior");
      const veterans = scoresArr.value.filter(item => item.category === "Veteran");
      const masters = scoresArr.value.filter(item => item.category === "Masters");
      const ladies = scoresArr.value.filter(item => item.category === "Ladies");
      const juniors = scoresArr.value.filter(item => item.category === "Junior");
      (this.scoreForm.controls.mensLeaders as FormArray).clear();
      (this.scoreForm.controls.seniorLeaders as FormArray).clear();
      (this.scoreForm.controls.veteranLeaders as FormArray).clear();
      (this.scoreForm.controls.mastersLeaders as FormArray).clear();
      (this.scoreForm.controls.ladiesLeaders as FormArray).clear();
      (this.scoreForm.controls.juniorLeaders as FormArray).clear();
      (this.scoreForm.controls.provinceLeaders as FormArray).clear();
      this.storeLeaders('mensLeaders', mens);
      this.storeLeaders('seniorLeaders', seniors);
      this.storeLeaders('veteranLeaders', veterans);
      this.storeLeaders('mastersLeaders', masters);
      this.storeLeaders('ladiesLeaders', ladies);
      this.storeLeaders('juniorLeaders', juniors);
      this.storeProvinceLeaders(scoresArr.value);
    }
    console.log(this.scoreForm);
  }
  squadToggle() {
    this.squadSort = !this.squadSort;
    let scoresArr = this.scoreForm.get('scores') as FormArray;
    if (this.squadSort) {
      scoresArr.value.sort(function (a, b) {
        var aSquad = parseInt(a.squadNumber, 10);
        var bSquad = parseInt(b.squadNumber, 10);

        return (aSquad < bSquad) ? -1 : (aSquad > bSquad) ? 1 : 0;
      });
    } else {
      scoresArr.value.sort(function (a, b) {
        var a = a.surname;
        var b = b.surname;

        return (a < b) ? -1 : (a > b) ? 1 : 0;
      });
    }

    scoresArr.patchValue(scoresArr.value);
  }
  storeProvinceLeaders(scores) {
    //Sort by Category and Score
    scores.sort(function (a, b) {
      var aProvince = a.province;
      var bProvince = b.province;
      var aTotal = a.grandTotal;
      var bTotal = b.grandTotal;
      // console.log(aLow + " | " + bLow);

      if (aProvince == bProvince) {
        return (aTotal < bTotal) ? 1 : (aTotal > bTotal) ? -1 : 0;
      }
      else {
        return (aProvince < bProvince) ? -1 : 1;
      }
    });
    let provinceArr = [];
    let currentProvince = scores[0].province;
    let x = 0;
    let provinceTotal = 0;
    let averageScore = 0;
    // console.log(scores);
    scores.forEach(score => {
      if (score.province === currentProvince) {
        if (x < 5) {
          provinceTotal += parseFloat(score.highGunPercentage);
          // console.log(currentProvince + ": " + provinceTotal);
          // console.log(score);
          // console.log('High Gun:' + score.highGunPercentage);
          x++;
        }
      } else {
        averageScore = provinceTotal / x;
        provinceArr.push({ province: currentProvince, score: averageScore });
        // console.log('Stored:' + currentProvince);
        x = 0;
        provinceTotal = 0;
        currentProvince = score.province;
        provinceTotal += score.highGunPercentage;
        x++;
        // console.log(currentProvince + ": " + provinceTotal);
        // console.log(score);
        // console.log('High Gun:' + score.highGunPercentage);


      }
    });
    // console.log(x);
    averageScore = provinceTotal / x;
    provinceArr.push({ province: currentProvince, score: averageScore });
    provinceArr.sort(
      (a, b) => (a.score > b.score) ? -1 : 1
    );
    // console.log(provinceArr);
    let provinces = <FormArray>this.scoreForm.get('provinceLeaders');
    provinceArr.forEach(province => {
      const scoreGroup = new FormGroup({
        province: new FormControl(province.province),
        score: new FormControl(province.score),
      });
      provinces.push(scoreGroup);
    });

  }
  storeLeaders(arr, scores) {
    let leadersArr = this.scoreForm.get(arr) as FormArray;
    if (scores.length > 0) {
      let limit = 3;
      if (scores.length < 3) {
        limit = scores.length;
      }
      for (let i = 0; i < limit; i++) {
        const score = scores[i];
        const scoreGroup = new FormGroup({
          userID: new FormControl(score.userID),
          initials: new FormControl(score.initials),
          surname: new FormControl(score.surname),
          class: new FormControl(score.class),
          category: new FormControl(score.category),
          province: new FormControl(score.province),
          range1Score: new FormControl(score.range1Score),
          range2Score: new FormControl(score.range2Score),
          range3Score: new FormControl(score.range3Score),
          range4Score: new FormControl(score.range4Score),
          range5Score: new FormControl(score.range5Score),
          range6Score: new FormControl(score.range6Score),
          range7Score: new FormControl(score.range7Score),
          range8Score: new FormControl(score.range8Score),
          day1Total: new FormControl(score.day1Total),
          day2Total: new FormControl(score.day2Total),
          grandTotal: new FormControl(score.grandTotal),
          highGunPercentage: new FormControl(score.highGunPercentage)
        });
        leadersArr.push(scoreGroup);
      }
    }
    return leadersArr;
  }
  ionViewDidEnter() {
    this.loadScoreboard();
    this.scoreboardSub = this.scoreboardService.scoreboardUpdated.subscribe(
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
            const scoresArr = <FormArray>this.scoreForm.get('scores');
            const scoreGroup = new FormGroup({
              userID: new FormControl(score.userID, Validators.required),
              initials: new FormControl(score.initials, Validators.required),
              surname: new FormControl(score.surname, Validators.required),
              member: new FormControl(score.surname + ', ' + score.initials + '.', Validators.required),
              class: new FormControl(score.class, Validators.required),
              category: new FormControl(score.category, Validators.required),
              province: new FormControl(score.province),
              range1Score: new FormControl(score.range1Score, Validators.compose([Validators.min(0), Validators.max(25), Validators.pattern("^[0-9]*$")])),
              range2Score: new FormControl(score.range2Score, Validators.compose([Validators.min(0), Validators.max(25), Validators.pattern("^[0-9]*$")])),
              range3Score: new FormControl(score.range3Score, Validators.compose([Validators.min(0), Validators.max(25), Validators.pattern("^[0-9]*$")])),
              range4Score: new FormControl(score.range4Score, Validators.compose([Validators.min(0), Validators.max(25), Validators.pattern("^[0-9]*$")])),
              range5Score: new FormControl(score.range5Score, Validators.compose([Validators.min(0), Validators.max(25), Validators.pattern("^[0-9]*$")])),
              range6Score: new FormControl(score.range6Score, Validators.compose([Validators.min(0), Validators.max(25), Validators.pattern("^[0-9]*$")])),
              range7Score: new FormControl(score.range7Score, Validators.compose([Validators.min(0), Validators.max(25), Validators.pattern("^[0-9]*$")])),
              range8Score: new FormControl(score.range8Score, Validators.compose([Validators.min(0), Validators.max(25), Validators.pattern("^[0-9]*$")])),
              day1Total: new FormControl(score.day1Total, Validators.compose([Validators.min(0), Validators.max(100)])),
              day2Total: new FormControl(score.day2Total, Validators.compose([Validators.min(0), Validators.max(100)])),
              grandTotal: new FormControl(score.grandTotal, Validators.compose([Validators.min(0), Validators.max(200)])),
              highGunPercentage: new FormControl(score.highGunPercentage, Validators.compose([Validators.min(0), Validators.max(1)])),
              squadNumber: new FormControl(score.squadNumber),
              shootOff: new FormControl(score.shootOff)
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
    );
    this.eventSub = this.eventsService.eventUpdated.subscribe(
      (event: Event) => {
        this.eventLoaded = true;
        this.event = event;
      }
    );
  }
  loadScoreboard() {
    console.log('Loading Scoreboard');
    this.scoreboardService.fetchScoreboard(this.eventID, 'captureByShooter');
    this.eventsService.fetchEvent(this.eventID);
  }

  ionViewDidLeave() {
    this.scoreboardSub.unsubscribe();
    this.eventSub.unsubscribe();
  }

}
