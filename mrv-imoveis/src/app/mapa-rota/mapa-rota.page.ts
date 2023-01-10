import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'
import {
  GoogleMaps,
  GoogleMap,
  Marker,
  HtmlInfoWindow,
  Environment,
  GoogleMapsEvent,
  GoogleMapOptions
} from '@ionic-native/google-maps/ngx'
import { NavProviderService } from '../services/provider/nav-provider.service'
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx'
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-mapa-rota',
  templateUrl: './mapa-rota.page.html',
  styleUrls: ['./mapa-rota.page.scss'],
})
export class MapaRotaPage implements OnInit {
  map: GoogleMap;
  objeto: any;
  latitude: any;
  longitude: any;

  Localizacao = {
    Latitude: 0,
    Longitude: 0
  }

  constructor(private platform: Platform, private launchnavigator: LaunchNavigator,
    private navProviderService: NavProviderService, private loadingController: LoadingController,
    private geolocation: Geolocation, private navCtrl: NavController) {
    this.Geolocalizacao();
  }

  async ngOnInit() {
    this.presentLoading();
    await this.platform.ready().then(() => {
      this.objeto = this.navProviderService.object;
    })
    document.getElementById("chat-flutuante").style.display = 'block';
  }

  Geolocalizacao() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.Localizacao.Latitude = resp.coords.latitude;
      this.Localizacao.Longitude = resp.coords.longitude;
    }).catch((error) => {
      console.log('Desculpe, não foi possível determinar sua localização devido a: ', error);
    })
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    if (this.platform.is("desktop")) {
      Environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBVxwD4z4FLeO0yKiZ_ZSwnk27I8C3o5wE',
        'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBVxwD4z4FLeO0yKiZ_ZSwnk27I8C3o5wE'
      });
    }

    this.latitude = this.objeto.objeto.latitude;
    this.longitude = this.objeto.objeto.longitude;

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.latitude,
          lng: this.longitude
        },
        zoom: 16
      },
      controls: {
        'compass': false,
        'myLocationButton': true,
        'myLocation': true,   // (blue dot)
        'indoorPicker': false,
        'zoom': false,          // android only
        'mapToolbar': false     // android only
      }
    }

    this.map = GoogleMaps.create('map_canvas', mapOptions);
    this.map.setVisible(true);
    let caminho = './assets/imagens/Icones-mapa/'
    if (this.objeto.objeto.origem == 0) {
      switch (this.objeto.objeto.classeStatusImovel) {
        case "2":
          this.map.addMarker({
            title: this.objeto.objeto.nome,
            animation: 'DROP',
            icon: {
              url: caminho + 'Pin-pronto.png',
              size: {
                width: 40,
                height: 45
              }
            },
            position: {
              lat: this.latitude,
              lng: this.longitude
            },
          });
          break;
        case "oferta":
          this.map.addMarker({
            title: this.objeto.objeto.nome,
            animation: 'DROP',
            icon: {
              url: caminho + 'Pin-ofertas.png',
              size: {
                width: 40,
                height: 45
              }
            },
            position: {
              lat: this.latitude,
              lng: this.longitude
            },
          });
          break;
        case "1":
          this.map.addMarker({
            title: this.objeto.objeto.nome,
            animation: 'DROP',
            icon: {
              url: caminho + 'Pin-lancamento.png',
              size: {
                width: 40,
                height: 45
              }
            },
            position: {
              lat: this.latitude,
              lng: this.longitude
            },
          });
          break;
        case "3":
          this.map.addMarker({
            title: this.objeto.objeto.nome,
            animation: 'DROP',
            icon: {
              url: caminho + 'Pin-em-construcao.png',
              size: {
                width: 40,
                height: 45
              }
            },
            position: {
              lat: this.latitude,
              lng: this.longitude
            },
          });
          break;
        case "12":
          this.map.addMarker({
            title: this.objeto.objeto.nome,
            animation: 'DROP',
            icon: {
              url: caminho + 'Pin-pre-lancamento.png',
              size: {
                width: 40,
                height: 45
              }
            },
            position: {
              lat: this.latitude,
              lng: this.longitude
            },
          });
          break;
      }
    }
    else {
      this.map.addMarker({
        title: this.objeto.objeto.nome,
        animation: 'DROP',
        icon: {
          url: caminho + 'Pin-lojas.png',
          size: {
            width: 40,
            height: 45
          }
        },
        position: {
          lat: this.latitude,
          lng: this.longitude
        },
      });
    }
    this.loadingController.dismiss();
  }
  abrirApp() {
    console.log('lat => ', this.latitude);
    console.log('long => ', this.longitude);
    
    this.launchnavigator.navigate([this.latitude, this.longitude], {
      start: `${this.Localizacao.Latitude}, ${this.Localizacao.Longitude}`,
      appSelection: {
        dialogHeaderText: "Selecione um aplicativo para iniciar a navegação",
        cancelButtonText: "Cancelar",
        rememberChoice: {
          prompt: {
            bodyText: "Usar o mesmo aplicativo para navegação na próxima utilização?",
            headerText: "Deseja salvar esse aplicativo como aplicativo de navegação padrão?",
            noButtonText: "Não",
            yesButtonText: "Sim"
          }
        }
      }
    });
  }

  async presentLoading() {
    const loadingElement = await this.loadingController.create({
      spinner: 'crescent',
      duration: 45000
    });
    return await loadingElement.present();
  }

  voltar() {
    this.navCtrl.goBack()
  }
}