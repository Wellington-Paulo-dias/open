import { Component } from '@angular/core';
import { Platform, NavController, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Firebase } from '@ionic-native/firebase/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
// import { GoogleAnalytics } from "@ionic-native/google-analytics";

import { ModalController } from '@ionic/angular';
import { ModalChatPage } from './modal-chat/modal-chat.page';
import { ModalFormAtendimentoPage } from './modal-form-atendimento/modal-form-atendimento.page';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { WebServiceService } from './services/mrv/web-service.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NetworkProviderService } from './services/provider/network-provider.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private geolocation: Geolocation,
    private firebase: Firebase,
    private iab: InAppBrowser,
    private modalController: ModalController,
    private navController: NavController,
    private toastCtrl: ToastController,
    private storage: NativeStorage,
    private ws: WebServiceService,
    private locationAccuracy: LocationAccuracy,
    private alertController: AlertController,
    private network: NetworkProviderService,
    // private ga: GoogleAnalytics
    private fa: FirebaseAnalytics
  ) {
    this.initializeApp();
  }

  UrlMeuMRV = '';

  async ngOnInit() {

    if (this.platform.is("android")) {
      this.UrlMeuMRV = "https://play.google.com/store/apps/details?id=br.com.mrv.meumrv";
    } else if (this.platform.is("ios")) {
      this.UrlMeuMRV = "https://itunes.apple.com/br/app/meu-mrv/id1180176371?mt=8";
    }

  }

  public appPages = [
    {
      title: 'Home',
      url: '/',
      icon: 'assets/icons/home.svg',
      class: 'i-home'
    },
    {
      title: 'Subsídio minha casa minha vida',
      url: '/tabs/(subsidio:subsidio)',
      icon: 'assets/icons/MCMV-linha.svg',
      class: 'i-subsidio'
    },
    {
      title: 'Financiamento',
      url: '/tabs/(financiamento:financiamento)',
      icon: 'assets/icons/financiamento.svg',
      class: 'i-financiamento'
    },
    {
      title: 'Favoritos',
      url: '/tabs/(favoritos:favoritos)',
      icon: 'assets/icons/favoritos.svg',
      class: 'i-favorito'
    },
    {
      title: 'Encontre seu imóvel',
      url: '/tabs/(busca:busca)',
      icon: 'assets/icons/busca.svg',
      class: 'i-imovel'
    },
    {
      title: 'Buscar imóveis próximos',
      url: '/tabs/(busca-proximidade:busca-proximidade)',
      icon: 'assets/icons/location-01.svg',
      class: 'i-buscaimovel'
    },
    {
      title: 'Lojas',
      url: '/tabs/(lojas:lojas)',
      icon: 'assets/icons/loja.svg',
      class: 'i-loja'
    },
    {
      title: 'Chat online vendas',
      url: 'chat-online',
      icon: 'assets/icons/chat-pre.svg',
      class: 'i-chat'
    },
    {
      title: 'Contato',
      url: '/tabs/(contato:contato)',
      icon: 'assets/icons/phone.svg',
      class: 'i-contato'
    }
  ];


  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is("android")) {
        this.verificaGPS();
      }
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#000000")
      this.splashScreen.hide();
      this.initializeGA();

      //LOCALIZAÇÃO
      this.geolocation.getCurrentPosition().then((resp) => {
        //  alert(resp.coords.latitude)
        //  alert(resp.coords.longitude)
      }).catch((error) => {
        console.log('Error getting location', error);
      })

      // //FIREBASE
      // this.firebase.getToken()
      //   //.then(token => alert(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
      //   .catch(error => console.error('Error getting token', error));

      this.initFirebase();
      // const sub = this.platform.backButton.subscribeWithPriority(9999, async () => {
      //   if(this.menuCtrl.isEnabled()){            
      //     this.menuCtrl.close();
      //     document.addEventListener("backbutton",function(e) {         
      //     }, false);
      //   }      
      // });
      this.VerificaPrimeiroAcesso();
      this.watchNetwork();
    });
  }

  verificaGPS() {
    this.locationAccuracy.canRequest().then((resp) => {
      if (resp) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then((request) => {
          console.log(request);
          if (request.code === 1) {
            // User agreed to make required location settings changes.
            window.location.reload();
          }
        },
          (error) => {
            window.location.reload();
          })
      }
    })
  }

  initFirebase() {
    this.firebase.subscribe("all");
    this.platform.is('android') ? this.initializeFirebaseAndroid() : this.initializeFirebaseIOS();
  }

  VerificaPrimeiroAcesso() {
    this.storage.getItem("firstOpen").then((dados) => {
      if (dados !== null && dados != "") {
      }
    }, () => {
      this.alertController.create({
        header: 'Seja Bem Vindo!',
        message: 'para um correto funcionamento sempre mantenha o gps e conexão ativos',
        buttons: [
          // {
          //   text: "Fechar",
          //   handler: () => {
          //     navigator['app'].exitApp();
          //   }
          // },
          {
            text: 'OK',
            handler: () => {
              this.storage.setItem("firstOpen", true).then(() => {
                if (this.platform.is("android")) {
                  window.location.reload()
                }
              })
            }
          },

        ]
      }).then((msg) => {
        msg.present();
      });
    }).catch(() => {

    })
  }

  initializeFirebaseAndroid() {
    this.firebase.getToken().then(token => { });
    this.firebase.onTokenRefresh().subscribe(token => { })
    this.subscribeToPushNotifications();
  }

  initializeFirebaseIOS() {
    this.firebase.grantPermission()
      .then(() => {
        this.firebase.getToken().then(token => { });
        this.firebase.onTokenRefresh().subscribe(token => { })
        this.subscribeToPushNotifications();
      })
      .catch((error) => {
        this.firebase.logError(error);
      });
  }

  subscribeToPushNotifications() {
    this.firebase.onNotificationOpen().subscribe((response) => {
      if (response.tap) {
        //Received while app in background (this should be the callback when a system notification is tapped)
        //This is empty for our app since we just needed the notification to open the app
      } else {
        //received while app in foreground (show a toast)
        let toast = this.toastCtrl.create({
          message: response.body,
          duration: 3000
        }).then((msg) => {
          msg.present();
        });
      }
    });
  }

  redesSociais(rede: number) {
    let browser;
    switch (rede) {
      case 1:
        browser = this.iab.create("https://www.facebook.com/MRV/", "_system")
        break;
      case 2:
        browser = this.iab.create("https://twitter.com/mrvoficial", "_system")
        break;
      case 3:
        browser = this.iab.create("https://www.instagram.com/mrv/", "_system")
        break;
      case 4:
        browser = this.iab.create("https://www.youtube.com/channel/UCv_02WaEuXw8ab4SHeabCwQ", "_system")
      case 5:
        browser = this.iab.create(this.UrlMeuMRV, "_system")
    }
  }

  async modalChat() {
    const modal = await this.modalController.create({
      component: ModalFormAtendimentoPage,
      componentProps: {
        page: "chatflutuante"
      }
    });
    return await modal.present();
  }

  navega(url) {
    this.navController.navigateForward(url);
    if (url == 'chat-online') {
      // this.modalChat();
      this.openWhatsMRV();
    }
  }

  watchNetwork() {
    console.log('******* watchNetwork *******');
    this.network.initializeNetworkEvents();
  }

  initializeGA() {
    // this.ga.startTrackerWithId(environment.ga_key)
    // .then(() => {
    //   console.log('Google analytics is ready now');
    //     this.ga.trackView('Google analytics is ready now in Open MRV');
    //   // Tracker is ready
    //   // You can now track pages or set additional information such as AppVersion or UserId
    // })
    // .catch(e => console.log('Error starting GoogleAnalytics', e));
    this.fa.setEnabled(true);
    this.fa.logEvent("init_app", {plataforma: this.platform.is("ios") ? 'ios' : 'android'})
    .then((res: any) => {
      console.log(res);  
    })
    .catch((error: any) => console.error(error));

  }

  openWhatsMRV() {
    this.iab.create(environment.whatsUrl, '_system');
  }
}
