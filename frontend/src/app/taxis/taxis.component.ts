import { Component } from '@angular/core';
import { Taxi } from '../taxi';
import { TaxiService } from '../services/taxi.service';
import { TurnoService } from '../services/turno.service';
import { ViagemService } from '../services/viagem.service';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  standalone: false,
  styleUrls: ['./taxis.component.css']
})
export class TaxisComponent {
  constructor(private taxiService: TaxiService,
              private turnoService: TurnoService,
              private viagemService: ViagemService
  ) {}

  //por enquanto ficam aqui, podem ser postos noutro ficheiro para maior organizaçao
  marcas: string[] = ['Toyota', 'Volkswagen', 'Mercedes', 'Renault'];
  modelos: { [key: string]: string[] } = {
    'Toyota': ['Corolla', 'Yaris', 'Hilux'],
    'Volkswagen': ['Golf', 'Polo', 'Tiguan'],
    'Mercedes': ['Classe A', 'Classe C', 'Classe E'],
    'Renault': ['Clio', 'Megane', 'Captur']
  };

  //em primeira instancia como a marca se encontra por omissao em Toyota
  //a lista de modelos deve ser esta, atualizada se marca mudar na funcao onMarcaChange
  modelosFiltrados: string[] = ['Corolla', 'Yaris', 'Hilux'];
  validPlate = true;
  anosDisponiveis: number[] = [];

  editConforto = true;

  ngOnInit(): void {
    const anoAtual = new Date().getFullYear();
    for (let i = 0; i < 30; i++) {
      this.anosDisponiveis.push(anoAtual - i);
    }
    this.getTaxis();
  }

  taxis: Taxi[] = [];
  selectedTaxi?: Taxi;

  onSelect(taxi: Taxi): void {
    this.selectedTaxi = taxi;
    this.onMarcaChange(taxi.marca); // atualiza os modelos para a marca selecionada
    this.viagemService.doesTaxiHaveViagem(this.selectedTaxi._id).subscribe(status => {
      if (status === -1) {
        console.log('Táxi não possui viagens');
        this.editConforto = true;
      } else if (status === 0) {
        console.log('Táxi possui viagens');
        this.editConforto = false;
      }
    });
  }

  getTaxis(): void {
    this.taxiService.getTaxis()
        .subscribe(taxis => this.taxis = taxis);
  }

  createTaxi(matricula: string, marca : string, modelo : string, anoCompra : string, conforto : string){

    //a verificacao da matricula deve ser apenas se possui 6 caracteres, com - pelo meio e que possua tanto letras como numero
    const formato = /^[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{2}$/i;

    if (!formato.test(matricula) ) {
      console.error("A matrícula deve ser possuir 6 caracteres, e que possua tanto letras como número.");
      this.validPlate = false;
      return;
    }
    this.validPlate = true;

      const taxi = {
      matricula: matricula,
      marca: marca,
      modelo: modelo,
      ano_de_compra: anoCompra,
      nivel_de_conforto: conforto
    };

    console.log(taxi);

    this.taxiService.addTaxi(taxi as Taxi)
      .subscribe(taxi => {
        console.log("Taxi recebido do backend:", taxi);
        this.taxis.unshift(taxi);
        this.loadTaxis();
      });
  }

  

updateTaxi() {
    if (!this.selectedTaxi) return;

    const formato = /^[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{2}$/i;

    if (!formato.test(this.selectedTaxi.matricula)) {
      console.error("A matrícula deve possuir 6 caracteres, com letras e números.");
      this.validPlate = false;
      return;
    }

    this.validPlate = true;

    this.taxiService.updateTaxi(this.selectedTaxi, this.selectedTaxi._id).subscribe(updatedTaxi => {
      this.taxis = this.taxis.filter(t => t._id !== updatedTaxi._id);

      this.taxis.unshift(updatedTaxi);

      this.selectedTaxi = undefined;
    });
  }

  
  //esta funcao estah aqui pq sem ela no subscribe em cima apos criar um novo taxi
  //quando a lista de taxis eh atualizada este novo elemento aparece com as properties em branco e so apos um refresh ah pagina
  //eh que este aparece integro
  loadTaxis() {
    this.taxiService.getTaxis()
      .subscribe((taxis) => {
        this.taxis = taxis.reverse();
      });
  }

  //logica para cada marca os seus distintos modelos
  onMarcaChange(marcaSelecionada: string) {
    this.modelosFiltrados = this.modelos[marcaSelecionada] || [];
  }

    deleteTaxi(taxi: Taxi): void {
    //se este taxi ja foi requisitado para algum turno, nao deve ser apagado
    //
      this.turnoService.getTurnosByTaxi(taxi._id).subscribe(turnos => {
        const turnosArray = turnos;

        if (!turnosArray || turnosArray.length === 0) {
          console.log("Táxi não tem turnos, pode apagar");
          this.taxis = this.taxis.filter(h => h !== taxi);
          this.taxiService.deleteTaxi(taxi._id).subscribe();  } 
          else {
          console.error("Este táxi já foi requisitado em algum turno.");
          return;
        }

      });
    
    }        // Só apaga se não tiver turnos
       
}
