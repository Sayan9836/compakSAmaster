import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScoreboardTeamsPage } from './scoreboard-teams.page';

const routes: Routes = [
  {
    path: '',
    component: ScoreboardTeamsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScoreboardTeamsPage]
})
export class ScoreboardTeamsPageModule { }
