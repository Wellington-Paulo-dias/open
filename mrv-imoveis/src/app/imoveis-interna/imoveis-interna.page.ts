import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController, LoadingController, AlertController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { ModalDiferenciaisPage } from '../modal-diferenciais/modal-diferenciais.page';
import { ModalFichaTecnicaPage } from '../modal-ficha-tecnica/modal-ficha-tecnica.page';
import { ModalGaleriaPage } from '../modal-galeria/modal-galeria.page';
import { ModalFormAtendimentoPage } from '../modal-form-atendimento/modal-form-atendimento.page';
import { WebServiceService } from '../services/mrv/web-service.service';
import { MapperService } from '../services/mapper/mapper.service';
import { NavProviderService } from '../services/provider/nav-provider.service'
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { RouterEventService } from '../services/provider/router-event.service'
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-imoveis-interna',
  templateUrl: './imoveis-interna.page.html',
  styleUrls: ['./imoveis-interna.page.scss'],
})

export class ImoveisInternaPage extends RouterEventService implements OnInit {

  active = false;
  contadorSlide = 0;
  slideTotal = 0;
  slideAtual = 0;
  id;
  detalhesImovel;
  semImoveis = false;
  uniqueID;
  classeFundo = true;

  Localizacao = {
    Latitude: 0,
    Longitude: 0
  }

  @ViewChild('firstSlider') slider;

  constructor(public modalController: ModalController, private activatedRoute: ActivatedRoute,
    private platform: Platform, private ws: WebServiceService, private mapper: MapperService,
    private navCtrl: NavController, private provider: NavProviderService, private geolocation: Geolocation,
    private loadingController: LoadingController, private socialSharing: SocialSharing, private alertController: AlertController,
    private uniqueDeviceID: UniqueDeviceID, private router: Router, private route: ActivatedRoute,
    private iab: InAppBrowser) {
    super(router, route);
    this.getId();
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
  }

  onEnter() {
    this.presentLoading().then(async () => this.iniciaView());
  }

  OnDestroy() {
  }

  async controleSlide() {
    this.contadorSlide = this.contadorSlide + 1;
    if (this.contadorSlide >= 3) {
      this.modalGaleria();
    }
  }

  iniciaView() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.Localizacao.Latitude = resp.coords.latitude;
      this.Localizacao.Longitude = resp.coords.longitude;
      this.ws.DetalheImovel(this.id, this.Localizacao.Latitude, this.Localizacao.Longitude, this.uniqueID).subscribe((resposta: any) => {
        //this.ws.DetalheImovel(this.id, -19.9245, -43.9353, 1234567).subscribe((resposta: any) => {
        if (resposta.success) {
          this.detalhesImovel = this.mapper.ServiceDetalhe(resposta);
          if (this.detalhesImovel.Imagens.length == 0) {
            let obj = {
              thumbMediumUrl: this.detalhesImovel.UrlLogo,
              thumbSmallUrl: this.detalhesImovel.UrlLogo,
              tipoImagem: "",
              tipoMedia: "Imagem",
              titulo: "Imagem principal",
              url: this.detalhesImovel.UrlLogo
            }
            this.detalhesImovel.Imagens.push(obj)
          }
          this.loadingController.dismiss().then(async () => {
            this.classeFundo = false;
            await this.bullets();
            this.loadingController.dismiss();
          });
          this.bullets();
          this.Dito();
        }
        else {
          this.mensagemDeErro();
        }
      }, (error) => {
        this.mensagemDeErro();
      })
      this.carregou = true;
    }).catch((error) => {
      this.mensagemDeErroLocal();
      this.carregou = true;
    })
  }

  public async ngOnInit() {
    document.getElementById("chat-flutuante").style.display = 'block';
  }

  voltar() {
    this.navCtrl.goBack();
  }

  async modalDiferenciais() {
    const modal = await this.modalController.create({
      component: ModalDiferenciaisPage,
      componentProps: {
        imovel: this.detalhesImovel
      }
    });
    return await modal.present();
  }

  async modalFichaTecnica() {
    const modal = await this.modalController.create({
      component: ModalFichaTecnicaPage,
      componentProps: {
        imovel: this.detalhesImovel
      }
    });
    return await modal.present();
  }

  async modalGaleria() {
    this.contadorSlide = 0;
    const modal = await this.modalController.create({
      component: ModalGaleriaPage,
      componentProps: {
        imovel: this.detalhesImovel
      }
    });
    return await modal.present();
  }

  async MapaRota() {
    let objeto = {
      nome: this.detalhesImovel.NomeImovel,
      latitude: this.detalhesImovel.Localizacao.Latitude,
      longitude: this.detalhesImovel.Localizacao.Longitude,
      classeStatusImovel: this.detalhesImovel.ClasseStatusImovel,
      origem: 0
    }
    console.log('objeto location => ', objeto);
    
    this.provider.object = { objeto };
    await this.navCtrl.navigateForward('/mapa-rota');
  }

  async toggle() {

    let exibeTexto = document.getElementById('toggleTexto');

    if (this.active == false) {
      this.active = true;
      document.getElementById('descricao-curta').classList.toggle("none");
      exibeTexto.classList.add('active');
      document.getElementById('btnTexto').innerHTML = "Mostrar menos";

    } else {
      this.active = false;
      document.getElementById('descricao-curta').classList.toggle("none");
      exibeTexto.classList.remove('active');
      document.getElementById('btnTexto').innerHTML = "Saiba mais";
    }
  }

  async toggleLocaliza() {

    let exibeTexto = document.getElementById('toggleTextoLocaliza');

    if (this.active == false) {
      this.active = true;
      document.getElementById('descricao-curta-local').classList.toggle("none");
      exibeTexto.classList.add('active');
      document.getElementById('btnTextoLocaliza').innerHTML = "Mostrar menos";

    } else {
      this.active = false;
      document.getElementById('descricao-curta-local').classList.toggle("none");
      exibeTexto.classList.remove('active');
      document.getElementById('btnTextoLocaliza').innerHTML = "Saiba mais";
    }
  }

  async bullets() {
    this.slideTotal = await this.slider.length();
    this.slideAtual = await this.slider.getActiveIndex() + 1;
  }

  async presentLoading() {
    const loadingElement = await this.loadingController.create({
      spinner: 'crescent',
      duration: 45000
    })

    return await loadingElement.present()
  }

  async modalChat() {
    const modal = await this.modalController.create({
      component: ModalFormAtendimentoPage,
      componentProps: {
        idImovel: this.detalhesImovel.IdImovel,
        page: "detalhe",
        imagem: this.detalhesImovel.UrlImagemCapa,
        logo: this.detalhesImovel.UrlLogo
      }
    });
    return await modal.present();
  }

  async modalAtendimento() {
    const modal = await this.modalController.create({
      component: ModalFormAtendimentoPage,
      componentProps: {
        idImovel: this.detalhesImovel.IdImovel,
        page: "detalhe",
        imagem: this.detalhesImovel.UrlImagemCapa,
        logo: this.detalhesImovel.UrlLogo
      }
    });
    return await modal.present();
  }

  Share() {
    this.socialSharing.share(this.detalhesImovel.NomeImovel, "Imóvel MRV", this.detalhesImovel.Imagens[0].url, this.detalhesImovel.Url)
  }

  getId() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => this.uniqueID = uuid)
      .catch((error: any) => console.log(error))
  }

  Favoritar(idImovel) {
    this.ws.GetImoveisFavoritos(this.uniqueID).subscribe((resposta) => {
      let imoveisFav = this.mapper.ImoveisFavoritadosId(resposta);
      if (imoveisFav.indexOf(idImovel) == -1) {
        this.FavoritarImovel(idImovel);
      }
      else {
        this.DesfavoritarImovel(idImovel);
      }
    })
  }

  FavoritarImovel(idImovel) {
    this.ws.PostImovelFavorito(this.uniqueID.toString(), idImovel).subscribe((resposta: any) => {
      if (resposta.success) {
        this.detalhesImovel.Favorito = true;
        this.DitoFavoritar();
      }
    });
  }

  DesfavoritarImovel(idImovel) {
    this.ws.RemoverImoveisFavorito(this.uniqueID.toString(), idImovel).subscribe((resposta: any) => {
      if (resposta.success) {
        this.detalhesImovel.Favorito = false;
      }
    })
  }

  home() {
    this.navCtrl.navigateForward("");
  }

  Dito() {
    let statusEmpreendimento = this.retornarClasse();
    let data = {
      status_empreendimento: statusEmpreendimento,
      imovel: this.detalhesImovel.NomeImovel,
      cidade: this.detalhesImovel.Endereco.Cidade,
      bairro: this.detalhesImovel.Endereco.Bairro,
      estado: this.detalhesImovel.Endereco.Uf,
      n_quartos: JSON.stringify(this.detalhesImovel.Quartos),
    }

    this.provider.PegarEmailStorage().then((email) => {
      this.ws.RastrearDito("acessouimovel", email, JSON.stringify(data)).subscribe((data) => {
        console.log(data);
      });
    })
  }

  DitoFavoritar() {
    let statusEmpreendimento = this.retornarClasse();
    let data = {
      status_empreendimento: statusEmpreendimento,
      imovel: this.detalhesImovel.NomeImovel,
      cidade: this.detalhesImovel.Endereco.Cidade,
      bairro: this.detalhesImovel.Endereco.Bairro,
      estado: this.detalhesImovel.Endereco.Uf,
      n_quartos: JSON.stringify(this.detalhesImovel.Quartos),
    }

    this.provider.PegarEmailStorage().then((email) => {
      this.ws.RastrearDito("favoritouimovel", email, JSON.stringify(data)).subscribe((data) => {
        console.log(data);
      });
    })
  }

  retornarClasse() {
    let statusEmpreendimento;
    switch (this.detalhesImovel.ClasseStatusImovel) {
      case "1":
        statusEmpreendimento = "Lançamento"
        break;
      case "2":
        statusEmpreendimento = "Pronto"
        break;
      case "3":
        statusEmpreendimento = "Em Construção"
        break;
      case "12":
        statusEmpreendimento = "Pré Lançamento"
        break;
      case "oferta":
        statusEmpreendimento = "Oferta"
        break;
    }
    return statusEmpreendimento;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Não foi possível acessar esse imóvel',
      message: 'Por favor, no momento não foi possível acessar o imóvel. Verifique sua internet ou tente novamente mais tarde',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.voltar();
        }
      }]
    });
    await alert.present();
  }

  async presentAlertLocal() {
    const alert = await this.alertController.create({
      header: 'Não foi possível acessar esse imóvel',
      message: 'Por favor, no momento não foi possível acessar o imóvel. Você deve habilitar sua localização para acessar o imóvel',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.voltar();
        }
      }]
    });
    await alert.present();
  }

  mensagemDeErro() {
    this.presentAlertLocal().then(async () => {
      this.loadingController.dismiss();
    });
  }

  mensagemDeErroLocal() {
    this.presentAlertLocal().then(async () => {
      this.loadingController.dismiss();
    });
  }

  openWhatsMRV() {
    this.iab.create(environment.whatsUrl, '_system');
  }
}
