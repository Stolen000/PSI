import { Morada } from "./morada";
import { Turno } from "./turno";

export interface Viagem { 
    _id: String;   
    motorista_id: String;
    sequencia: number;
    turno_id: String;
    nif_cliente: number;
    inicio_viagem: Date;
    fim_viagem: Date;
    num_pessoas: number;
    local_partida: Morada;
    local_chegada: Morada;
  }