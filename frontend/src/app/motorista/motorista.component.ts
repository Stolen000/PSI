import { Component, OnInit } from '@angular/core';

import { Motorista } from '../motorista';
import { MotoristaService } from '../services/motorista.service';

@Component({
  selector: 'app-motorista',
  templateUrl: './motorista.component.html',
  standalone: false,
  styleUrls: ['./motorista.component.css']
})
export class MotoristaComponent implements OnInit {
  motoristas: Motorista[] = [];

  constructor(private motoristaService: MotoristaService) { }

  ngOnInit(): void {
    // Inicialização futura se necessário
  }

  getMotoristas(): void {

  }

  registarMotorista(
    name: string,
    anoNascimento: number,
    cartaConducao: number,
    rua: string,
    numeroPorta: number,
    codigoPostal: string,
    localidade: string
  ): void {
    const motorista = {
      _id: '', // será gerado no backend
      name: name,
      ano_nascimento: +anoNascimento,
      carta_conducao: +cartaConducao,
      morada: {
        rua: rua,
        numero_porta: +numeroPorta,
        codigo_postal: codigoPostal,
        localidade: localidade
      }
    };




  
    console.log('Motorista a registar:', motorista);
    
    this.motoristaService.addMotorista(motorista as Motorista)
      .subscribe(hero => {
        this.motoristas.push(hero);
      });

  }
  

  buscarLocalidade(codigoPostal: string): void {
    // A lógica de busca será implementada depois
    console.log('Buscar localidade para código postal:', codigoPostal);
  }
}
