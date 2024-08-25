import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NoticesService } from 'src/app/services/notices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register-event',
  templateUrl: './register-event.page.html',
  styleUrls: ['./register-event.page.scss'],
})
export class RegisterEventPage implements OnInit {

  constructor(
    private notice: NoticesService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router

  ) { }

  eventID = null;
  registerForm: FormGroup;
  domain = environment.domain;
  registerData = {
    APIMode: 'Register For Event',
    eventID: null,
    userID: null,
    targets: null
  }
  ngOnInit() {
    this.eventID = this.route.snapshot.paramMap.get("eventID");
    this.registerForm = new FormGroup({
      targets: new FormControl()
    });
  }
  save() {
    if (!this.registerForm.invalid) {
      this.notice.presentLoader();
      this.registerData.eventID = this.eventID;
      this.registerData.targets = this.registerForm.value.targets;
      this.http.put(this.domain + '/api/v2/events', this.registerData).subscribe(
        (resp: any) => {
          this.notice.presentToast('Successfully registered.', 'success');
          this.notice.dismissLoader();
          this.router.navigate(['/event-details', this.eventID]);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.notice.presentToast('Competition full.', 'danger');
          this.notice.dismissLoader();
        }
      );
    } else {
      this.notice.presentToast('You have not completed all the required fields.', 'danger');
    }
  }

}
