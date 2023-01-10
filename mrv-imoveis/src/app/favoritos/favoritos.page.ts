import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { WebServiceService } from '../services/mrv/web-service.service';
import { MapperService } from '../services/mapper/mapper.service';
import { Imovel } from '../model/imovel';
import { NavController } from '@ionic/angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { RouterEventService } from '../services/provider/router-event.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage extends RouterEventService implements OnInit, OnDestroy {

  imoveisFavoritos = new Array<Imovel>();
  semImoveis = false;
  uniqueID;

  constructor(private platform: Platform, private ws: WebServiceService, private loadingController: LoadingController,
    private mapper: MapperService, private navController: NavController, private uniqueDeviceId: UniqueDeviceID,
    private socialSharing: SocialSharing, private router: Router, private route: ActivatedRoute) {
    super(router, route)
    this.getId();
    if (this.platform.ready()) {
      this.initFavoritos();
    }
  }

  initFavoritos() {
    this.presentLoading().then(() => this.BuscarFavoritos().then(() => this.loadingController.dismiss()));
  }

  onEnter() {
    if (this.carregou) {
      this.imoveisFavoritos = null;
      this.initFavoritos();
    }
  }

  onDestroy() {

  }

  ngOnInit() {
    document.getElementById("chat-flutuante").style.display = 'block';
  }

  getId() {
    this.uniqueDeviceId.get()
      .then((uuid: any) => {this.uniqueID = uuid; console.log('uuid => ', uuid)})
      .catch((error: any) => console.log(error))
  }

  RemoverFavorito(idImovel) {
    this.ws.RemoverImoveisFavorito(this.uniqueID, idImovel).subscribe((resposta: any) => {
      if (resposta.success) {
        let indexImovelProximos = this.imoveisFavoritos.findIndex(imovel => imovel.IdImovel == idImovel);
        if (indexImovelProximos != -1) {
          this.imoveisFavoritos.splice(indexImovelProximos, 1);
          if (this.imoveisFavoritos.length == 0) {
            this.semImoveis = true;
          }
        }
      }
    });
  }

  async BuscarFavoritos() {
    this.ws.GetImoveisFavoritos(this.uniqueID).subscribe((resposta: any) => {
      if (resposta.success) {
        if (resposta.data.length > 0) {
          this.imoveisFavoritos = this.mapper.ServiceFavoritos(resposta);
          this.semImoveis = false;
        }
        else {
          this.semImoveis = true;
        }
      }
    })
    this.carregou = true;
  }

  async presentLoading() {
    const loadingElement = await this.loadingController.create({
      spinner: 'crescent',
      duration: 45000
    });
    return await loadingElement.present();
  }

  home() {
    this.navController.navigateForward("");
  }

  Share(idImovel) {
    let indexFavorito = this.imoveisFavoritos.findIndex(imovel => imovel.IdImovel == idImovel);
    if (indexFavorito != -1) {
      this.socialSharing.share("apenas um teste", "Teste Assunto", this.imoveisFavoritos[indexFavorito].CaminhoImagemCapa, this.imoveisFavoritos[indexFavorito].Url)
      this.imoveisFavoritos[indexFavorito]
    }
  }

  internaImoveis(id) {
    this.navController.navigateForward(`/tabs/(imoveis-interna:imoveis-interna/${id})`);
  }
}
