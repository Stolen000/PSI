import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MotoristaComponent } from './motorista/motorista.component';

const routes: Routes = [
  { path: 'motorista', component: MotoristaComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}