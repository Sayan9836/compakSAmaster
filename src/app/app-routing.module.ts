import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
// import { AuthGuard } from "./auth/auth.guard";
const routes: Routes = [
  { path: "", redirectTo: "auth", pathMatch: "full" },
  { path: "auth", loadChildren: "./auth/auth.module#AuthPageModule" },
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "events",
    loadChildren: "./events/events.module#EventsPageModule",
    // canActivate: [AuthGuard],
    // data: { permissionID: 21 }
  },
  {
    path: "event-details/:eventID",
    loadChildren:
      "./events/event-details/event-details.module#EventDetailsPageModule",
    // canActivate: [AuthGuard],
    // data: { permissionID: 22 }
  },
  {
    path: "register-event/:eventID",
    loadChildren:
      "./events/register-event/register-event.module#RegisterEventPageModule",
    // canActivate: [AuthGuard],
    // data: { permissionID: 14 }
  },
  {
    path: "account",
    loadChildren: "./account/account.module#AccountPageModule",
    // canActivate: [AuthGuard],
    // data: { permissionID: 23 }
  },
  {
    path: "edit-account/:userID",
    loadChildren:
      "./account/edit-account/edit-account.module#EditAccountPageModule",
    // canActivate: [AuthGuard],
    // data: { permissionID: 24 }
  },
  {
    path: "scoreboards/:eventID",
    loadChildren: "./scoreboards/scoreboards.module#ScoreboardsPageModule",
    // canActivate: [AuthGuard],
    // data: { permissionID: 11 }
  },
  {
    path: "scoreboard-details/:eventID/:index",
    loadChildren:
      "./scoreboards/scoreboard-details/scoreboard-details.module#ScoreboardDetailsPageModule",
    // canActivate: [AuthGuard],
    // data: { permissionID: 25 }
  },
  {
    path: "scoreboard-capture-scores/:eventID",
    loadChildren:
      "./scoreboards/scoreboard-capture-scores/scoreboard-capture-scores.module#ScoreboardCaptureScoresPageModule",
    // canActivate: [AuthGuard],
    // data: { permissionID: 26 }
  },
  {
    path: "register",
    loadChildren: "./registration/registration.module#RegistrationPageModule",
  },
  {
    path: "shoot-off/:eventID",
    loadChildren: "./scoreboards/shoot-off/shoot-off.module#ShootOffPageModule",
  },
  {
    path: "active-members",
    loadChildren:
      "./members/active-members/active-members.module#ActiveMembersPageModule",
  },
  {
    path: "inactive-members",
    loadChildren:
      "./members/inactive-members/inactive-members.module#InactiveMembersPageModule",
  },
  { path: "clubs", loadChildren: "./clubs/clubs.module#ClubsPageModule" },
  {
    path: "edit-club/:clubID",
    loadChildren: "./clubs/edit-club/edit-club.module#EditClubPageModule",
  },
  {
    path: "create-club",
    loadChildren: "./clubs/create-club/create-club.module#CreateClubPageModule",
  },
  {
    path: "events/:eventID/class-override/:userID",
    loadChildren:
      "./events/class-override/class-override.module#ClassOverridePageModule",
  },
  {
    path: "reports/paid-members-by-province",
    loadChildren:
      "./reports/paid-members-by-province/paid-members-by-province.module#PaidMembersByProvincePageModule",
  },
  {
    path: "reports/paid-members-by-club",
    loadChildren:
      "./reports/paid-members-by-club/paid-members-by-club.module#PaidMembersByClubPageModule",
  },
  {
    path: "paid-members-by-club",
    loadChildren:
      "./exports/paid-members-by-club/paid-members-by-club.module#PaidMembersByClubPageModule",
  },
  {
    path: "paid-members-by-province",
    loadChildren:
      "./exports/paid-members-by-province/paid-members-by-province.module#PaidMembersByProvincePageModule",
  },
  {
    path: "scoreboard-teams/:eventID",
    loadChildren:
      "./scoreboards/scoreboard-teams/scoreboard-teams.module#ScoreboardTeamsPageModule",
  },
  { path: "**", redirectTo: "auth" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
