import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
import { Club } from '../clubs/club.model';
import { Province } from '../provinces/province.model';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { NoticesService } from '../services/notices.service';
import { ClubsService } from '../clubs/clubs.service';
import { ProvincesService } from '../provinces/provinces.service';
import { Router } from '@angular/router';
import { TouchSequence } from 'selenium-webdriver';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(
    private notice: NoticesService,
    private clubsService: ClubsService,
    private provincesService: ProvincesService,
    private http: HttpClient,
    private router: Router,
    private accountsService: AccountService
  ) { }

  domain = environment.domain;
  accountForm: FormGroup;

  tokenSub;
  token: string;

  clubs: Club[];
  clubsLoaded = false;
  noClubs = true;
  clubsSub;

  provinces: Province[];
  provincesLoaded = false;
  noProvinces = true;
  provincesSub;

  accountData = {
    "APIMode": "Add User",
    "token": null,
    "name": null,
    "surname": null,
    "email": null,
    "cellNumber": null,
    "landNumber": null,
    "ID": "ID Number",
    "gender": null,
    "postalAddress": null,
    "physicalAddress": null,
    "DOB": null,
    "province": null,
    "clubID": null
  };
  ngOnInit() {
    this.accountForm = new FormGroup({
      name: new FormControl(),
      surname: new FormControl(),
      email: new FormControl(),
      cellNumber: new FormControl(),
      landNumber: new FormControl(),
      gender: new FormControl(),
      postalAddress: new FormControl(),
      physicalAddress: new FormControl(),
      DOB: new FormControl(),
      club: new FormControl(),
      province: new FormControl(),
      ID: new FormControl()
    });
  }

  loadClubs() {
    this.clubsService.fetchClubs();
  }
  loadProvinces() {
    this.provincesService.fetchProvinces();
  }
  loadFormToken() {
    this.accountsService.registerFormToken();
  }
  ionViewDidEnter() {
    this.clubsSub = this.clubsService.clubsLoaded.subscribe(
      (clubs: Club[]) => {
        if (clubs !== null) {
          this.clubs = clubs;
          this.clubsLoaded = true;
          this.noClubs = false;
        } else {
          this.noClubs = true;
        }
      }
    );
    this.provincesSub = this.provincesService.provincesLoaded.subscribe(
      (provinces: Province[]) => {
        if (provinces !== null) {
          this.provinces = provinces;
          this.provincesLoaded = true;
          this.noProvinces = false;
        } else {
          this.noProvinces = true;
        }
      }
    );
    this.tokenSub = this.accountsService.formTokenLoaded.subscribe(
      (token: string) => {
        this.token = token;
      }
    );
    this.loadClubs();
    this.loadProvinces();
    this.loadFormToken();
  }

  save() {
    if (!this.accountForm.invalid) {
      this.notice.presentLoader();
      this.accountData.name = this.accountForm.value.name;
      this.accountData.surname = this.accountForm.value.surname;
      this.accountData.email = this.accountForm.value.email;
      this.accountData.cellNumber = this.accountForm.value.cellNumber;
      this.accountData.landNumber = this.accountForm.value.landNumber;
      this.accountData.ID = this.accountForm.value.ID;
      this.accountData.gender = this.accountForm.value.gender;
      this.accountData.postalAddress = this.accountForm.value.postalAddress;
      this.accountData.physicalAddress = this.accountForm.value.physicalAddress;
      this.accountData.DOB = this.accountForm.value.DOB;
      this.accountData.province = this.accountForm.value.province;
      this.accountData.clubID = this.accountForm.value.club;
      this.accountData.token = this.token;
      console.log(this.accountData);
      this.http.post(this.domain + '/api/v1/accounts', this.accountData).subscribe(
        (resp: any) => {
          this.notice.presentToast('Successfully registered. Password is your ID Number.', 'success');
          this.notice.dismissLoader();
          this.router.navigate(['/auth']);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          if (error.statusText === 'E6') {
            this.notice.presentToast('Already registered. Please log in using this email address and ID as your password.', 'danger');
          } else {
            this.notice.presentToast('A critical error occured.', 'danger');
          }
          this.notice.dismissLoader();
        }
      );
    } else {
      this.notice.presentToast('You have not completed all the required fields correctly.', 'danger');
    }
  }
  ionViewWillLeave() {
    this.clubsSub.unsubscribe();
    this.provincesSub.unsubscribe();
    this.tokenSub.unsubscribe();
  }

}
