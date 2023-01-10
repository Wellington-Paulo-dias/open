import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Platform, NavController, LoadingController, AlertController } from '@ionic/angular';
import { WebServiceService } from '../services/mrv/web-service.service';
import { NavProviderService } from '../services/provider/nav-provider.service'
import { MapperService } from '../services/mapper/mapper.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { FaixaDePreco } from '../model';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
  animations: [
    trigger('FadeToggle', [
      state('fadeIn', style({
        opacity: 1,
      })),
      state('fadeOut', style({
        opacity: 0.5,
      })),
      transition('fadeIn => fadeOut', [
        animate('0.5s')
      ]),
      transition('fadeOut => fadeIn', [
        animate('0.5s')
      ]),
    ]),
  ]
})
export class BuscaPage implements OnInit {

  isToggle = true;
  estados;
  estadoEscolhido;
  cidades;
  cidadeEscolhida;
  bairros;
  bairrosEscolhidos;
  faixasDePreco;
  faixaDePrecoEscolhida;
  uniqueID;
  existeCidade = false;
  existeBairro = false;
  existeFaixa = false;
  selecionarTodos = true;

  toggle() {
    this.isToggle = !this.isToggle;
    if (!this.isToggle) {
      document.getElementById('toggle').setAttribute('name', 'remove-circle-outline');
      document.getElementById('pesquisa-avancada').classList.add('ativo');
    } else {
      document.getElementById('toggle').setAttribute('name', 'add-circle');
      document.getElementById('pesquisa-avancada').classList.remove('ativo');
    }
  }

  constructor(
    private navController: NavController, private ws: WebServiceService,
    private platform: Platform, private alertController: AlertController,
    private provider: NavProviderService, private mapper: MapperService,
    private loadingController: LoadingController,
    private uniqueDeviceId: UniqueDeviceID
  ) {
    this.getId();
    if (this.platform.ready()) {
      this.CarregarEstados();
    }
  }

  ngOnInit() {
    document.getElementById('chat-flutuante').style.display = 'block';
    document.getElementById('toggle').style.display = 'none';
  }

  // exibirPesquisaAvancada(){
  //   this.isToggle = !this.isToggle;
  //   document.getElementById('toggle').style.display = "block";
  // }

  // ocultarPesquisaAvancada(){
  //   document.getElementById('exibir').style.display = "block";
  //   document.getElementById('toggle').style.display = "none";
  // }

  getId() {
    this.uniqueDeviceId.get()
    .then((uuid: any) => this.uniqueID = uuid)
    .catch((error: any) => console.log(error));
  }

  CarregarEstados() {
    this.ws.getEstadosImoveis().subscribe((resposta: any) => {
      this.LimparCampoEstado();
      this.estados = resposta.data;
    });
  }

  CarregarCidades() {
    if (this.estadoEscolhido.id != null){
      this.ws.getCidadeImovel(this.estadoEscolhido.id).subscribe((resposta: any) => {
        this.LimparCampoCidade();
        this.cidades = resposta.data;
        this.existeCidade = true;
      });
    }
  }

  CarregarBairros() {
    if (this.cidadeEscolhida.id != null) {
      this.ws.getBairrosCidade(this.cidadeEscolhida.id).subscribe((resposta: any) => {
        this.LimparCampoBairro();
        this.bairros = resposta.data;
        this.CarregarFaixasDePreco(this.estadoEscolhido.id, this.cidadeEscolhida.id, this.bairrosEscolhidos);
        this.existeBairro = true;
        document.getElementById('toggle').style.display = 'block';
      });
    }
  }

  CarregarFaixasDePreco(idEstado, idCidade, bairros = null){
    if (idCidade != null && idEstado != null) {
      this.ws.getFaixaDePreco(idEstado, idCidade, bairros).subscribe((resposta: any) => {
        if (resposta.data.length == 0) {
          this.faixasDePreco = new Array<FaixaDePreco>();
          this.faixaDePrecoEscolhida = null;
          this.existeFaixa = false;
        } else {
          this.faixasDePreco = this.mapper.FaixaDePreco(resposta.data);
          this.existeFaixa = true;
        }
      });
    }
  }

  AlterarBairros() {
    this.CarregarFaixasDePreco(this.estadoEscolhido.id, this.cidadeEscolhida.id, this.bairrosEscolhidos);
  }

  BuscarImoveis() {
    if (this.estadoEscolhido.id == null){
      this.presentAlert('Estado');
    } else if (this.cidadeEscolhida.id == null) {
      this.presentAlert('Cidade');
    } else {
      this.presentLoading();
      this.ws.BuscaAvancada(this.estadoEscolhido.id, this.cidadeEscolhida.id, this.bairrosEscolhidos, this.faixaDePrecoEscolhida, "12345667").subscribe((resposta: any) => {
        let imoveis = this.mapper.ServiceTodosImoveis(resposta);
        this.provider.object = imoveis;
        this.loadingController.dismiss();
        this.navController.navigateForward(`/tabs/(todos-imoveis:todos-imoveis)`);
      });
    }

    this.Dito();
  }

  Dito() {
    let bairrosEscolhidosNomes = [];
    if (this.bairrosEscolhidos != undefined && this.bairrosEscolhidos != null && this.bairrosEscolhidos.length > 0){
      this.bairrosEscolhidos.forEach((bairro) => {
        bairrosEscolhidosNomes.push(bairro.nome);
      });
    } else {
      bairrosEscolhidosNomes.push('Não possui.');
    }

    let faixasDePrecoEscolhidas = [];
    if (this.faixaDePrecoEscolhida != undefined && this.faixaDePrecoEscolhida != null && this.faixaDePrecoEscolhida.length > 0){
      this.faixaDePrecoEscolhida.forEach((faixa) => {
        faixasDePrecoEscolhidas.push(faixa.faixaDePreco);
      });
    } else {
      faixasDePrecoEscolhidas.push('Não possui.');
    }

    this.provider.PegarEmailStorage().then((email) => {

      let data = {
        estado: this.estadoEscolhido.nome,
        cidade: this.cidadeEscolhida.nome,
        bairros: JSON.stringify(bairrosEscolhidosNomes),
        faixa_de_preco: JSON.stringify(faixasDePrecoEscolhidas)
      }

      this.ws.RastrearDito('buscouimovel', email, JSON.stringify(data)).subscribe((data) => {
        console.log(data);
      });
    });
  }

  LimparCampoEstado() {
    this.estadoEscolhido = null;
    this.cidadeEscolhida = null;
    this.cidades = [null];
    this.bairrosEscolhidos = null;
    this.bairros = [null];
    this.faixaDePrecoEscolhida = null;
    this.faixasDePreco = [null];
    this.existeCidade = false;
    this.existeBairro = false;
    this.existeFaixa = false;
  }

  LimparCampoCidade() {
    this.cidadeEscolhida = null;
    this.bairrosEscolhidos = null;
    this.bairros = [null];
    this.faixaDePrecoEscolhida = null;
    this.faixasDePreco = [null];
  }

  LimparCampoBairro() {
    this.bairrosEscolhidos = null;
    this.faixaDePrecoEscolhida = null;
    this.faixasDePreco = [null];
  }

  LimparCampoFaixaDePreco() {
    this.faixaDePrecoEscolhida = null;
  }

  voltar() {
    this.navController.back();
  }

  home() {
    this.navController.navigateForward('');
  }

  async presentLoading() {
    const loadingElement = await this.loadingController.create({
      spinner: 'crescent',
      duration: 45000
    });
    return await loadingElement.present();
  }

  async presentAlert(unidadeAdm) {
    const alert = await this.alertController.create({
      header: unidadeAdm + ' não selecionado(a)',
      message: 'Por favor, selecione um(a) ' + unidadeAdm + ' antes de continuar a busca.',
      buttons: ['OK']
    });
    await alert.present();
  }

  compararFaixa() {
    return 1 && 1 ? 1 === 1 : 1 === 1;
  }
}
