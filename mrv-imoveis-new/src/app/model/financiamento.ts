export class Financiamento {
    Id;
    Nome;
    Apresentacao;
    Descricao;
    Url;
    Logos: Array<Logos>;
    pussuiSimulacao;

    constructor(){
        this.Logos = new Array<Logos>();
    }  
}

export class Logos {
    url;
    tipo;
}