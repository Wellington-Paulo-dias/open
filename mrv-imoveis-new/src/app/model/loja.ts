export class Cidade {
    idCidade;
    nomeCidade;
    idEstado;
    nomeEstado;
    lojas = new Array<Loja>();
}

export class Loja {
    nomeLoja;
    distancia;
    endereco;
    estacionamento;
    unidadeDecorada;
    decoradoVirtual;
    latitude;
    longitude;
    telefones = new Array<Telefone>();
    id;
}

export class Telefone {
    numero;
}

