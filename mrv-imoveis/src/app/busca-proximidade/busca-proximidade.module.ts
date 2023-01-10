import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BuscaProximidadePage } from './busca-proximidade.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: BuscaProximidadePage }])
  ],
  declarations: [BuscaProximidadePage]
})
export class BuscaProximidadePageModule { }
