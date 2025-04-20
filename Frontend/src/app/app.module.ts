import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { TransportPricesComponent } from './transport-prices/transport-prices.component';
import { AppComponent } from './app.component';
import { TaxisComponent } from './taxis/taxis.component';
import { TaxiDetailsComponent } from "./taxi-details/taxi-details.component";
import { AppRoutes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    TaxisComponent,
    TaxiDetailsComponent,
    TransportPricesComponent 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutes,
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }