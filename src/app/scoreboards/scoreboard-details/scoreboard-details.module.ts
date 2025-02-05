import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScoreboardDetailsPage } from './scoreboard-details.page';

const routes: Routes = [
  {
    path: '',
    component: ScoreboardDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScoreboardDetailsPage]
})
export class ScoreboardDetailsPageModule {}
