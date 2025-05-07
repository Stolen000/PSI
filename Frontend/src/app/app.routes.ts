import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportPricesComponent } from './transport-prices/transport-prices.component';
import { TaxisComponent } from './taxis/taxis.component';
import { MotoristaComponent } from './motorista/motorista.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MotoristaPerfilComponent } from './motorista-perfil/motorista-perfil.component';


export const routes: Routes = [
    
    { path: "taxis" , component: TaxisComponent },
    { path: "prices" , component: TransportPricesComponent },
    { path: "dashboard", component: DashboardComponent},
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: "motorista", component: MotoristaComponent},
    { path: "motorista-perfil/:id", component: MotoristaPerfilComponent},
    { path: '**', redirectTo: '/dashboard' }
]; 

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutes { 
    
  }