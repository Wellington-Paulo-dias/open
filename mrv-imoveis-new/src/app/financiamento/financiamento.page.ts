declare var dito;

import { Component, OnInit, ɵConsole } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import { WebServiceService } from '../services/mrv/web-service.service';
import { MapperService } from '../services/mapper/mapper.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavProviderService } from '../services/provider/nav-provider.service';

@Component({
  selector: 'app-financiamento',
  templateUrl: './financiamento.page.html',
  styleUrls: ['./financiamento.page.scss']
})
export class FinanciamentoPage implements OnInit {
  isToggle = true;

  financiamentos: any;

  constructor(private iab: InAppBrowser, private platform: Platform, private loadingController: LoadingController,
    private ws: WebServiceService, private mapper: MapperService, private router: Router, private navController: NavController,
    private provider: NavProviderService) {
    if (this.platform.ready()) {
      this.presentLoading().then(() => this.CarregarFinanciamentos().then(() => this.loadingController.dismiss()));
      this.Dito();
    }
  }

  ngOnInit() {
    document.getElementById("chat-flutuante").style.display = 'block';
  }

  toggleSection(index) {

    if (document.getElementById(index).classList.contains("ativo")) {
      document.getElementById(index).classList.remove("ativo");
    } else {
      document.getElementById(index).classList.add("ativo");
    }

    // if(!this.isToggle){
    //   document.getElementById('toggle').setAttribute('name','remove-circle-outline');
    //   document.getElementById('pesquisa-avancada').classList.add('ativo');
    // }else {
    //   document.getElementById('toggle').setAttribute('name','add-circle');
    //   document.getElementById('pesquisa-avancada').classList.remove('ativo');
    // }

  }

  async CarregarFinanciamentos() {
    this.ws.Financiamento().subscribe((resposta) => {
      console.log(resposta)
      this.financiamentos = this.mapper.Financiamentos(resposta)
      this.financiamentos[8].Logos.push({ url: "assets/imagens/plano-investidor.png" });
      this.financiamentos[9].Logos.push({ url: "assets/imagens/ofertas.png" })
    });
  }

  Documentacao() {
    this.DitoRastreamento("clicou-documentos-necessarios")
    const browser = this.iab.create("https://www.mrv.com.br/imoveis/financiamento/documentos", "_system")
  }

  Simulacao() {
    this.router.navigateByUrl('/subsidio-mcmv');
  }

  async presentLoading() {
    const loadingElement = await this.loadingController.create({
      spinner: 'crescent',
      duration: 45000
    });
    return await loadingElement.present();
  }
  home() {
    this.navController.navigateForward("");
  }
  voltar() {
    this.navController.back();
  }

  Dito() {
    this.provider.PegarEmailStorage().then((email) => {
      this.ws.RastrearDito("acessoufinanciamento", email, "").subscribe((data) => {
        console.log(data);
      });
    })
  }

  Rastreamento(nome: string) {
    console.log(nome)
    switch (nome) {
      case "Financiamento Bancário Banco Bradesco":
        //this.DitoRastreamento("")
        break;
      case "Caixa Econômica Federal/ SFH-CEF":
        this.DitoRastreamento("clicou-saiba-mais-caixa")
        break;
      case "Financiamento Banco do Brasil":
        this.DitoRastreamento("clicou-saiba-mais-banco-do-brasil")
        break;
      case "Minha Casa Minha Vida":
        this.DitoRastreamento("clicou-saiba-mais-mcmv")
        break;
      case "FGTS":
        this.DitoRastreamento("clicou-saiba-mais-fgts")
        break;
      case "Financiamento Bancário Banco Inter":
        this.DitoRastreamento("clicou-saiba-mais-inter")
        break;
      case "Financiamento Bancário Santander":
        this.DitoRastreamento("clicou-saiba-mais-santander")
        break;
      case "Crédito Imobiliário Banco Inter para Emigrantes":
        this.DitoRastreamento("clicou-saiba-mais-inter-imigrantes")
        break;
      case "Investidor":
        this.DitoRastreamento("clicou-saiba-mais-investidor")
        break;
      case "Condições Especiais":
        this.DitoRastreamento("clicou-saiba-mais-condicoes-especiais")
        break;
    }
  }

  DitoRastreamento(codigo: string) {
    let data = {
      origem: "app"
    }
    this.provider.PegarEmailStorage().then((email) => {
      this.ws.RastrearDito(codigo, email, JSON.stringify(data)).subscribe((data) => {
        console.log(data)
      })
    })
  }
}

