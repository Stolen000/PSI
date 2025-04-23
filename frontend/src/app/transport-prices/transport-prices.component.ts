import { Component, OnInit } from '@angular/core';
import { TransportPricesService } from '../services/transport-prices.service';
import { Price } from '../price';

@Component({
  selector: 'app-transport-prices',
  templateUrl: './transport-prices.component.html',
  styleUrls: ['./transport-prices.component.css'],
  standalone: false

})
//
export class TransportPricesComponent implements OnInit{
  price: Price = {
    basic_price: '',
    luxurious_price: '',
    nocturne_tax: ''
  };
  validPriceInput = true;
  tripCost: number | null = null;
  showTripCalculator = false;
  constructor(private transpPriceService : TransportPricesService){ }

  ngOnInit(): void {
    this.getPrices();
  } 

  getPrices(): void{
    this.transpPriceService.getPrices()
      .subscribe(prices => this.price = prices);
  }

  toggleTripCalculator(): void {
    this.showTripCalculator = !this.showTripCalculator;
    this.tripCost = null;
  }

  savePrice(basic: string, luxury: string, surcharge: string): void {
    const price: Price = {
      basic_price: basic,      
      luxurious_price: luxury,
      nocturne_tax: surcharge
    };
    console.log(price);
    if(!price || !(parseFloat(price.basic_price) >= 0 && parseFloat(price.luxurious_price) >= 0 &&
          parseFloat(price.nocturne_tax) >= 0)){
      this.validPriceInput = false;
      return;
    }

    this.validPriceInput = true;

    
    if (price.basic_price !== this.price.basic_price ||
      price.luxurious_price !== this.price.luxurious_price ||
      price.nocturne_tax !== this.price.nocturne_tax
  ) {
      this.transpPriceService.updatePrices(price)
        .subscribe((response => {
          if(response && response.prices){
            this.price = response.prices;
          }
        }));

    }
  }

   // Calculate the cost of the fictional trip
   calculateTripCost(comfortLevel: string, startTime: string, endTime: string): void {
    if (!this.price || !comfortLevel || !startTime || !endTime) return;
    
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    let startMin = startH * 60 + startM;
    let endMin = endH * 60 + endM;

    if (endMin <= startMin) endMin += 24 * 60;

    const pricePerMinute = comfortLevel === 'basic'
      ? parseFloat(this.price.basic_price)
      : parseFloat(this.price.luxurious_price);

    const taxRate = parseFloat(this.price.nocturne_tax) / 100;
    let total = 0;

    for (let i = startMin; i < endMin; i++) {
      const hour = Math.floor(i % 1440 / 60);
      const isNight = hour >= 21 || hour < 6;
      total += pricePerMinute * (isNight ? 1 + taxRate : 1);
    }

    this.tripCost = Math.round(total * 100) / 100;
  }

  

}
