import { environment } from 'src/environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy, LoadingController } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { GoogleMaps, HtmlInfoWindow } from '@ionic-native/google-maps/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Firebase } from '@ionic-native/firebase/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { AngularFireModule } from '@angular/fire';
// import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import { ImoveisInternaPageModule } from './imoveis-interna/imoveis-interna.module';

import { ModalDiferenciaisPageModule } from './modal-diferenciais/modal-diferenciais.module';
import { ModalFichaTecnicaPageModule } from './modal-ficha-tecnica/modal-ficha-tecnica.module';
import { ModalGaleriaPageModule } from './modal-galeria/modal-galeria.module';
import { ModalChatPageModule } from './modal-chat/modal-chat.module';
import { MapaRotaPageModule } from './mapa-rota/mapa-rota.module';
import { ModalFormAtendimentoPageModule } from './modal-form-atendimento/modal-form-atendimento.module';
import { ModalLigamosParaVocePageModule } from './modal-ligamos-para-voce/modal-ligamos-para-voce.module';
import { ModalEnviarMsgPageModule } from './modal-enviar-msg/modal-enviar-msg.module';
import { ModalGaleriaInternaPageModule } from './modal-galeria-interna/modal-galeria-interna.module';

import { CacheModule } from 'ionic-cache';
import { HomePageModule } from './home/home.module';
import { Network } from '@ionic-native/network/ngx';
import { TabsPageModule } from './tabs/tabs.module';
// import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ModalDiferenciaisPageModule,
    ModalFichaTecnicaPageModule,
    ModalGaleriaPageModule,
    ModalChatPageModule,
    MapaRotaPageModule,
    ModalFormAtendimentoPageModule,
    ModalEnviarMsgPageModule,
    ModalLigamosParaVocePageModule,
    ImoveisInternaPageModule,
    ModalGaleriaInternaPageModule,
    FormsModule,
    CacheModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    TabsPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    Firebase,
    ScreenOrientation,
    GoogleMaps,
    HtmlInfoWindow,
    PhotoViewer,
    CallNumber,
    YoutubeVideoPlayer,
    AppAvailability,
    Device,
    InAppBrowser,
    LaunchNavigator,
    LoadingController,
    NativeStorage,
    SocialSharing,
    UniqueDeviceID,
    // FirebaseAnalytics,
    // GoogleAnalytics,
    Facebook,
    LocationAccuracy,
    StatusBar,
    Network
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
