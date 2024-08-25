import { Component, OnInit } from '@angular/core';
import { Event } from '@angular/router';
import { EventsService } from './events.service';
import { NoticesService } from '../services/notices.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  constructor(
    private eventsService: EventsService,
    private notice: NoticesService,
    private network: NetworkService,
  ) { }

  eventsLoaded = false;
  noEvents = true;
  eventsSub;
  events: Event[];

  ngOnInit() {

  }
  ionViewDidEnter() {
    this.eventsSub = this.eventsService.eventsUpdated.subscribe(
      (events: Event[]) => {
        console.log(events);
        this.events = events;
        this.eventsLoaded = true;
        if (events.length === 0) {
          this.noEvents = true;
        } else {
          this.noEvents = false;
        }
      }
    );
    console.log('Load Events');
    this.eventsService.fetchEvents();
  }
  ionViewDidLeave() {
    this.eventsSub.unsubscribe();
  }

}
