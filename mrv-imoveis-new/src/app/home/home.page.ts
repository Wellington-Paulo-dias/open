import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WebServiceService } from '../services/mrv/web-service.service';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { Imovel } from '../model/imovel';
import { MapperService } from '../services/mapper/mapper.service';
import { ModalController } from '@ionic/angular';
import { NavProviderService } from '../services/provider/nav-provider.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalFormAtendimentoPage } from '../modal-form-atendimento/modal-form-atendimento.page';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouterEventService } from '../services/provider/router-event.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage extends RouterEventService implements OnDestroy, OnInit {
  subscription: Subscription;
  urlVitrines = new Array();
  caminhoVitrine = '';
  latitude;
  longitude;
  caminhoBanner = '';
  removerLoading = false;
  removerLoadingCidade = false;
  semImoveis = false;
  semImoveisCidade = false;
  keyImovel = 'buscarImoveis-home';
  uniqueID;
  emailUsuario;
  listIdImoveisFavoritados = [];

  @ViewChild('Slider') slider;
  @ViewChild('Slider2') slider2;
  @ViewChild('content') content;

  options: GeolocationOptions = {
    timeout: 8000,
    enableHighAccuracy: true,
    maximumAge: 3000
  };

  cidade = 'encontrando imóveis';

  imoveis = {
    Proximos: new Array<Imovel>(),
    Cidades: new Array<Imovel>()
  };

  imoveisFavoritados: any;

  Localizacao = {
    Latitude: 0,
    Longitude: 0
  };

  slideOpts = {
    effect: 'flip',
    slidesPerView: 4,
    centeredSlides: false,
    width: 280,
    breakpoints: {
      768: {
        slidesPerView: 1
      }
    }
  };

  slideVitrineOpts = {
    loop: 'true',
    autoplay: {
      delay: 7000,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
    }
  };

  constructor(private ws: WebServiceService, private mapper: MapperService,
    private screenOrientation: ScreenOrientation, private platform: Platform,
    private provider: NavProviderService, private locationAccuracy: LocationAccuracy,
    private modalController: ModalController, private uniqueDeviceID: UniqueDeviceID,
    private navCtrl: NavController, private iab: InAppBrowser, private alertController: AlertController,
    private geolocation: Geolocation, private router: Router, private route: ActivatedRoute,
    private storage: NativeStorage) {

    super(router, route);
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).catch((err) => {
      console.log('ERRO: ' + err);
    });

  }

  ionViewDidEnter() {
    // if (this.platform.ready()) {
      this.BuscaImoveisFavoritos();
      this.getId();
      this.Banner();
      this.CarregaVitrine();
      this.BuscarImoveis();
    // }
  }

  scrollTo() {
    this.content.scrollToTop(0);
  }

  ngOnInit() {
    document.getElementById('chat-flutuante').style.display = 'block';
  }

  onEnter() {
    if (this.carregou) {
      console.log('Entrou');

      this.slider.slideTo(0);
      this.slider2.slideTo(0);
      this.imoveis.Proximos = [];
      this.imoveis.Cidades = [];
      this.removerLoading = false;
      this.removerLoadingCidade = false;
      this.BuscaImoveisFavoritos();
      this.BuscarImoveis();
    }

    // this.storage.getItem("firstOpen").then((dados) => {
    //   if (dados !== null && dados != "") {
    //   } else {

    //   }
    // }).catch(() => {
    //   this.storage.setItem("firstOpen", true).then(() => {
    //     setTimeout(() => {
    //       window.location.reload()
    //     }, 10000);

    //   })
    // })
  }

  onDestroy() {
    super.ngOnDestroy();
  }

  getId() {
    return new Promise((resolve, reject) => {
      this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.uniqueID = uuid;
        resolve(uuid);  
      })
      .catch((error: any) => reject(error));
    });
  }

  async CarregaVitrine() {
    this.ws.vitrineHome().subscribe((resposta: any) => {
      resposta.data.forEach((vitrine) => {
        this.urlVitrines.push(vitrine);
      });
    }, (error) => {
      console.log(error);
    });
  }

  todosImoveis() {
    this.provider.object = this.imoveis.Proximos;
    this.navCtrl.navigateForward(`/tabs/(todos-imoveis:todos-imoveis)`);
  }

  internaImoveis(id) {
    this.navCtrl.navigateForward(`/tabs/(imoveis-interna:imoveis-interna/${id})`);
  }

  // TODO: Melhorar Esse Metodo
  Banner() {
    let numbers = [1, 2, 3, 4]
    numbers = this.shuffle(numbers)
    setTimeout(function () {
      document.getElementById("chat").insertAdjacentHTML("beforeend", "<img src=" + "../../assets/imagens/banner/chat" + numbers[0] + ".png" + " alt='chat online'>")
    }, 300);

  }

  Favoritar(idImovel) {
    if (this.listIdImoveisFavoritados.indexOf(idImovel) == -1) {
      this.FavoritarImovel(idImovel);
    } else {
      this.DesfavoritarImovel(idImovel);
    }
    // this.ws.GetImoveisFavoritos(234657).subscribe((resposta) => {
    // this.ws.GetImoveisFavoritos(this.uniqueID.toString()).subscribe((resposta) => {
    //   console.log('GetImoveisFavoritos() => ', resposta);
      
    //   this.listIdImoveisFavoritados = this.mapper.ImoveisFavoritadosId(resposta);
    // });
  }

  FavoritarImovel(idImovel) {
    this.getId().then(uniqueID => {
      this.ws.PostImovelFavorito(this.uniqueID.toString(), idImovel).subscribe((resposta: any) => {
        console.log('PostImovelFavorito => ', resposta);
        
        // this.ws.PostImovelFavorito("1234567", idImovel).subscribe((resposta: any) => {
        if (resposta.success) {
          let indexImovelProximos = this.imoveis.Proximos.findIndex(imovel => imovel.IdImovel === idImovel);
          if (indexImovelProximos !== -1) {
            this.imoveis.Proximos[indexImovelProximos].Favorito = true;
            this.DitoFavoritar(this.imoveis.Proximos[indexImovelProximos]);
          }
          let indexImovelCidades = this.imoveis.Cidades.findIndex(imovel => imovel.IdImovel === idImovel);
          if (indexImovelCidades !== -1) {
            this.imoveis.Cidades[indexImovelCidades].Favorito = true;
          }
        }
      });
    });
  }

  DesfavoritarImovel(idImovel) {
    this.ws.RemoverImoveisFavorito(this.uniqueID.toString(), idImovel).subscribe((resposta: any) => {
      // this.ws.RemoverImoveisFavorito("1234567", idImovel).subscribe((resposta: any) => {
      if (resposta.success) {
        let indexImovelProximos = this.imoveis.Proximos.findIndex(imovel => imovel.IdImovel === idImovel);
        if (indexImovelProximos !== -1) {
          this.imoveis.Proximos[indexImovelProximos].Favorito = false;
        }
        let indexImovelCidades = this.imoveis.Cidades.findIndex(imovel => imovel.IdImovel === idImovel);
        if (indexImovelCidades !== -1) {
          this.imoveis.Cidades[indexImovelCidades].Favorito = false;
        }
      }
    });
  }

  BuscarImoveis() {
    this.geolocation.getCurrentPosition(this.options).then((resp) => {
      this.Localizacao.Latitude = resp.coords.latitude;
      this.Localizacao.Longitude = resp.coords.longitude;

      this.ws.getCidadeLatitudeLongitude(this.Localizacao.Latitude, this.Localizacao.Longitude).subscribe((resposta: any) => {
        if (resposta.success) {
          this.storage.setItem('cboCidade', resposta.data.id);
          this.storage.setItem('estadoSelecionado', resposta.data.estado.id);
        }
      }, (error) => {
        console.log('Error buscar imoveis: ', error);
          // this.BuscarImoveis()
          this.alertController.create({
            header: 'Ocorreu um erro!',
            message: 'Verifique sua internet e ative a localização para tentarmos novamente.',
            buttons: ['OK']
          }).then((alert) => {
            alert.present();
          })
          this.semImoveis = true;
          this.removerLoading = true;
          this.semImoveisCidade = true;
          this.removerLoadingCidade = true;

      });

      this.ws.BuscarImoveisHome(-19.9245, -43.9353, 1234567).subscribe((resposta: any) => {
        console.log('BuscarImoveisHome(-19.9245, -43.9353, 1234567)');
      // this.ws.BuscarImoveisHome(this.Localizacao.Latitude, this.Localizacao.Longitude, this.uniqueID.toString()).subscribe((resposta: any) => {
        if (resposta.data.imoveisProximos.length > 0) {
          const imoveisProximos = this.mapper.ServiceHome(resposta.data.imoveisProximos);
          console.log('imoveisProximos => ', imoveisProximos);
          
          this.imoveis.Proximos = imoveisProximos;
          this.imoveis.Proximos.map(imovel => imovel.Favorito = false);
          this.MatchFavoritos();
          this.removerLoading = true;
          this.semImoveis = false;
        } else {
          this.semImoveis = true;
          this.removerLoading = true;
        }
        if (resposta.data.imoveisNaCidade.length > 0) {
          const imoveisCidade = this.mapper.ServiceHome(resposta.data.imoveisNaCidade);
          this.imoveis.Cidades = imoveisCidade;
          this.cidade = 'Imóveis em ' + this.imoveis.Cidades[0].Cidade;
          this.removerLoadingCidade = true;
          this.semImoveisCidade = false;
        } else {
          this.semImoveisCidade = true;
          this.removerLoadingCidade = true;
        }
      }, (error: any) => {
        this.semImoveis = true;
        this.removerLoading = true;
        this.semImoveisCidade = true;
        this.removerLoadingCidade = true;
      });
      this.carregou = true;
      this.Dito();
    }, (error) => {
      if (this.platform.is('android')) {
        console.log('error => ', error);
        // Aqui vai o popup
        this.presentAlertLocal();
        // window.location.reload();
      } else if (this.platform.is('ios')) {
        this.BuscarImoveis();
      }

    }).catch( (error) => {
      this.getId();
      this.BuscarImoveis();
    }
    );
  }

  BuscaImoveisFavoritos() {
    if (this.uniqueID) {
      this.ws.GetImoveisFavoritos(this.uniqueID.toString()).subscribe((resposta) => {
        this.listIdImoveisFavoritados = this.mapper.ImoveisFavoritadosId(resposta);  
      });
    } else {
      this.getId().then(uuid => {
        this.ws.GetImoveisFavoritos(uuid.toString()).subscribe((resposta) => {
          this.listIdImoveisFavoritados = this.mapper.ImoveisFavoritadosId(resposta);
        });
      });
    }
  }
  
  MatchFavoritos() {
    console.log('match favoritos => ', this.listIdImoveisFavoritados);
    console.log('match proxiimos => ', this.imoveis.Proximos);
    
    this.listIdImoveisFavoritados.forEach(imoFavId => {
      this.imoveis.Proximos.forEach(imovelProximo => {
        if (imovelProximo.IdImovel === imoFavId) {
          console.log('imovelProximo.IdImovel => ', imovelProximo.IdImovel, imovelProximo.Endereco.Bairro);
          console.log('imoFavId => ', imoFavId);
          imovelProximo.Favorito = true;
        }
      });
     });    
  }

  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  async modalChat() {
    const modal = await this.modalController.create({
      component: ModalFormAtendimentoPage,
      componentProps: {
        page: 'home'
      }
    });
    return await modal.present();
  }

  navegar() {
    this.navCtrl.navigateForward('busca');
  }

  async acaoVitrine(tipoAcao, urlAcao) {
    if (tipoAcao === 'Link') {
      const browser = this.iab.create(urlAcao, '_system');
    } else if (tipoAcao === 'Chat') {
      this.ModalAtendimento();
    }
  }

  async ModalAtendimento() {
    const modal = await this.modalController.create({
      component: ModalFormAtendimentoPage,
      componentProps: {

      }
    });
    return await modal.present();
  }

  Dito() {
    this.provider.PegarEmailStorage().then((email) => {
      this.ws.RastrearDito('acessouhome', email, '').subscribe((data) => {
        console.log(data);
      });
    });
  }

  DitoFavoritar(imovel) {
    this.provider.PegarEmailStorage().then((email) => {

      let data = {
        status_empreendimento: imovel.StatusImovel,
        imovel: imovel.NomeImovel,
        cidade: imovel.Cidade,
        bairro: imovel.Endereco.Bairro,
        estado: imovel.Endereco.Uf,
        n_quartos: imovel.NumeroQuartos
      };

      this.ws.RastrearDito('favoritouimovel', email, JSON.stringify(data)).subscribe((data) => {
        console.log(data);
      });
    });
  }

  async presentAlertLocal() {
    const alert = await this.alertController.create({
      header: 'Não foi possível carregar os imóveis!',
      message: 'GPS desativado ou sem conexão com a internet.',
      buttons: [
        {
          text: 'Fechar',
          handler: () => {
            navigator['app'].exitApp();
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
            this.BuscarImoveis();
          }
        },

      ]
    });
    await alert.present();
  }

  mensagemDeErroLocal() {
    this.presentAlertLocal();
    this.carregou = true;
  }

  openWhatsMRV() {
    this.iab.create(environment.whatsUrl);
  }
}
