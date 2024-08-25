import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScoreboardsService } from '../scoreboards.service';
import { Scoreboard } from '../scoreboard.model';
import { EventsService } from 'src/app/events/events.service';
import { Event } from 'src/app/events/event.model';

@Component({
  selector: 'app-scoreboard-details',
  templateUrl: './scoreboard-details.page.html',
  styleUrls: ['./scoreboard-details.page.scss'],
})
export class ScoreboardDetailsPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private scoreboardsService: ScoreboardsService,
    private eventsService: EventsService
  ) { }

  //TODO Offline mode sorting for shoot off
  eventID = null;
  index = null;
  scoreboard: Scoreboard;
  event: Event;
  ngOnInit() {
    this.eventID = this.route.snapshot.paramMap.get('eventID');
    this.index = this.route.snapshot.paramMap.get('index');
    this.scoreboard = this.scoreboardsService.scoreboard;
    this.event = this.eventsService.event;
  }
}
