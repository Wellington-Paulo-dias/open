declare var dito;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebServiceService } from '../services/mrv/web-service.service';
import { MapperService } from '../services/mapper/mapper.service';
import { Platform, LoadingController, NavController } from '@ionic/angular';
import { Imovel } from '../model/imovel';
import { NavProviderService } from '../services/provider/nav-provider.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { RouterEventService } from '../services/provider/router-event.service'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-todos-imoveis',
  templateUrl: './todos-imoveis.page.html',
  styleUrls: ['./todos-imoveis.page.scss'],
})

export class TodosImoveisPage extends RouterEventService implements OnInit, OnDestroy {
  //i: any;
  animacao: any;
  todosImoveis = new Array<Imovel>();
  todosImoveisFiltro = new Array<Imovel>();
  semImoveis = false;
  semImoveisFiltro = false;
  uniqueID;

  Localizacao = {
    Latitude: 0,
    Longitude: 0
  }

  constructor(private ws: WebServiceService, private mapper: MapperService, private platform: Platform,
              private loadingController: LoadingController, private provider: NavProviderService,
              private geolocation : Geolocation, private navController: NavController, private uniqueDeviceID: UniqueDeviceID,
              private router: Router, private route: ActivatedRoute) {

    super(router, route);
    this.getId();
    this.Geolocalizacao();
    this.iniciaTodosImoveis();
    if(this.platform.ready){
      this.iniciaTodosImoveis();
    }
   }

   iniciaTodosImoveis() {
    this.presentLoading().then(() => this.CarregarTodosImoveis().then(() => this.loadingController.dismiss()))
   }

  ngOnInit() {
    document.getElementById("chat-flutuante").style.display = 'block';
    if (this.platform.is("ios")) {
      document.getElementById('bloco-filtro').classList.add('ios-filtro');
    }
  }

  onEnter() {
    if(this.carregou) {
      this.todosImoveis = null;
      this.todosImoveisFiltro = null;
      this.iniciaTodosImoveis();
    }
  }

  onDestroy() {
    super.ngOnDestroy();
  }

  getId(){
    this.uniqueDeviceID.get()
    .then((uuid: any) => this.uniqueID = uuid)
    .catch((error: any) => console.log(error))
  }

  Geolocalizacao() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.Localizacao.Latitude = resp.coords.latitude;
      this.Localizacao.Longitude = resp.coords.longitude;
    }).catch((error) => {
      console.log('Desculpe, não foi possível determinar sua localização devido a: ', error);
    })
  }

  async CarregarTodosImoveis(){
    if(this.provider.object != null && this.provider.object != undefined && this.provider.object.length > 0) {
      this.todosImoveis = this.provider.object;
      this.todosImoveisFiltro = this.provider.object;
      this.carregou = true;
      this.semImoveis = false;
    }
    else{
      this.semImoveis = true;
    } 
  }

  Filtrar(status : any){
    if(status.currentTarget.dataset.value.trim() != "todos"){
      this.todosImoveis = this.todosImoveisFiltro.filter(item => item.ClasseStatusImovel.toLowerCase() == status.currentTarget.dataset.value.toLowerCase());
    }
    else{
      this.todosImoveis = this.todosImoveisFiltro;
    }
    document.getElementById("filtro").style.display = "none";
    document.getElementById("filtro").attributes.getNamedItem("data-value").textContent = "false";
    this.semImoveisFiltro = this.todosImoveis.length == 0 ? true : false; 
  }

  Favoritar(idImovel) {
    this.ws.GetImoveisFavoritos(this.uniqueID).subscribe((resposta) => {
      let imoveisFav = this.mapper.ImoveisFavoritadosId(resposta);
      if (imoveisFav.indexOf(idImovel) == -1) {
        this.FavoritarImovel(idImovel);
      }
      else {
        this.DesfavoritarImovel(idImovel);
      }
    })
  }

  FavoritarImovel(idImovel){
    this.ws.PostImovelFavorito(String(this.uniqueID), idImovel).subscribe((resposta: any) => {
      if (resposta.success) {
        let indexImovel = this.todosImoveis.findIndex(imovel => imovel.IdImovel == idImovel);
        if(indexImovel != -1){
          this.todosImoveis[indexImovel].Favorito = true;
          this.DitoFavoritar(this.todosImoveis[indexImovel]);
        }
        let indexImovelFiltro = this.todosImoveis.findIndex(imovel => imovel.IdImovel == idImovel);
        if(indexImovelFiltro != -1){
          this.todosImoveisFiltro[indexImovelFiltro].Favorito = true;
        } 
      }
    });
  }

  DesfavoritarImovel(idImovel) {
    this.ws.RemoverImoveisFavorito(String(this.uniqueID), idImovel).subscribe((resposta: any) => {
      if(resposta.success) {
        let indexImovel = this.todosImoveis.findIndex(imovel => imovel.IdImovel == idImovel);
        if(indexImovel != -1){
          this.todosImoveis[indexImovel].Favorito = false;
        }
        let indexImovelFiltro = this.todosImoveis.findIndex(imovel => imovel.IdImovel == idImovel);
        if(indexImovelFiltro != -1){
          this.todosImoveisFiltro[indexImovelFiltro].Favorito = false;
        }       
      }
    })
  }

  MostraFiltro() {
    let i = 0;
    let filtro = document.getElementById("filtro").attributes.getNamedItem("data-value").textContent;
    //let tempo = 200;
    //let itens = [];
    i = document.getElementById("filtro").children.length - 1; 

    // document.getElementById("filtro").childNodes.forEach((item: any) => {
    //   itens.push(item);
    // });

    if (filtro === "false") {
      document.getElementById("filtro").style.display = "block";
      document.getElementById("filtro").attributes.getNamedItem("data-value").textContent = "true";

      // this.animacao = setInterval(
      //   function () {
      //     if (i >= 0) {
      //       console.log(i)
      //       document.getElementById("filtro").children[i].classList.add("animated");
      //       i--;
      //     } else {
            
      //       document.getElementById("filtro").childNodes.forEach((item: any) => {
      //         item.classList.remove("animated");
      //       })
      //       document.getElementById("filtro").attributes.getNamedItem("data-value").textContent = "true";
      //       clearInterval(this.animacao);
      //     }
      //   }, 
      // 200);  

    } else {
      document.getElementById("filtro").style.display = "none";
      document.getElementById("filtro").attributes.getNamedItem("data-value").textContent = "false";
      // let j = 0;
      // this.animacao = setInterval(
      //   function () {
      //     if (j <= 4) {
      //       console.log(j)
      //       document.getElementById("filtro").children[j].classList.add("animated");
      //       j++;
      //     } else {
      //       document.getElementById("filtro").childNodes.forEach((item: any) => {
      //         item.classList.remove("animated");
      //         clearInterval(this.animacao);
      //       })
      //       document.getElementById("filtro").attributes.getNamedItem("data-value").textContent = "false";
      //     }
      //   }, 
      // 500); 

    }
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

  internaImoveis(id) {
    this.navController.navigateForward(`/tabs/(imoveis-interna:imoveis-interna/${id})`);
  }

  voltar() {
    this.navController.goBack()
  } 

  DitoFavoritar(imovel) {
    dito.track({
      action: 'favoritou-imovel',
      data: {
        status_empreendimento: imovel.StatusImovel,
        imovel: imovel.NomeImovel, 
        cidade: imovel.Cidade,
        bairro: imovel.Endereco.Bairro,
        estado: imovel.Endereco.Uf,
        n_quartos: imovel.NumeroQuartos
      }
    });
  }
}
