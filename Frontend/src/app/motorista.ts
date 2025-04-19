import {Morada} from './morada';

export interface Motorista {
    _id: string;
    nome: string;
    genero: string;
    nif: number;
    ano_de_nascimento: number;
    carta_conducao: number;
    morada: Morada;
}

