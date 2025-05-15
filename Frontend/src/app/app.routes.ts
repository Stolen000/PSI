import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportPricesComponent } from './transport-prices/transport-prices.component';
import { TaxisComponent } from './taxis/taxis.component';
import { MotoristaComponent } from './motorista/motorista.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequisitarViagemComponent } from './requisitar-viagem/requisitar-viagem.component';
import { MotoristaPerfilComponent } from './motorista-perfil/motorista-perfil.component';
import { RequisicaoTaxiComponent } from './requisicao-taxi/requisicao-taxi.component';
import { PedidosMotoristaComponent } from './pedidos-motorista/pedidos-motorista.component';
import { RegistarViagemComponent } from './registar-viagem/registar-viagem.component';
import { AreaGestorComponent } from './area-gestor/area-gestor.component';
import { AreaMotoristaComponent } from './area-motorista/area-motorista.component';


export const routes: Routes = [
    
    { path: "gestor" , component:AreaGestorComponent},
    { path: "taxis" , component: TaxisComponent },
    { path: "prices" , component: TransportPricesComponent },
    { path: "dashboard", component: DashboardComponent},
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: "motorista", component: AreaMotoristaComponent},
    { path: "motoristas", component: MotoristaComponent},
    { path: "dashboard", component: DashboardComponent},
    { path: "pedidos", component: RequisitarViagemComponent},
    { path: "motorista-perfil/:id", component: MotoristaPerfilComponent},
    { path: "motorista-perfil/:motorista_id/pedido-taxi", component: RequisicaoTaxiComponent},
    {  path: "motorista-perfil/:id/aceitar-pedido", component: PedidosMotoristaComponent},
    { path: "motorista-perfil/:id/registo-viagem", component: RegistarViagemComponent},
    { path: '**', redirectTo: '/dashboard' },

]; 

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutes { 
    
  }