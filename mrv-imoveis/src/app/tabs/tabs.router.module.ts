import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { HomePage } from '../home/home.page';
import { AboutPage } from '../about/about.page';
import { BuscaProximidadePage } from '../busca-proximidade/busca-proximidade.page';
import { LojasPage } from '../lojas/lojas.page';
import { BuscaPage } from '../busca/busca.page';
import { ContatosMrvPage } from '../contatos-mrv/contatos-mrv.page';
import { FinanciamentoPage } from '../financiamento/financiamento.page';
import { SubsidioMcmvPage } from '../subsidio-mcmv/subsidio-mcmv.page';
import { FavoritosPage } from '../favoritos/favoritos.page';
import { ImoveisInternaPage } from '../imoveis-interna/imoveis-interna.page';
import { TodosImoveisPage } from '../todos-imoveis/todos-imoveis.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(home:home)',
        pathMatch: 'full',
      },
      {
        path: 'home',
        outlet: 'home',
        component: HomePage
      },
      {
        path: 'busca-proximidade',
        outlet: 'busca-proximidade',
        component: BuscaProximidadePage
      },
      {
        path: 'lojas',
        outlet: 'lojas',
        component: LojasPage
      },
      {
        path: 'busca',
        outlet: 'busca',
        component: BuscaPage
      },
      {
        path: 'contato',
        outlet: 'contato',
        component: ContatosMrvPage
      },
      {
        path: 'financiamento',
        outlet: 'financiamento',
        component: FinanciamentoPage
      },
      {
        path: 'subsidio',
        outlet: 'subsidio',
        component: SubsidioMcmvPage
      },
      {
        path: 'favoritos',
        outlet: 'favoritos',
        component: FavoritosPage
      },
      {
        path: 'imoveis-interna/:id',
        outlet: 'imoveis-interna',
        component: ImoveisInternaPage
      },
      {
        path: 'todos-imoveis',
        outlet: 'todos-imoveis',
        component: TodosImoveisPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(home:home)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
