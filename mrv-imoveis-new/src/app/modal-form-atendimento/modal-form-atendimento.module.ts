import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { BrMaskerModule } from 'br-mask';

import { ModalFormAtendimentoPage } from './modal-form-atendimento.page';

const routes: Routes = [
  {
    path: '',
    component: ModalFormAtendimentoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrMaskerModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalFormAtendimentoPage]
})
export class ModalFormAtendimentoPageModule {}
