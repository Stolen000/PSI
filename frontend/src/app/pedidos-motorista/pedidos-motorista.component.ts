import { Component, OnInit } from '@angular/core';
import { Pedido_Viagem } from '../pedido-viagem';
import { PedidosViagemService } from '../services/pedidos-viagem.service';
import { HttpClient } from '@angular/common/http';
import { LocalizationService } from '../services/localization.service';
import { TurnoService } from '../services/turno.service';
import { ActivatedRoute } from '@angular/router';
import { Taxi } from '../taxi';
import { TaxiService } from '../services/taxi.service';


@Component({
  selector: 'app-pedidos-motorista',
  templateUrl: './pedidos-motorista.component.html',
  styleUrls: ['./pedidos-motorista.component.css']
})
export class PedidosMotoristaComponent implements OnInit {
  pedidos: Pedido_Viagem[] = [];
  pedidos_aceite: Pedido_Viagem[] = []
  latitude: number = 38.756734;
  longitude: number = -9.155412;
  turnoAtivo: boolean = false;
  motoristaId: string = 'TESTE-ID'; // Coloca aqui como vais obter o ID do motorista
  fim_de_turno?: Date;
  taxi?: Taxi;
  turno_id?: String;




  constructor(private pedidoService: PedidosViagemService,
    private http: HttpClient,
    private localizationService: LocalizationService,
    private turnoService: TurnoService,
    private route: ActivatedRoute,
    private taxiService: TaxiService
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
      this.turno_id=turno._id;
      this.fim_de_turno =  new Date(turno.periodo.fim);
      this.taxiService.getTaxi(turno.taxi_id).subscribe(taxi => {
        this.taxi = taxi;
        console.log('Taxi recebido:', this.taxi);
      });

      console.log(this.fim_de_turno);
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
  const agora = new Date();

  this.pedidoService.getPedidos().subscribe(pedidos => {
    // Filtra e processa os pedidos
    console.log('motoristaId:', this.motoristaId, typeof this.motoristaId);

    this.pedidos = pedidos
      .filter(pedido => {
        console.log(pedido)
        if (pedido.nivel_conforto !== this.taxi?.nivel_de_conforto ||
  (Array.isArray(pedido.motoristas_rejeitados) &&
   pedido.motoristas_rejeitados.includes(this.motoristaId))
        ) {
          return false;
        }

        // Verifica se o pedido está aceito
        if (pedido.estado === 'aceite' && !this.pedidos_aceite.some(p => p._id === pedido._id)) {
          // Se o pedido não estiver na lista de aceites, adiciona
          this.pedidos_aceite.push(pedido);
          return false;  // Exclui da lista de pendentes
        }

        const distancia = this.localizationService.calcularDistanciaKm(
          this.latitude,
          this.longitude,
          pedido.coordenadas_origem.lat,
          pedido.coordenadas_origem.lon
        );

        const tempoAteCliente = distancia * 4; // minutos
        const tempoTotalEstimado = tempoAteCliente + pedido.tempo_estimado;

        const fimPrevisto = new Date(agora.getTime() + tempoTotalEstimado * 60 * 1000);
        console.log(fimPrevisto)

        if (!this.fim_de_turno) return false;
        return fimPrevisto <= this.fim_de_turno;
      })
      .map(pedido => {
        const distancia = this.localizationService.calcularDistanciaKm(
          this.latitude,
          this.longitude,
          pedido.coordenadas_origem.lat,
          pedido.coordenadas_origem.lon
        );
        return { ...pedido, distancia_motorista: distancia };
      })
      .sort((a, b) => a.distancia_motorista - b.distancia_motorista);
  });
}

  pedidoSelecionado: Pedido_Viagem | null = null;

  selecionarPedido(pedido: Pedido_Viagem): void {
    //console.log(pedido);
    this.pedidoSelecionado = pedido;
  }

aceitarPedido(): void {
  if (this.pedidoSelecionado && this.pedidoSelecionado._id && this.taxi) {
    const pedidoId = this.pedidoSelecionado._id;
    const motoristaId = this.motoristaId;
    const taxiId = this.taxi._id;  // Obtém o ID do taxi
    const distanciaMotorista = Math.round(this.pedidoSelecionado.distancia_motorista * 100) / 100;  // Distância já calculada
    const turno_id = this.turno_id;
    if(!turno_id){return}

    // Chama a função aceitarPedido no serviço passando os dados
    this.pedidoService.aceitarPedido(pedidoId, motoristaId, taxiId, distanciaMotorista, turno_id)
      .subscribe(
        (response) => {
          console.log('Pedido aceito com sucesso:', response);
          
          // Remove da lista de pedidos pendentes
          this.pedidos = this.pedidos.filter(pedido => pedido._id !== pedidoId);
          
          // Adiciona à lista de pedidos aceites
          if (this.pedidoSelecionado) {
            this.pedidos_aceite.push(this.pedidoSelecionado);
            
            // Ordena a lista de pedidos aceites pela distância de forma crescente
            this.pedidos_aceite.sort((a, b) => a.distancia_motorista - b.distancia_motorista);
          }
          
          // Limpa a seleção do pedido
          this.pedidoSelecionado = null;
        },
        (error) => {
          console.error('Erro ao aceitar o pedido:', error);
          this.getPedidos();  // Atualiza a lista de pedidos
        }
      );
  } else {
    console.log('Nenhum pedido selecionado, ID do motorista ou ID do taxi inválido');
    this.getPedidos();  // Atualiza a lista de pedidos
  }
}
}
