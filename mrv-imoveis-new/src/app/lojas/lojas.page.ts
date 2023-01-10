declare var dito;

import { Component, OnInit } from '@angular/core';
import { WebServiceService } from '../services/mrv/web-service.service';
import { NavController, Platform } from '@ionic/angular';
import { MapperService } from '../services/mapper/mapper.service';
import { Cidade } from '../model/loja';
import { Estado } from '../model/estado';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { NavProviderService } from '../services/provider/nav-provider.service';
import { CacheService } from 'ionic-cache';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-lojas',
  templateUrl: './lojas.page.html',
  styleUrls: ['./lojas.page.scss'],
})
export class LojasPage implements OnInit {
  cidades = new Array<Cidade>();
  estados = new Array<Estado>();
  cidadesBusca = new Array<Cidade>();
  estadoSelecionado;
  cidadeSelecionada;

  Localizacao = {
    Latitude: 0,
    Longitude: 0
  }

  constructor(private ws: WebServiceService, private platform: Platform, private map: MapperService, private callNumber: CallNumber,
    private provider: NavProviderService, private navCtrl: NavController, private cache: CacheService, private geolocation: Geolocation) {
    if (this.platform.ready()) {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.Localizacao.Latitude = resp.coords.latitude;
        this.Localizacao.Longitude = resp.coords.longitude;
        this.CarregaEstado();
        this.CarregaCidade();
      }).catch((error) => {
        this.Localizacao.Latitude = -19.9245;
        this.Localizacao.Longitude = -43.9353;
        this.CarregaEstado();
        this.CarregaCidade();
      })
      this.Dito();
    }
  }

  ngOnInit() {
    document.getElementById("chat-flutuante").style.display = 'block';
  }

  abrirBuscaLoja() {
    document.getElementById("formBusca").classList.remove('esconder');
    document.getElementById("btnBusca").style.display = "none";
    document.getElementById("formBusca").classList.add('ativo');
  }

  fecharBuscaLoja() {
    document.getElementById("formBusca").classList.remove('ativo');
    document.getElementById("formBusca").style.height = "auto";

    document.getElementById("formBusca").classList.add('esconder');
    setTimeout(function () { document.getElementById("formBusca").style.height = "0"; document.getElementById("btnBusca").style.display = "block"; }, 1000);

  }

  Ligar(telefone) {
    this.callNumber.callNumber(telefone, true).catch((error) => {
      console.log("ERROR on call number: " + error)
    })
  }

  Filtrar() {
    if (this.cidadeSelecionada === undefined) {
      this.cidadeSelecionada = 0
    }
    this.ws.LojaCidadeEstado(this.cidadeSelecionada, this.estadoSelecionado).subscribe((resposta) => {
      this.cidades = this.map.ServiceLojas(resposta)
      document.getElementById("btnFechaBusca").click()
      console.log(this.cidades)
    }, error => {
      console.log('erro aqui => ', error);
      this.cidades = null;
    })
  }

  async CarregaCidade() {
    let key = 'cidades-loja';
    let ttl = 3600 * 24 * 7 * 52;
    this.cache.removeItem(key);
    let existeCache = await this.cache.itemExists(key);
    await this.cache.loadFromObservable(key, this.ws.Lojas(this.Localizacao.Latitude, this.Localizacao.Longitude), "", ttl).subscribe((resposta) => {
      if (!existeCache) {
        this.cache.saveItem(key, resposta);
      }
      this.cidades = this.map.ServiceLojas(resposta)
    })
  }

  async CarregaEstado() {
    let key = 'estados-loja';
    let ttl = 3600 * 24 * 7 * 52;
    await this.cache.loadFromObservable(key, this.ws.getEstadosLoja(), "", ttl).subscribe((resposta) => {
      this.cache.saveItem(key, resposta);
      this.estados = this.map.ServiceEstados(resposta)
    })
  }

  ChangeEstado() {
    this.ws.getCidadeLoja(this.estadoSelecionado).subscribe((resposta: any) => {
      this.cidadesBusca = this.map.ServiceCidades(resposta);
    })
  }

  async MapaRota(loja) {
    let objeto = {
      nome: loja.nomeLoja,
      latitude: parseFloat(parseFloat(loja.latitude.replace(',', '.')).toFixed(10)),
      longitude: parseFloat(parseFloat(loja.longitude.replace(',', '.')).toFixed(10)),
      classeStatusImovel: '',
      origem: 1
    }
    this.provider.object = { objeto };
    await this.navCtrl.navigateForward('/mapa-rota');
  }

  voltar() {
    this.navCtrl.back()
  }
  home() {
    this.navCtrl.navigateForward("");
  }

  Dito() {
    this.provider.PegarEmailStorage().then((email) => {
      this.ws.RastrearDito("acessoupontosdevenda", email, "").subscribe((data) => {
        console.log(data);
      });
    })
  }
}