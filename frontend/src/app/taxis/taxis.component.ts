import { Component } from '@angular/core';
import { Taxi } from '../taxi';
import { TaxiService } from '../services/taxi.service';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  standalone: false,
  styleUrls: ['./taxis.component.css']
})
export class TaxisComponent {
  constructor(private taxiService: TaxiService) {}

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
  }

  getTaxis(): void {
    this.taxiService.getTaxis()
        .subscribe(taxis => this.taxis = taxis);
  }

  createTaxi(matricula: string, marca : string, modelo : string, anoCompra : string, conforto : string){

    const formato1 = /^[A-Z]{2}-\d{2}-[A-Z]{2}$/; //LL-NN-LL
    const formato2 = /^\d{2}-[A-Z]{2}-\d{2}$/;    //NN-LL-NN
    
    if (!formato1.test(matricula) && !formato2.test(matricula)) {
      console.error("A matrícula deve ser do formato LL-NN-LL ou NN-LL-NN.");
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

    this.taxiService.addTaxi(taxi)
    .subscribe(taxi => {
      console.log("Taxi recebido do backend:", taxi);
      this.loadTaxis(); // <- recarrega a lista com os dados atualizados direto do backend
    });
  }
  
  //esta funcao estah aqui pq sem ela no subscribe em cima apos criar um novo taxi
  //quando a lista de taxis eh atualizada este novo elemento aparece com as properties em branco e so apos um refresh ah pagina
  //eh que este aparece integro
  loadTaxis() {
    this.taxiService.getTaxis()
      .subscribe((taxis) => {
        this.taxis = taxis;
      });
  }

  //logica para cada marca os seus distintos modelos
  onMarcaChange(marcaSelecionada: string) {
    this.modelosFiltrados = this.modelos[marcaSelecionada] || [];
  }
}
