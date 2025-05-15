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

@Component({
  selector: 'app-registar-viagem',
  templateUrl: './registar-viagem.component.html',
})

export class RegistarViagemComponent implements OnInit {
  viagens: Viagem[] = [];
  motorista_id: string = "";
  viagemAtual?: Viagem;
  selectedViagem?: Viagem;
  viagemEmCurso: boolean = false;
  precoViagemSelecionada?: number;
  distanciaViagemSelecionada?: number;
  math: any;
  nome_motorista : String = "";


  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService,
    private transpPriceService: TransportPricesService,
    private turnoService: TurnoService,
    private taxiService: TaxiService,
    private localizationService: LocalizationService,
    private motoristaService: MotoristaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.motorista_id = id;
      console.log("Motorista ID obtido do path:", this.motorista_id);
      this.getNomeMotorista(this.motorista_id);
      this.getViagens();
    }
  }
  getNomeMotorista(motorista_id: string): void {
    this.motoristaService.getMotoristaById(motorista_id).subscribe(motorista => this.nome_motorista = motorista.name);
  }

  ngOnSelect(): void {
  }
  
  onSelect(viagem: Viagem): void {
    this.selectedViagem = viagem;

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
      this.viagemService
        .atualizarViagemInicio(inicio_viagem, this.selectedViagem)
        .subscribe(() => {
          console.log("Viagem atualizada com sucesso:", this.selectedViagem);
          this.getViagens();
        });
    }
  }

  finalizarViagem(): void {
    if (this.selectedViagem) {
      const fim_viagem = new Date();
      this.viagemService
        .atualizarViagemFim(fim_viagem, this.selectedViagem)
        .subscribe(() => {
          console.log("Viagem atualizada com sucesso:", this.selectedViagem);
          this.getViagens();
        });
    }
    this.calcularPrecoViagem();
    this.viagemEmCurso = false;
  }

  getViagens(): void {
    this.viagemService.getViagens().subscribe(todasViagens => {
      this.viagens = todasViagens.filter(
        viagem => viagem.motorista_id === this.motorista_id
      );

      // Atualiza estado da viagem em curso
      this.viagemEmCurso = this.viagens.some(
        viagem => viagem.inicio_viagem && !viagem.fim_viagem
      );
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

}