import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditClubPage } from './edit-club.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: EditClubPage
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
  declarations: [EditClubPage]
})
export class EditClubPageModule { }
