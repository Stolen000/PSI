import { Component } from '@angular/core';
import { Motorista } from '../motorista';
import { MotoristaService } from '../services/motorista.service';
import { ActivatedRoute } from '@angular/router';
import { TurnoService } from '../services/turno.service';

@Component({
  selector: 'app-motorista-perfil',
  templateUrl: './motorista-perfil.component.html',
  styleUrls: ['./motorista-perfil.component.css']
})
export class MotoristaPerfilComponent {
  motorista: Motorista | undefined;
  turnoAtivo: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private motoristaService: MotoristaService,
    private turnoService: TurnoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.motoristaService.getMotoristaById(id).subscribe(motorista => {
        this.motorista = motorista;

        // Verifica se há turno ativo
        this.turnoService.getTurnoAtual(id).subscribe(turno => {
          this.turnoAtivo = !!turno;
        });
      });
    }
  }
  
  getMotorista(){
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    if (id) {
      this.motoristaService.getMotoristaById(id).subscribe(motorista => {
        console.log('Fetched motorista:', motorista);
        this.motorista = motorista;
      });
    }
  }
}
