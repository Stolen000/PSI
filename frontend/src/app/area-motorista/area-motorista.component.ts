import { Component } from '@angular/core';
import { MotoristaService } from '../services/motorista.service';
import { CodigoPostalService } from '../services/codigo-postal.service';
import { Motorista } from '../motorista';

@Component({
  selector: 'app-area-motorista',
  templateUrl: './area-motorista.component.html',
  styleUrls: ['./area-motorista.component.css']
})
export class AreaMotoristaComponent {
  motoristas: Motorista[] = [];
  codigosPostais: any[] = [];
  localidade: string = ''; 
  codigoPostalNaoEncontrado: boolean = false;
  nifProcurado: number = 0;
  motoristaNaoEncontrado: boolean = false;
  mensagemSucesso: string = '';


  constructor(
    private motoristaService: MotoristaService,
    private codigoPostalService: CodigoPostalService
  ) {}

  delete(motorista: Motorista): void {
    console.log("delete no motorista.ts")
    this.motoristas = this.motoristas.filter(h => h !== motorista);
    console.log("delete no motorista.ts")
    this.motoristaService.deleteMotorista(motorista._id).subscribe();
  }

  ngOnInit(): void {
    this.getMotoristas();

    this.codigoPostalService.getCodigosPostais().subscribe(data => {
      this.codigosPostais = data;
    });
  }

  getMotoristas(): void {
    this.motoristaService.getMotoristas()
      .subscribe(motoristas => {
        this.motoristas = motoristas.sort((a, b) => (b._id > a._id ? 1 : -1));
      });
  }





  
  procurarMotorista() {
    const motorista = this.motoristas.find(m => m.nif === this.nifProcurado);
    if (motorista) {
      this.motoristaNaoEncontrado = false;
      // Navegar para a página do motorista
      window.location.href = `/motorista-perfil/${motorista._id}`;
    } else {
      this.motoristaNaoEncontrado = true;
    }
  }
}
