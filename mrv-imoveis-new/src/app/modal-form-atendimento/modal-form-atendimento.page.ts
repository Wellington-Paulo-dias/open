import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform, AlertController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { WebServiceService } from '../services/mrv/web-service.service';
import { MapperService } from '../services/mapper/mapper.service';
import { Estado } from '../model/estado'
import { Cidade } from '../model/loja';
import { ModalChatPage } from '../modal-chat/modal-chat.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavProviderService } from '../services/provider/nav-provider.service'

@Component({
  selector: 'app-modal-form-atendimento',
  templateUrl: './modal-form-atendimento.page.html',
  styleUrls: ['./modal-form-atendimento.page.scss'],
})

export class ModalFormAtendimentoPage implements OnInit {

  estados;
  cidades;
  cidadeSelecionada
  estadoSelecionado
  user_nome
  user_email
  user_telefone
  user_ddd
  controleInterna = false
  imagemCapa = ""
  logo = ""
  validacao = true
  checkTermos = false

  constructor(private ws: WebServiceService, private map: MapperService, private modalController: ModalController,
    private navParams: NavParams, private alertController: AlertController, private plataform: Platform, private storage: NativeStorage, private iab: InAppBrowser) { }

  ngOnInit() {
    this.user_nome = '';
    this.user_email = '';
    this.user_ddd = '';
    this.user_telefone = '';

    if (this.navParams.get("page") == "detalhe") {
      this.imagemCapa = this.navParams.get("imagem")
      this.logo = this.navParams.get("logo")
      this.controleInterna = true
      setTimeout(() => {
        this.preencheBG()
      }, 300);
    }
    this.carregaEstado()
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

  inicializaCampo() {
    this.storage.getItem("nome_usuario").then((data) => {
      if (data != null && data != "") {
        this.user_nome = data;
      }
    });

    this.storage.getItem("email_usuario").then((data) => {
      if (data != null && data != "") {
        this.user_email = data;
      }
    });

    this.storage.getItem("ddd").then((data) => {
      if (data != null && data != "") {
        this.user_ddd = data;
      }
    });

    this.storage.getItem("telefone_usuario").then((data) => {
      if (data != null && data != "") {
        this.user_telefone = data;
      }
    });
    // setTimeout(() => {
    //   this.validacaoForm()
    // }, 700);
    
  }

  fechaModal() {
    this.modalController.dismiss();
  }

  async enviar() {
    let propriedades = {}
    let erro = 0;

    if (this.user_email != null && this.user_email != "") {
      this.storage.setItem("email_usuario", this.user_email);
    } else {
      erro++;
      this.presentAlert("email");
    }

    if (this.user_nome != null && this.user_nome != "") {
      this.storage.setItem("nome_usuario", this.user_nome);
    } else {
      erro++;
      this.presentAlert("nome");
    }

    if (this.user_ddd != null && this.user_ddd != "")
      this.storage.setItem("ddd", this.user_ddd)

    if (this.user_telefone != null && this.user_telefone != "")
      this.storage.setItem("telefone_usuario", this.user_telefone)

    if (this.cidadeSelecionada != null && this.cidadeSelecionada != "") {
      this.storage.setItem("cboCidade", this.cidadeSelecionada.id);
    } else {
      erro++;
      this.presentAlert("Cidade");
    }

    if (this.estadoSelecionado != null && this.estadoSelecionado != "") {
      this.storage.setItem("estadoSelecionado", this.estadoSelecionado.id);
    } else {
      erro++;
      this.presentAlert("Estado");
    }

    if (erro === 0) {
      if (this.navParams.get("page") == "detalhe") {
        const modal = await this.modalController.create({
          component: ModalChatPage,
          componentProps: {
            page: "detalhe",
            idImovel: this.navParams.get("idImovel")
          }
        });
        return await modal.present();
      } else {
        const modal = await this.modalController.create({
          component: ModalChatPage,
          componentProps: {
            page: "atendimento"
          }
        });
        return await modal.present();
      }
    }
  }

  termo() {
    const browser = this.iab.create("https://www.mrv.com.br/institucional/pt/politica-de-privacidade", "_system")
  }

  verificandoCheck() {
    // var check = document.getElementById("termo").getAttribute("aria-checked");
    // if (check == "false") {
    //   document.getElementById("enviaFormAtendimento").setAttribute("disabled", "false");
    // } else {
    //   document.getElementById("enviaFormAtendimento").setAttribute("disabled", "true");
    // }
  }

  preencheBG() {
    document.getElementById("bgCapa").style.backgroundImage = "url(" + this.imagemCapa + ")"
  }

  LimparCampoEstado() {
    this.estadoSelecionado = null;
    this.cidadeSelecionada = null;
  }

  LimparCampoCidade() {
    this.cidadeSelecionada = null;
  }

  async presentAlert(dado) {
    const alert = await this.alertController.create({
      header: dado,
      message: 'Por favor, preencha corretamente o campo ' + dado + ' antes de enviar a mensagem',
      buttons: ['OK']
    });
    await alert.present();
  }

  changeDDD(dados){
    if(this.contemNumero(dados)){
      if(dados.length > 2){
        this.user_ddd = dados.substr(1, 2)
        console.log(this.user_ddd)
      }else{
        this.user_ddd = dados
        console.log(this.user_ddd)
      }
    }else{
      this.user_ddd = "";
    } 
    //this.validacaoForm()
  }

  changeTelefone(dados){
    if(this.contemNumero(dados)){
      if (Number(dados).toString().length < 9) this.validacao = false;

      this.user_telefone = dados;
      console.log(this.user_telefone)
    }else{
      this.user_telefone = "";
    } 
    //this.validacaoForm()
  }

  changeEmail(dados){
    if(dados.includes("@") && dados.includes(".com")){
      this.user_email = dados.trim()
    }
    //this.validacaoForm()
  }

  contemNumero(dados): boolean{
    var matches = dados.match(/\d+/g);
    if (matches != null) {
      return true;
    }else{
      return false;
    }
  }

  validacaoForm(){
    if(this.user_ddd != "" && this.user_email != "" && this.user_telefone != null && this.cidadeSelecionada != null){
      this.validacao = true
    }else{
      this.validacao = false
    }
  }
}

