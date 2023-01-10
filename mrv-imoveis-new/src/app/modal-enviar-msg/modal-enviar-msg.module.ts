import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalEnviarMsgPage } from './modal-enviar-msg.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEnviarMsgPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalEnviarMsgPage]
})
export class ModalEnviarMsgPageModule {}
