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

  getViagens(): void {
    this.viagemService.getViagens().subscribe(todasViagens => {
      this.viagens = todasViagens.filter(
        viagem => viagem.motorista_id === this.motorista_id
      );
    });
  }
}
