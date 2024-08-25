import { Component, OnInit } from '@angular/core';
import { NoticesService } from 'src/app/services/notices.service';
import { ProvincesService } from 'src/app/provinces/provinces.service';
import { Province } from 'src/app/provinces/province.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImagesService } from 'src/app/shared/services/images.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-club',
  templateUrl: './create-club.page.html',
  styleUrls: ['./create-club.page.scss'],
})
export class CreateClubPage implements OnInit {

  constructor(
    private notice: NoticesService,
    private provincesService: ProvincesService,
    private imagesService: ImagesService,
    private http: HttpClient,
    private router: Router,
    private navCtrl: NavController
  ) { }

  provinces: Province[];
  noProvinces = true;
  provincesLoaded = false;
  provincesSub;
  loading = false;
  loadingSub;
  clubForm: FormGroup;
  domain = environment.domain;

  clubData = {
    APIMode: "Create Club",
    name: null,
    contactPerson: null,
    contactNumber: null,
    emailAddress: null,
    physicalAddress: null,
    postalAddress: null,
    websiteAddress: null,
    GPS: null,
    bankingDetails: null,
    logo: null,
    provinceID: null
  }
  ngOnInit() {
    this.createClubForm();
  }

  goBack() {
    this.navCtrl.pop();
  }
  onImagePicked(imageData: string | File) {
    this.clubData.logo = imageData;
  }
  ionViewDidEnter() {
    this.imagesService.updateBtnText('Select Logo');
    this.loadingSub = this.notice.loading.subscribe(
      (state: boolean) => {
        this.loading = state;
      }
    );
    this.provincesSub = this.provincesService.provincesLoaded.subscribe(
      (provinces: Province[]) => {
        this.notice.hideLoader();
        this.provinces = provinces;
        this.provincesLoaded = true;
        if (this.provinces.length === 0) {
          this.noProvinces = true;
        } else {
          this.noProvinces = false;
        }
      }
    );
    this.loadProvinces();
  }
  loadProvinces() {
    this.notice.showLoader();
    this.provincesService.fetchProvinces();
  }
  save() {
    if (this.clubForm.invalid) {
      this.notice.presentToast('You must complete all required fields before saving.', 'danger');
      return;
    }
    this.notice.presentLoader();
    this.clubData.name = this.clubForm.value.name;
    this.clubData.contactPerson = this.clubForm.value.contactPerson;
    this.clubData.contactNumber = this.clubForm.value.contactNumber;
    this.clubData.emailAddress = this.clubForm.value.emailAddress;
    this.clubData.physicalAddress = this.clubForm.value.physicalAddress;
    this.clubData.postalAddress = this.clubForm.value.postalAddress;
    this.clubData.websiteAddress = this.clubForm.value.websiteAddress;
    this.clubData.GPS = this.clubForm.value.GPS;
    this.clubData.bankingDetails = this.clubForm.value.bankingDetails;
    this.clubData.physicalAddress = this.clubForm.value.physicalAddress;
    this.clubData.provinceID = this.clubForm.value.provinceID;
    console.log(this.clubData);
    this.http.post(this.domain + '/api/v2/clubs', this.clubData).subscribe(
      (resp: any) => {
        this.notice.presentToast('Successfully updated.', 'success');
        this.notice.dismissLoader();
        this.router.navigate(['/clubs']);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.notice.presentToast('A critical error occured.', 'danger');
        this.notice.dismissLoader();
      }
    );
  }
  createClubForm() {
    this.clubForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      contactPerson: new FormControl(null, Validators.required),
      emailAddress: new FormControl(null, Validators.required),
      contactNumber: new FormControl(null, Validators.required),
      physicalAddress: new FormControl(null),
      postalAddress: new FormControl(null),
      websiteAddress: new FormControl(null),
      GPS: new FormControl(null),
      bankingDetails: new FormControl(null),
      provinceID: new FormControl(null, Validators.required)
    });
  }
  ionViewDidLeave() {
    this.provincesSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }

}
