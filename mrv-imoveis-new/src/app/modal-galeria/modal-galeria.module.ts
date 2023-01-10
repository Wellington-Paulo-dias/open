import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalGaleriaPage } from './modal-galeria.page';

const routes: Routes = [
  {
    path: '',
    component: ModalGaleriaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalGaleriaPage]
})
export class ModalGaleriaPageModule {}
