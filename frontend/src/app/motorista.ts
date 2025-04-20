import {Morada} from './morada';

export interface Motorista {
    _id: string;
    name: string;
    morada: Morada;
    nif: number;
    genero: string;
    ano_nascimento: number;
    carta_conducao: number;
  }