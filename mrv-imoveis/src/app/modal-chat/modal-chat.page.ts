import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { WebServiceService } from '../services/mrv/web-service.service';

@Component({
  selector: 'app-modal-chat',
  templateUrl: './modal-chat.page.html',
  styleUrls: ['./modal-chat.page.scss'],
})
export class ModalChatPage implements OnInit {
  Url: string = ''
  safeUrl: SafeResourceUrl = 'https://www.mrv.com.br/chat?key=5F9086FB-EFE2-4D12-8989-CB16B25B3C9A'

  constructor(private modalController: ModalController, private navParams: NavParams, private firebaseAnalytics: FirebaseAnalytics,
              private platform: Platform, private storage: NativeStorage, private sanitizer: DomSanitizer, private ws: WebServiceService) {}

  async ngOnInit() {
    let plataforma;
    if (this.platform.ready()) {
      document.getElementById("chat-flutuante").style.display = "none"
      if (this.platform.is("android")) {
        this.Url = 'https://www.mrv.com.br/chat?key=5F9086FB-EFE2-4D12-8989-CB16B25B3C9A&referrer=appandroid'
        plataforma = 'android';
      }
      else if (this.platform.is("ios")) {
        this.Url = 'https://www.mrv.com.br/chat?key=5F9086FB-EFE2-4D12-8989-CB16B25B3C9A&referrer=mrvappios'
        plataforma = 'ios';
      }

      if (this.navParams.get("page") == "detalhe") {
        let param = this.navParams.get("idImovel")
        await this.montaUrlDetalheImovel(param)
      } else {
        await this.montaUrlFrameBtnFixo()
      }
    }
    
    this.firebaseAnalytics.logEvent("chat_online", { pagina: this.navParams.get("page"), plataforma: plataforma } )
        .then((res: any) => console.log(res))
        .catch((error: any) => console.log(error));
  } 

  async verificaDados(key: string) {
    return this.storage.getItem(key)
  }

  async MontaUrl() {

    this.storage.keys().then((data) => {
      if (data.length > 0) {
        var url = this.Url
        data.forEach((item) => {
          this.verificaDados(item).then((dados) => {
            url = url + "&" + item + "=" + dados
            this.Url = url
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.Url)
          })
        })
      } else {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.Url)
      }
    })

  }

  async MontaUrlComImovel(idImovel: string) {

    this.storage.keys().then((data) => {
      if (data.length > 0) {
        var url = this.Url
        data.forEach((item) => {
          this.verificaDados(item).then((dados) => {
            url = url + "&" + item + "=" + dados
          }).finally(() => {
            this.Url = url + "&origem=" + idImovel
            console.log(this.Url)
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.Url)
          })
        })
      } else {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.Url)
      }
    })

  }

  async montaUrlFrameBtnFixo() {
    await this.MontaUrl()
  }

  async montaUrlDetalheImovel(idImovel: string) {
    await this.MontaUrlComImovel(idImovel)
  }

  fechaModal() {
    document.getElementById("chat-flutuante").style.display = "block"
    this.modalController.dismiss();
  }
}
