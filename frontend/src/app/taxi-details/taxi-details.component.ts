import { Component , Input } from '@angular/core';
import { Taxi } from '../taxi';


@Component({
  selector: 'app-taxi-details',
  standalone: false,
  templateUrl: './taxi-details.component.html',
  styleUrls: ['./taxi-details.component.css']
})
export class TaxiDetailsComponent {
  @Input() taxi?: Taxi;

}
