import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TodosImoveisPage } from './todos-imoveis.page';

const routes: Routes = [
  {
    path: '',
    component: TodosImoveisPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [TodosImoveisPage]
})
export class TodosImoveisPageModule { }
