import { Component, OnInit } from '@angular/core';
import { Motorista } from '../motorista';
import { MotoristaService } from '../services/motorista.service';
import { CodigoPostalService } from '../services/codigo-postal.service';
import { NgForm } from '@angular/forms';
import { TurnoService } from '../services/turno.service';
import { Turno } from '../turno';

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
  nifProcurado: number = 0;
  motoristaNaoEncontrado: boolean = false;
  mensagemSucesso: string = '';

  //new 
  name_edit: string = '';
  anoNascimento_edit: number | undefined;
  cartaConducao_edit: number | undefined;
  nif_edit: number | null = null;
  genero_edit: string = '';
  rua_edit: string = '';
  numeroPorta_edit: number | null = null;
  codigoPostal_edit: string = '';
  localidade_nova_edit: string = '';

  isEditMode: boolean = false;
  editingMotoristaId: string  = "";
  originalMotorista: Motorista | null = null;

  canDeleteMap: { [id: string]: boolean } = {};
  turnos: Turno[] = [];

  constructor(
    private motoristaService: MotoristaService,
    private codigoPostalService: CodigoPostalService,
    private turnoService: TurnoService
  ) {}

  delete(motorista: Motorista): void {
    console.log("delete no motorista.ts")
    this.motoristas = this.motoristas.filter(h => h !== motorista); //Tira da lista atual
    this.motoristaService.deleteMotorista(motorista._id).subscribe(); //Delete no backend
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
        this.motoristas = motoristas;
        this.checkIfCanDelete();
      });
  }

  getTurnos(): void{
    this.turnoService.getTurnos().subscribe(turnos => {this.turnos = turnos;});
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
    localidade: string,
    formulario: NgForm
  ) {
    console.log("EDIT MODE: " + this.isEditMode);
    console.log("ID do motorista a ser visto: " + this.editingMotoristaId);
    if (!name || !anoNascimento || !cartaConducao || !nif || !genero || !rua || !numeroPorta || !codigoPostal || !localidade) {
      alert('Preenche todos os campos corretamente!');
      return;
    }

    const jaExisteCC = this.motoristas.some(m => m._id.toString() !== this.editingMotoristaId.toString() && m.carta_conducao === cartaConducao);
    if (jaExisteCC) {
      alert('Já existe um motorista com essa carta de condução!');
      return;
    }

    const jaExistNIF = this.motoristas.some(m => m._id.toString() !== this.editingMotoristaId.toString() && m.nif === nif);
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
  
    let motorista = {
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
      },
    };

    if(!this.isEditMode){
      console.log('Motorista a registar:', motorista);
      this.motoristaService.addMotorista(motorista as Motorista)
        .subscribe(motorista => {
          console.log("Motorista recebido do backend:", motorista);
          this.motoristas.unshift(motorista);
        });
      this.mensagemSucesso = 'Motorista registado com sucesso!';
      formulario.resetForm();
      setTimeout(() => {
        this.mensagemSucesso = '';
      }, 3000);
      this.getMotoristas(); 
    } else {
      let motoristaUpdate  = {
        ...motorista,
        _id: this.editingMotoristaId
      } as Motorista;

      //Editing time! 
      console.log('Motorista a updatar:', motoristaUpdate);
      //Chamar o Update do Service
      this.motoristaService.putMotorista(motoristaUpdate as Motorista)
        .subscribe(
          (response) => {
            console.log('Motorista atualizado com sucesso:', response);

            this.mensagemSucesso = 'Motorista atualizado com sucesso!';
            this.getMotoristas(); 
            this.cancelEdit();

            setTimeout(() => {
              this.mensagemSucesso = '';
            }, 3000);
          },
          (error) => {
            console.error('Erro ao atualizar motorista:', error);
            alert('Erro ao atualizar o motorista.');
          }
        );
      //dar feedback de edicao bem sucecida?
    }
    
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
    return !this.motoristas.some(m => m._id.toString() !== this.editingMotoristaId.toString() && m.carta_conducao === numero);
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
  
  edit(motorista: Motorista) {

    if (this.editingMotoristaId === motorista._id) {
      this.cancelEdit();
      return;
    }

    this.originalMotorista = JSON.parse(JSON.stringify(motorista)); // Deep copy
    this.name_edit = motorista.name;
    this.anoNascimento_edit = motorista.ano_nascimento;
    this.cartaConducao_edit = motorista.carta_conducao;
    this.nif_edit = motorista.nif;
    this.genero_edit = motorista.genero;
    this.rua_edit = motorista.morada.rua;
    this.numeroPorta_edit = motorista.morada.numero_porta;
    this.codigoPostal_edit = motorista.morada.codigo_postal;
    this.localidade = motorista.morada.localidade;

    this.isEditMode = true;
    this.editingMotoristaId = motorista._id;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editingMotoristaId = "";
    this.originalMotorista = null;

    // Clear form fields
    this.name_edit = '';
    this.anoNascimento_edit = undefined;
    this.cartaConducao_edit = undefined;
    this.nif_edit = null;
    this.genero_edit = '';
    this.rua_edit = '';
    this.numeroPorta_edit = null;
    this.codigoPostal_edit = '';
    this.localidade = '';
  }

  hasFormChanged(): boolean {
  if (!this.originalMotorista) return false;

  return (
    this.name_edit !== this.originalMotorista.name ||
    this.anoNascimento_edit !== this.originalMotorista.ano_nascimento ||
    this.cartaConducao_edit !== this.originalMotorista.carta_conducao ||
    this.nif_edit !== this.originalMotorista.nif ||
    this.genero_edit !== this.originalMotorista.genero ||
    this.rua_edit !== this.originalMotorista.morada.rua ||
    this.numeroPorta_edit !== this.originalMotorista.morada.numero_porta ||
    this.codigoPostal_edit !== this.originalMotorista.morada.codigo_postal ||
    this.localidade !== this.originalMotorista.morada.localidade
  );
}

  //get all turnos
  //check if any of the motoristas have any turno
  //If so, disable their delete button
  checkIfCanDelete(): void {
    this.turnoService.getTurnos().subscribe(turnos => {
      // Criar um Set com os IDs dos motoristas que têm turnos
      const motoristaIdsWithTurnos = new Set<string>();

      for (let t of turnos) {
        if (t.motorista_id) {
          motoristaIdsWithTurnos.add(t.motorista_id.toString());
        }
      }
      this.motoristas.forEach(m => {
        this.canDeleteMap[m._id.toString()] = !motoristaIdsWithTurnos.has(m._id.toString());
      });
    });
  }

  
}
