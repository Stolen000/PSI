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
  tripCost: number | null = null;
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

   // Calculate the cost of the fictional trip
   calculateTripCost(comfortLevel: string, startTime: string, endTime: string): void {
    // Convert time (HH:mm) to minutes
    const startParts = startTime.split(':');
    const endParts = endTime.split(':');
  
    const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
  
    // Calculate duration in minutes
    let durationInMinutes = endMinutes - startMinutes;
  
    // If duration is negative (i.e., end time is earlier than start time), assume it's the next day
    if (durationInMinutes < 0) {
      durationInMinutes += 24 * 60; // Add 24 hours worth of minutes
    }

    // Price per minute, based on comfort level
    let pricePerMinute: number;
    if (comfortLevel === 'basic') {
      pricePerMinute = parseFloat(this.price?.basic_price || '0');
    } else {
      pricePerMinute = parseFloat(this.price?.luxurious_price || '0.25');
    }

    // Check if the trip happens at night (21h - 6h)
    const startHour = parseInt(startParts[0]);
    const endHour = parseInt(endParts[0]);

    let normalDuration = 0;
    let nightDuration = 0;

    // Check if trip starts before 21:00 and ends after 21:00
    if (startHour < 21 && endHour >= 21) {
      // Calculate normal time (before 21:00)
      normalDuration = (21 * 60 - startMinutes); // Time from start to 21:00
      
      // Calculate night time (from 21:00 onwards)
      nightDuration = endMinutes - 21 * 60; // Time from 21:00 to end
    } else if (startHour >= 21) {
      // If trip starts after 21:00, apply the surcharge for the entire duration
      nightDuration = durationInMinutes;
    } else {
      // If trip happens before 21:00, apply no surcharge
      normalDuration = durationInMinutes;
    }

    // Calculate the surcharge percentage
    let surcharge = 0;
    if (nightDuration > 0) {
      surcharge = parseFloat(this.price?.nocturne_tax || '20') / 100; // Convert tax to percentage
    }

    // Calculate the total price
    let totalPrice = 0;

    // Price during the normal hours (before 21:00)
    totalPrice += normalDuration * pricePerMinute;

    // Price during the night time (after 21:00) with surcharge
    if (nightDuration > 0) {
      totalPrice += nightDuration * pricePerMinute * (1 + surcharge);
    }

    // Set the trip cost
    this.tripCost = totalPrice;
  }

  

}
