import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportPricesComponent } from './transport-prices/transport-prices.component';
import { TaxisComponent } from './taxis/taxis.component';


export const routes: Routes = [
    
    { path: "taxi" , component: TaxisComponent },
    { path: "prices" , component: TransportPricesComponent }
]; 

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutes { 
    
  }