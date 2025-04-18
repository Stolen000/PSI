import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppComponent } from './app.component';
import { TaxisComponent } from './taxis/taxis.component';
import { TaxiDetailsComponent } from "./taxi-details/taxi-details.component";

@NgModule({
  declarations: [
    AppComponent,
    TaxisComponent,
    TaxiDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }