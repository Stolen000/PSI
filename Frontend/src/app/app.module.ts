import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
//import { HttpClientModule } from '@angular/common/http';

import { HttpClientModule } from '@angular/common/http'; // <-- Import HttpClientModule
import { TransportPricesComponent } from './transport-prices/transport-prices.component';
import { AppComponent } from './app.component';
import { TaxisComponent } from './taxis/taxis.component';
import { TaxiDetailsComponent } from "./taxi-details/taxi-details.component";
import { MotoristaComponent } from './motorista/motorista.component';
import { AppRoutes } from './app.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequisitarViagemComponent } from './requisitar-viagem/requisitar-viagem.component';
import { MotoristaPerfilComponent } from './motorista-perfil/motorista-perfil.component';
import { RegistarViagemComponent } from './registar-viagem/registar-viagem.component';
import { RequisicaoTaxiComponent } from './requisicao-taxi/requisicao-taxi.component';
import { PedidosMotoristaComponent } from './pedidos-motorista/pedidos-motorista.component';
import { AreaGestorComponent } from './area-gestor/area-gestor.component';

@NgModule({
  declarations: [
    AppComponent,
    TaxisComponent,
    TaxiDetailsComponent,
    TransportPricesComponent,
    MotoristaComponent,
    DashboardComponent,
    RequisitarViagemComponent,
    MotoristaPerfilComponent,
    RegistarViagemComponent,
    RequisicaoTaxiComponent,
    PedidosMotoristaComponent,
    AreaGestorComponent 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
