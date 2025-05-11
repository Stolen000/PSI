import { Component, OnInit } from '@angular/core';
import { Pedido_Viagem } from '../pedido-viagem';
import { PedidosViagemService } from '../services/pedidos-viagem.service';
import { HttpClient } from '@angular/common/http';
import { LocalizationService } from '../services/localization.service';
import { TurnoService } from '../services/turno.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-pedidos-motorista',
  templateUrl: './pedidos-motorista.component.html',
  styleUrls: ['./pedidos-motorista.component.css']
})
export class PedidosMotoristaComponent implements OnInit {
  pedidos: Pedido_Viagem[] = [];
  latitude: number = 38.756734;
  longitude: number = -9.155412;
  turnoAtivo: boolean = false;
  motoristaId: string = 'TESTE-ID'; // Coloca aqui como vais obter o ID do motorista


  constructor(private pedidoService: PedidosViagemService,
    private http: HttpClient,
    private localizationService: LocalizationService,
    private turnoService: TurnoService,
    private route: ActivatedRoute
  ) {}



ngOnInit(): void {

  const motoristaId = this.route.snapshot.paramMap.get('id');
  if (!motoristaId) {
    this.turnoAtivo = false;
    return;
  }

  this.motoristaId = motoristaId; 
  console.log(this.motoristaId);

  this.turnoService.getTurnoAtual(this.motoristaId).subscribe(turno => {
    console.log(turno)
    if (turno) {
      this.turnoAtivo = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
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
    } else {
      this.turnoAtivo = false;
    }
  });
}


getPedidos(): void {
  this.pedidoService.getPedidos().subscribe(pedidos => {
    this.pedidos = pedidos
      .filter(pedido => pedido.estado === 'pendente') // Filtra os pendentes
      .map(pedido => {
        const distancia = this.localizationService.calcularDistanciaKm(
          this.latitude,
          this.longitude,
          pedido.coordenadas_origem.lat,
          pedido.coordenadas_origem.lon
        );
        return { ...pedido, distancia_motorista: distancia };
      })
      .sort((a, b) => a.distancia_motorista - b.distancia_motorista); // Ordena pela distância crescente
  });
}



  

  pedidoSelecionado: Pedido_Viagem | null = null;

  selecionarPedido(pedido: Pedido_Viagem): void {
    //console.log(pedido);
    this.pedidoSelecionado = pedido;
  }

  aceitarPedido(): void {
    // Lógica para aceitar pedido será adicionada depois
    console.log('Pedido aceite:', this.pedidoSelecionado);
  }
}
