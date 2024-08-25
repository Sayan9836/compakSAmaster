import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateClubPage } from './create-club.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CreateClubPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateClubPage]
})
export class CreateClubPageModule { }
