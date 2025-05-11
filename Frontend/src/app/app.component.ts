import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaxisComponent } from "./taxis/taxis.component";

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'taxiCompany';
  sidenavCollapsed = false;

  toggleSidenav() {
    this.sidenavCollapsed = !this.sidenavCollapsed;
  }

}
