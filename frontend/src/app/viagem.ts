import { Morada } from "./morada";
import { Turno } from "./turno";

export interface Viagem {    
    sequencia: number;
    turno: Turno;
    nif_cliente: number;
    inicio_viagem: Date;
    fim_viagem: Date;
    num_pessoas: number;
    local_partida: Morada;
    local_chegada: Morada;
  }