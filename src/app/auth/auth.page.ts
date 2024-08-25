import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { MenusService } from "../menus/menus.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NoticesService } from "../services/notices.service";
import { environment } from "src/environments/environment";
import { DatabaseService } from "../services/database.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private menusService: MenusService,
    private router: Router,
    private notice: NoticesService,
    private database: DatabaseService,
    private route: ActivatedRoute,
  ) {}

  email = null;
  password = null;
  domain = environment.domain;
  loginSub;
  ngOnInit() {
    // this.database.getObject('token').then(
    //   (data) => {
    //     if (data !== null) {
    //       if (this.authService.isValid(data)) {
    //       }
    //     }
    //   }
    // );
    console.log(this.route.snapshot.paramMap);
  }

  ionViewDidEnter() {
    this.loginSub = this.authService.authenticatedLogin.subscribe(
      (state: boolean) => {
        console.log(state);
        if (state) {
          this.menusService.fetchMenus();
          this.router.navigate(["/events"]);
        }
      },
    );
    this.authService.autoLogin();
  }
  login() {
    this.notice.presentLoader();
    const formData: FormData = new FormData();
    formData.append("username", this.email);
    formData.append("password", this.password);
    //this.domain + "/api/v1/login"
    //https://new.compaksa.co.za/wp-json/jwt-auth/v1/token
    this.http
      .post(`https://new.compaksa.co.za/wp-json/jwt-auth/v1/token`, formData)
      .subscribe(
        (resp: any) => {
          this.notice.dismissLoader();
          console.log("resp=> ", resp.token);
          this.authService.setToken(resp.token);
          if (this.authService.isAuthenticated()) {
            this.menusService.fetchMenus();
            this.router.navigate(["/events"]);
          }
        },
        (error: HttpErrorResponse) => {
          console.log("error=> ", error);
          this.notice.dismissLoader();
          this.notice.presentToast("Incorrect login details", "danger");
        },
      );
  }

  ionViewDidLeave() {
    this.loginSub.unsubscribe();
  }
}
