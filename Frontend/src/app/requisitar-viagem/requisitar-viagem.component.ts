import { Component, OnInit } from '@angular/core';
import { Pedido_Viagem } from '../pedido-viagem';
import { PedidosViagemService } from '../services/pedidos-viagem.service';


@Component({
  selector: 'app-requisitar-viagem',
  templateUrl: './requisitar-viagem.component.html',
  standalone: false,
  styleUrls: ['./requisitar-viagem.component.css']
})


export class RequisitarViagemComponent {

  
  pedidos: Pedido_Viagem[] = [];

  selectedPedido?: Pedido_Viagem;
    constructor( private pedidosViagemService: PedidosViagemService ) {}

    ngOnInit(): void {
      this.getPedidos(); 
    }

  //registar um pedido com base nos atributos recebidos
    //envia lo para a db com o service 
  createPedidoViagem(nome: string, 
                      numeroIF: string, 
                      genre: string, 
                      origem: string, 
                      destino: string, 
                      confort: string, 
                      numPessoas: string): void {
    
    const pedidoViagem = {
      cliente_nome: nome,
      cliente_nif: numeroIF,
      cliente_genero: genre,
      morada_origem: origem,
      morada_destino: destino,
      nivel_conforto: confort,
      numero_pessoas: numPessoas,
      estado: 'pendente', 
    };
    
    console.log(pedidoViagem);

    this.pedidosViagemService.addPedido(pedidoViagem as Pedido_Viagem)
    .subscribe(response => {
      console.log("pedido de taxi recebido do backend:", response);
      // Atualiza a lista com os pedidos mais recentes devolvidos pelo backend
      this.pedidos = response.pedidos;
    });
    
  }

  
  //listar todos os pedidos
  getPedidos(): void {
    this.pedidosViagemService.getPedidos()
        .subscribe(pedidos => this.pedidos = pedidos);
  }

  onSelect(pedido: Pedido_Viagem): void {
    this.selectedPedido = pedido;
  }
  
  deletePedido(pedido: Pedido_Viagem): void {
    this.pedidosViagemService.deletePedido(pedido._id!)
        .subscribe(() => {
          this.pedidos = this.pedidos.filter(p => p !== pedido);
        });
  }



//um cliente vai usar esta tab para requisitar um taxi para uma viagem
//este requisitarviagem precisa de um tipo para guardar informaçoes essenciais da viagem
//objeto pedidoViagem
//precisa de guardar_
//  dados do cliente
        //nif
        //genero
    //localizacao atual
    //destino
    //nivel de conforto do taxi
    //numero de pessoas a ir
    //cliente pessoa morada taxi viagem



//User Story 6: Como cliente, quero poder pedir um táxi, para chegar mais depressa ao destino. Os critérios de aceitação são os seguintes:

//a) Deve ser possível preencher um formulário com os dados do cliente, da
//sua localização geográfica atual e do destino para onde pretende ir, bem
//como o nível de conforto do táxi e o número de pessoas que irão no táxi,
//com campos provenientes das entidades Cliente, Pessoa, Morada, Táxi,
//e Viagem;

//b) O NIF e género do cliente devem satisfazer as RIA 10 e 11, o nível de conforto do táxi deve estar conforme a RIA 16, e o número de pessoas que
//irá na viagem de táxi deve satisfazer a RIA 19;
//13 Mais precisamente, táxis que não estejam a ser usados em turnos que intersetem o turno
//em causa, conforme a RIA 8.

//c) Se o browser tiver acesso às coordenadas geográficas,14 a morada da localização atual deve ser obtida automaticamente.
//15 Caso contrário, a morada deve poder ser preenchida à mão (ex. o código postal) de tal forma
//que permita a sua correta tradução para coordenadas geográficas;15

//d) A morada de destino deve poder ser preenchida manualmente, contando
//que possa ser traduzida para coordenadas geográficas, ou então deve
//poder ser marcado um ponto num mapa;16

//e) Após o pedido de táxi, o cliente deve poder ficar a aguardar a resposta de
//algum motorista, ou eventualmente cancelar o pedido;

//f) Se um motorista responder, deve ser mostrado o seu nome, a distância a
//que está, o tempo estimado de chegada até ao cliente e o custo estimado
//da viagem até ao destino,17 e todos os detalhes do táxi.
//  O cliente deve, então, poder aceitar ou rejeitar esse motorista e táxi.

}
