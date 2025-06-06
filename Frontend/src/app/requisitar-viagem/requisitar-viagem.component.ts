import { Component, OnInit } from '@angular/core';
import { Pedido_Viagem } from '../pedido-viagem';
import { PedidosViagemService } from '../services/pedidos-viagem.service';
import { CodigoPostalService } from '../services/codigo-postal.service';
import { LocalizationService } from '../services/localization.service';
import { TransportPricesService } from '../services/transport-prices.service';
import { ViagemService } from '../services/viagem.service';
import { TurnoService } from '../services/turno.service';
import { TaxiService } from '../services/taxi.service';

import { Taxi } from '../taxi';
import { Morada } from '../morada';
import { forkJoin, map, Observable } from 'rxjs';
import { Turno } from '../turno';
import { MotoristaService } from '../services/motorista.service';
import { Motorista } from '../motorista';




@Component({
  selector: 'app-requisitar-viagem',
  templateUrl: './requisitar-viagem.component.html',
  standalone: false,
  styleUrls: ['./requisitar-viagem.component.css']
})


//ver alguns tipos
//tentar aceder ah localizacao de cliente e se sim guardar a coordenadas e retirar de la a morada
//e fazer o resto igual

//senao, ja estah a ser feito...

export class RequisitarViagemComponent implements OnInit {

  pedidos: Pedido_Viagem[] = [];
  codigosPostais: any[] = [];
  localidadeOrigem: string = '';

  codigoPostalOrigemNaoEncontrado: boolean = false;
  codigoPostalDestinoNaoEncontrado: boolean = false;
  usarLocalizacao: boolean = false;
  coordenadasOrigem: { lat: number; lon: number } | null = null;
  turnoSelecionado?: Turno;

  taxiDetalhesMap: { [taxiId: string]: Taxi } = {};


  moradaOrigem: Morada = {
    rua: '',
    numero_porta: 0,
    codigo_postal: '',
    localidade: ''
  };
  motoristas: Motorista[] = [];
  
  selectedPedido?: Pedido_Viagem;

  coordenadasSelecionadas: { lat: number; lon: number } | null = null;
  moradaDestino: Morada = {
    rua: '',
    numero_porta: 0,
    codigo_postal: '',
    localidade: ''
  };
  localidadeDestino: string = '';

  constructor(
    private pedidosViagemService: PedidosViagemService,
    private codigoPostalService: CodigoPostalService,
    private localizationService: LocalizationService,
    private transpPriceService : TransportPricesService,
    private viagemService: ViagemService,
    private turnoService: TurnoService,
    private motoristaService: MotoristaService,
    private taxiService: TaxiService
  ) {}

  ngOnInit(): void {
    this.getPedidos();
    this.codigoPostalService.getCodigosPostais().subscribe(data => {
      this.codigosPostais = data;
      this.criarAutoMoradaOrigem();
    });
  }

  usarLocalizacaoAtual(): void {  
    this.usarLocalizacao = true;
  }

  usarLocalizacaoManual(): void {
    this.usarLocalizacao = false;
  }

  criarAutoMoradaOrigem(): void {
    this.localizationService.getLocalizacaoAtual().then(
      (coords) => {
        this.coordenadasOrigem = coords;
        this.usarLocalizacao = true; // <- aqui você define que o utilizador aceitou
        console.log('Coordenadas de origem obtidas:', coords);

        // Chamar o reverse geocoding com as coordenadas
        this.localizationService.getMoradaPorCoordenadas(coords.lat, coords.lon)
          .subscribe(morada => {
            if (morada) {
              this.moradaOrigem = morada;
              console.log('Morada obtida:', morada);
              if (this.moradaOrigem?.codigo_postal && this.moradaOrigem.codigo_postal.length === 8) {
                setTimeout(() => {
                  this.buscarLocalidadeOrigem(this.moradaOrigem.codigo_postal);
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

  moradaConfirmada: Boolean = false;
  moradaNaoConfirmada: Boolean = false;
  criarMoradaOrigemManual(
    ruaOrigem: string,
    numeroPortaOrigem: number,
    codigoPostalOrigem: string,
    localidadeOrigem: string
  ): void {
    if (
      !ruaOrigem || ruaOrigem.trim() === '' ||
      numeroPortaOrigem == null || numeroPortaOrigem < 0 ||
      !codigoPostalOrigem || codigoPostalOrigem.trim() === '' ||
      !localidadeOrigem || localidadeOrigem.trim() === ''
    ) {
      console.warn('Algum dos campos obrigatórios está vazio ou inválido.');
      console.log("RUA",ruaOrigem,"PORTA",numeroPortaOrigem,"codigoPOSTAL",codigoPostalOrigem,"LOCALIDADE",localidadeOrigem)
      this.moradaConfirmada = false;
      this.moradaNaoConfirmada = true;
      setTimeout(() => {
        this.moradaNaoConfirmada = false;
        console.log('Timer disparado!');
      }, 5000);
      return;
    }

    const morada_origem: Morada = {
      rua: ruaOrigem,
      numero_porta: numeroPortaOrigem,
      codigo_postal: codigoPostalOrigem,
      localidade: localidadeOrigem
    };

    this.moradaOrigem = morada_origem;
    console.log(morada_origem);
    this.moradaConfirmada = true;
    this.moradaNaoConfirmada = false;
    setTimeout(() => {
      this.moradaConfirmada = false;
      console.log('Timer disparado!');
    }, 5000);
  }

  
  onSelect(pedido: Pedido_Viagem): void {
      console.log("Pedido selecionado:", pedido);
    this.selectedPedido = pedido;
  }

  getPedidos(): void {
    this.pedidosViagemService.getPedidos().subscribe(pedidos => {
      this.pedidos = pedidos;

      const taxiIdsUnicos = Array.from(new Set(
        pedidos
          .filter(p => p.taxi)   // só pedidos que têm taxi atribuído
          .map(p => p.taxi!)
      ));

      // Para cada taxiId único, pega os dados do taxi (se ainda não estiver no mapa)
      taxiIdsUnicos.forEach(taxiId => {
        if (!this.taxiDetalhesMap[taxiId]) {
          this.taxiService.getTaxi(taxiId).subscribe(taxi => {
            this.taxiDetalhesMap[taxiId] = taxi;
          });
        }
      });
      
      this.pedidos.forEach(element => {
        if(element.estado !== 'pendente' ){      
          this.motoristaService.getMotoristaById(element.motorista)
          .subscribe(motorista => this.motoristas.push(motorista));}

      });
    });
  }

  getMotoristaNome(id: string): string | undefined {

    const motorista = this.motoristas.find(element => element._id === id);
    //console.log(motorista?.name);
    return motorista?.name;
  }



  deletePedido(pedido: Pedido_Viagem): void {
    this.pedidosViagemService.deletePedido(pedido._id!)
      .subscribe(() => {
        this.pedidos = this.pedidos.filter(p => p !== pedido);
      });
  }

  aceitarPedido(pedido: Pedido_Viagem): void {
    //criar a viagem com estes dados
    //manda la para a bd

    //criar viagem com os atributos do pedido


    /*
      nif do cliente
      coordenadas de origem
      coordenadas de destino
      numero de pessoas
      motorista id 
      taxi id
    */

    //sacar turno pelo turno id
    //atualizar numero de viagens do turno
    // sacar turno pelo turno id e atualizar numero de viagens do turno
    this.turnoService.incrementaTurno(pedido.turno_id)
      .subscribe({
        next: (turno) => {  
          this.turnoSelecionado = turno;
          console.log(turno);

          if (!this.turnoSelecionado) {
            console.log("Entrei aqui");
            return;
          }
          console.log(pedido)
          // atualizar o numero de viagens do turno
          const viagem = {
            motorista_id: this.turnoSelecionado.motorista_id,
            sequencia: this.turnoSelecionado.viagens_realizadas,
            turno_id: pedido.turno_id,
            nif_cliente: pedido.cliente_nif,
            coordenadas_origem: pedido.coordenadas_origem,
            coordenadas_destino: pedido.coordenadas_destino,   
            inicio_viagem: null,
            fim_viagem: null,
            num_pessoas: pedido.numero_pessoas,
            pedido_id: pedido._id
          };
          console.log("Dentro do requisitar viagem a ver a viagem criada:", viagem.nif_cliente);
          console.log("Dentro do requisitar viagem a ver a viagem criada 2:", pedido.cliente_nif);
          // utilizar esse para o numero de sequencia desta viagem
          this.viagemService.criarViagem(viagem)
            .subscribe(response => {
              console.log("Pedido de viagem recebido do backend:", response);
            });

          // apagar o pedido a seguir (coloque aqui se tiver lógica específica)
          this.aguadarMotorista(pedido);

        }
      });
  }

  aguadarMotorista(pedido: Pedido_Viagem): void{
        console.log("Pedido no aguardar motorista: ",pedido)
        this.pedidosViagemService.aguardarMotorista(pedido._id!)
      .subscribe(() => {
        this.getPedidos();

        //this.pedidos = this.pedidos.filter(p => p !== pedido);
      });
  }

  recusarPedido(pedido: Pedido_Viagem): void {
    //alterar os campos para
    //estado pendente
    //retirar valores de 
      //taxi id
      //motorista id
      //distancia ao motorista
      console.log(pedido.motorista);
      pedido.motoristas_rejeitados.push(pedido.motorista);
      pedido.distancia_motorista = -1;
      pedido.estado = 'pendente';
      pedido.taxi = '';
      pedido.motorista = '';

      //fazer o update para a db
      this.pedidosViagemService.updatePedido(pedido)
        .subscribe(() => {
          console.log('Pedido recusado e atualizado com sucesso.');
        });
  }



    verificarCodigoPostal(valor: string) {
      if (valor && valor.length === 8) {
        this.buscarLocalidadeOrigem(valor);
      }
    }



    

  buscarLocalidadeOrigem(codigoPostal: string): void {
    console.log('A procurar localidade para:', `"${codigoPostal}"`);
    const resultado = this.codigosPostais.find(
      c => c.codigo_postal === codigoPostal
    );
      console.log("Localidade Encontrada:",resultado)
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
      numeroIF: number,
      genero: string,
      ruaDestino: string,
      numeroPortaDestino: number,
      codigoPostalDestino: string,
      localidadeDestino: string,
      conforto: string,
      numPessoas: number
    ): void {
      if (
        !nome || !numeroIF || !genero ||
        !ruaDestino || !numeroPortaDestino || !codigoPostalDestino || !localidadeDestino ||
        !conforto || !numPessoas ||
        this.codigoPostalOrigemNaoEncontrado || this.codigoPostalDestinoNaoEncontrado
      ) {
        alert('Por favor preencha todos os campos corretamente e valide os códigos postais.');
        return;
      }

      //se usarLocalizao estah a true
      //sacar coordenadas
      //sacar morada origem atraves das coordenadas
      //else
      //sacar como estah agora

      const morada_destino: Morada = {
        rua: ruaDestino,
        numero_porta: numeroPortaDestino,
        codigo_postal: codigoPostalDestino,
        localidade: localidadeDestino
      };

      if(numPessoas < 1){
        console.log("Numero de Pessoas inválido");
        return;
      }

      forkJoin({
        coords_origem: this.localizationService.getCoordenadasDaMorada(this.moradaOrigem),
        coords_destino: this.localizationService.getCoordenadasDaMorada(morada_destino)
      }).subscribe(({ coords_origem, coords_destino }) => {
        if (!coords_origem || !coords_destino) {
          console.log(coords_origem);
          console.log(coords_destino);
          console.error('Erro ao obter coordenadas.');
          return;
        }

        const distancia_viagem = this.localizationService.calcularDistanciaKm(
          coords_origem.lat, coords_origem.lon,
          coords_destino.lat, coords_destino.lon
        );

        const tempo_viagem = this.localizationService.calcularTempoEstimado(distancia_viagem);

        const now = new Date();
        const end = new Date(now.getTime() + tempo_viagem * 60 * 1000);

        this.transpPriceService.getPrices().subscribe(price => {
          const startMin = now.getHours() * 60 + now.getMinutes();
          let endMin = end.getHours() * 60 + end.getMinutes();

          if (end <= now) endMin += 24 * 60;

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

          const pedidoViagem = {
            cliente_nome: nome,
            cliente_nif: numeroIF,
            cliente_genero: genero,
            morada_origem: this.moradaOrigem,
            coordenadas_origem: coords_origem,
            morada_destino: morada_destino,
            coordenadas_destino: coords_destino,
            nivel_conforto: conforto,
            numero_pessoas: numPessoas,
            estado: 'pendente',
            distancia_motorista: distancia_viagem,
            tempo_estimado: tempo_viagem,
            custo_estimado: custo_estimado,
          };

          console.log('Pedido de viagem:', pedidoViagem);

          this.pedidosViagemService.addPedido(pedidoViagem as Pedido_Viagem)
            .subscribe(response => {
              console.log("Pedido de viagem recebido do backend:", response);
              this.pedidos = response.pedidos;
            });
        });
      });
    }








  guardarCoordenadas(coords: { lat: number; lon: number }) {
    console.log('Recebido do mapa:', coords);
    this.coordenadasSelecionadas = coords;

    // Exemplo: chamar reverse geocoding automaticamente

    this.localizationService.getMoradaPorCoordenadas(this.coordenadasSelecionadas.lat,this.coordenadasSelecionadas.lon)
    .subscribe(morada => {
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



}


