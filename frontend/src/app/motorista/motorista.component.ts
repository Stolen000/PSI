import { Component, OnInit } from '@angular/core';
import { Motorista } from '../motorista';
import { MotoristaService } from '../services/motorista.service';
import { CodigoPostalService } from '../services/codigo-postal.service';

@Component({
  selector: 'app-motorista',
  templateUrl: './motorista.component.html',
  standalone: false,
  styleUrls: ['./motorista.component.css']
})
export class MotoristaComponent implements OnInit {
  motoristas: Motorista[] = [];
  codigosPostais: any[] = [];
  localidade: string = ''; 
  codigoPostalNaoEncontrado: boolean = false;

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

  registarMotorista(
    name: string,
    anoNascimento: number,
    cartaConducao: number,
    nif: number,
    genero: string,
    rua: string,
    numeroPorta: number,
    codigoPostal: string,
    localidade: string
  ) {
    if (!name || !anoNascimento || !cartaConducao || !nif || !genero || !rua || !numeroPorta || !codigoPostal || !localidade) {
      alert('Preenche todos os campos corretamente!');
      return;
    }

    const jaExisteCC = this.motoristas.some(m => m.carta_conducao === cartaConducao);
    if (jaExisteCC) {
      alert('Já existe um motorista com essa carta de condução!');
      return;
    }

    const jaExistNIF = this.motoristas.some(m => m.nif === nif);
    if (jaExistNIF) {
      alert('Já existe um motorista com esse NIF!');
      return;
    }

    if (nif.toString().length !== 9 || nif < 0) {
      alert('O NIF deve ter exatamente 9 dígitos e ser positivo.');
      return;
    }
  
    const anoAtual = new Date().getFullYear();
    if (anoAtual - anoNascimento < 18) {
      alert('O motorista deve ter pelo menos 18 anos.');
      return;
    }
  
    const motorista = {
      name,
      ano_nascimento: anoNascimento,
      carta_conducao: cartaConducao,
      nif,
      genero,
      morada: {
        rua,
        numero_porta: numeroPorta,
        codigo_postal: codigoPostal,
        localidade
      }
    };

    console.log('Motorista a registar:', motorista);

    this.motoristaService.addMotorista(motorista as Motorista)
      .subscribe(motorista => {
        console.log("Motorista recebido do backend:", motorista);
        this.motoristas.unshift(motorista);
      });
  }

  buscarLocalidade(codigoPostal: string): void {
    const resultado = this.codigosPostais.find(
      c => c.codigo_postal === codigoPostal
    );
  
    if (resultado) {
      this.localidade = resultado.localidade;
      this.codigoPostalNaoEncontrado = false;
    } else {
      this.codigoPostalNaoEncontrado = true;
      this.localidade = '';
    }
  }

  verificaIdadeValida(ano: number): boolean {
    const anoAtual = new Date().getFullYear();
    return ((ano && (anoAtual - ano)) >= 18);
  }

  verificaCartaConducaoUnica(numero: number): boolean {
    return !this.motoristas.some(m => m.carta_conducao === numero);
  }
  
  
  
}
