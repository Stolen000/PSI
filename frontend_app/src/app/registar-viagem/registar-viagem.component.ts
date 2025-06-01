import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViagemService } from '../services/viagem.service';
import { Viagem } from '../viagem';
import { TransportPricesService } from '../services/transport-prices.service';
import { TurnoService } from '../services/turno.service';
import { TaxiService } from '../services/taxi.service';
import { LocalizationService } from '../services/localization.service';
import { MotoristaService } from '../services/motorista.service';
import { Motorista } from '../motorista';
import { Pedido_Viagem } from '../pedido-viagem';
import { PedidosViagemService } from '../services/pedidos-viagem.service';
import { Morada } from '../morada';
import { CodigoPostalService } from '../services/codigo-postal.service';

@Component({
  selector: 'app-registar-viagem',
  templateUrl: './registar-viagem.component.html',
})

export class RegistarViagemComponent implements OnInit {

  viagens: Viagem[] = [];
  motorista_id: string = "";
  viagemAtual?: Viagem; //?
  pedidoAtual?: Pedido_Viagem;
  selectedViagem?: Viagem;
  viagemEmCurso: boolean = false;
  precoViagemSelecionada?: number;
  distanciaViagemSelecionada?: number;
  math: any;
  nome_motorista : String = "";
  pedidos: Pedido_Viagem[] = [];
  

  viagensEmCurso: Viagem[] = [];
  viagensTerminadas: Viagem[] = [];


  //new Stuff
  usarLocalizacao: boolean = false;
  codigosPostais: any[] = [];
  codigoPostalDestinoNaoEncontrado: boolean = false;
  localidadeDestino: string = '';
  moradaDestino: Morada = {
    rua: '',
    numero_porta: 0,
    codigo_postal: '',
    localidade: ''
  }; //vai ter o codigo postal e o num de porta

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService,
    private transpPriceService: TransportPricesService,
    private turnoService: TurnoService,
    private taxiService: TaxiService,
    private localizationService: LocalizationService,
    private motoristaService: MotoristaService,
    private pedidosService: PedidosViagemService,
    private codigoPostalService: CodigoPostalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.motorista_id = id;
      console.log("Motorista ID obtido do path:", this.motorista_id);
      this.getNomeMotorista(this.motorista_id);
      this.getViagens();
    }
    this.codigoPostalService.getCodigosPostais().subscribe(data => {
      this.codigosPostais = data;
    });
  }
  getNomeMotorista(motorista_id: string): void {
    this.motoristaService.getMotoristaById(motorista_id).subscribe(motorista => this.nome_motorista = motorista.name);
  }

  getNomeCliente(pedido_id: string): string {
    const pedido = this.pedidos.find(p => p._id === pedido_id);
    return pedido ? pedido.cliente_nome : 'Cliente não encontrado';
  }


  getPedidos(): void {
    this.pedidosService.getPedidos().subscribe(todosPedidos => {
      const idsViagens = this.viagens.map(v => v.pedido_id);
      this.pedidos = todosPedidos.filter(p => idsViagens.includes(p._id));
      //console.log(this.pedidos);
    });
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


  ngOnSelect(): void {
  }
  
  onSelect(viagem: Viagem): void {
    this.selectedViagem = viagem;
    this.pedidoAtual = this.pedidos.find(p => p._id === viagem.pedido_id);


    if (viagem.inicio_viagem && viagem.fim_viagem) {
      this.calcularPrecoViagem();
      this.calcularDistancia();
    }
  }

  //funcao quando clico no botao começar viagem
  //coloca o tempo Agora
  //no atributo inicioViagem
  //dar um update da viagem no backend
iniciarViagem(): void {
  this.viagemEmCurso = true;

  if (this.selectedViagem) {
    const inicio_viagem = new Date();
    const pedidoId = this.selectedViagem.pedido_id;
    // Atualizar início da viagem
    this.viagemService.atualizarViagemInicio(inicio_viagem, this.selectedViagem)
      .subscribe(() => {
        console.log("Viagem atualizada com sucesso:", this.selectedViagem);
        this.getViagens();

        // Iniciar o pedido associado à viagem
        // ou .pedido_id, conforme o nome correto
        if (pedidoId) {
          this.pedidosService.iniciarPedidoViagem(pedidoId).subscribe(() => {
            console.log(`Pedido ${pedidoId} iniciado com sucesso`);
          });
        }
      });
  }
}

async finalizarViagem(): Promise<void> {
  if (!this.selectedViagem) return;

  const viagem = this.selectedViagem;
  const fim_viagem = new Date();
  
  this.viagemService.atualizarViagemFim(fim_viagem, viagem).subscribe(async () => {
    viagem.fim_viagem = fim_viagem;
    this.getViagens();

    // Terminar o pedido associado à viagem, se existir
    try {
      // Calcular custo
      const custo = await this.calcularCustoViagem(viagem);

      // Encontrar o pedido associado pela viagem.pedido_id
      const pedido = this.pedidos.find(p => p._id === viagem.pedido_id);
      if (pedido) {
        pedido.custo_final = custo;
        pedido.estado = 'terminada';

        // Atualizar o pedido com o custo final
        this.pedidosService.updatePedido(pedido).subscribe({
          next: () => {
            console.log(`Pedido ${pedido._id} atualizado com custo final: €${custo}`);
          },
          error: (err) => {
            console.error("Erro ao atualizar o pedido:", err);
          }
        });
      } else {
        console.warn("Pedido não encontrado para a viagem:", viagem);
      }

      console.log("Custo da viagem:", custo);
    } catch (erro) {
      console.error("Erro ao calcular custo:", erro);
    }

    this.viagemEmCurso = false;
  });
}

  getViagens(): void {
    this.viagemService.getViagens().subscribe(todasViagens => {
      this.viagens = todasViagens.filter(
        viagem => viagem.motorista_id === this.motorista_id
      ).sort((a, b) => {
        let timeA = a.inicio_viagem ? new Date(a.inicio_viagem).getTime() : 0;
        let timeB = b.inicio_viagem ? new Date(b.inicio_viagem).getTime() : 0;
        console.log("Time A " + timeA);
        console.log("Time B " + timeB);
        return timeB - timeA;
      });

      // Atualiza estado da viagem em curso
      const viagemEmCursoObj = this.viagens.find(
        viagem => viagem.inicio_viagem && !viagem.fim_viagem
      );

      // Atualiza estado da viagem em curso
      this.viagemEmCurso = !!viagemEmCursoObj;
      //Popular os parametros do forms com os da viagem!!
      // Se houver uma viagem em curso, popula os parâmetros do formulário
      if (viagemEmCursoObj) {
        this.localizationService.getMoradaPorCoordenadas(
          viagemEmCursoObj.coordenadas_destino.lat,viagemEmCursoObj.coordenadas_destino.lon
        ).subscribe(morada => {
            if (morada) {
              this.moradaDestino = morada;
              console.log('Morada Destino obtida:', morada);
              if (this.moradaDestino?.codigo_postal && this.moradaDestino.codigo_postal.length === 8) {
                setTimeout(() => {
                  this.buscarLocalidadeDestino(this.moradaDestino.codigo_postal);
                  console.log("Entrei aqui no guardar coordenadas")
                });
              }
          } else {
            console.error('Erro ao obter morada de origem.');
          }
        });
      }
      this.getPedidos();
      console.log(this.pedidos);
      this.viagensEmCurso = this.viagens.filter(v => !v.fim_viagem);
      this.viagensTerminadas = this.viagens.filter(v => v.fim_viagem);
    });
  }



  calcularDistancia(){
        if (!this.selectedViagem ) {
      console.warn('Viagem selecionada ou datas de início/fim em falta.');
      return ;
    }
    this.distanciaViagemSelecionada = (Math.round((this.localizationService.calcularDistanciaKm(this.selectedViagem?.coordenadas_origem.lat, this.selectedViagem?.coordenadas_origem.lon,
                                                                  this.selectedViagem?.coordenadas_destino.lat, this.selectedViagem?.coordenadas_destino.lon)) * 100) / 100);
  }


  //preciso de calcular o preço da viagem com base nas coordenadas
  calcularPrecoViagem(){
    if (!this.selectedViagem || !this.selectedViagem.inicio_viagem || !this.selectedViagem.fim_viagem) {
      console.warn('Viagem selecionada ou datas de início/fim em falta.');
      return ;
    }

    const begin = new Date(this.selectedViagem.inicio_viagem);
    const end = new Date(this.selectedViagem.fim_viagem);
    if (!begin || !end) {
      console.warn('Datas de início ou fim em falta.');
      return;
    }
    console.log("viagem:", this.selectedViagem);
    this.turnoService.getTurnoById(this.selectedViagem.turno_id).subscribe(turno => {
      if (!turno) return;
      console.log("Turno obtido:", turno);

      this.taxiService.getTaxi(turno.taxi_id).subscribe(taxi => {
        if (!taxi) return;
        console.log("Taxi obtido:", taxi);

        const conforto = taxi.nivel_de_conforto;

        this.transpPriceService.getPrices().subscribe(price => {
          const startMin = begin.getHours() * 60 + begin.getMinutes();
          let endMin = end.getHours() * 60 + end.getMinutes();

          if (end <= begin) endMin += 24 * 60;

          const pricePerMinute = conforto === 'basic'
            ? parseFloat(price.basic_price)
            : parseFloat(price.luxurious_price);

          const taxRate = parseFloat(price.nocturne_tax) / 100;
          let total = 0;

          for (let i = startMin; i < endMin; i++) {
            const hour = Math.floor(i % 1440 / 60);
            const isNight = hour >= 21 || hour < 6;
            total += pricePerMinute * (isNight ? 1 + taxRate : 1);
          }

          const custo_estimado = Math.round(total * 100) / 100;
          this.precoViagemSelecionada = custo_estimado;
          console.log(`Custo estimado: €${custo_estimado}`);
          // aqui podes guardar ou apresentar o custo_estimado
        });
      });
    });
  }

  calcularCustoViagem(viagem?: Viagem): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!viagem || !viagem.inicio_viagem || !viagem.fim_viagem) {
      console.log(viagem, viagem?.inicio_viagem, viagem?.fim_viagem);
      console.warn('Viagem ou datas de início/fim em falta.');
      return reject('Dados da viagem inválidos');
    }

    const begin = new Date(viagem.inicio_viagem);
    const end = new Date(viagem.fim_viagem);
    if (!begin || !end) {
      console.warn('Datas de início ou fim inválidas.');
      return reject('Datas inválidas');
    }

    this.turnoService.getTurnoById(viagem.turno_id).subscribe(turno => {
      if (!turno) return reject('Turno não encontrado');

      this.taxiService.getTaxi(turno.taxi_id).subscribe(taxi => {
        if (!taxi) return reject('Táxi não encontrado');

        const conforto = taxi.nivel_de_conforto;

        this.transpPriceService.getPrices().subscribe(price => {
          const startMin = begin.getHours() * 60 + begin.getMinutes();
          let endMin = end.getHours() * 60 + end.getMinutes();
          if (end <= begin) endMin += 24 * 60;

          const pricePerMinute = conforto === 'basic'
            ? parseFloat(price.basic_price)
            : parseFloat(price.luxurious_price);

          const taxRate = parseFloat(price.nocturne_tax) / 100;
          let total = 0;

          for (let i = startMin; i < endMin; i++) {
            const hour = Math.floor(i % 1440 / 60);
            const isNight = hour >= 21 || hour < 6;
            total += pricePerMinute * (isNight ? 1 + taxRate : 1);
          }

          const custo_estimado = Math.round(total * 100) / 100;
          resolve(custo_estimado);
        }, () => reject('Erro ao obter preços'));
      }, () => reject('Erro ao obter táxi'));
    }, () => reject('Erro ao obter turno'));
  });
}

  buscarMoradaAtual(): void {
    this.localizationService.getLocalizacaoAtual().then(
      (coords) => {
        let coordenadas = coords;
        this.usarLocalizacao = true; // <- aqui você define que o utilizador aceitou
        console.log('Coordenadas de origem obtidas:', coords);

        // Chamar o reverse geocoding com as coordenadas
        this.localizationService.getMoradaPorCoordenadas(coords.lat, coords.lon)
          .subscribe(morada => {
            if (morada) {
              this.moradaDestino = morada;
              console.log('Morada obtida:', morada);
              if (this.moradaDestino?.codigo_postal && this.moradaDestino.codigo_postal.length === 8) {
                setTimeout(() => {
                  this.buscarLocalidadeOrigem(this.moradaDestino.codigo_postal);
                });
              }


            } else {
              console.error('Erro ao obter morada de origem.');
            }
          });

      },
      (error) => {
        this.usarLocalizacao = false; // <- aqui define que o utilizador recusou
        console.error('Erro ao obter localização:', error);
        // Aqui você pode também mostrar uma mensagem ao utilizador, se quiser
      }
    );
  }

  usarLocalizacaoAtual(): void {  
    this.usarLocalizacao = true;
  }

  buscarLocalidadeOrigem(codigoPostal: string): void {
    console.log('A procurar localidade para:', `"${codigoPostal}"`);
    const resultado = this.codigosPostais.find(
      c => c.codigo_postal === codigoPostal
    );
      console.log("Localidade Encontrada:",resultado)
    if (resultado) {

      this.localidadeDestino = resultado.localidade;
      this.codigoPostalDestinoNaoEncontrado = false;
    } else {
      this.localidadeDestino = '';
      this.codigoPostalDestinoNaoEncontrado = true;
    }
  }
}