import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticesService } from '../services/notices.service';
import { ScoreboardsService } from './scoreboards.service';
import { Scoreboard } from './scoreboard.model';
import { EventsService } from '../events/events.service';
import { Event } from '../events/event.model';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-scoreboards',
  templateUrl: './scoreboards.page.html',
  styleUrls: ['./scoreboards.page.scss'],
})
export class ScoreboardsPage implements OnInit {
  // @ViewChild('content', { read: ElementRef }) content: IonContent;
  // @ViewChild('content', { read: true, static: false }) content: IonContent;
  @ViewChild('content', { read: ElementRef, static: false }) private content: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private notice: NoticesService,
    private scoreboardsService: ScoreboardsService,
    private eventsService: EventsService,
  ) { }

  //Scoreboard
  scoreboardsSub;
  scoreboard: Scoreboard;
  noScoreboard = true;
  scoreboardLoaded = false;
  rangeAve = [];
  averages = [];
  //Event
  eventID = null;
  eventLoaded = false;
  eventSub;
  event: Event;

  scroll() {
    console.log(this.content);
    this.content.nativeElement.scrollToBottom(360000).then(
      () => {
        this.content.nativeElement.scrollToTop(1000).then(
          () => {
            this.scroll();
          }
        );
      }
    );

  }
  ngOnInit() {
  };
  ionViewDidEnter() {
    // this.content.scrollToBottom(300);
    this.eventID = this.route.snapshot.paramMap.get("eventID");
    this.scoreboardsSub = this.scoreboardsService.scoreboardUpdated.subscribe(
      (scoreboard: Scoreboard) => {
        console.log(scoreboard);
        // console.log(scoreboard.scores);
        //this.notice.dismissLoader();
        this.scoreboardLoaded = true;
        if (scoreboard !== null) {
          this.scoreboard = scoreboard;
          scoreboard.scores.sort(
            (a, b) => (a.highGunPercentage > b.highGunPercentage) ? -1 : 1
          );
          this.averages = this.rangeAverages(scoreboard.scores);
          console.log(this.averages);
          console.log(this.averages[0][0]);
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
    this.eventsService.fetchEvent(this.eventID);
    this.loadScoreboard();
  }
  loadScoreboard() {
    this.scoreboard = null;
    this.noScoreboard = true;
    this.scoreboardLoaded = false;
    this.scoreboardsService.fetchScoreboard(this.eventID, null);

  }
  rangeAverages(scores) {
    if (scores === null) {
      return [];
    }
    if (scores.length === 0) {
      return [];
    }
    let excludeDay1 = false;
    let excludeDay2 = false;
    const rangeAve = [0, 0, 0, 0, 0, 0, 0, 0];
    const openRangeAve = [0, 0, 0, 0, 0, 0, 0, 0];
    const classARangeAve = [0, 0, 0, 0, 0, 0, 0, 0];
    const classBRangeAve = [0, 0, 0, 0, 0, 0, 0, 0];
    const classCRangeAve = [0, 0, 0, 0, 0, 0, 0, 0];
    let totalScoresDay1 = 0;
    let totalScoresDay2 = 0;
    let openTotalScoresDay1 = 0;
    let openTotalScoresDay2 = 0;
    let classATotalScoresDay1 = 0;
    let classATotalScoresDay2 = 0;
    let classBTotalScoresDay1 = 0;
    let classBTotalScoresDay2 = 0;
    let classCTotalScoresDay1 = 0;
    let classCTotalScoresDay2 = 0;

    scores.forEach(score => {
      if (score.day1Total === 0) {
        excludeDay1 = true;
      } else {
        excludeDay1 = false;
      }
      if (score.day2Total === 0) {
        excludeDay2 = true;
      } else {
        excludeDay2 = false;
      }
      if (!excludeDay1) {
        totalScoresDay1++;
        rangeAve[0] += score.range1Score;
        rangeAve[1] += score.range2Score;
        rangeAve[2] += score.range3Score;
        rangeAve[3] += score.range4Score;
        if (score.class === 'Open') {
          openTotalScoresDay1++;
          openRangeAve[0] += score.range1Score;
          openRangeAve[1] += score.range2Score;
          openRangeAve[2] += score.range3Score;
          openRangeAve[3] += score.range4Score;
        } else if (score.class === 'A') {
          classATotalScoresDay1++;
          classARangeAve[0] += score.range1Score;
          classARangeAve[1] += score.range2Score;
          classARangeAve[2] += score.range3Score;
          classARangeAve[3] += score.range4Score;
        } else if (score.class === 'B') {
          classBTotalScoresDay1++;
          classBRangeAve[0] += score.range1Score;
          classBRangeAve[1] += score.range2Score;
          classBRangeAve[2] += score.range3Score;
          classBRangeAve[3] += score.range4Score;
        } else if (score.class === 'C') {
          classCTotalScoresDay1++;
          classCRangeAve[0] += score.range1Score;
          classCRangeAve[1] += score.range2Score;
          classCRangeAve[2] += score.range3Score;
          classCRangeAve[3] += score.range4Score;
        }
      }
      if (!excludeDay2) {
        totalScoresDay2++;
        rangeAve[4] += score.range5Score;
        rangeAve[5] += score.range6Score;
        rangeAve[6] += score.range7Score;
        rangeAve[7] += score.range8Score;
        if (score.class === 'Open') {
          openTotalScoresDay2++;
          openRangeAve[4] += score.range5Score;
          openRangeAve[5] += score.range6Score;
          openRangeAve[6] += score.range7Score;
          openRangeAve[7] += score.range8Score;
        } else if (score.class === 'A') {
          classATotalScoresDay2++;
          classARangeAve[4] += score.range5Score;
          classARangeAve[5] += score.range6Score;
          classARangeAve[6] += score.range7Score;
          classARangeAve[7] += score.range8Score;
        } else if (score.class === 'B') {
          classBTotalScoresDay2++;
          classBRangeAve[4] += score.range5Score;
          classBRangeAve[5] += score.range6Score;
          classBRangeAve[6] += score.range7Score;
          classBRangeAve[7] += score.range8Score;
        } else if (score.class === 'C') {
          classCTotalScoresDay2++;
          classCRangeAve[4] += score.range5Score;
          classCRangeAve[5] += score.range6Score;
          classCRangeAve[6] += score.range7Score;
          classCRangeAve[7] += score.range8Score;
        }
      }
    });
    rangeAve[0] = Math.round(rangeAve[0] / totalScoresDay1);
    rangeAve[1] = Math.round(rangeAve[1] / totalScoresDay1);
    rangeAve[2] = Math.round(rangeAve[2] / totalScoresDay1);
    rangeAve[3] = Math.round(rangeAve[3] / totalScoresDay1);
    rangeAve[4] = Math.round(rangeAve[4] / totalScoresDay2);
    rangeAve[5] = Math.round(rangeAve[5] / totalScoresDay2);
    rangeAve[6] = Math.round(rangeAve[6] / totalScoresDay2);
    rangeAve[7] = Math.round(rangeAve[7] / totalScoresDay2);
    openRangeAve[0] = Math.round(openRangeAve[0] / openTotalScoresDay1);
    openRangeAve[1] = Math.round(openRangeAve[1] / openTotalScoresDay1);
    openRangeAve[2] = Math.round(openRangeAve[2] / openTotalScoresDay1);
    openRangeAve[3] = Math.round(openRangeAve[3] / openTotalScoresDay1);
    openRangeAve[4] = Math.round(openRangeAve[4] / openTotalScoresDay2);
    openRangeAve[5] = Math.round(openRangeAve[5] / openTotalScoresDay2);
    openRangeAve[6] = Math.round(openRangeAve[6] / openTotalScoresDay2);
    openRangeAve[7] = Math.round(openRangeAve[7] / openTotalScoresDay2);
    classARangeAve[0] = Math.round(classARangeAve[0] / classATotalScoresDay1);
    classARangeAve[1] = Math.round(classARangeAve[1] / classATotalScoresDay1);
    classARangeAve[2] = Math.round(classARangeAve[2] / classATotalScoresDay1);
    classARangeAve[3] = Math.round(classARangeAve[3] / classATotalScoresDay1);
    classARangeAve[4] = Math.round(classARangeAve[4] / classATotalScoresDay2);
    classARangeAve[5] = Math.round(classARangeAve[5] / classATotalScoresDay2);
    classARangeAve[6] = Math.round(classARangeAve[6] / classATotalScoresDay2);
    classARangeAve[7] = Math.round(classARangeAve[7] / classATotalScoresDay2);
    classBRangeAve[0] = Math.round(classBRangeAve[0] / classBTotalScoresDay1);
    classBRangeAve[1] = Math.round(classBRangeAve[1] / classBTotalScoresDay1);
    classBRangeAve[2] = Math.round(classBRangeAve[2] / classBTotalScoresDay1);
    classBRangeAve[3] = Math.round(classBRangeAve[3] / classBTotalScoresDay1);
    classBRangeAve[4] = Math.round(classBRangeAve[4] / classBTotalScoresDay2);
    classBRangeAve[5] = Math.round(classBRangeAve[5] / classBTotalScoresDay2);
    classBRangeAve[6] = Math.round(classBRangeAve[6] / classBTotalScoresDay2);
    classBRangeAve[7] = Math.round(classBRangeAve[7] / classBTotalScoresDay2);
    classCRangeAve[0] = Math.round(classCRangeAve[0] / classCTotalScoresDay1);
    classCRangeAve[1] = Math.round(classCRangeAve[1] / classCTotalScoresDay1);
    classCRangeAve[2] = Math.round(classCRangeAve[2] / classCTotalScoresDay1);
    classCRangeAve[3] = Math.round(classCRangeAve[3] / classCTotalScoresDay1);
    classCRangeAve[4] = Math.round(classCRangeAve[4] / classCTotalScoresDay2);
    classCRangeAve[5] = Math.round(classCRangeAve[5] / classCTotalScoresDay2);
    classCRangeAve[6] = Math.round(classCRangeAve[6] / classCTotalScoresDay2);
    classCRangeAve[7] = Math.round(classCRangeAve[7] / classCTotalScoresDay2);
    return [rangeAve, openRangeAve, classARangeAve, classBRangeAve, classCRangeAve];
  }
  ionViewDidLeave() {
    this.scoreboardsSub.unsubscribe();
    this.eventSub.unsubscribe();
  }

  //TODO make scrollable
}
