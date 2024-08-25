import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InactiveMembersPage } from './inactive-members.page';

const routes: Routes = [
  {
    path: '',
    component: InactiveMembersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InactiveMembersPage]
})
export class InactiveMembersPageModule {}
