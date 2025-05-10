import { Component, OnInit } from '@angular/core';
import { Pedido_Viagem } from '../pedido-viagem';
import { PedidosViagemService } from '../services/pedidos-viagem.service';
import { CodigoPostalService } from '../services/codigo-postal.service';
import { LocalizationService } from '../services/localization.service';
import { NgForm } from '@angular/forms';
import { Morada } from '../morada';
import { forkJoin } from 'rxjs';




@Component({
  selector: 'app-requisitar-viagem',
  templateUrl: './requisitar-viagem.component.html',
  standalone: false,
  styleUrls: ['./requisitar-viagem.component.css']
})


export class RequisitarViagemComponent implements OnInit {

  pedidos: Pedido_Viagem[] = [];
  codigosPostais: any[] = [];
  localidadeOrigem: string = '';
  localidadeDestino: string = '';
  codigoPostalOrigemNaoEncontrado: boolean = false;
  codigoPostalDestinoNaoEncontrado: boolean = false;

  selectedPedido?: Pedido_Viagem;

  constructor(
    private pedidosViagemService: PedidosViagemService,
    private codigoPostalService: CodigoPostalService,
    private localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    this.getPedidos();

    this.codigoPostalService.getCodigosPostais().subscribe(data => {
      this.codigosPostais = data;
    });
  }

  
  onSelect(pedido: Pedido_Viagem): void {
    this.selectedPedido = pedido;
  }

  getPedidos(): void {
    this.pedidosViagemService.getPedidos()
      .subscribe(pedidos => this.pedidos = pedidos);
  }

  deletePedido(pedido: Pedido_Viagem): void {
    this.pedidosViagemService.deletePedido(pedido._id!)
      .subscribe(() => {
        this.pedidos = this.pedidos.filter(p => p !== pedido);
      });
  }

  buscarLocalidadeOrigem(codigoPostal: string): void {
    const resultado = this.codigosPostais.find(
      c => c.codigo_postal === codigoPostal
    );

    if (resultado) {
      this.localidadeOrigem = resultado.localidade;
      this.codigoPostalOrigemNaoEncontrado = false;
    } else {
      this.localidadeOrigem = '';
      this.codigoPostalOrigemNaoEncontrado = true;
    }
  }

  buscarLocalidadeDestino(codigoPostal: string): void {
    const resultado = this.codigosPostais.find(
      c => c.codigo_postal === codigoPostal
    );

    if (resultado) {
      this.localidadeDestino = resultado.localidade;
      this.codigoPostalDestinoNaoEncontrado = false;
    } else {
      this.localidadeDestino = '';
      this.codigoPostalDestinoNaoEncontrado = true;
    }
  }


  //ver se pode sacar as coordenadas pela localizacao do dispositivo
    //se sim criar a morada com elas
    //se nao eh suposto preencher os campos da morada
      //e sacar as coordenadas dai
  createPedidoViagem(
    nome: string,
    numeroIF: string,
    genero: string,
    ruaOrigem: string,
    numeroPortaOrigem: number,
    codigoPostalOrigem: string,
    localidadeOrigem: string,
    ruaDestino: string,
    numeroPortaDestino: number,
    codigoPostalDestino: string,
    localidadeDestino: string,
    conforto: string,
    numPessoas: string
  ): void {
    if (
      !nome || !numeroIF || !genero ||
      !ruaOrigem || !numeroPortaOrigem || !codigoPostalOrigem || !localidadeOrigem ||
      !ruaDestino || !numeroPortaDestino || !codigoPostalDestino || !localidadeDestino ||
      !conforto || !numPessoas ||
      this.codigoPostalOrigemNaoEncontrado || this.codigoPostalDestinoNaoEncontrado
    ) {
      alert('Por favor preencha todos os campos corretamente e valide os códigos postais.');
      return;
    }
  
    const morada_origem: Morada = {
    rua: ruaOrigem,
    numero_porta: numeroPortaOrigem,
    codigo_postal: codigoPostalOrigem,
    localidade: localidadeOrigem
    };

    const morada_destino: Morada = {
      rua: ruaDestino,
      numero_porta: numeroPortaDestino,
      codigo_postal: codigoPostalDestino,
      localidade: localidadeDestino
    };

  forkJoin({
    origem: this.localizationService.getCoordenadasDaMorada(morada_origem),
    destino: this.localizationService.getCoordenadasDaMorada(morada_destino)
  }).subscribe(({ origem, destino }) => {
    if (!origem || !destino) {
      console.error('Erro ao obter coordenadas.');
      return;
    }

    const pedidoViagem = {
      cliente_nome: nome,
      cliente_nif: numeroIF,
      cliente_genero: genero,
      morada_origem,
      coordenadas_origem: origem,
      morada_destino,
      coordenadas_destino: destino,
      nivel_conforto: conforto,
      numero_pessoas: numPessoas,
      estado: 'pendente'
    };

    console.log('Pedido de viagem:', pedidoViagem);

    this.pedidosViagemService.addPedido(pedidoViagem as Pedido_Viagem)
      .subscribe(response => {
        console.log("Pedido de viagem recebido do backend:", response);
        this.pedidos = response.pedidos;
      });
  });
  }
}

