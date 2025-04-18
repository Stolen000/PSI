import { Injectable } from '@angular/core';
import { Taxi } from '../taxi';
import { TAXIS } from '../mock-taxis';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TaxiService {

  constructor() { }

  getTaxis(): Observable<Taxi[]> {
    const taxis = of(TAXIS);
    return taxis;
  }
}
