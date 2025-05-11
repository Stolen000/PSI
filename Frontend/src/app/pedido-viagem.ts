import { Morada } from './morada';
import { Coordenadas } from './coordenadas';

export interface Pedido_Viagem {
  _id?: string;
  cliente_nome: string;
  cliente_nif: string;
  cliente_genero: string;
  morada_origem: Morada;
  morada_destino: Morada;
  coordenadas_origem: Coordenadas;  
  coordenadas_destino: Coordenadas; 
  nivel_conforto: string;
  numero_pessoas: string;
  estado: string;
  taxi_id: string;
  distancia_motorista: number;
  tempo_estimado: number;
  custo_estimado: number;
  motorista_id: string;
}
