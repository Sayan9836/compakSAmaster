import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScoreboardsPage } from './scoreboards.page';
import { NoDataComponent } from '../components/no-data/no-data.component';

const routes: Routes = [
  {
    path: '',
    component: ScoreboardsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScoreboardsPage, NoDataComponent]
})
export class ScoreboardsPageModule { }
