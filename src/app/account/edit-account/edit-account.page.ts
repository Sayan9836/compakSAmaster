import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { NoticesService } from 'src/app/services/notices.service';
import { ClubsService } from 'src/app/clubs/clubs.service';
import { Club } from 'src/app/clubs/club.model';
import { ProvincesService } from 'src/app/provinces/provinces.service';
import { Province } from 'src/app/provinces/province.model';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/users/user.model';
import { NavController } from '@ionic/angular';
import { ImagesService } from 'src/app/shared/services/images.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {

  constructor(
    private accountsService: AccountService,
    private notice: NoticesService,
    private clubsService: ClubsService,
    private provincesService: ProvincesService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private imagesService: ImagesService
  ) { }

  domain = environment.domain;
  accountForm: FormGroup;

  accountLoaded = false;
  noAccount = true;
  account: User;
  accountSub;
  imageLoc = null;
  clubs: Club[];
  clubsLoaded = false;
  noClubs = true;
  clubsSub;

  provinces: Province[];
  provincesLoaded = false;
  noProvinces = true;
  provincesSub;

  userID;

  accountData = {
    "APIMode": "Edit User",
    "userID": null,
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
    "clubID": null,
    "img": null
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
      ID: new FormControl(),
      image: new FormControl()
    });
  }
  onImagePicked(imageData: string | File) {
    console.log(imageData);
    // let imageFile;
    // if (typeof imageData === 'string') {
    //   console.log(imageData);
    //   // try {
    //   //   imageFile = this.imagesService.base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
    //   // } catch (error) {
    //   //   console.log(error);
    //   //   return;
    //   // }
    // } else {
    //   imageFile = imageData;
    // }
    this.accountForm.patchValue({ image: imageData });
    console.log(this.accountForm);
  }
  goBack() {
    this.navCtrl.pop();
  }
  loadClubs() {
    this.clubsService.fetchClubs();
  }
  loadProvinces() {
    this.provincesService.fetchProvinces();
  }
  loadAccount() {
    this.notice.presentLoader();
    this.accountsService.fetchDetails(this.userID);
  }
  ionViewDidEnter() {
    this.userID = this.route.snapshot.paramMap.get("userID");
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
    )
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
    )
    this.accountSub = this.accountsService.accountLoaded.subscribe(
      (account: User) => {
        let clubID = null;
        this.notice.dismissLoader();
        if (account !== null) {
          console.log(account);

          this.imagesService.currentImage = account.img;
          this.imageLoc = account.img;
          // this.imagesService.loadPicker(true);
          this.noAccount = false;
          this.account = account;
          this.accountLoaded = true;
          if (account.club !== null) {
            clubID = account.club.clubID;
          }
          this.accountForm = new FormGroup({
            name: new FormControl(account.name),
            surname: new FormControl(account.surname),
            email: new FormControl(account.email),
            cellNumber: new FormControl(
              account.cellNumber,
              Validators.compose([Validators.min(100000000), Validators.max(999999999), Validators.required])
            ),
            landNumber: new FormControl(account.landNumber),
            gender: new FormControl(account.gender),
            postalAddress: new FormControl(account.postalAddress),
            physicalAddress: new FormControl(account.physicalAddress),
            DOB: new FormControl(account.DOB),
            club: new FormControl(clubID),
            province: new FormControl(account.province),
            ID: new FormControl(
              account.ID,
              Validators.compose([Validators.min(100000000000), Validators.max(9999999999999), Validators.required])
            ),
            image: new FormControl(account.img)
          });
        } else {
          this.noAccount = true;
        }
      }
    );
    this.loadAccount();
    this.loadClubs();
    this.loadProvinces();
  }

  save() {
    if (!this.accountForm.invalid) {
      this.notice.presentLoader();
      this.accountData.userID = this.userID;
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
      this.accountData.img = this.accountForm.value.image;
      console.log(this.accountData);
      this.http.put(this.domain + '/api/v1/accounts', this.accountData).subscribe(
        (resp: any) => {
          this.notice.presentToast('Successfully updated.', 'success');
          this.notice.dismissLoader();
          // this.router.navigate(['/account']);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.notice.presentToast('A critical error occured.', 'danger');
          this.notice.dismissLoader();
        }
      );
    } else {
      this.notice.presentToast('You have not completed all the required fields correctly.', 'danger');
    }
  }
  ionViewWillLeave() {
    this.accountSub.unsubscribe();
    this.clubsSub.unsubscribe();
    this.provincesSub.unsubscribe();
  }

}
