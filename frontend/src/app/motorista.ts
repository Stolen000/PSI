import {Morada} from './morada';

export interface Motorista {
    _id: string;
    name: string;
    morada: Morada;
    ano_nascimento: number;
    carta_conducao: number;
  }