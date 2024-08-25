import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaidMembersByProvincePage } from './paid-members-by-province.page';

const routes: Routes = [
  {
    path: '',
    component: PaidMembersByProvincePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaidMembersByProvincePage]
})
export class PaidMembersByProvincePageModule {}
