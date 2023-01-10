import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MapperService } from '../mapper/mapper.service';
import { Observable, } from 'rxjs';
import { Imovel } from 'src/app/model';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class WebServiceService {
  constructor(private http: HttpClient, private mapper: MapperService) { }

  // Estados 

  public getEstadosLoja() {
    return this.http.get(`${apiUrl}/estados/lojas`);
  }

  public getEstadosImoveis() {
    return this.http.get(`${apiUrl}/estados/imoveis`);
  }

  // Cidades

  public getCidadeLoja(id) {
    return this.http.get(`${apiUrl}/cidades/por-estado-loja?idEstado=${id}`)
  }

  public getCidadeLatitudeLongitude(latitude, longitude) {
    return this.http.get(`${apiUrl}/cidades/por-latitude-longitude-imovel?latitude=${latitude}&longitude=${longitude}`)
  }

  public getCidadeImovel(id) {
    return this.http.get(`${apiUrl}/cidades/por-estado-imovel?idEstado=${id}`)
  }

  public getCidadesMCMV() {
    return this.http.get(`${apiUrl}/cidades/minha-casa-minha-vida`)
  }

  // Bairros

  public getBairrosCidade(id) {
    return this.http.get(`${apiUrl}/bairros/por-cidade/${id}`)
  }

  // Vitrines

  public vitrineHome() {
    return this.http.get(`${apiUrl}/vitrines`);
  }

  // Imoveis

  public BuscarImoveisHome(latitude, longitude, deviceId = 0) {
    if (deviceId != 0) {
      return this.http.get(`${apiUrl}/imoveis/na-regiao?latitude=${latitude}&longitude=${longitude}&deviceId=${deviceId}`)
    } else {
      return this.http.get(`${apiUrl}/imoveis/na-regiao?latitude=${latitude}&longitude=${longitude}`)
    }
  }

  public ImovelPorLatitudeLongitude(latitude, longitude) {
    return this.http.get(`${apiUrl}/imoveis/por-latitude-longitude?latitude=${latitude}&longitude=${longitude}`)
  }

  public ImovelPorCidade(idCidade, slugEstado, paginaInicial, tamanhoPagina) {
    return this.http.get(`${apiUrl}/imoveis/por-cidade?idCidade=${idCidade}&slugEstado=${slugEstado}&paginaInicial=${paginaInicial}&tamanhoPagina=${tamanhoPagina}`)
  }

  public DetalheImovel(id, latitude, longitude, deviceId) {
    return this.http.get(`${apiUrl}/imoveis/${id}?latitude=${latitude}&longitude=${longitude}&deviceId=${deviceId}`)
  }

  public BuscaAvancada(estadoId, cidadeId, bairros, faixasDePreco, deviceId) {

    let bairrosEscolhidosId = [];
    if (bairros != undefined && bairros != null && bairros.length > 0) {
      bairros.forEach((bairro) => {
        bairrosEscolhidosId.push(parseInt(bairro.id));
      });
    }

    let faixasPrecoId = [];
    if (faixasDePreco != undefined && faixasDePreco != null) {
      faixasDePreco.forEach((faixa) => {
        if (faixa != "" && faixa != null) {
          faixasPrecoId.push(faixa.id)
        }
      });
    }

    return this.http.post(`${apiUrl}/imoveis/busca-avancada`, { "estadoId": parseInt(estadoId), "cidadeId": parseInt(cidadeId), "bairros": bairrosEscolhidosId, "faixasDePreco": faixasPrecoId, "deviceId": deviceId }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  public getFaixaDePreco(idEstado, idCidade, bairros) {
    let bairrosEscolhidosInt = [];
    if (bairros != undefined && bairros != null && bairros.length > 0) {
      bairros.forEach((bairro) => {
        bairrosEscolhidosInt.push(parseInt(bairro.id));
      });
    }

    if (bairrosEscolhidosInt == null || bairrosEscolhidosInt.length == 0) {
      return this.http.get(`${apiUrl}/imoveis/faixas-de-preco?idEstado=${parseInt(idEstado)}&idCidade=${parseInt(idCidade)}`);
    }
    else {
      return this.http.get(`${apiUrl}/imoveis/faixas-de-preco?idEstado=${parseInt(idEstado)}&idCidade=${parseInt(idCidade)}&bairros=${bairrosEscolhidosInt}`);
    }
  }

  // Lojas

  public Lojas(latitude, longitude) {
    return this.http.get(`${apiUrl}/lojas/por-latitude-longitude?latitude=${latitude}&longitude=${longitude}`)
  }

  public LojaCidadeEstado(cidade = 0, estado = 0) {
    return this.http.get(`${apiUrl}/lojas/por-estado-cidade?idEstado=${estado}&idCidade=${cidade}`)
  }

  // Favoritos

  public GetImoveisFavoritos(deviceId) {
    return this.http.get(`${apiUrl}/imoveis-favoritos/${deviceId}`)
  }

  public PostImovelFavorito(deviceId, imovelId) {
    return this.http.post(`${apiUrl}/ImoveisFavoritos`, { "deviceId": deviceId, "imovelId": imovelId }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  public RemoverImoveisFavorito(deviceId, imovelId) {
    return this.http.delete(`${apiUrl}/ImoveisFavoritos?imovelId=${imovelId}&deviceId=${deviceId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  // Financeira
  public Financiamento() {
    return this.http.get(`${apiUrl}/Financeiras`);
  }

  public Subsidio(renda, idSubsidio, dependente) {
    return this.http.get(`${apiUrl}/financeiras/simulacao-subsidio-minha-casa-minha-vida?renda=${renda}&idSubsidio=${idSubsidio}&dependente=${dependente}`);
  }

  // Contato
  public EnviarContato(nome, ddd, telefone, mensagem, email, idCidade, newsletter) {
    return this.http.post(`${apiUrl}/Contatos`, { "nome": nome, "ddd": ddd, "telefone": telefone, "mensagem": mensagem, "email": email, "idCidade": idCidade, "newsletter": newsletter }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  // Prospect
  public ProspectEmail(email) {
    return this.http.post(`${apiUrl}/prospect/por-email`, { "email": email }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  public RastrearDito(tipo, email, data) {
    return this.http.post(`${apiUrl}/prospect/rastrear`, { "tipo": tipo, "email": email, "data": data }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })    
    })
  }
}
