import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViagemService } from '../services/viagem.service';

@Component({
  selector: 'app-registar-viagem',
  templateUrl: './registar-viagem.component.html',
})
export class RegistarViagemComponent implements OnInit {
  motoristaId!: string;
  viagemAtual: any;
  turnoAtual: any;

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService
  ) {}

  ngOnInit(): void {
    this.motoristaId = this.route.snapshot.paramMap.get('motoristaId')!;
    this.viagemService.getViagemAtual(this.motoristaId).subscribe((res) => {
      this.viagemAtual = res.viagem;
      this.turnoAtual = res.turno;
    });
  }

  


}
