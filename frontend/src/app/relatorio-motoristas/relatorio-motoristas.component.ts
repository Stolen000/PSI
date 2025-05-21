import { Component } from '@angular/core';
import { Motorista } from '../motorista';
import { Turno } from '../turno';
import { Viagem } from '../viagem';
import { MotoristaService } from '../services/motorista.service';
import { TurnoService } from '../services/turno.service';
import { ViagemService } from '../services/viagem.service';
import { LocalizationService } from '../services/localization.service';

@Component({
  selector: 'app-relatorio-motoristas',
  templateUrl: './relatorio-motoristas.component.html',
  styleUrls: ['./relatorio-motoristas.component.css']
})
export class RelatorioMotoristasComponent {
  motoristas: Motorista[] = [];
  turnos: Turno[] = [];
  viagens: Viagem[] = [];
  inicio_periodo?: Date;
  fim_periodo?: Date = new Date();

  //
  periodo_vazio: Boolean = false;
  perido_invalido: Boolean = false;
  //

  //CALCULO DE TOTAL DE VIAGENS
  totalViagens: number = 0;
  viagensPorMotorista: { motorista: string, total: number }[] = [];
  mostrarDetalhesViagens: boolean = false;
  motoristaSelecionado?: { motorista: string, total: number };
  viagensDoMotoristaSelecionado: Viagem[] = [];

  //CALCULO DE TEMPO DE VIAGENS
  temposPorMotorista: { motorista: string, tempoTotalMin: number }[] = [];
  mostrarDetalhesTempos: boolean = false;
  totalTempoMin: number = 0;
  viagensComDuracaoPorMotorista: { [motoristaId: string]: { inicio: string, fim: string, duracaoMin: number }[] } = {};
  motoristasComTemposExpandido: string[] = []; // Para controlar quais estão expandidos
  


  //CALCULO DE KILOMETRO
  totalKm: number = 0;
  kmsPorMotorista: { motorista: string; kmTotal: number }[] = [];
  viagensComKmPorMotorista: { [motorista: string]: { inicio: string; fim: string; km: number }[] } = {};
  mostrarDetalhesKms: boolean = false;
  motoristasComKmsExpandido: string[] = [];

  constructor(
    private motoristaService: MotoristaService,
    private turnoService: TurnoService,
    private viagemService: ViagemService,
    private localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    this.getMotoristas();
  }

  setPeriodo(inicio: string, fim: string): void {
    if (!inicio || !fim) {
      //alert("Preencha o período");
      this.periodo_vazio = true;
      return;
    } else {
      this.periodo_vazio = false;
    }

    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);

    if (inicioDate > fimDate) {
      //alert("O início do período não pode ser posterior ao fim");
      this.perido_invalido = true;
      return;
    } else {
      this.perido_invalido = false;
    }

    this.inicio_periodo = inicioDate;
    this.fim_periodo = fimDate;
    this.getViagens();
    console.log('Início:', this.inicio_periodo);
    console.log('Fim:', this.fim_periodo);
  }


  get hoje(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMotoristas(): void {
    this.motoristaService.getMotoristas()
      .subscribe(motoristas => {
        this.motoristas = motoristas.sort((a, b) => (b._id > a._id ? 1 : -1));
      });
  }

  getViagens(): void {
    if (!this.inicio_periodo || !this.fim_periodo) {
      alert("Defina primeiro o período de tempo.");
      return;
    }

    const inicio = new Date(this.inicio_periodo);
    const fim = new Date(this.fim_periodo);

    // opcional: garantir que o fim do período é o fim do dia
    fim.setHours(23, 59, 59, 999);

    this.viagemService.getViagens().subscribe(viagens => {
      this.viagens = viagens.filter(v => {
        if (!v.inicio_viagem) return false;

        const inicioViagem = new Date(v.inicio_viagem);
        if (isNaN(inicioViagem.getTime())) return false;

        return inicioViagem >= inicio && inicioViagem <= fim;
      });

      console.log("Viagens no período:", this.viagens);
      this.calculaTotais();
      this.calculaTemposTotais();
      this.calculaDistanciasTotais();
    });
  }

  getNomeMotorista(id: string): string {
    const motorista = this.motoristas.find(m => m._id === id);
    return motorista ? motorista.name : 'Motorista Desconhecido';
  }


  calculaTotais() {
    if (!this.viagens) {
      this.totalViagens = 0;
      this.viagensPorMotorista = [];
      return;
    }

    this.totalViagens = this.viagens.length;

    // Contar viagens por motorista só das viagens filtradas
    const mapa: {[motorista: string]: number} = {};

    this.viagens.forEach(v => {
      mapa[v.motorista_id] = (mapa[v.motorista_id] || 0) + 1;
    });

    // Agora garantir que todos motoristas aparecem, mesmo que com 0 viagens
    this.viagensPorMotorista = this.motoristas.map(m => {
      return {
        motorista: m.name,
        total: mapa[m._id] || 0  // pega o valor do mapa ou 0 se não existir
      };
    });
  }




  selecionarMotorista(m: { motorista: string, total: number }) {
    if (this.motoristaSelecionado && this.motoristaSelecionado.motorista === m.motorista) {
      // Se clicar no mesmo motorista, desmarca para esconder a lista
      this.motoristaSelecionado = undefined;
      this.viagensDoMotoristaSelecionado = [];
    } else {
      this.motoristaSelecionado = m;
      // Filtrar e ordenar viagens desse motorista
      this.viagensDoMotoristaSelecionado = this.viagens
        .filter(v => this.getNomeMotorista(v.motorista_id) === m.motorista)
        .sort((a, b) => {
          const dataA = a.inicio_viagem ? new Date(a.inicio_viagem).getTime() : 0;
          const dataB = b.inicio_viagem ? new Date(b.inicio_viagem).getTime() : 0;
          return dataB - dataA; // ordem decrescente (mais recente primeiro)
        });
    }
  }

  //------------------------------CALCULO DE TEMPO DE VIAGENS------------------------------\\
calculaTemposTotais() {
  const mapa: { [motorista: string]: number } = {};
  this.viagensComDuracaoPorMotorista = {};

  this.viagens.forEach(v => {
    if (v.inicio_viagem && v.fim_viagem) {
      // Converte para Date caso sejam strings
      const inicioDate = v.inicio_viagem instanceof Date ? v.inicio_viagem : new Date(v.inicio_viagem);
      const fimDate = v.fim_viagem instanceof Date ? v.fim_viagem : new Date(v.fim_viagem);

      const duracaoMin = Math.floor((fimDate.getTime() - inicioDate.getTime()) / 60000);

      if (!mapa[v.motorista_id]) {
        mapa[v.motorista_id] = 0;
      }
      mapa[v.motorista_id] += duracaoMin;

      if (!this.viagensComDuracaoPorMotorista[v.motorista_id]) {
        this.viagensComDuracaoPorMotorista[v.motorista_id] = [];
      }

      this.viagensComDuracaoPorMotorista[v.motorista_id].push({
        inicio: inicioDate.toISOString(),
        fim: fimDate.toISOString(),
        duracaoMin: duracaoMin
      });
    }
  });

  this.temposPorMotorista = this.motoristas.map(m => ({
    motorista: m._id,
    tempoTotalMin: mapa[m._id] || 0
  }));

  this.totalTempoMin = this.temposPorMotorista.reduce((soma, item) => soma + item.tempoTotalMin, 0);
}



alternarExpandido(motoristaId: string) {
  const i = this.motoristasComTemposExpandido.indexOf(motoristaId);
  if (i >= 0) {
    this.motoristasComTemposExpandido.splice(i, 1); // já está aberto → fecha
  } else {
    this.motoristasComTemposExpandido.push(motoristaId); // abre
  }
}

















calculaDistanciasTotais() {
  const mapaKm: { [motorista: string]: number } = {};
  this.viagensComKmPorMotorista = {};
  this.totalKm = 0;

  this.viagens.forEach(v => {
    if (v.inicio_viagem && v.fim_viagem &&
        v.coordenadas_origem?.lat && v.coordenadas_origem?.lon &&
        v.coordenadas_destino?.lat && v.coordenadas_destino?.lon) {

      const km = this.localizationService.calcularDistanciaKm(
        v.coordenadas_origem.lat, v.coordenadas_origem.lon,
        v.coordenadas_destino.lat, v.coordenadas_destino.lon
      );

      if (!mapaKm[v.motorista_id]) {
        mapaKm[v.motorista_id] = 0;
      }
      mapaKm[v.motorista_id] += km;

      if (!this.viagensComKmPorMotorista[v.motorista_id]) {
        this.viagensComKmPorMotorista[v.motorista_id] = [];
      }
      this.viagensComKmPorMotorista[v.motorista_id].push({
        inicio: new Date(v.inicio_viagem!).toISOString(),
        fim: new Date(v.fim_viagem!).toISOString(),
        km: km
      });


      this.totalKm += km;
    }
  });

  this.kmsPorMotorista = this.motoristas.map(m => ({
    motorista: m._id,
    kmTotal: mapaKm[m._id] || 0
  }));
}


alternarExpandidoKms(motoristaId: string) {
  const idx = this.motoristasComKmsExpandido.indexOf(motoristaId);
  if (idx === -1) {
    this.motoristasComKmsExpandido.push(motoristaId);
  } else {
    this.motoristasComKmsExpandido.splice(idx, 1);
  }
}








}
