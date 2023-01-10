import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalLigamosParaVocePage } from './modal-ligamos-para-voce.page';

const routes: Routes = [
  {
    path: '',
    component: ModalLigamosParaVocePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalLigamosParaVocePage]
})
export class ModalLigamosParaVocePageModule {}
