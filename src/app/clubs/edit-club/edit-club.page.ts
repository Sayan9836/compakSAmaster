import { Component, OnInit } from "@angular/core";
import { NoticesService } from "src/app/services/notices.service";
import { ProvincesService } from "src/app/provinces/provinces.service";
import { Province } from "src/app/provinces/province.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ImagesService } from "src/app/shared/services/images.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Router, ActivatedRoute } from "@angular/router";
import { ClubsService } from "../clubs.service";
import { Club } from "../club.model";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-edit-club",
  templateUrl: "./edit-club.page.html",
  styleUrls: ["./edit-club.page.scss"],
})
export class EditClubPage implements OnInit {
  constructor(
    private notice: NoticesService,
    private provincesService: ProvincesService,
    private imagesService: ImagesService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private clubsService: ClubsService,
    private navCtrl: NavController,
  ) {}

  provinces: Province[];
  noProvinces = true;
  provincesLoaded = false;
  provincesSub;
  loading = false;
  loadingSub;
  clubForm: FormGroup;
  domain = environment.domain;
  clubID = null;
  clubData = {
    APIMode: "Edit Club",
    clubID: null,
    name: null,
    contactPerson: null,
    contactNumber: null,
    emailAddress: null,
    // physicalAddress: null,
    // postalAddress: null,
    address: null,
    websiteAddress: null,
    GPS: null,
    bankingDetails: null,
    logo: null,
    provinceID: null,
  };
  club: Club = null;
  noClub = true;
  clubsLoaded = false;
  clubsSub;

  ngOnInit() {
    this.clubID = this.route.snapshot.paramMap.get("clubID");
    this.createClubForm();
  }
  remove() {
    this.notice.presentLoader();
    this.http.delete(this.domain + "/api/v2/clubs/" + this.clubID).subscribe(
      (resp: any) => {
        this.notice.presentToast("Successfully removed.", "success");
        this.notice.dismissLoader();
        this.router.navigate(["/clubs"]);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.notice.presentToast("A critical error occured.", "danger");
        this.notice.dismissLoader();
      },
    );
  }
  confirmRemove() {
    this.notice.presentAlertConfirm(
      "You have chosen to remove this club.",
      () => {
        this.remove();
      },
    );
  }
  onImagePicked(imageData: string | File) {
    this.clubData.logo = imageData;
  }
  goBack() {
    this.navCtrl.pop();
  }
  ionViewDidEnter() {
    this.clubsSub = this.clubsService.clubLoaded.subscribe((club: Club) => {
      this.club = club;
      this.createClubForm();
      this.imagesService.updateImage(this.club.logoPath);
      this.clubsLoaded = true;
      if (club === null) {
        this.noClub = true;
      } else {
        this.noClub = false;
      }
    });
    this.clubsService.fetchClub(this.clubID);
    this.imagesService.updateBtnText("Select Logo");
    this.loadingSub = this.notice.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
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
      },
    );
    this.loadProvinces();
  }
  loadProvinces() {
    this.notice.showLoader();
    this.provincesService.fetchProvinces();
  }
  save() {
    if (this.clubForm.invalid) {
      this.notice.presentToast(
        "You must complete all required fields before saving.",
        "danger",
      );
      return;
    }
    this.notice.presentLoader();
    this.clubData.clubID = this.clubID;
    this.clubData.name = this.clubForm.value.name;
    this.clubData.contactPerson = this.clubForm.value.contactPerson;
    this.clubData.contactNumber = this.clubForm.value.contactNumber;
    this.clubData.emailAddress = this.clubForm.value.emailAddress;
    // this.clubData.physicalAddress = this.clubForm.value.physicalAddress;
    // this.clubData.postalAddress = this.clubForm.value.postalAddress;
    this.clubData.address = this.clubForm.value.address;
    this.clubData.websiteAddress = this.clubForm.value.websiteAddress;
    this.clubData.GPS = this.clubForm.value.GPS;
    this.clubData.bankingDetails = this.clubForm.value.bankingDetails;
    // this.clubData.physicalAddress = this.clubForm.value.physicalAddress;
    this.clubData.provinceID = this.clubForm.value.provinceID;
    this.http.put(this.domain + "/api/v2/clubs", this.clubData).subscribe(
      (resp: any) => {
        this.notice.presentToast("Successfully updated.", "success");
        this.notice.dismissLoader();
        this.router.navigate(["/clubs"]);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.notice.presentToast("A critical error occured.", "danger");
        this.notice.dismissLoader();
      },
    );
  }
  createClubForm() {
    console.log(this.club);
    if (this.club === null) {
      this.club = new Club(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        // null,
        // null,
      );
    }
    this.clubForm = new FormGroup({
      name: new FormControl(this.club.name, Validators.required),
      contactPerson: new FormControl(
        this.club.contactPerson,
        Validators.required,
      ),
      emailAddress: new FormControl(
        this.club.emailAddress,
        Validators.required,
      ),
      contactNumber: new FormControl(
        this.club.contactNumber,
        Validators.required,
      ),
      // physicalAddress: new FormControl(this.club.physicalAddress),
      // postalAddress: new FormControl(this.club.postalAddress),
      address: new FormControl(this.club.address),
      websiteAddress: new FormControl(this.club.websiteAddress),
      GPS: new FormControl(this.club.GPS),
      bankingDetails: new FormControl(this.club.bankingDetails),
      provinceID: new FormControl(this.club.provinceID, Validators.required),
    });
  }
  ionViewDidLeave() {
    this.provincesSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }
}
