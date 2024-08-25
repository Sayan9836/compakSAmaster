import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ActiveMembersPage } from './active-members.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveMembersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ActiveMembersPage]
})
export class ActiveMembersPageModule {}
