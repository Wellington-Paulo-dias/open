import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-ficha-tecnica',
  templateUrl: './modal-ficha-tecnica.page.html',
  styleUrls: ['./modal-ficha-tecnica.page.scss'],
})
export class ModalFichaTecnicaPage implements OnInit {
  imovel: any;
  
  constructor(private modalController: ModalController, private navParams: NavParams) {
    this.imovel = this.navParams.get("imovel");
  }

  ngOnInit() {

  }

  fechaModal() {
    this.modalController.dismiss();
  }

}
