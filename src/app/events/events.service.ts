import { Injectable, EventEmitter } from "@angular/core";
import { Event } from "./event.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { DatabaseService } from "../services/database.service";
import { NetworkService } from "../services/network.service";
import { NoticesService } from "../services/notices.service";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  eventsUpdated = new EventEmitter<Event[]>();
  eventUpdated = new EventEmitter<Event>();
  event: Event;
  constructor(
    private http: HttpClient,
    private database: DatabaseService,
    private network: NetworkService,
    private notice: NoticesService,
  ) {}
  domain = environment.domain;
  fetchEvents() {
    this.notice.presentLoader();
    if (this.network.connected) {
      // this.domain + '/api/v2/events'
      this.http
        .get<Event[]>("https://new.compaksa.co.za/wp-json/api/v2/events")
        .subscribe(
          (resp) => {
            // console.log(resp);
            console.log("Online Events Loaded");

            this.notice.dismissLoader();
            this.eventsUpdated.emit(resp);
            if (this.database.sync) {
              this.syncEvents(resp);
            }
          },
          (error: HttpErrorResponse) => {
            this.notice.dismissLoader();
            console.log(error.status + " - " + error.statusText);
          },
        );
    } else {
      console.log("Offline Events Loaded");
      this.database.getObject("events").then((resp) => {
        this.notice.dismissLoader();
        this.eventsUpdated.emit(resp);
        // console.log('Offline Data Provided');
      });
    }
  }
  fetchEvent(eventID) {
    this.notice.presentLoader();
    if (this.network.connected) {
      // this.domain + "/api/v2/events/" + eventID
      this.http
        .get<Event>(
          "https://new.compaksa.co.za/wp-json/api/v2/events/" + eventID,
        )
        .subscribe(
          (resp) => {
            // console.log(resp);
            this.notice.dismissLoader();
            this.event = resp;
            this.eventUpdated.emit(resp);
            if (this.database.sync) {
              this.syncEventDetails(resp);
            }
          },
          (error: HttpErrorResponse) => {
            this.notice.dismissLoader();
            console.log(error.status + " - " + error.statusText);
          },
        );
    } else {
      this.database.getObject("eventDetails").then((resp) => {
        let eventDetail = null;
        if (resp !== null) {
          if (resp.length > 1) {
            resp.forEach((event) => {
              if (event.eventID === eventID) {
                eventDetail = event;
              }
            });
          }
        }
        this.eventUpdated.emit(eventDetail);
        this.notice.dismissLoader();

        // console.log('Offline Data Provided');
      });
    }
  }
  syncEventDetails(eventDetail) {
    const eventDetails = [];
    this.database.getObject("eventDetails").then((data) => {
      if (data === null) {
        eventDetails.push(eventDetail);
        // this.database.setObject('eventDetails', eventDetail);
      } else {
        // delete data['eventID'] = eventDetail.eventID;
        // console.log(data);
        if (data.length > 1) {
          data.forEach((event) => {
            if (event.eventID !== eventDetail.eventID) {
              eventDetails.push(event);
            }
          });
        } else {
          if (data.eventID === eventDetail.eventID) {
            data = [];
          } else {
            eventDetails.push(data[0]);
          }
        }
        eventDetails.push(eventDetail);
      }
      this.database.setObject("eventDetails", eventDetails);
    });
  }
  syncEvents(data) {
    this.database.setObject("events", data);
  }
}
