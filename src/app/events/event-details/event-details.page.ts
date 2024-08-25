import { Component, OnInit } from "@angular/core";
import { NoticesService } from "src/app/services/notices.service";
import { EventsService } from "../events.service";
import { Event } from "../event.model";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/auth/auth.service";
import { NetworkService } from "src/app/services/network.service";
import { ReportsService } from "src/app/reports/reports.service";
import * as XLSX from "xlsx";

@Component({
  selector: "app-event-details",
  templateUrl: "./event-details.page.html",
  styleUrls: ["./event-details.page.scss"],
})
export class EventDetailsPage implements OnInit {
  constructor(
    private notice: NoticesService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private network: NetworkService,
    private reportsService: ReportsService,
  ) {}

  eventLoaded = false;
  event: Event;
  noEvent = true;
  eventsSub;
  eventID = null;
  domain = environment.domain;
  admin = false;
  subs = [];
  users: any[] = [];
  ngOnInit() {
    this.eventID = this.route.snapshot.paramMap.get("eventID");
    // this.admin =  this.authService.permissions.includes(26);
    this.admin = false;
  }
  upcomingEvent(startDate) {
    const startDateTime = new Date(startDate);
    const currentDate = new Date();
    if (startDateTime.getTime() >= currentDate.getTime()) {
      return true;
    } else {
      return false;
    }
  }
  ionViewDidEnter() {
    this.network.getStatus();
    this.eventsSub = this.eventsService.eventUpdated.subscribe(
      (event: Event) => {
        // console.log(event);
        this.eventLoaded = true;
        this.event = event;
        if (event !== null) {
          this.noEvent = false;
        } else {
          this.noEvent = true;
        }
      },
    );
    this.subs.push(
      this.reportsService.usersLoaded.subscribe((users: any[]) => {
        console.log(users);
        this.users = users;
      }),
    );
    this.eventsService.fetchEvent(this.eventID);
    if (this.admin) {
      this.loadMembersRegistered();
    }
  }
  exportXLSX() {
    const headers = [
      "Surname",
      "Name",
      "Category",
      "Class",
      "Compak SA member",
      "Membership paid",
      "E-mail address",
    ];
    let rows = [];

    rows.push(headers);
    this.users.forEach((user) => {
      let membershipStatus = "Yes";
      if (user.membershipStatus === "0") {
        membershipStatus = "No";
      }
      let paidStatus = "No";
      if (user.paidStatus === "Yes") {
        paidStatus = "Yes";
      }
      rows.push([
        user.surname,
        user.name,
        user.category,
        user.class,
        membershipStatus,
        paidStatus,
        user.email,
      ]);
    });

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Registered Members`);

    /* save to file */
    XLSX.writeFile(wb, `Registered Members for ${this.event.name}.xlsx`);
  }
  deregister() {
    this.notice.presentLoader();
    this.http
      .delete(this.domain + "/api/v2/events/" + this.eventID + "/deregister")
      .subscribe(
        (resp: any) => {
          this.notice.dismissLoader();
          this.notice.presentToast("Successfully de-registered.", "success");
          this.eventsService.fetchEvent(this.eventID);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.notice.dismissLoader();
          this.notice.presentToast("A critical error occured.", "danger");
        },
      );
  }
  loadMembersRegistered() {
    this.reportsService.loadMembersRegisteredForEvent(this.eventID);
  }

  confirmDeregister() {
    this.notice.presentAlertConfirm(
      "You have chosen to de-register yourself from this event.",
      () => {
        this.deregister();
      },
    );
  }
  ionViewDidLeave() {
    this.eventsSub.unsubscribe();
  }
}
