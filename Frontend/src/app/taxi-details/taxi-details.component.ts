import { Component , Input } from '@angular/core';
import { Taxi } from '../taxi';


@Component({
  selector: 'app-taxi-details',
  standalone: false,
  templateUrl: './taxi-details.component.html',
  styleUrl: './taxi-details.component.css'
})
export class TaxiDetailsComponent {
  @Input() taxi?: Taxi;

}
