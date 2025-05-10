import { Component, OnInit } from '@angular/core';
import { Pedido_Viagem } from '../pedido-viagem';
import { PedidosViagemService } from '../services/pedidos-viagem.service';

@Component({
  selector: 'app-pedidos-motorista',
  templateUrl: './pedidos-motorista.component.html',
  styleUrls: ['./pedidos-motorista.component.css']
})
export class PedidosMotoristaComponent implements OnInit {
  pedidos: Pedido_Viagem[] = [];
  latitude: number = 38.756734;
  longitude: number = -9.155412;

  constructor(private pedidoService: PedidosViagemService) {}

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log("Coordenadas atuais:", this.latitude, this.longitude);
          this.getPedidos();
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          this.getPedidos();
        }
      );
    } else {
      console.error('Geolocation não é suportado neste browser.');
      this.getPedidos();
    }
  }

  getPedidos(): void {
    this.pedidoService.getPedidos().subscribe(pedidos => this.pedidos = pedidos);
  }

  pedidoSelecionado: Pedido_Viagem | null = null;

  selecionarPedido(pedido: Pedido_Viagem): void {
    this.pedidoSelecionado = pedido;
  }

  aceitarPedido(): void {
    // Lógica para aceitar pedido será adicionada depois
    console.log('Pedido aceite:', this.pedidoSelecionado);
  }
}
