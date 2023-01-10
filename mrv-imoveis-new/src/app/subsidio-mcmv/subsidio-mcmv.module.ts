import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SubsidioMcmvPage } from './subsidio-mcmv.page';
// import {NgxMaskIonicModule} from 'ngx-mask-ionic';
import { NgxMaskModule } from 'ngx-mask';

const routes: Routes = [
  {
    path: '',
    component: SubsidioMcmvPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    // NgxMaskIonicModule,
    NgxMaskModule
  ],
  declarations: [SubsidioMcmvPage]
})
export class SubsidioMcmvPageModule {}
