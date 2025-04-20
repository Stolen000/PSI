import { Component, OnInit } from '@angular/core';
import { TransportPricesService } from '../services/transport-prices.service';
import { Price } from '../price';

@Component({
  selector: 'app-transport-prices',
  templateUrl: './transport-prices.component.html',
  styleUrls: ['./transport-prices.component.css'],
  standalone: false

})
//implements OnInit
export class TransportPricesComponent {
  price?:Price;
  constructor(private transpPriceService : TransportPricesService){ }

  /* ngOnInit(): void {
    this.getPrices();
  } */

  getPrices(): void{
    this.transpPriceService.getPrices()
      .subscribe(prices => this.price = prices);
  }

  savePrice(basic: string, luxury: string, surcharge: string): void {
    const price: Price = {
      basic_price: basic,      
      luxurious_price: luxury,
      nocturne_tax: surcharge
    };
    
    if (price) {
      this.transpPriceService.updatePrices(price)
        .subscribe();
    }
  }

}
