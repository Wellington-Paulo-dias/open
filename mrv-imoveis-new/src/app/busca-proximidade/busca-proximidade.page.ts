import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Platform, NavController, LoadingController, AlertController } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  Marker,
  HtmlInfoWindow,
  Environment,
  GoogleMapsEvent,
  GoogleMapOptions
} from '@ionic-native/google-maps/ngx'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { WebServiceService } from '../services/mrv/web-service.service';
import { MapperService } from '../services/mapper/mapper.service';
import { RouterEventService } from '../services/provider/router-event.service'
import { Router, ActivatedRoute } from '@angular/router';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-busca-proximidade',
  templateUrl: './busca-proximidade.page.html',
  styleUrls: ['./busca-proximidade.page.scss'],
})
export class BuscaProximidadePage extends RouterEventService implements OnInit, OnDestroy, AfterViewInit {

  Localizacao = {
    Latitude: 0,
    Longitude: 0
  }
  MapaFoiRolado = false;
  map: GoogleMap;
  imoveisProximos: any;
  // imoveisProximosHistorico: any = { data: { imoveisProximos: [] } };
  imoveisMapeados: any [] = [];
  lista = true;
  caminhoPlataforma;
  semImoveis = false;
  uniqueID;

  constructor(private platform: Platform, private geolocation: Geolocation, private ws: WebServiceService, private mapper: MapperService,
    private navCtrl: NavController, private loadingController: LoadingController, private router: Router, private route: ActivatedRoute,
    private uniqueDeviceID: UniqueDeviceID, private alertController: AlertController) {
    super(router, route);
    this.getId();
  }

  async ngOnInit() {
    await this.platform.ready().then(() => {
      this.initGMaps();
    });
    document.getElementById("chat-flutuante").style.display = 'block';
  }

  initGMaps() {
    this.Geolocalizacao();
  }

  async watchMapsEvents() {
    console.log('watch maps events');

    this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe((result) => {
      const atualLatLong = result[0].target;
      if (this.Localizacao.Longitude && this.Localizacao.Longitude) {
        this.presentLoading().then(() => {
          this.Localizacao.Latitude = atualLatLong.lat;
          this.Localizacao.Longitude = atualLatLong.lng;
          this.ws.BuscarImoveisHome(this.Localizacao.Latitude, this.Localizacao.Longitude, this.uniqueID)
            .subscribe((resp: any) => {
              // Aqui fiz uma tratativa para parar de inserir icones repetidamente no mapa, mas gerou outros problemas...
              // const respCloned = { data: { imoveisProximos: [] } };

              // resp.data.imoveisProximos.forEach(imovelProximo => {
              //   if (!this.imoveisProximosHistorico.data.imoveisProximos.find(imovelHistorico => imovelHistorico.id === imovelProximo.id)) {
              //     respCloned.data.imoveisProximos.push(imovelProximo);
              //     this.imoveisProximosHistorico.data.imoveisProximos.push(imovelProximo);
              //   }
              // });

              if (resp.success && resp.data.imoveisProximos.length > 0) {
                this.imoveisProximos = this.mapper.ServiceGoogleMaps(resp);
                this.carregarImoveis(this.imoveisProximos);
                this.semImoveis = false;
                this.carregou = true;
                this.MapaFoiRolado = true;
              } else {
                this.semImoveis = true;
                this.MapaFoiRolado = true;
                this.loadingController.dismiss();
              }
            }, error => {
              this.presentAlert();
            });
        });
      }
    });

    // this.map.on(GoogleMapsEvent.CAMERA_MOVE_START).subscribe(async (endRes) => {
    //   console.log(endRes, 'camera_move_start');
    //   const alert = await this.alertController.create({
    //     message: endRes,
    //     header: 'camera_move_start',
    //     buttons: [
    //       {
    //         text: 'OK',
    //         handler: () => { }
    //       }
    //     ]
    //   });
    //   await alert.present();
    // });

    // this.map.on(GoogleMapsEvent.CAMERA_MOVE).subscribe(async (endRes) => {
    //   console.log(endRes, 'camera_move');
    //   const alert = await this.alertController.create({
    //     message: endRes,
    //     header: 'camera_move',
    //     buttons: [
    //       {
    //         text: 'OK',
    //         handler: () => { }
    //       }
    //     ]
    //   });
    //   await alert.present();
    // });

    // this.map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(async (endRes) => {
    //   console.log(endRes, 'camera_move_end');
    //   const alert = await this.alertController.create({
    //     message: endRes,
    //     header: 'camera_move_end',
    //     buttons: [
    //       {
    //         text: 'OK',
    //         handler: () => { }
    //       }
    //     ]
    //   });
    //   await alert.present();
    // });
  }

  getId() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => this.uniqueID = uuid)
      .catch((error: any) => console.log(error))
  }

  onEnter() {
    if (this.carregou) {
      this.initGMaps();
    }
  }

  onDestroy() {
    super.ngOnDestroy();
    this.map.destroy();
    this.MapaFoiRolado = false;
  }

  async Geolocalizacao() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.Localizacao.Latitude = resp.coords.latitude;
      this.Localizacao.Longitude = resp.coords.longitude;
      this.loadMap();
      this.watchMapsEvents();
      // this.ws.BuscarImoveisHome(this.Localizacao.Latitude, this.Localizacao.Longitude, this.uniqueID.toString())
      //   .subscribe((resp: any) => {
      //     const respCloned = { data: { imoveisProximos: [] } };

      //     resp.data.imoveisProximos.forEach(imovelProximo => {
      //       if (!this.imoveisProximosHistorico.find(imovelHistorico => imovelHistorico.id === imovelProximo.id)) {
      //         respCloned.data.imoveisProximos.push(imovelProximo);
      //         this.imoveisProximosHistorico.push(imovelProximo);
      //       }
      //     });

      //     if (resp.success && respCloned.data.imoveisProximos.length > 0) {
      //       this.imoveisProximos = this.mapper.ServiceGoogleMaps(respCloned);
      //       this.carregarImoveis(this.imoveisProximos);
      //       this.semImoveis = false;
      //       this.carregou = true;
      //     } else {
      //       this.semImoveis = true;
      //       this.loadingController.dismiss();
      //     }
      //   })
    }).catch((error) => {
      this.presentAlert();
      console.log('Desculpe, não foi possível determinar sua localização devido a: ', error);
    })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Ocorreu um erro!',
      message: 'Verifique sua internet e ative a localização para tentarmos novamente.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.voltar();
        }
      }]
    });
    await alert.present();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.loadMap();
  }

  internaImoveis(id) {
    this.navCtrl.navigateForward(`imoveis-interna/${id}`)
  }

  async loadMap() {
    if (this.platform.is("desktop")) {
      console.log('desktop')
      Environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBSW511lPtjPAZYj8u9TlAsl7dzLEjIbNM',
        'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBSW511lPtjPAZYj8u9TlAsl7dzLEjIbNM'
      });
    }

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.Localizacao.Latitude,
          lng: this.Localizacao.Longitude
        },
        zoom: 10
      },
      controls: {
        'compass': false,
        'myLocationButton': true,
        'myLocation': false,   // (blue dot)
        'indoorPicker': false,
        'zoom': false,          // android only
        'mapToolbar': false     // android only
      }
    }

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    this.map.setVisible(true);
  }

  mostraImovel(idImovel) {
    console.log('IDIMOVEL: ', idImovel);
    this.imoveisProximos = this.imoveisProximos.filter(imovel => imovel.id === idImovel);
    console.log('IMOVEIS PROXIMOS: ', this.imoveisProximos);
    this.listaImoveis();
  }

  onMarkerAdded(marker: Marker) {
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      if (marker.get('meuLocal') == false) {
        let frame: HTMLElement = document.createElement('div');
        frame = document.createElement('div');
        // [routerLink]="['tabs/(imoveis-interna:imoveis-interna/` + marker.get('idImovel') + `)']"
        frame.innerHTML =
          `<span class='box-img'>
            <div class="content" style=" display: flex; align-items: center;">
              <img class="img" style="width: 40%; margin-right: 10px;" src="`+ marker.get('urlImg') + `" />
              <div class='info' style="width: 53%;">
                <h2 style="font-size: 17px; margin: 0 0 5px;" class='h-linha localizacao'>`+ marker.get('nomeImovel') + `</h2>
                <h3 style="font-size:13px;" class='cidade'>`+ marker.get('cidade') + ` / ` + marker.get('estado') + `</h3>
              </div>
            </div>
            <button style="background: `+ marker.get('classeStatus') + `;width: 96%;padding: 10px;color: #fff;letter-spacing: 1px;margin-top: 5px;" expand="full">` + marker.get('status') + `</button>
          </span>`;
        let htmlInfoWindow = new HtmlInfoWindow();
        htmlInfoWindow.setContent(frame, {
          width: "300px",
          height: "148px"
        });
        htmlInfoWindow.open(marker);
        // if(this.platform.is('ios')) {
        //   console.log('Criou o pin');
        //   frame.innerHTML =
        //     `<a class='box-img' href='tabs/(imoveis-interna:imoveis-interna/` + marker.get('idImovel') + `)'>
        //       <div class="content" style=" display: flex; align-items: center;">
        //         <img class="img" style="width: 40%; margin-right: 10px;" src="`+ marker.get('urlImg') + `" />
        //         <div class='info' style="width: 53%;">
        //           <h2 style="font-size: 17px; margin: 0 0 5px;" class='h-linha localizacao'>`+ marker.get('nomeImovel') + `</h2>
        //           <h3 style="font-size:13px;" class='cidade'>`+ marker.get('cidade') + ` / ` + marker.get('estado') + `</h3>
        //           <div style="padding: 8px; color: #fff; margin-top: 16px; background: `+ marker.get('classeStatus') + `;" class="btn-status" ` + marker.get('classeStatus') + `>` + marker.get('status') + `</div>
        //         </div>
        //       </div>
        //       <button style="background: #f47022;width: 96%;padding: 10px;color: #fff;letter-spacing: 1px;margin-top: 5px;" expand="full">Saiba Mais</button>
        //     </a>`;
        //   let htmlInfoWindow = new HtmlInfoWindow();
        //   htmlInfoWindow.setContent(frame, {
        //     width: "300px",
        //     height: "148px"
        //   });
        //   htmlInfoWindow.open(marker);
        // } else {
        //   frame.innerHTML =
        //     `<a class='box-img' href='tabs/(imoveis-interna:imoveis-interna/` + marker.get('idImovel') + `)'>
        //       <div class="content" style=" display: flex; align-items: center;">
        //         <img class="img" style="width: 40%; margin-right: 10px;" src="`+ marker.get('urlImg') + `" />
        //         <div class='info' style="width: 53%;">
        //           <h2 style="font-size: 17px; margin: 0 0 5px;" class='h-linha localizacao'>`+ marker.get('nomeImovel') + `</h2>
        //           <h3 style="font-size:13px;" class='cidade'>`+ marker.get('cidade') + ` / ` + marker.get('estado') + `</h3>
        //           <div style="padding: 8px; color: #fff; margin-top: 16px; background: `+ marker.get('classeStatus') + `;" class="btn-status" ` + marker.get('classeStatus') + `>` + marker.get('status') + `</div>
        //         </div>
        //       </div>
        //       <button style="background: #f47022;width: 96%;padding: 10px;color: #fff;letter-spacing: 1px;margin-top: 5px;" expand="full">Saiba Mais</button>
        //     </a>`;
        //   let htmlInfoWindow = new HtmlInfoWindow();
        //   htmlInfoWindow.setContent(frame, {
        //     width: "300px",
        //     height: "148px"
        //   });
        //   htmlInfoWindow.open(marker);
        // }
      }
    })
  };

  async carregarImoveis(imoveisProximos) {
    console.log('imoveisProximos');
    let caminho = './assets/imagens/Icones-mapa/';
    if (!this.MapaFoiRolado) {
      this.map.addMarker({
        title: 'Minha localização',
        animation: 'DROP',
        icon: {
          url: caminho + 'Pin-user.png',
          size: {
            width: 40,
            height: 45
          }
        },
        position: {
          lat: this.Localizacao.Latitude,
          lng: this.Localizacao.Longitude
        },
        meuLocal: true
      }).then(this.onMarkerAdded);
    }

    imoveisProximos.forEach(imovel => {
      switch (imovel.ClasseStatusImovel) {
        case "pronto":
          if (!this.imoveisMapeados.find(imovelProximoHistorico => imovelProximoHistorico.IdImovel === imovel.IdImovel)) {
            this.map.addMarker({
              animation: 'DROP',
              icon: {
                url: caminho + 'Pin-pronto.png',
                size: {
                  width: 40,
                  height: 45
                }
              },
              position: {
                lat: imovel.Localizacao.Latitude,
                lng: imovel.Localizacao.Longitude,
              },
              idImovel: imovel.IdImovel,
              urlImg: imovel.CaminhoImagemCapa,
              nomeImovel: imovel.NomeCompletoImovel,
              cidade: imovel.Cidade,
              estado: imovel.EstadoSigla,
              status: imovel.StatusImovel,
              classeStatus: "#FB595C",
              meuLocal: false
            }).then(this.onMarkerAdded);
            this.imoveisMapeados.push(imovel);
          }
          break;
        case "oferta":
          if (!this.imoveisMapeados.find(imovelProximoHistorico => imovelProximoHistorico.IdImovel === imovel.IdImovel)) {
            this.map.addMarker({
              animation: 'DROP',
              icon: {
                url: caminho + 'Pin-ofertas.png',
                size: {
                  width: 40,
                  height: 45
                }
              },
              position: {
                lat: imovel.Localizacao.Latitude,
                lng: imovel.Localizacao.Longitude,
              },
              idImovel: imovel.IdImovel,
              urlImg: imovel.CaminhoImagemCapa,
              nomeImovel: imovel.NomeCompletoImovel,
              cidade: imovel.Cidade,
              estado: imovel.EstadoSigla,
              status: imovel.StatusImovel,
              classeStatus: "#FFCC00",
              meuLocal: false
            }).then(this.onMarkerAdded);
            this.imoveisMapeados.push(imovel);
          }
          break;
        case "lancamento":
          if (!this.imoveisMapeados.find(imovelProximoHistorico => imovelProximoHistorico.IdImovel === imovel.IdImovel)) {
            this.map.addMarker({
              animation: 'DROP',
              icon: {
                url: caminho + 'Pin-lancamento.png',
                size: {
                  width: 40,
                  height: 45
                }
              },
              position: {
                lat: imovel.Localizacao.Latitude,
                lng: imovel.Localizacao.Longitude,
              },
              idImovel: imovel.IdImovel,
              urlImg: imovel.CaminhoImagemCapa,
              nomeImovel: imovel.NomeCompletoImovel,
              cidade: imovel.Cidade,
              estado: imovel.EstadoSigla,
              status: imovel.StatusImovel,
              classeStatus: "#f68f39",
              meuLocal: false
            }).then(this.onMarkerAdded);
            this.imoveisMapeados.push(imovel);
          }
          break;
        case "em-construcao":
          if (!this.imoveisMapeados.find(imovelProximoHistorico => imovelProximoHistorico.IdImovel === imovel.IdImovel)) {
            this.map.addMarker({
              animation: 'DROP',
              icon: {
                url: caminho + 'Pin-em-construcao.png',
                size: {
                  width: 40,
                  height: 45
                }
              },
              position: {
                lat: imovel.Localizacao.Latitude,
                lng: imovel.Localizacao.Longitude,
              },
              idImovel: imovel.IdImovel,
              urlImg: imovel.CaminhoImagemCapa,
              nomeImovel: imovel.NomeCompletoImovel,
              cidade: imovel.Cidade,
              estado: imovel.EstadoSigla,
              status: imovel.StatusImovel,
              classeStatus: "#5a9df9",
              meuLocal: false
            }).then(this.onMarkerAdded);
            this.imoveisMapeados.push(imovel);
          }
          break;
        case "pre-lancamento":
          if (!this.imoveisMapeados.find(imovelProximoHistorico => imovelProximoHistorico.IdImovel === imovel.IdImovel)) {
            this.map.addMarker({
              animation: 'DROP',
              icon: {
                url: caminho + 'Pin-pre-lancamento.png',
                size: {
                  width: 40,
                  height: 45
                }
              },
              position: {
                lat: imovel.Localizacao.Latitude,
                lng: imovel.Localizacao.Longitude,
              },
              idImovel: imovel.IdImovel,
              urlImg: imovel.CaminhoImagemCapa,
              nomeImovel: imovel.NomeCompletoImovel,
              cidade: imovel.Cidade,
              estado: imovel.EstadoSigla,
              status: imovel.StatusImovel,
              classeStatus: "#00C997",
              meuLocal: false
            }).then(this.onMarkerAdded);
            this.imoveisMapeados.push(imovel);
          }
          break;
      }
    });
    this.loadingController.dismiss();
  }

  async listaImoveis() {
    if (this.lista == true) {
      document.getElementById('imoveis').parentElement.style.height = "400px";
      document.getElementById('imoveis').style.display = "block";
      document.getElementById('verMais').innerHTML = "Fechar Lista";
      this.lista = false;
    } else {
      document.getElementById('imoveis').style.display = "none";
      document.getElementById('imoveis').parentElement.style.height = "auto";
      document.getElementById('verMais').innerHTML = "Ver Lista";
      this.lista = true;
    }
  }

  async presentLoading() {
    const loadingElement = await this.loadingController.create({
      spinner: 'crescent',
      duration: 45000
    });
    return await loadingElement.present();
  }

  voltar() {
    this.navCtrl.back()
  }
  home() {
    this.navCtrl.navigateForward("");
  }

  Favoritar(idImovel) {
    this.ws.GetImoveisFavoritos(this.uniqueID.toString()).subscribe((resposta) => {
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
      // this.ws.PostImovelFavorito("1234567", idImovel).subscribe((resposta: any) => {
      if (resposta.success) {
        let indexImovelProximos = this.imoveisProximos.findIndex(imovel => imovel.IdImovel == idImovel);
        if (indexImovelProximos != -1) {
          this.imoveisProximos[indexImovelProximos].Favorito = true;
        }
      }
    });
  }

  DesfavoritarImovel(idImovel) {
    this.ws.RemoverImoveisFavorito(this.uniqueID.toString(), idImovel).subscribe((resposta: any) => {
      // this.ws.RemoverImoveisFavorito("1234567", idImovel).subscribe((resposta: any) => {
      if (resposta.success) {
        let indexImovelProximos = this.imoveisProximos.findIndex(imovel => imovel.IdImovel == idImovel);
        if (indexImovelProximos != -1) {
          this.imoveisProximos[indexImovelProximos].Favorito = false;
        }
      }
    })
  }
}
