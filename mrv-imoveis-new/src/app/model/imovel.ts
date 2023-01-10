import { Diferencial } from "./diferencial";
import { Selo, Ribbon } from "./selo";
import { Localizacao, Endereco } from "./detalhe-imovel";

export class Imovel {

    constructor() {
        this.Localizacao = new Localizacao();
        this.Diferenciais = new Array<Diferencial>();
        this.Selos = new Array<Selo>();
        this.Ribbons = new Array<Ribbon>();
    }

    IdImovel;
    NomeImovel;
    NomeCompletoImovel;
    CaminhoImagemCapa;
    CorClasseNome;
    AltImagemCapa;
    EstadoSigla;
    Cidade;
    StatusImovel;
    NumeroQuartos;
    ApresentacaoImovel;
    Distancia;
    ClasseStatusImovel;
    Mcmv;
    Favorito;
    Url;
    Endereco: Endereco;
    Localizacao: Localizacao;
    Diferenciais: Array<Diferencial>;
    Selos: Array<Selo>;
    Ribbons: Array<Ribbon>;
}


