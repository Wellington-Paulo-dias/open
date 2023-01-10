import { Injectable } from '@angular/core';

import { Network } from '@ionic-native/network/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController, Platform, AlertController } from '@ionic/angular';

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkProviderService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor(private network: Network, private toastController: ToastController, private plt: Platform, private alertController: AlertController) { 
    this.plt.ready().then(() => {
      this.initializeNetworkEvents();
      let status =  this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
    });
  }

  public initializeNetworkEvents() {
 
    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        console.log('WE ARE OFFLINE');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });
 
    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log('WE ARE ONLINE');
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }
 
  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);
 
    let connection = status == ConnectionStatus.Offline ? 'sem conexão com a internet' : 'conectado';
    let reload = ConnectionStatus.Online ? true : false;

    if (reload) { window.location.reload(); }
    // let toast = this.toastController.create({
    //   message: `Você está ${connection}`,
    //   duration: 6000,
    //   position: 'bottom'
    // });
    // toast.then(toast => toast.present());
    try {
      await this.alertController.dismiss();
    } catch (error) {
      
    }

    this.alertController.create({
      header: 'Conexão com a internet!',
      message: `Agora você está ${connection}`,
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
            // this.storage.setItem("firstOpen", true).then(() => {
            //   if(this.platform.is("android")){
            //     window.location.reload()
            //   }               
            // })
          }
        },

      ]
    }).then((msg) => {
      msg.present();
    });
  }
 
  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }
 
  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }
}
