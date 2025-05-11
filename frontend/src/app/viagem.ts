import { Morada } from "./morada";
import { Turno } from "./turno";
import { Coordenadas } from './coordenadas';


export interface Viagem { 
    _id?: string;   
    motorista_id: string;
    sequencia: number;
    turno_id: string;
    nif_cliente: number;
    inicio_viagem?: Date | null;
    fim_viagem?: Date | null;
    num_pessoas: number;
    coordenadas_origem: Coordenadas;
    coordenadas_destino: Coordenadas;
  }