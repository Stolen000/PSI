import { Component } from '@angular/core';
import { Turno } from '../turno';
import { ActivatedRoute } from '@angular/router';
import { TaxiService } from '../services/taxi.service';
import { Taxi } from '../taxi';
import { TurnoService } from '../services/turno.service';
import { Periodo } from '../periodo';
import { forkJoin, map } from 'rxjs';
import { MotoristaService } from '../services/motorista.service';
type TurnoWithTaxi = Turno & { taxi?: Taxi, ativo?: boolean };
@Component({
  selector: 'app-requisicao-taxi',
  templateUrl: './requisicao-taxi.component.html',
  styleUrls: ['./requisicao-taxi.component.css']
})

export class RequisicaoTaxiComponent {
  motorista_id: string = "";
  inicio: string = "";
  fim: string = "";
  taxis: Taxi[] = [];
  filtered_taxis: Taxi[] = [];
  turnos_all: Turno[] = []; //Inicializa turnos todos
  startDate!: string;  // Store the selected start date
  endDate!: string;    // Store the selected end date
  selectedTaxiId: string = "";
  validTimeFormat: boolean = true;
  showError: boolean = false;
  showErrorOverlap: boolean = false;
  taxiRequisitado: boolean = true; //Should be false, its just true to debug
  turnos_motorista: TurnoWithTaxi[] = [];
  motorista_nome: string = "";
  turno_ativo: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private taxiService: TaxiService,
    private turnoService: TurnoService,
    private motoristaService: MotoristaService,
  ) {}


  //Busca o id do motorista (Posso ir buscar o objeto se for preciso)
  //Busca a lista de taxis completa
  ngOnInit(){
    this.getMotoristaId();
    this.getMotorista(this.motorista_id);
    this.getTurnos();
    this.buscarTaxisDisponiveis();
    this.getTurnosDoMotorista(this.motorista_id);
    //this.getTurnoAtualAtivo();
  }

  getMotoristaId(){
    const motorista_id = this.route.snapshot.paramMap.get('motorista_id');
    if(motorista_id){
      this.motorista_id = motorista_id;
    }
  }
  getMotorista(motoristaId:string){
    this.motoristaService.getMotoristaById(motoristaId).subscribe(motorista => this.motorista_nome = motorista.name);
  }

  buscarTaxisDisponiveis(){
    this.taxiService.getTaxis().subscribe(taxis => this.taxis = taxis);
  }

  getTurnos(){
    this.turnoService.getTurnos().subscribe(turnos => this.turnos_all = turnos);
  }

  getTurnosDoMotorista(motoristaId: string) {
    const dateAtual = new Date();
    this.turnoService.getTurnosByMotorista(motoristaId).subscribe(turnos => {
      // Sort the original list by start time anD filter out only turnos that havent ended

      turnos.sort((a, b) => new Date(a.periodo.inicio).getTime() - new Date(b.periodo.inicio).getTime());
      let upcomingTurnos = turnos.filter(turno => new Date(turno.periodo.fim) > dateAtual);

      // Check if the first turno is currently active
      const firstTurno = upcomingTurnos[0];
      this.turno_ativo = false;

      if (firstTurno) {
        const inicio = new Date(firstTurno.periodo.inicio);
        const fim = new Date(firstTurno.periodo.fim);
        if (dateAtual >= inicio && dateAtual <= fim) {
          this.turno_ativo = true;
        }
      }

      // Create an array of observables for taxi fetches
      const taxiRequests = upcomingTurnos.map(turno =>
        this.taxiService.getTaxi(turno.taxi_id).pipe(
          map(taxi => ({ ...turno, taxi }))
        )
      );

      // Wait for all taxi requests to complete
      forkJoin(taxiRequests).subscribe((enrichedTurnos: TurnoWithTaxi[]) => {
        // If the first is active, mark it
        if (this.turno_ativo && enrichedTurnos.length > 0) {
          enrichedTurnos[0] = { ...enrichedTurnos[0], ativo: true };
        }
        this.turnos_motorista = enrichedTurnos;
      }, error => {
        console.error('Erro ao obter dados dos táxis:', error);
      });

    });
    this.taxiRequisitado = true;
  }

  //===========================================================
  hasOverlappingTurnosTaxi(taxiId: string, newStart: Date, newEnd: Date): boolean {
    // Verifica se existe algum turno do táxi que se sobrepõe com o novo turno
    return this.turnos_all.some(turno => {
      if (turno.taxi_id === taxiId) {
        const existingStart = new Date(turno.periodo.inicio);
        const existingEnd = new Date(turno.periodo.fim);

        // Verifica se há sobreposição de horários usando Date
        return newStart < existingEnd && newEnd > existingStart;
      }
      return false;
    });
  }

  // Função para filtrar os táxis disponíveis (sem sobreposição de turnos)
  filterAvailableTaxis() {
    if(!this.fim || !this.inicio || !this.startDate || !this.endDate) {
      this.validTimeFormat= false;
      this.selectedTaxiId = "";
      return;
    }
    this.validTimeFormat= true;
    const startDateTime = new Date(`${this.startDate}T${this.inicio}:00`);
    const endDateTime = new Date(`${this.endDate}T${this.fim}:00`);
    const currentDate = new Date();  // Get current date and time
    if(startDateTime >= endDateTime || currentDate >= startDateTime || currentDate >= endDateTime ||
      !this.checkTurnoMenorQue8Horas(startDateTime,endDateTime)){
      this.showError = true;
      this.selectedTaxiId = "";
      return;
    }
    if(this.checkTurnosMotorista(this.motorista_id,startDateTime,endDateTime)){
      this.selectedTaxiId = "";
      this.showErrorOverlap = true;
      return
    }
    this.showErrorOverlap = false;
    this.showError = false;
    //Por cada taxi, checka se existe algum que interceta o turno novo
    this.filtered_taxis = this.taxis.filter(taxi => {
      return !this.hasOverlappingTurnosTaxi(taxi._id, startDateTime, endDateTime);
    });
  }

  // Função chamada quando o tempo de início ou fim muda
  onTimeChange() {
    this.filterAvailableTaxis();
  }

  resetForm(){
    this.inicio = "";
    this.fim = "";
    this.selectedTaxiId = "";
    this.startDate = "";
    this.endDate = "";
  }

  //Vai fazer o post do turno para a db
  createTurnoFromForm(){
    //criar o Periodo
    let startDateTime = new Date(`${this.startDate}T${this.inicio}:00`);
    let endDateTime = new Date(`${this.endDate}T${this.fim}:00`);
    let periodo_novo = {
      inicio: startDateTime,
      fim: endDateTime
    }
    //criar o Turno
    let turno = {
      motorista_id: this.motorista_id,
      taxi_id: this.selectedTaxiId,
      periodo: periodo_novo,
      viagens_realizadas: 0
    }
    //Chamar service para fazer post
    //console.log("Turno a criar: " + JSON.stringify(turno, null, 2));


    this.turnoService.addTurno(turno as Turno).subscribe({
      next: (createdTurno) => {
        //console.log("Turno criado com sucesso:", createdTurno);
        //this.getTurnosDoMotorista(this.motorista_id); //Como estamos a ignorar fazemos onInit
          this.taxiService.getTaxi(createdTurno.taxi_id).subscribe(taxi => {
          let enrichedTurno = { ...createdTurno, taxi };
          //Em vez da linha de cima fazer push para o 1 lugar?
          this.turnos_motorista.push(enrichedTurno as Turno);
          this.turnos_motorista.sort((a, b) =>
              new Date(a.periodo.inicio).getTime() - new Date (b.periodo.inicio).getTime());

          this.resetForm(); 
        });
      },
      error: (err) => {
        console.error("Erro ao criar turno:", err);
      }
    });
   
  }

  checkTurnosMotorista(motorista_id: string, newStart: Date, newEnd: Date){
    const overlappingTurno = this.turnos_all.some(turno => {
        if (turno.motorista_id === motorista_id) {
          const existingStart = new Date(turno.periodo.inicio);
          const existingEnd = new Date(turno.periodo.fim);

          // Verifica se há sobreposição de horários
          return newStart < existingEnd && newEnd > existingStart;
        }
        return false;
      });

      if (overlappingTurno) {
        // O motorista já tem um turno sobrepondo o novo turno
        console.log('Erro: O motorista já tem um turno que interceta com o novo turno.');
        return true; // Retorna verdadeiro se houver sobreposição
      } else {
        // Não há sobreposição
        //console.log('O motorista pode ser agendado para o novo turno.');
        return false; // Retorna falso se não houver sobreposição
      }
  }

  checkTurnoMenorQue8Horas(turno_start:Date, turno_end: Date){
    const start = new Date(turno_start).getTime();  
    const end = new Date(turno_end).getTime();      
    const diffMilliseconds = end - start;
    const diffHours = diffMilliseconds / (1000 * 60 * 60);
    
    return diffHours <= 8;  
  }

  deleteTurno(turno: Turno): void {
    this.turnoService.deleteTurno(turno).subscribe({
      next: () => {
        // Update UI by removing the deleted turno
        this.turnos_motorista = this.turnos_motorista.filter(t => t._id !== turno._id);
        //console.log(`Turno com ID ${turno._id} foi removido.`);
      },
      error: (err) => {
        console.error('Erro ao deletar turno:', err);
      }
    });
  }
  getTurnoAtualAtivo(): Turno | undefined {
    let turnoToReturn = undefined;
    this.turnoService.getTurnoAtual(this.motorista_id).subscribe(turno => {
      if (turno) {
        //console.log("Existe turno ativo:");
        turnoToReturn = turno;
      } else {
        console.log("Não existe turno ativo");
      }
    });
    return turnoToReturn;
  }
}



  