import { Morada } from "./morada";
import { Turno } from "./turno";
import { Coordenadas } from './coordenadas';


export interface Viagem { 
    _id?: String;   
    motorista_id: String;
    sequencia: number;
    turno_id: String;
    nif_cliente: number;
    inicio_viagem?: Date | null;
    fim_viagem?: Date | null;
    num_pessoas: number;
    coordenadas_origem: Coordenadas;
    coordenadas_destino: Coordenadas;
  }