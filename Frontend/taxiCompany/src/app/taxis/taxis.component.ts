import { Component } from '@angular/core';
import { Taxi } from '../taxi';
import { TAXIS } from '../mock-taxis';



@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  standalone: false,
  styleUrl: './taxis.component.css'
})
export class TaxisComponent {
  taxis = TAXIS;
}
