import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';



@Component({
  selector: 'app-modal-diferenciais',
  templateUrl: './modal-diferenciais.page.html',
  styleUrls: ['./modal-diferenciais.page.scss'],
})

export class ModalDiferenciaisPage implements OnInit {

  imovel: any;

  constructor( private modalController:ModalController, private navParams:NavParams) 
  {
   this.imovel = this.navParams.get('imovel');
  }

  ngOnInit() {}

  fechaModal() {
    this.modalController.dismiss();
  }

  toggleText(event) {

    if (event.target.parentElement.tagName === 'LI') {

      if(event.target.parentElement.className === 'ativo' ){
        event.target.parentElement.classList.remove('ativo');
        
      }else {
        event.target.parentElement.classList.add('ativo');
      }
      
    }else{
      if(event.target.parentElement.parentElement.className === 'ativo' ){
        event.target.parentElement.parentElement.classList.remove('ativo');
      }else {
        event.target.parentElement.parentElement.classList.add('ativo');
      }
    }
  }

}
