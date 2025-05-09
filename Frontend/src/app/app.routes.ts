import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportPricesComponent } from './transport-prices/transport-prices.component';
import { TaxisComponent } from './taxis/taxis.component';
import { MotoristaComponent } from './motorista/motorista.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequisitarViagemComponent } from './requisitar-viagem/requisitar-viagem.component';


export const routes: Routes = [
    
    { path: "taxis" , component: TaxisComponent },
    { path: "prices" , component: TransportPricesComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: "motorista", component: MotoristaComponent},
    { path: "dashboard", component: DashboardComponent},
    { path: "pedidos", component: RequisitarViagemComponent},
]; 

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutes { 
    
  }