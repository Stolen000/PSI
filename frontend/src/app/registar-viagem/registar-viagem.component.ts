import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViagemService } from '../services/viagem.service';
import { Viagem } from '../viagem';
import { Coordenadas } from '../coordenadas';
import { LocalizationService } from '../services/localization.service';

@Component({
  selector: 'app-registar-viagem',
  templateUrl: './registar-viagem.component.html',
})
export class RegistarViagemComponent implements OnInit {
  viagens: Viagem[] = [];
  viagensTerminadas: Viagem[] = [];
  viagensPorComecar: Viagem[] = [];

  motorista_id: string = "";
  viagemAtual: Viagem | null = null;

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService,
    private localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.motorista_id = id;
      console.log("Motorista ID obtido do path:", this.motorista_id);
      this.getViagens();
      this.getViagemAtual();
    }
  }

  getViagens(): void {
    this.viagemService.getViagens().subscribe(todasViagens => {
      // viagens do motorista atual
      this.viagens = todasViagens.filter(
        viagem => viagem.motorista_id === this.motorista_id
      );
      // separar as que já começaram vs as que ainda não
      this.viagensPorComecar = this.viagens.filter(
        v => v.inicio_viagem !== null
      );
      this.viagensTerminadas = this.viagens.filter(
        v => v.inicio_viagem === null && v.fim_viagem !== null
      );
    });
  }

  getViagemAtual(): void {
    this.viagemService.getViagemAtualDoMotorista(this.motorista_id).subscribe({
      next: (viagem) => {
        if (viagem) {
          console.log("Viagem atual do motorista:", viagem);
          this.viagemAtual = viagem;
        } else {
          console.log("Nenhuma viagem atual encontrada.");
        }
      },
      error: (err) => {
        console.error("Erro ao obter viagem atual:", err);
      }
    });
  }

  selecionarViagem(viagem: Viagem): void {
    this.viagemAtual = viagem;
  } 

  comecarViagem(): void {
  if (!this.viagemAtual) return;

  // Aqui vai o que me vais dizer para fazer quando começa a viagem
  console.log("Iniciar viagem:", this.viagemAtual);
}

getDestino(coordenadas: Coordenadas): void {
  this.localizationService.getMoradaPorCoordenadas(coordenadas.lat, coordenadas.lon)
    .subscribe({
      next: (morada) => {
        if (morada) {
          console.log("Morada obtida:", morada);
        } else {
          console.log("Não foi possível obter a morada.");
        }
      },
      error: (err) => {
        console.error("Erro ao obter a morada:", err);
      }
    });
}



}
