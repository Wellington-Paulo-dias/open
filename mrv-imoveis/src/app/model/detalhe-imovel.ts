import { Diferencial } from "." ;
import { Ribbon } from ".";

export class DetalheImovel {
 
    IdImovel;
    NomeImovel;
    Distancia;
    Descricao;
    NomeProduto;
    AreaTerreno;
    DescricaoEstacionamento;
    PontosDeReferencia;
    ConstrutoraResponsavel;
    RegistroIncorporacao;
    ClasseStatusImovel;
    Mcmv;
    Url;
    UrlLogo;
    UrlImagemCapa;
    Favorito;
    Tours: Array<Tour>;
    AreasComuns: Array<string>;
    Diferenciais: Array<Diferencial>;
    Endereco: Endereco;
    Localizacao: Localizacao;
    Quartos: Array<Quarto>; 
    Imagens: Array<Midia>;
    Videos: Array<Midia>;
    Ribbons: Array<Ribbon>;

    constructor(){
        this.AreasComuns = new Array<string>();        
        this.Diferenciais = new Array<Diferencial>();
        this.Quartos = new Array<Quarto>();
        this.Imagens = new Array<Midia>();
        this.Videos = new Array<Midia>();
        this.Tours = new Array<Tour>();
        this.Ribbons = new Array<Ribbon>();
    }
}

export class Endereco {
    Logradouro;
    Bairro;
    Cidade;
    Uf;
}

export class Localizacao {
    Descricao;
    Latitude;
    Longitude;
    UrlImagemMapa;
    UrlStreetView;
}

export class Quarto {
    Rotulo;
    AreaTotal;
} 

export class Midia {
    Titulo;   
    Url;
    ThumbSmallUrl;
    ThumbMediumUrl;
    TipoMedia;
    TipoImagem;
}

export class Tour {
    Tipo;
    Url;
}