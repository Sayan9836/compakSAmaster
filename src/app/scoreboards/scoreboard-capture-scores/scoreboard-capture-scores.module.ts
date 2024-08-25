import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScoreboardCaptureScoresPage } from './scoreboard-capture-scores.page';

const routes: Routes = [
  {
    path: '',
    component: ScoreboardCaptureScoresPage
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
  declarations: [ScoreboardCaptureScoresPage]
})
export class ScoreboardCaptureScoresPageModule { }
