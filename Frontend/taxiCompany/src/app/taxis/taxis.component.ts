import { Component } from '@angular/core';
import { Taxi } from '../taxi';
import { TaxiService } from '../services/taxi.service';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  standalone: false,
  styleUrl: './taxis.component.css'
})
export class TaxisComponent {
  constructor(private taxiService: TaxiService) {}

  ngOnInit(): void {
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
}
