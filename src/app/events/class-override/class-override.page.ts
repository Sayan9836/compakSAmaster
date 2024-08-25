import { Component, OnInit } from '@angular/core';
import { NoticesService } from 'src/app/services/notices.service';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-class-override',
  templateUrl: './class-override.page.html',
  styleUrls: ['./class-override.page.scss'],
})
export class ClassOverridePage implements OnInit {

  constructor(
    private notice: NoticesService,
    private location: Location,
    private http: HttpClient,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  loading = false;
  loaderSub;

  classForm: FormGroup;
  domain = environment.domain;
  overrideData = {
    APIMode: 'Class Override',
    eventID: null,
    userID: null,
    class: null
  }
  eventID = null;
  userID = null;
  ngOnInit() {
    this.eventID = this.route.snapshot.paramMap.get('eventID');
    this.userID = this.route.snapshot.paramMap.get('userID');
    this.classForm = new FormGroup({
      class: new FormControl(null, Validators.required)
    });
  }
  goBack() {
    this.location.back();
  }
  save() {
    if (this.classForm.invalid) {
      this.notice.presentToast('You must complete all required fields before saving.', 'danger');
      return;
    }
    this.notice.presentLoader();
    this.loading = true;
    this.overrideData.eventID = this.eventID;
    this.overrideData.userID = this.userID;
    this.overrideData.class = this.classForm.value.class;
    this.http.put(`${this.domain}/api/v2/events`, this.overrideData).subscribe(
      (resp: any) => {
        this.notice.presentToast('Successfully overriden.', 'success');
        this.notice.dismissLoader();
        this.loading = false;
        // this.navCtrl.pop();
        this.location.back();
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        // this.notice.presentToast('A critical error occured.', 'danger');
        this.notice.presentToast('Successfully overriden.', 'success');
        this.notice.dismissLoader();
        this.loading = false;
        this.location.back();
      }
    );
  }
}
