import { Morada } from './morada';
import { Coordenadas } from './coordenadas';

export interface Pedido_Viagem {
  _id: string;
  cliente_nome: string;
  cliente_nif: number;
  cliente_genero: string;
  morada_origem: Morada;
  morada_destino: Morada;
  coordenadas_origem: Coordenadas;  
  coordenadas_destino: Coordenadas; 
  nivel_conforto: string;
  numero_pessoas: number;
  estado: string;
  taxi: string;
  distancia_motorista: number;
  tempo_estimado: number;
  custo_estimado: number;
  motorista: string;
  turno_id: string;
}
