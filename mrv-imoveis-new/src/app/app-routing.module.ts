import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'todos-imoveis/', loadChildren: './todos-imoveis/todos-imoveis.module#TodosImoveisPageModule' },
  { path: 'imoveis-interna/:id', loadChildren: './imoveis-interna/imoveis-interna.module#ImoveisInternaPageModule' },
  { path: 'modal-diferenciais', loadChildren: './modal-diferenciais/modal-diferenciais.module#ModalDiferenciaisPageModule' },
  { path: 'modal-ficha-tecnica', loadChildren: './modal-ficha-tecnica/modal-ficha-tecnica.module#ModalFichaTecnicaPageModule' },
  { path: 'modal-galeria', loadChildren: './modal-galeria/modal-galeria.module#ModalGaleriaPageModule' },
  { path: 'modal-chat', loadChildren: './modal-chat/modal-chat.module#ModalChatPageModule' },
  { path: 'financiamento', loadChildren: './financiamento/financiamento.module#FinanciamentoPageModule' },
  { path: 'mapa-rota', loadChildren: './mapa-rota/mapa-rota.module#MapaRotaPageModule' },
  { path: 'subsidio-mcmv', loadChildren: './subsidio-mcmv/subsidio-mcmv.module#SubsidioMcmvPageModule' },
  { path: 'contatos-mrv', loadChildren: './contatos-mrv/contatos-mrv.module#ContatosMrvPageModule' },
  { path: 'modal-form-atendimento', loadChildren: './modal-form-atendimento/modal-form-atendimento.module#ModalFormAtendimentoPageModule' },
  { path: 'modal-enviar-msg', loadChildren: './modal-enviar-msg/modal-enviar-msg.module#ModalEnviarMsgPageModule' },
  { path: 'favoritos', loadChildren: './favoritos/favoritos.module#FavoritosPageModule' },
  { path: 'busca', loadChildren: './busca/busca.module#BuscaPageModule' },
  { path: 'modal-ligamos-para-voce', loadChildren: './modal-ligamos-para-voce/modal-ligamos-para-voce.module#ModalLigamosParaVocePageModule' }





  //{ path: 'lojas', loadChildren: './lojas/lojas.module#LojasPageModule' },




  // { path: 'busca-proximidade', loadChildren: './busca-proximidade/busca-proximidade.module#BuscaProximidadePageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
