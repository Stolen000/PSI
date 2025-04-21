import { Component } from '@angular/core';
import { TransportPricesService } from '../services/transport-prices.service';

@Component({
  selector: 'app-transport-prices',
  templateUrl: './transport-prices.component.html',
  styleUrls: ['./transport-prices.component.css'],
  standalone: false

})
export class TransportPricesComponent {

  constructor(private transpPriceService : TransportPricesService){ }

}
