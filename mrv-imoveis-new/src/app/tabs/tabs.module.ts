import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';
import { TabsPage } from './tabs.page';
import { HomePageModule } from '../home/home.module';
import { BuscaProximidadePageModule } from '../busca-proximidade/busca-proximidade.module'
import { LojasPageModule } from '../lojas/lojas.module';
import { BuscaPageModule } from '../busca/busca.module';
import { ContatosMrvPageModule } from '../contatos-mrv/contatos-mrv.module';
import { FinanciamentoPageModule } from '../financiamento/financiamento.module';
import { SubsidioMcmvPageModule } from '../subsidio-mcmv/subsidio-mcmv.module';
import { FavoritosPageModule } from '../favoritos/favoritos.module';
import { ImoveisInternaPageModule } from '../imoveis-interna/imoveis-interna.module';
import { TodosImoveisPageModule } from '../todos-imoveis/todos-imoveis.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HomePageModule,
    BuscaProximidadePageModule,
    LojasPageModule,
    BuscaPageModule,
    ContatosMrvPageModule,
    FinanciamentoPageModule,
    SubsidioMcmvPageModule,
    FavoritosPageModule,
    ImoveisInternaPageModule,
    TodosImoveisPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }
