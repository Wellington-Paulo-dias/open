import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ImoveisInternaPage } from './imoveis-interna.page';

const routes: Routes = [
  {
    path: '',
    component: ImoveisInternaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ImoveisInternaPage]
})
export class ImoveisInternaPageModule {}
