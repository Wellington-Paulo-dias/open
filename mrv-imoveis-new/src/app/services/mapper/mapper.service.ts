import { Injectable } from '@angular/core';
import { Imovel, Selo, Diferencial, DetalheImovel, Ribbon, FaixaDePreco } from '../../model';
//import { unwatchFile } from 'fs';
import { Cidade, Loja, Telefone } from '../../model/loja';
import { Estado } from 'src/app/model/estado';
import { Financiamento } from 'src/app/model/financiamento';


@Injectable({
  providedIn: 'root'
})

export class MapperService {

  retornoLojas = new Array<Cidade>();
  retornoEstados = new Array<Estado>();
  retornoCidades = new Array<Cidade>();

  constructor() {
  }

  public ServiceHome(RespostaWebService) {

    let imoveis = this.MapperImoveisHome(RespostaWebService);
    return imoveis;
  }
  
  public ServiceDetalhe(RespostaWebService) {
    let detalheImovel = new DetalheImovel();
    let data = RespostaWebService.data;

    detalheImovel.IdImovel = data.id;
    detalheImovel.NomeImovel = data.nome;
    detalheImovel.Distancia = data.distancia;
    detalheImovel.Descricao = data.descricao;
    detalheImovel.NomeProduto = data.nomeProduto;
    detalheImovel.AreaTerreno = data.areaTerreno;
    detalheImovel.DescricaoEstacionamento = data.descricaoEstacionamento;
    detalheImovel.PontosDeReferencia = data.pontosDeReferencia;
    detalheImovel.ConstrutoraResponsavel = data.construtoraResponsavel;
    detalheImovel.RegistroIncorporacao = data.registroIncorporacao;
    detalheImovel.ClasseStatusImovel = data.status;
    detalheImovel.AreasComuns = data.areasComuns.map((item) => item.nome);
    detalheImovel.Tours = data.tours.map((item) => item);
    detalheImovel.Mcmv = data.minhaCasaMinhaVida;
    detalheImovel.Url = data.url;
    detalheImovel.UrlLogo = data.urlLogo;
    detalheImovel.UrlImagemCapa = data.urlImagemCapa;
    detalheImovel.Favorito = data.favorito;

    if (detalheImovel.Mcmv) {
      let diferencial = new Diferencial;
      diferencial.Descricao = "Minha casa minha vida"
      diferencial.Icone = "assets/imagens/thumb-imovel/diferenciais/1.png";
      diferencial.Titulo = "Minha Casa Minha Vida";
      detalheImovel.Diferenciais.push(diferencial);
    }

    data.promocoes.forEach(ribbon => {
      let ribbonTemp = new Ribbon;
      ribbonTemp.UrlBackground = ribbon.url;
      detalheImovel.Ribbons.push(ribbonTemp);
    });

    data.diferenciais.forEach(diferencial => {
      let diferencialTemp = new Diferencial;
      diferencialTemp.Descricao = diferencial.descricao;
      diferencialTemp.Icone = diferencial.urlIcone;
      diferencialTemp.Titulo = diferencial.titulo;
      detalheImovel.Diferenciais.push(diferencialTemp);
    });

    detalheImovel.Quartos = data.quartos.map((item) => item);
    detalheImovel.Imagens = data.midias.imagens.map((item) => item);
    detalheImovel.Videos = data.midias.videos.map((item) => item);
    detalheImovel.Endereco = {
      Bairro: data.endereco.bairro,
      Cidade: data.endereco.cidade,
      Uf: data.endereco.uf,
      Logradouro: data.endereco.logradouro
    };
    detalheImovel.Localizacao = {
      Descricao: data.localizacao.descricao,
      Latitude: data.localizacao.latitude,
      Longitude: data.localizacao.longitude,
      UrlImagemMapa: data.localizacao.urlImagemMapa,
      UrlStreetView: data.localizacao.urlStreetView
    };

    return detalheImovel;
  }

  public ServiceTodosImoveis(RespostaWebService) {
    return this.MapperImoveis(RespostaWebService.data);
  }

  public ServiceGoogleMaps(RespostaWebService){
    
    RespostaWebService.data.imoveisProximos.forEach((imovel) => {
      if(imovel.localizacao != undefined && imovel.localizacao != null)
      {
       if(imovel.localizacao.latitude.toString().indexOf('.') == -1) { imovel.localizacao.latitude = parseFloat(parseFloat(imovel.localizacao.latitude.toString().slice(0, 3) + '.' + imovel.localizacao.latitude.toString().slice(3)).toFixed(10));}
       if(imovel.localizacao.longitude.toString().indexOf('.') == -1) { imovel.localizacao.longitude = parseFloat(parseFloat(imovel.localizacao.longitude.toString().slice(0, 3) + '.' + imovel.localizacao.longitude.toString().slice(3)).toFixed(10));}  
      }
    })

    return this.MapperImoveis(RespostaWebService.data.imoveisProximos);
  }

  public ServiceFavoritos(RespostaWebService){
    return this.MapperImoveis(RespostaWebService.data);
  }

  public ServiceLojas(RespostaWebService) {
    this.retornoLojas = new Array<Cidade>();
    this.retornoEstados = new Array<Estado>();

    RespostaWebService.data.forEach((cidadeLoja) => {
      let cidade = new Cidade();

      cidade.idCidade = cidadeLoja.idCidade
      cidade.nomeCidade = cidadeLoja.nomeCidade

      cidade.idEstado = cidadeLoja.idEstado
      cidade.nomeEstado = cidadeLoja.nomeEstado


      cidadeLoja.lojas.forEach((dadosLoja) => {
        let loja = new Loja();
        loja.id = dadosLoja.id;
        loja.nomeLoja = dadosLoja.nome;
        loja.estacionamento = dadosLoja.possuiEstacionamento;
        loja.unidadeDecorada = dadosLoja.possuiUnidadeDecorada;
        loja.decoradoVirtual = dadosLoja.possuiDecoradoVirtual;
        loja.endereco = dadosLoja.endereco.logradouro + ", " + dadosLoja.endereco.bairro;
        loja.distancia = dadosLoja.localizacao.distancia + " KM";
        loja.latitude = dadosLoja.localizacao.latitude;
        loja.longitude = dadosLoja.localizacao.longitude;
        
        dadosLoja.telefones.forEach((telefoneLoja) => {
          let telefone = new Telefone();
          telefone.numero = telefoneLoja
          loja.telefones.push(telefone)
        })

        cidade.lojas.push(loja)
      })
      this.retornoLojas.push(cidade)
    })
    return this.retornoLojas
  }

  public ServiceEstados(RespostaWebService) {
    this.retornoEstados = new Array<Estado>();
    RespostaWebService.data.forEach((estadoDados) => {
      let estado = new Estado();
      estado.id = estadoDados.id;
      estado.nome = estadoDados.nome;
      estado.slug = estadoDados.slug;
      estado.uf = estadoDados.uf;
      this.retornoEstados.push(estado)
    })
    return this.retornoEstados;
  }

  public ServiceCidades(RespostaWebService) {
    this.retornoCidades = new Array<Cidade>();
    RespostaWebService.data.forEach((cidadeDados) => {
      let cidade = new Cidade();
      cidade.idCidade = cidadeDados.id;
      cidade.idEstado = cidadeDados.estado.id;
      cidade.nomeCidade = cidadeDados.nome;
      this.retornoCidades.push(cidade);
    })
    return this.retornoCidades;
  }


  public MapperImoveisHome(imoveis) {
    console.log('MapperImoveisHome => ', imoveis);
    let ImoveisHome = new Array<Imovel>();

    imoveis.forEach(item => {
      let imovel = new Imovel;
      imovel.Selos = new Array<Selo>();
      imovel.Diferenciais = new Array<Diferencial>()

      imovel.IdImovel = item.id;
      imovel.NomeImovel = item.nome;
      imovel.NomeCompletoImovel = item.nome;
      imovel.Cidade = item.endereco.cidade;
      imovel.EstadoSigla = item.endereco.uf;
      imovel.CaminhoImagemCapa = item.urlImagemCapa;
      imovel.AltImagemCapa = item.nome;
      imovel.Distancia = "a " + item.distancia + " KM";
      imovel.ClasseStatusImovel = item.status;
      imovel.StatusImovel = item.statusLabel;
      imovel.NumeroQuartos = item.descricaoNumeroQuartos;
      //imovel.ApresentacaoImovel = item.ApresentacaoImovel;
      imovel.Mcmv = item.minhaCasaMinhaVida;
      imovel.Favorito = item.favorito;
      imovel.Endereco = {
        Bairro: item.endereco.bairro,
        Cidade: item.endereco.cidade,
        Uf: item.endereco.uf,
        Logradouro: ""
      };

      item.ribbons.forEach(ribbon => {
        let ribbonTemp = new Ribbon;
        ribbonTemp.CssClass = ribbon.cssClass;
        ribbonTemp.Texto = ribbon.texto;
        ribbonTemp.UrlBackground = ribbon.urlBackground;
        imovel.Ribbons.push(ribbonTemp);
      });

      item.selos.forEach(selo => {
        let seloTemp = new Selo;
        seloTemp.Cor = "rgb(" + selo.cor + ")";
        seloTemp.Selo = selo.selo;
        imovel.Selos.push(seloTemp);
      });

      if (imovel.Mcmv) {
        let diferencial = new Diferencial;
        diferencial.Icone = "assets/imagens/thumb-imovel/diferenciais/1.png";
        diferencial.Titulo = "Minha Casa Minha Vida";
        imovel.Diferenciais.push(diferencial);
      }

      item.diferenciais.forEach(diferencial => {
        let diferencialTemp = new Diferencial;
        diferencialTemp.Descricao = diferencial.descricao;
        diferencialTemp.Icone = diferencial.urlIcone;
        diferencialTemp.Titulo = diferencial.titulo;
        imovel.Diferenciais.push(diferencialTemp);
      });

      ImoveisHome.push(imovel);
    });
    return ImoveisHome;
  }


  public MapperImoveis(imoveis){
    let todosImoveis = new Array<Imovel>();
    imoveis.forEach(item => {
      let imovel = new Imovel;
      imovel.Selos = new Array<Selo>();
      imovel.Diferenciais = new Array<Diferencial>()

      imovel.IdImovel = item.id;
      imovel.NomeImovel = item.nome;
      imovel.NomeCompletoImovel = item.nome;
      imovel.Cidade = item.endereco.cidade;
      imovel.EstadoSigla = item.endereco.uf;
      imovel.CaminhoImagemCapa = item.urlImagemCapa;
      imovel.AltImagemCapa = item.nome;
      imovel.ClasseStatusImovel = item.status;
      imovel.Url = item.url;
      if(item.localizacao != undefined && item.localizacao != null)
      {
        imovel.Localizacao.Latitude = item.localizacao.latitude;
        imovel.Localizacao.Longitude = item.localizacao.longitude;
      }
      imovel.StatusImovel = item.statusLabel;
      imovel.NumeroQuartos = item.descricaoNumeroQuartos;
      //imovel.ApresentacaoImovel = item.ApresentacaoImovel;
      imovel.Mcmv = item.minhaCasaMinhaVida;
      imovel.Favorito = item.favorito;

      item.ribbons.forEach(ribbon => {
        let ribbonTemp = new Ribbon;
        ribbonTemp.CssClass = ribbon.cssClass;
        ribbonTemp.Texto = ribbon.texto;
        ribbonTemp.UrlBackground = ribbon.urlBackground;
        imovel.Ribbons.push(ribbonTemp);
      });

      item.selos.forEach(selo => {
        let seloTemp = new Selo;
        seloTemp.Cor = "rgb(" + selo.cor + ")";
        seloTemp.Selo = selo.selo;
        imovel.Selos.push(seloTemp);
      });

      if (imovel.Mcmv) {
        let diferencial = new Diferencial;
        diferencial.Icone = "assets/imagens/thumb-imovel/diferenciais/1.png";
        diferencial.Titulo = "Minha Casa Minha Vida";
        imovel.Diferenciais.push(diferencial);
      }

      item.diferenciais.forEach(diferencial => {
        let diferencialTemp = new Diferencial;
        diferencialTemp.Descricao = diferencial.descricao;
        diferencialTemp.Icone = diferencial.urlIcone;
        diferencialTemp.Titulo = diferencial.titulo;
        imovel.Diferenciais.push(diferencialTemp);
      });

      todosImoveis.push(imovel);
    });

    return todosImoveis;   
  }

  public ImoveisFavoritadosId(RespostaWebService){
    let idImoveis = new Array<string>();
    RespostaWebService.data.forEach((imoveis) => {
      idImoveis.push(imoveis.id);
    })
    return idImoveis;
  }

  public Financiamentos(RespostaWebService){
    let financiamentos = new Array<Financiamento>();
    RespostaWebService.data.forEach((item) => {
      let financiamento = new Financiamento;
      financiamento.Id = item.id;
      financiamento.Nome = item.nome;
      financiamento.Apresentacao = item.apresentacao;
      financiamento.Descricao = item.descricao;
      financiamento.Url = item.url;
      financiamento.pussuiSimulacao = item.pussuiSimulacao;
      financiamento.Logos = item.logos.map((item) => item);
      financiamentos.push(financiamento);
    })

    return financiamentos;
  }

  public FaixaDePreco(RespostaWebService) {
    let faixaDePrecos = new Array<FaixaDePreco>();
    RespostaWebService.forEach((item) => {
      let faixaDePreco = new FaixaDePreco;
      faixaDePreco.id = item.id;
      faixaDePreco.faixaDePreco = item.faixaDePreco;
      faixaDePreco.checked = true;
      faixaDePrecos.push(faixaDePreco);
    })

    return faixaDePrecos;
  }
}
