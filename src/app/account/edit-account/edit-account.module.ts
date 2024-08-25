import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditAccountPage } from './edit-account.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: EditAccountPage
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
  declarations: [EditAccountPage]
})
export class EditAccountPageModule { }
