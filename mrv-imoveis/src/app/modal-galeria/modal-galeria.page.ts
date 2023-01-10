import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { ModalGaleriaInternaPage } from '../modal-galeria-interna/modal-galeria-interna.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-modal-galeria',
  templateUrl: './modal-galeria.page.html',
  styleUrls: ['./modal-galeria.page.scss'],
})

export class ModalGaleriaPage implements OnInit {
  imovel: any;

  constructor(private modalController: ModalController, private navParams: NavParams, private photoViewer: PhotoViewer, private youtubeVideoPlayer: YoutubeVideoPlayer, private screenOrientation: ScreenOrientation) {
    this.imovel = this.navParams.get('imovel');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).catch((err) => {
      console.log("ERRO: " + err)
    })
  }

  ngOnInit() {
  }

  fechaModal() {
    this.modalController.dismiss();
  }
  viewPhoto() {
    let options = {
      share: true, // default is false
      closeButton: false, // default is true
      copyToReference: true // default is false
    };
    this.photoViewer.show('https://marketingdeconteudo.com/wp-content/uploads/2017/01/formatos-de-imagem-2.jpg', 'Optional Title', options);
  }

  abrirVideo(url) {
    this.youtubeVideoPlayer.openVideo(url);
  }

  openImage(index) {
    this.modalController.create({
      component: ModalGaleriaInternaPage,
      componentProps: {
        imovel: this.imovel,
        imgs: this.imovel.Imagens,
        index: index,
        url: this.imovel.Url
      }
    }).then(modal => modal.present())
  }

  Info() { 
    if (document.getElementById('info').classList.contains('on')) { 
      document.getElementById('info').classList.remove('on') 
      document.getElementById('info').classList.add('off') 
    } 
    else { 
      document.getElementById('info').classList.remove('off') 
      document.getElementById('info').classList.add('on') 
    } 
  }

}
