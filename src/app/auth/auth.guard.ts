// // import { Injectable } from '@angular/core';
// // import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router } from '@angular/router';
// // import { Observable } from 'rxjs';
// // import { AuthService } from './auth.service';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthGuard implements CanLoad {

// //   constructor(private authService: AuthService, private router: Router) { }

// //   canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
// //     if (!this.authService.isAuthenticated()) {
// //       this.router.navigateByUrl('/auth');
// //     }
// //     return this.authService.isAuthenticated();
// //   }
// // }
// import { Injectable } from "@angular/core";
// import { Router } from "@angular/router";
// import {
//   CanActivate,
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
// } from "@angular/router";
// import { AuthService } from "./auth.service";
// import { AlertController } from "@ionic/angular";
// import { NoticesService } from "../services/notices.service";

// @Injectable({
//   providedIn: "root",
// })
// export class AuthGuard implements CanActivate {
//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private notice: NoticesService,
//   ) {}
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot,
//   ): boolean {
//     const permissionID = route.data["permissionID"];
//     console.log("data-route => ", route.data);

//     if (this.authService.permissions.includes(permissionID)) {
//       return true;
//     } else {
//       this.notice.presentToast(
//         "You do not have permission to view this.",
//         "danger",
//       );
//       this.router.navigate(["/"]);
//       return false;
//     }
//   }
// }
