import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContatosMrvPage } from './contatos-mrv.page';

const routes: Routes = [
  {
    path: '',
    component: ContatosMrvPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ContatosMrvPage]
})
export class ContatosMrvPageModule {}
