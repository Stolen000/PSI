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
  viagemAtual?: Viagem;
  selectedViagem?: Viagem;
  viagemEmCurso: boolean = false;

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
    }
  }

  ngOnSelect(): void {
  }
  
  onSelect(viagem: Viagem): void {
    this.selectedViagem = viagem;
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
    this.viagemEmCurso = false;
  }

  getViagens(): void {
    this.viagemService.getViagens().subscribe(todasViagens => {
      this.viagens = todasViagens.filter(
        viagem => viagem.motorista_id === this.motorista_id
      );
    });
  }

}
