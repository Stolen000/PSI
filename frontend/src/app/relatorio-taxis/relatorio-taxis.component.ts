import { Component } from '@angular/core';
import { MotoristaService } from '../services/motorista.service';
import { ViagemService } from '../services/viagem.service';
import { TurnoService } from '../services/turno.service';
import { LocalizationService } from '../services/localization.service';
import { TaxiService } from '../services/taxi.service';
import { Taxi } from '../taxi';
import { Viagem } from '../viagem';
import { Turno } from '../turno';

@Component({
  selector: 'app-relatorio-taxis',
  templateUrl: './relatorio-taxis.component.html',
  styleUrls: ['./relatorio-taxis.component.css']
})
export class RelatorioTaxisComponent {
  taxis: Taxi[] = [];
  viagens: Viagem[] = [];
  inicio_periodo?: Date;
  fim_periodo?: Date = new Date();
  turnos: Turno[] = [];



  totalViagens: number = 0;
totalViagensPorTaxi: { taxiId: string, matricula: string, total: number }[] = [];
viagensPorTaxi: { [taxiId: string]: Viagem[] } = {};
taxisExpandido: string[] = [];
  mostrarDetalhesViagens: boolean = false;



  mostrarDetalhesTempos: boolean = false;
totalMinutos: number = 0;

temposPorTaxi: { taxiId: string, matricula: string, totalMin: number }[] = [];
temposExpandido: string[] = [];

viagensComDuracaoPorTaxi: { [taxiId: string]: { inicio: string, fim: string, duracaoMin: number }[] } = {};



mostrarDetalhesKms: boolean = false;
totalKms: number = 0;

kmsPorTaxi: { taxiId: string, matricula: string, totalKm: number }[] = [];
kmsExpandido: string[] = [];

viagensComDistanciaPorTaxi: { [taxiId: string]: { inicio: string, fim: string, distanciaKm: number }[] } = {};



  constructor(
    private taxiService: TaxiService,
    private turnoService: TurnoService,
    private viagemService: ViagemService,
    private localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    this.getTaxis();
    this.getTurnos();
  }

  setPeriodo(inicio: string, fim: string): void {
    if (!inicio || !fim) {
      alert("Preencha o período");
      return;
    }

    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);

    if (inicioDate > fimDate) {
      alert("O início do período não pode ser posterior ao fim");
      return;
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

      this.calculaTotais();
      this.calculaTemposTotais();
      this.calculaKmsTotais();
      console.log("Viagens no período:", this.viagens);
    });
  }

  getTaxis(): void {
    this.taxiService.getTaxis().subscribe(taxis => {
      this.taxis = taxis;
    })
  }

  getTurnos(): void {
    this.turnoService.getTurnos().subscribe(turnos => {
      this.turnos = turnos;
    })
  }

getTaxiFromTurnoId(id: string): string {
  const turno = this.turnos.find((t: Turno) => t._id === id);
  if (!turno) {
    throw new Error(`Turno com ID “${id}” não encontrado.`);
  }
  return turno.taxi_id;
}


calculaTotais(): void {
  this.totalViagens = this.viagens.length;
  const mapa: { [taxiId: string]: Viagem[] } = {}; // <-- string

  this.viagens.forEach(v => {
    let taxiId: string;
    try {
      taxiId = this.getTaxiFromTurnoId(v.turno_id);
    } catch (e) {
      console.warn(e);
      return;
    }

    if (!mapa[taxiId]) {
      mapa[taxiId] = [];
    }
    mapa[taxiId].push(v);
  });

  this.totalViagensPorTaxi = this.taxis.map(taxi => ({
    taxiId: taxi._id, // <-- string
    matricula: taxi.matricula,
    total: mapa[taxi._id]?.length || 0
  }));

  this.viagensPorTaxi = {};
  for (const taxiId in mapa) {
    this.viagensPorTaxi[taxiId] = mapa[taxiId]
      .filter(v => v.inicio_viagem) // só entra se tiver data
      .sort((a, b) => {
        const dataA = new Date(a.inicio_viagem as string | Date);
        const dataB = new Date(b.inicio_viagem as string | Date);
        return dataB.getTime() - dataA.getTime();
      });
  }

}



alternarExpandido(taxiId: string): void {
  const i = this.taxisExpandido.indexOf(taxiId);
  if (i >= 0) {
    this.taxisExpandido.splice(i, 1); // já está expandido → recolhe
  } else {
    this.taxisExpandido.push(taxiId); // expande
  }
}



















calculaTemposTotais(): void {
  const mapa: { [taxiId: string]: number } = {};
  this.viagensComDuracaoPorTaxi = {};

  this.viagens.forEach(v => {
    if (v.inicio_viagem && v.fim_viagem) {
      const inicioDate = v.inicio_viagem instanceof Date ? v.inicio_viagem : new Date(v.inicio_viagem);
      const fimDate = v.fim_viagem instanceof Date ? v.fim_viagem : new Date(v.fim_viagem);

      const duracaoMin = Math.floor((fimDate.getTime() - inicioDate.getTime()) / 60000);

      const taxiId = this.getTaxiFromTurnoId(v.turno_id);
      if (!taxiId) return;

      if (!mapa[taxiId]) {
        mapa[taxiId] = 0;
      }
      mapa[taxiId] += duracaoMin;

      if (!this.viagensComDuracaoPorTaxi[taxiId]) {
        this.viagensComDuracaoPorTaxi[taxiId] = [];
      }

      this.viagensComDuracaoPorTaxi[taxiId].push({
        inicio: inicioDate.toISOString(),
        fim: fimDate.toISOString(),
        duracaoMin
      });
    }
  });

  this.temposPorTaxi = this.taxis.map(t => ({
    taxiId: t._id,
    matricula: t.matricula,
    totalMin: mapa[t._id] || 0
  }));

  this.totalMinutos = this.temposPorTaxi.reduce((soma, item) => soma + item.totalMin, 0);
}


alternarTemposExpandido(taxiId: string): void {
  const i = this.temposExpandido.indexOf(taxiId);
  if (i >= 0) {
    this.temposExpandido.splice(i, 1);
  } else {
    this.temposExpandido.push(taxiId);
  }
}

















calculaKmsTotais(): void {
  const mapa: { [taxiId: string]: number } = {};
  this.viagensComDistanciaPorTaxi = {};

  this.viagens.forEach(v => {
    if (v.coordenadas_origem.lat != null && v.coordenadas_origem.lon != null && v.coordenadas_destino.lat != null && v.coordenadas_destino.lon != null && v.inicio_viagem && v.fim_viagem) {
      const distancia = this.localizationService.calcularDistanciaKm(
        v.coordenadas_origem.lat, v.coordenadas_origem.lon,
        v.coordenadas_destino.lat, v.coordenadas_destino.lon
      );

      const inicioDate = v.inicio_viagem instanceof Date ? v.inicio_viagem : new Date(v.inicio_viagem);
      const fimDate = v.fim_viagem instanceof Date ? v.fim_viagem : new Date(v.fim_viagem);

      const taxiId = this.getTaxiFromTurnoId(v.turno_id);
      if (!taxiId) return;

      if (!mapa[taxiId]) {
        mapa[taxiId] = 0;
      }
      mapa[taxiId] += distancia;

      if (!this.viagensComDistanciaPorTaxi[taxiId]) {
        this.viagensComDistanciaPorTaxi[taxiId] = [];
      }

      this.viagensComDistanciaPorTaxi[taxiId].push({
        inicio: inicioDate.toISOString(),
        fim: fimDate.toISOString(),
        distanciaKm: distancia
      });
    }
  });

  this.kmsPorTaxi = this.taxis.map(t => ({
    taxiId: t._id,
    matricula: t.matricula,
    totalKm: mapa[t._id] ? +mapa[t._id].toFixed(2) : 0 // arredonda p/ 2 decimais
  }));

  this.totalKms = this.kmsPorTaxi.reduce((soma, item) => soma + item.totalKm, 0);
}


alternarKmsExpandido(taxiId: string): void {
  const i = this.kmsExpandido.indexOf(taxiId);
  if (i >= 0) {
    this.kmsExpandido.splice(i, 1);
  } else {
    this.kmsExpandido.push(taxiId);
  }
}



}
