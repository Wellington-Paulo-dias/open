declare var dito;

import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform, AlertController } from '@ionic/angular';
import { WebServiceService } from '../services/mrv/web-service.service';
import { Newsletter } from '../model/newsletter';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavProviderService } from '../services/provider/nav-provider.service';
import { MapperService } from '../services/mapper/mapper.service';

@Component({
  selector: 'app-modal-enviar-msg',
  templateUrl: './modal-enviar-msg.page.html',
  styleUrls: ['./modal-enviar-msg.page.scss'],
})

export class ModalEnviarMsgPage implements OnInit {

  estados;
  cidades;
  cidadeSelecionada
  estadoSelecionado
  contatoNome
  contatoEmail;
  contatoCelular;
  contatoDDD;
  contatoMensagem;
  newsletter = new Newsletter();

  constructor(private modalController: ModalController, private navParams: NavParams,
    private platform: Platform, private ws: WebServiceService, private iab: InAppBrowser,
    private storage: NativeStorage, private alertController: AlertController, private provider: NavProviderService, private map: MapperService) {
    if (this.platform.ready()) {
      this.carregaEstado();
    }
  }

  ngOnInit() {
    if (this.platform.is("android")) {
      document.getElementById('check').classList.add('check-android');
    }
    this.inicializaCampo()
  }

  inicializaCampo() {
    this.storage.getItem("nome_usuario").then((data) => {
      if (data != null && data != "") {
        this.contatoNome = data
      }
    });

    this.storage.getItem("email_usuario").then((data) => {
      if (data != null && data != "") {
        this.contatoEmail = data
      }
    });

    this.storage.getItem("ddd").then((data) => {
      if (data != null && data != "") {
        this.contatoDDD = data
      }
    });

    this.storage.getItem("telefone_usuario").then((data) => {
      if (data != null && data != "") {
        this.contatoCelular = data
      }
    });
  }

  fechaModal() {
    this.modalController.dismiss();
  }

  carregaEstado() {
    this.ws.getEstadosImoveis().subscribe((resposta) => {
      this.estados = this.map.ServiceEstados(resposta);
      this.storage.getItem("estadoSelecionado").then((data) => {
        if (data != null && data != "") {
          let estado = this.estados.filter(a => a.id == parseInt(data));
          this.estadoSelecionado = estado[0];
          this.carregaCidade();
        }
      })
      this.inicializaCampo();
    })
  }

  carregaCidade() {
    this.ws.getCidadeImovel(this.estadoSelecionado.id).subscribe((resposta: any) => {
      this.cidades = resposta.data;
      this.storage.getItem("cboCidade").then((data) => {
        if (data != null && data != "") {
          let cidade = this.cidades.filter(a => a.id == parseInt(data));
          this.cidadeSelecionada = cidade[0];
        }
      })
    });
  }

  LimparCampoEstado() {
    this.estadoSelecionado = null;
    this.cidadeSelecionada = null;
  }

  LimparCampoCidade() {
    this.cidadeSelecionada = null;
  }

  EnviarMensagem() {
    let erro = 0;

    if (this.contatoNome == null || this.contatoNome == "") {
      erro++;
      this.presentAlert("Nome");
    }

    if (this.contatoEmail == null || this.contatoEmail == "") {
      erro++;
      this.presentAlert("E-mail");
    }

    if (this.cidadeSelecionada == null || this.cidadeSelecionada == "") {
      erro++;
      this.presentAlert("Cidade");
    }

    if (this.estadoSelecionado == null || this.estadoSelecionado == "") {
      erro++;
      this.presentAlert("Estado");
    }

    if (this.contatoMensagem == null || this.contatoMensagem == "") {
      erro++;
      this.presentAlert("Mensagem");
    }

    console.log(erro)

    if (erro === 0) {
      this.ws.EnviarContato(this.contatoNome, this.contatoDDD.toString(), this.contatoCelular.toString(), this.contatoMensagem, this.contatoEmail, this.cidadeSelecionada.id, this.newsletter).subscribe((data: any) => {
        if (data.success) {
          alert("Mensagem Enviada")
          this.modalController.dismiss();
          this.Dito();
        }
      })
    }
  }

  termo() {
    const browser = this.iab.create("https://www.mrv.com.br/institucional/pt/politica-de-privacidade", "_system")
  }

  verificandoCheck() {
    var check = document.getElementById("termo").getAttribute("aria-checked");
    if (check == "false") {
      document.getElementById("enviaFormMensagem").setAttribute("disabled", "false");
    } else {
      document.getElementById("enviaFormMensagem").setAttribute("disabled", "true");
    }
  }

  Dito() {

    let data = {
      nome: this.contatoNome,
      email: this.contatoEmail,
      telefone: '(' + this.contatoDDD + ') ' + this.contatoCelular,
      estado: this.estadoSelecionado.nome,
      cidade: this.cidadeSelecionada.nome,
      mensagem: this.contatoMensagem,
      receber_contato: this.newsletter
    }

    this.provider.PegarEmailStorage().then((email) => {
      this.ws.RastrearDito("envioumensagem", email, JSON.stringify(data)).subscribe((data) => {
        console.log(data);
      });
    })
  }


  async presentAlert(dado) {
    const alert = await this.alertController.create({
      header: dado,
      message: 'Por favor, preencha corretamente o campo ' + dado + ' antes de enviar a mensagem',
      buttons: ['OK']
    });
    await alert.present();
  }
}
