import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HeroesComponent } from './motorista/motorista.component';


import { PetsComponent } from './taxis/taxis.component';

const routes: Routes = [

  { path: 'heroes', component: HeroesComponent },
  { path: 'pets', component: PetsComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}