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
  showError8Hours: boolean = false;
  showErrorBeforeNow: boolean = false;
  showErrorEndBeforeBeggining: boolean = false;

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

    //Dar reset aos erros?
    this.showError = false;
    this.showErrorEndBeforeBeggining = false;
    this.showError8Hours = false;
    this.showErrorBeforeNow = false;
    this.showErrorOverlap = false;

    //Erros - Testar Inicio depois de Fim
    if(startDateTime >= endDateTime){
      this.showErrorEndBeforeBeggining = true;
      this.showError = true;
    }
    //Erros - Duracao Superior a 8 horas
    if(!this.checkTurnoMenorIgualQue8Horas(startDateTime,endDateTime)){
      this.showError8Hours = true;
      this.showError = true;
    }
    //Erros - Criar turno antes da hora atual
    if(currentDate > startDateTime){
      this.showErrorBeforeNow = true;
      this.showError = true;
    }
    //Erros - Nao pode intercetar outro turno dele
    if(this.existeOverlapNosTurnosDoMotorista(this.motorista_id,startDateTime,endDateTime)){
      this.showErrorOverlap = true;
      this.showError = true;
    }
    if(this.showError){
      this.selectedTaxiId = "";
      this.filtered_taxis = [];
      return;
    }

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
    console.log("Turno a criar: " + JSON.stringify(turno, null, 2));


    this.turnoService.addTurno(turno as Turno).subscribe({
      next: (createdTurno) => {
        console.log("Turno criado com sucesso:", createdTurno);
        this.resetForm(); 
        this.turnos_all.push(turno as Turno); //Atualizar o turnos_all (para os taxis)
        this.getTurnosDoMotorista(this.motorista_id);  //Atualizar o turnos_do_motorista
      },
      error: (err) => {
        console.error("Erro ao criar turno:", err);
      }
    });
    
  }

  existeOverlapNosTurnosDoMotorista(motorista_id: string, newStart: Date, newEnd: Date){
    const overlappingTurno = this.turnos_motorista.some(turno => {
        if (turno.motorista_id === motorista_id) {
          const existingStart = new Date(turno.periodo.inicio);
          const existingEnd = new Date(turno.periodo.fim);
          // Verifica se há sobreposição de horários
          return newStart < existingEnd && newEnd > existingStart;
        }
        return false;
      });
      return overlappingTurno;
  }

  checkTurnoMenorIgualQue8Horas(turno_start:Date, turno_end: Date){
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
        console.log(`Turno com ID ${turno._id} foi removido.`);
      },
      error: (err) => {
        console.error('Erro ao deletar turno:', err);
      }
    });
  }
}