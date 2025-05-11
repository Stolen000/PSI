import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViagemService } from '../services/viagem.service';
import { Viagem } from '../viagem';

@Component({
  selector: 'app-registar-viagem',
  templateUrl: './registar-viagem.component.html',
})
export class RegistarViagemComponent implements OnInit {
  viagens: Viagem[] = [];
  motorista_id: string = "";
  viagemAtual: Viagem | null = null;

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService
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
      this.viagens = todasViagens.filter(
        viagem => viagem.motorista_id === this.motorista_id
      );
    });
  }

  getViagemAtual(): void{
    this.viagemService.getViagemAtualDoMotorista(this.motorista_id).subscribe({
      next: (viagem) => {
        if (viagem) {
          console.log("Viagem atual do motorista:", viagem);
          this.viagemAtual = viagem; // Podes guardar se quiseres mostrar no HTML
        } else {
          console.log("Nenhuma viagem atual encontrada.");
        }
      },
      error: (err) => {
        console.error("Erro ao obter viagem atual:", err);
      }
    });

  }
}
