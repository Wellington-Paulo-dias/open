declare var dito;
import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';
import { WebServiceService } from '../services/mrv/web-service.service';
import { Newsletter } from '../model/newsletter';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavProviderService } from '../services/provider/nav-provider.service'
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Estado } from '../model/estado'
import { Cidade } from '../model/loja';
import { MapperService } from '../services/mapper/mapper.service';

@Component({
  selector: 'app-modal-ligamos-para-voce',
  templateUrl: './modal-ligamos-para-voce.page.html',
  styleUrls: ['./modal-ligamos-para-voce.page.scss'],
})

export class ModalLigamosParaVocePage implements OnInit {

  estados;
  estadoSelecionado;
  cidades;
  cidadeSelecionada;
  contatoLigamosNome = "";
  contatoLigamosEmail = "";
  contatoLigamosCelular;
  contatoLigamosDDD;
  newsletter = new Newsletter();

  constructor(
    private ws: WebServiceService,
    private modalController: ModalController,
    private platform: Platform,
    private iab: InAppBrowser,
    private provider: NavProviderService,
    private storage: NativeStorage,
    private map: MapperService,
    private alertController: AlertController
  ) {
    if (this.platform.ready()) {
      this.CarregarEstados();
    }
  }

  ngOnInit() {

  }

  inicializaCampo() {
    this.storage.getItem("nome_usuario").then((data) => {
      if (data != null && data != "") {
        this.contatoLigamosNome = data;
      }
    });

    this.storage.getItem("email_usuario").then((data) => {
      if (data != null && data != "") {
        this.contatoLigamosEmail = data;
      }
    });

    this.storage.getItem("ddd").then((data) => {
      if (data != null && data != "") {
        this.contatoLigamosDDD = data;
      }
    });

    this.storage.getItem("telefone_usuario").then((data) => {
      if (data != null && data != "") {
        this.contatoLigamosCelular = data;
      }
    });
  }

  CarregarEstados() {
    this.ws.getEstadosImoveis().subscribe((resposta) => {
      this.estados = this.map.ServiceEstados(resposta);
      this.storage.getItem("estadoSelecionado").then((data) => {
        if (data != null && data != "") {
          let estado = this.estados.filter(a => a.id == parseInt(data));
          this.estadoSelecionado = estado[0];
          this.CarregarCidades();
        }
      })
      this.inicializaCampo();
    })
  }

  CarregarCidades() {
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

    if (this.contatoLigamosNome == null || this.contatoLigamosNome == "") {
      erro++;
      this.presentAlert("Nome");
    }

    if (this.contatoLigamosEmail == null || this.contatoLigamosEmail == "") {
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

    if (erro === 0) {
      this.ws.EnviarContato(this.contatoLigamosNome, this.contatoLigamosDDD.toString(), this.contatoLigamosCelular.toString(), "", this.contatoLigamosEmail, this.cidadeSelecionada.id, this.newsletter).subscribe((data: any) => {
        if (data.success) {
          this.modalController.dismiss();
          this.Dito();
          this.DitoRastreamento("ligamos-para-voce")
        }
      })
    }
  }

  fechaModal() {
    this.modalController.dismiss();
  }

  termo() {
    const browser = this.iab.create("https://www.mrv.com.br/institucional/pt/politica-de-privacidade", "_system")
  }

  verificandoCheck() {
    var check = document.getElementById("termo").getAttribute("aria-checked");
    if (check == "false") {
      document.getElementById("enviaLigamos").setAttribute("disabled", "false");
    } else {
      document.getElementById("enviaLigamos").setAttribute("disabled", "true");
    }
  }

  Dito() {

    let data = {
      nome: this.contatoLigamosNome,
      email: this.contatoLigamosEmail,
      telefone: '(' + this.contatoLigamosDDD + ') ' + this.contatoLigamosCelular,
      estado: this.estadoSelecionado.nome,
      cidade: this.cidadeSelecionada.nome
    }

    this.provider.PegarEmailStorage().then((email) => {
      this.ws.RastrearDito("PreencheuLigamosParaVoce", email, JSON.stringify(data)).subscribe((data) => {
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

  DitoRastreamento(codigo: string) {
    let data = {
      origem: "app",
      nome: this.contatoLigamosNome,
      email: this.contatoLigamosEmail
    }
    this.provider.PegarEmailStorage().then((email) => {
      this.ws.RastrearDito(codigo, email, JSON.stringify(data)).subscribe((data) => {
        console.log(data)
      })
    })
  }
}
