declare var dito;

import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ModalController, Platform, NavController, AlertController } from '@ionic/angular';
import { ModalFormAtendimentoPage } from '../modal-form-atendimento/modal-form-atendimento.page';
import { WebServiceService } from '../services/mrv/web-service.service';
import { NavProviderService } from '../services/provider/nav-provider.service'



@Component({
  selector: 'app-subsidio-mcmv',
  templateUrl: './subsidio-mcmv.page.html',
  styleUrls: ['./subsidio-mcmv.page.scss'],
})

export class SubsidioMcmvPage implements OnInit {

  valor: any;
  renda: any;
  valorLimiteCidade: any;
  cidades;
  cidadeEscolhida;
  idCidadeEscolhida;
  cidadeEscolhidaNome;
  multiploCompradorDependente = true;
  valorLimiteCidadeTemp = "";
  cidadeEscolhidaNomeTemp = "";

  constructor(private callNumber: CallNumber, private modalController: ModalController, private alertController: AlertController,
    private ws: WebServiceService, private platform: Platform, private navController: NavController, private provider: NavProviderService) {
    if (this.platform.ready()) {
      this.CarregaCidades();
      this.Dito();
    }
  }

  ngOnInit() {
    document.getElementById("chat-flutuante").style.display = 'block';
  }

  CalcularSubsidio() {
    this.DitoRastreamento("clicou-simulacao-subsidio")
    let rendaBruta = this.renda;
    rendaBruta = rendaBruta.replace("R$ ", "")
    rendaBruta = rendaBruta.replace(".", "")
    parseInt(rendaBruta);

    if (rendaBruta == null || rendaBruta == undefined || rendaBruta == "") {
      this.presentAlert("Renda");
    }
    else if (this.cidadeEscolhida == null || this.cidadeEscolhida == undefined) {
      this.presentAlert("Cidade");
    }
    else {
      this.ws.Subsidio(rendaBruta != null && rendaBruta != undefined ? rendaBruta.toString() : "0",
        this.idCidadeEscolhida != null && this.idCidadeEscolhida != undefined ? Number(this.idCidadeEscolhida) : 0,
        this.multiploCompradorDependente).subscribe((resposta: any) => {
          this.valor = resposta.data.valor;
          this.cidadeEscolhidaNomeTemp = this.cidadeEscolhida.nome
          this.valorLimiteCidadeTemp = this.valorLimiteCidade
          this.DitoSimular();
        })
    }
  }

  Ligar(telefone) {
    this.callNumber.callNumber(telefone, true).catch((error) => {
      console.log("ERROR on call number: " + error)
    })
  }

  CarregaCidades() {
    this.ws.getCidadesMCMV().subscribe((resposta: any) => {
      this.cidades = resposta.data;
    })
  }

  PreencherCidade() {
    if (this.cidadeEscolhida != null || this.cidadeEscolhida != undefined) {
      this.cidadeEscolhidaNome = this.cidadeEscolhida.nome;
      this.idCidadeEscolhida = this.cidadeEscolhida.subsidio;
      this.valorLimiteCidade = this.cidadeEscolhida.limite;
    }
  }

  async modalAtendimento() {
    const modal = await this.modalController.create({
      component: ModalFormAtendimentoPage,
      componentProps: {

      }
    });
    return await modal.present();
  }

  home() {
    this.navController.navigateForward("");
  }

  formatReal() {
    let v = this.renda;
    v = v.replace(/\D/g, "") // permite digitar apenas numero
    v = v.replace(/(\d{1})(\d{15})$/, "$1.$2") // coloca ponto antes dos ultimos digitos
    v = v.replace(/(\d{1})(\d{11})$/, "$1.$2") // coloca ponto antes dos ultimos 13 digitos
    v = v.replace(/(\d{1})(\d{8})$/, "$1.$2") // coloca ponto antes dos ultimos 10 digitos
    v = v.replace(/(\d{1})(\d{5})$/, "$1.$2") // coloca ponto antes dos ultimos 7 digitos
    v = v.replace(/(\d{1})(\d{1,2})$/, "$1,$2") // coloca virgula antes dos ultimos 4 digitos
    this.renda = "R$ " + v;
  }

  Dito() {
    this.provider.PegarEmailStorage().then((email) => {
      this.ws.RastrearDito("AcessouMinhaCasaMinhavida", email, "").subscribe((data) => {
        console.log(data);
      });
    })
  }

  DitoSimular() {
    let rendaMensal = this.renda;
    rendaMensal = rendaMensal.replace("R$ ", "");
    rendaMensal = rendaMensal.replace(".", "");
    parseInt(rendaMensal);

    let data = {
      renda_mensal: rendaMensal,
      cidade: this.cidadeEscolhidaNome,
      comprador_dependente: this.multiploCompradorDependente,
      total_subsidio: this.valor,
      valor_limite_imovel: this.valorLimiteCidade
    }

    this.provider.PegarEmailStorage().then((email) => {
      this.ws.RastrearDito("SimulouMinhaCasaMinhaVida", email, JSON.stringify(data)).subscribe((data) => {
        console.log(data);
      });
    })
  }

  async presentAlert(dado) {
    const alert = await this.alertController.create({
      header: dado + ' não selecionada',
      message: 'Por favor, preencha a ' + dado + ' antes de continuar a busca.',
      buttons: ['OK']
    });
    await alert.present();
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
