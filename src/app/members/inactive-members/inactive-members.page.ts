import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';
import { User } from 'src/app/users/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NoticesService } from 'src/app/services/notices.service';
@Component({
  selector: 'app-inactive-members',
  templateUrl: './inactive-members.page.html',
  styleUrls: ['./inactive-members.page.scss'],
})
export class InactiveMembersPage implements OnInit {

  constructor(
    private usersService: UsersService,
    private http: HttpClient,
    private notice: NoticesService
  ) { }

  users: User[] = [];
  usersUnfiltered: User[];
  noUsers = true;
  usersLoaded = false;
  usersSub;
  domain = environment.domain;
  currentPage = 0;
  entriesPP = 20;
  searchTerm = null;
  loaderSub;
  loading = false;
  inactiveData = {
    APIMode: "Update User State",
    userID: null,
    state: 1
  };
  loadEvent = null;
  unfilteredCP = null;
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.loaderSub = this.notice.loading.subscribe(
      (state: boolean) => {
        this.loading = state;
      }
    );
    this.usersSub = this.usersService.usersLoaded.subscribe(
      (users: User[]) => {
        this.notice.hideLoader();
        this.usersLoaded = true;
        Array.prototype.push.apply(this.users, users);
        if (this.loadEvent !== null) {
          this.loadEvent.target.complete();
        }
        if (users.length !== 0) {
          this.noUsers = false;
        } else {
          this.noUsers = true;
        }
      }
    );
    this.fetchUsers();
  }
  loadMore(event) {
    this.currentPage++;
    this.fetchUsers();
    this.loadEvent = event;
  }
  search(event) {
    this.unfilteredCP = this.currentPage;
    this.usersUnfiltered = this.users;
    this.searchTerm = event.srcElement.value;
    this.users = [];
    this.currentPage = 0;
    this.fetchUsers();

    // this.users = this.users.filter((user) => {
    //   if ((user.name.toLowerCase().search(search) !== -1) || (user.surname.toLowerCase().search(search) !== -1)) {
    //     return true;
    //   } else { return false; }
    // });
  }
  clearSearch() {
    this.users = this.usersUnfiltered;

    this.currentPage = this.unfilteredCP;
    this.searchTerm = null;
  }
  fetchUsers() {
    this.notice.showLoader();
    this.users = [];
    this.usersService.fetchUsers(0, this.entriesPP, this.currentPage, this.searchTerm);
  }
  makeActive(userID) {
    this.notice.presentAlertConfirm('You have chosen to make this member active.', () => { this.activate(userID); });
  }
  activate(userID) {
    this.inactiveData.userID = userID;
    console.log(this.inactiveData);
    this.http.put(this.domain + '/api/v1/accounts', this.inactiveData).subscribe(
      (resp: any) => {
        this.notice.presentToast('Successfully deactivated.', 'success');
        this.notice.dismissLoader();
        this.fetchUsers();
      },
      (error: HttpErrorResponse) => {
        // console.log(error);
        this.notice.presentToast('A critical error occured.', 'danger');
        this.notice.dismissLoader();
      }
    );
  }
  ionViewDidLeave() {
    console.log('left');
    this.usersSub.unsubscribe();
  }


}
