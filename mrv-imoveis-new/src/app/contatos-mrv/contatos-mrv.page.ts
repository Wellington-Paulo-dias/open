import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { ModalLigamosParaVocePage } from '../modal-ligamos-para-voce/modal-ligamos-para-voce.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalEnviarMsgPage } from '../modal-enviar-msg/modal-enviar-msg.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ModalFormAtendimentoPage } from '../modal-form-atendimento/modal-form-atendimento.page';
import { WebServiceService } from '../services/mrv/web-service.service';
import { NavProviderService } from '../services/provider/nav-provider.service';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { environment } from 'src/environments/environment';
//import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-contatos-mrv',
  templateUrl: './contatos-mrv.page.html',
  styleUrls: ['./contatos-mrv.page.scss'],
  // animations: [
  //   trigger('FadeToggle',[
  //     state('fadeIn', style({
  //       opacity: 1
  //     })),
  //     state('fadeOut', style({
  //       opacity: 0.5
  //     })),
  //     transition('fadeIn => fadeOut', [
  //       animate('0.5s')
  //     ]),
  //     transition('fadeOut => fadeIn',[
  //       animate('0.5s')
  //     ])
  //   ])
  // ]
})
export class ContatosMrvPage implements OnInit {

  isToggle = true;
  // 'fb-messenger://user-thread/ID';
  messengerAppiOS = 'fb-messenger://';
  messengerAppAndroid = 'com.facebook.orca';
  // messengerHttpUrl = 'https://m.facebook.com/';
  messengerHttpUrl = 'https://m.me/MRV';
  // messengerHttpUrl = 'https://messenger.com/login.php?next=https%3A%2F%2Fwww.messenger.com%2Ft%2F219638988065716%2F%3Fmessaging_source%3Dsource%253Apages%253Amessage_shortlink';
  // https://www.messenger.com/login.php?next=https%3A%2F%2Fwww.messenger.com%2Ft%2F219638988065716%2F%3Fmessaging_source%3Dsource%253Apages%253Amessage_shortlink
  messengerUrl = 'fb-messenger://messages/';

  constructor(
    private callNumber: CallNumber,
    private iab: InAppBrowser,
    private modalController: ModalController,
    private navController: NavController,
    private plataform: Platform,
    private ws: WebServiceService,
    private provider: NavProviderService,
    private appAvailability: AppAvailability
  ) {

  }

  UrlMeuMRV = '';

  ngOnInit() {
    document.getElementById("chat-flutuante").style.display = 'block';

    if (this.plataform.is("android")) {
      this.UrlMeuMRV = "https://play.google.com/store/apps/details?id=br.com.mrv.meumrv";
    } else if (this.plataform.is("ios")) {
      this.UrlMeuMRV = "https://itunes.apple.com/br/app/meu-mrv/id1180176371?mt=8";
    }
    this.DitoRastreamento("acessou-contato")
  }

  async modalLigamos() {
    const modal = await this.modalController.create({
      component: ModalLigamosParaVocePage,
      componentProps: {

      }
    });
    return await modal.present();
  }

  async modalAtendimento() {
    const modal = await this.modalController.create({
      component: ModalFormAtendimentoPage,
      componentProps: {

      }
    });
    return await modal.present();
  }

  async modalMensagem() {
    const modal = await this.modalController.create({
      component: ModalEnviarMsgPage,
      componentProps: {

      }
    });
    return await modal.present();
  }

  portal() {
    this.DitoRastreamento("acessou-portal-mrv")
    const browser = this.iab.create("https://relacionamento.mrv.com.br/_layouts/MRVPR/login.aspx?ReturnUrl=%2f_layouts%2fAuthenticate.aspx%3fSource%3d%252F&Source=%2F", "_system")
  }

  meuMrv() {
    this.DitoRastreamento("acessou-meu-mrv")
    const browser = this.iab.create(this.UrlMeuMRV, "_system")
  }

  Ligar(telefone) {
    this.DitoRastreamento("ligou-mrv")
    this.callNumber.callNumber(telefone, true).catch((error) => {
      console.log(error)
    })
  }

  voltar() {
    this.navController.back()
  }

  home() {
    this.navController.navigateForward("");
  }

  navega(url) {
    this.navController.navigateForward(url)
  }

  async Ligarcliente() {
    document.getElementById("modal").classList.add('ativo');
  }

  async closeLigarCliente() {
    document.getElementById("modal").classList.remove('ativo');
  }

  DitoRastreamento(codigo: string) {
    let data = {
      origem: "app"
    }
    this.provider.PegarEmailStorage().then((email) => {
      console.log(`Email dito rastreamento: ${email}`);
      this.ws.RastrearDito(codigo, email, JSON.stringify(data)).subscribe((data) => {
        console.log(data)
      })
    })
  }

  Facebook() {
    this.launchExternalApp(this.messengerAppiOS, this.messengerAppAndroid, this.messengerUrl, this.messengerHttpUrl).then(success => {
      this.DitoRastreamento("acessou-chat-facebook");
    });
  }

  launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let app: string;

      if (this.plataform.is('ios')) {
        app = iosSchemaName;
      } else if (this.plataform.is('android')) {
        app = androidPackageName;
      } else {
        this.iab.create(httpUrl, '_system');
      }

      this.appAvailability.check(app).then(
        () => { // success callback
          console.log(`App ${app} availabled`);
          this.iab.create(httpUrl, '_system');
          // browser.create('com.facebook.katana', '_system');
          // this.iab.create(`android-app://${app}`, '_system', `profile=${username}`);
          resolve(true);
          return;
        },
        () => { // error callback
          console.log(`App ${app} is not availabled`);
          this.iab.create(httpUrl, '_system');
        }
      );
    });

  }
  
  openWhatsMRV() {
    this.iab.create(environment.whatsUrl, '_system');
  }

}
