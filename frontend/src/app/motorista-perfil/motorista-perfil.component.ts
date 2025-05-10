import { Component } from '@angular/core';
import { Motorista } from '../motorista';
import { MotoristaService } from '../services/motorista.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-motorista-perfil',
  templateUrl: './motorista-perfil.component.html',
  styleUrls: ['./motorista-perfil.component.css']
})
export class MotoristaPerfilComponent {
  motorista: Motorista | undefined;

  constructor(
    private route: ActivatedRoute,
    private motoristaService: MotoristaService,
  ) {}

  ngOnInit(){
    this.getMotorista();
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
