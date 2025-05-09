import {Taxi} from './taxi';
import {Motorista} from './motorista';



export interface Pedido_Viagem {
    _id?: string;
    cliente_nome: string; //id do cliente
    cliente_nif: string;
    cliente_genero: string; //genero do cliente
    morada_origem: string; //id da morada origem
    morada_destino: string; //id da morada destino
    nivel_conforto: string; //nivel de conforto do taxi
    numero_pessoas: string; //numero de pessoas na viagem
    estado: string; //estado da viagem (pendente, aceite, rejeitada, concluida)
    taxi: Taxi; //id do taxi
    distancia_motorista: number; //distancia da viagem
    tempo_estimado: number; //tempo estimado da viagem
    custo_estimado: number; //custo estimado da viagem
    motorista: Motorista; //id do motorista
}