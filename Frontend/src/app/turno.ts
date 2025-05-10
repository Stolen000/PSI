import { Periodo } from "./periodo";

export interface Turno {    
    _id: string ;
    motorista_id: string;
    taxi_id: string;
    periodo: Periodo
    viagens_realizadas: number;
  }
  
  