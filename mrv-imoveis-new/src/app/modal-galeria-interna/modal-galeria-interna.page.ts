import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalFormAtendimentoPage } from '../modal-form-atendimento/modal-form-atendimento.page';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-galeria-interna',
  templateUrl: './modal-galeria-interna.page.html',
  styleUrls: ['./modal-galeria-interna.page.scss'],
})
export class ModalGaleriaInternaPage implements OnInit {
  imagens;
  index;
  url;
  slideTotal = 0;
  slideAtual = 0;
  slideInicial = 0;
  tituloAtual = "";
  detalhesImovel;

  control = 1;
  /*
  control 1 Portrait
  control 0 Landscape
  */

  @ViewChild('Slider') slider;

  sliderOpts = {
    zoom: {
      maxRatio: 2
    },
    pagination: false
  }

  constructor(private navParams: NavParams, private modalController: ModalController,
    private screenOrientation: ScreenOrientation, private socialSharing: SocialSharing, 
    private iab: InAppBrowser) {
    this.detalhesImovel = this.navParams.data.imovel;

    this.screenOrientation.unlock()
    this.screenOrientation.onChange().subscribe((dados) => {
      if (this.control == 1) {
        this.control = 0
        setTimeout(() => {
          this.slider.update()
          this.slider.updateSize()
          this.slider.OnResize()
        }, 500)

        //document.getElementById('pai').classList.add('rotate')
      } else {
        setTimeout(() => {
          this.slider.update()
          this.slider.updateSize()
          this.slider.OnResize()
        }, 500)
        //document.getElementById('pai').classList.remove('rotate')
      }
    })
  }

  ngOnInit() {
    this.imagens = this.navParams.get('imgs')
    this.index = this.navParams.get('index')
    this.url = this.navParams.get("url")
    this.tituloAtual = this.imagens[this.index].titulo
    this.slideAtual = this.index + 1
    this.slideTotal = this.imagens.length
    this.slider.slideTo(this.index)
  }

  zoom() {
    let zoom = this.slider.nativeElement.swiper.zoom
    zoom.in()
  }

  fechar() {
    this.modalController.dismiss()
  }

  controleSlide() {
    if (this.slideAtual === this.slideTotal || this.slideAtual === this.slideTotal - 1) {
      setTimeout(async () => {
        await this.fechar();
        await this.OpenModalChat();
      }, 3000);
    }
  }

  async updateInfo() {
    this.slideAtual = await this.slider.getActiveIndex() + 1
    this.tituloAtual = await this.slider.length()
  }

  async Share() {
    console.log(await this.slider.getActiveIndex())
    this.socialSharing.share(this.imagens[await this.slider.getActiveIndex()].titlulo, "Imóvel MRV", this.imagens[await this.slider.getActiveIndex()].url, this.url)
  }

  async OpenModalChat() {
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
  
  openWhatsMRV() {
    this.iab.create(environment.whatsUrl, '_system');
  }
}
