import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Price } from '../price';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransportPricesService {
  private pricesUrl = 'http://10.101.151.25:3028/prices';  // URL to web api

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  getPrices(): Observable<Price> {
    return this.http.get<Price>(this.pricesUrl).pipe(
      catchError(err => {
        console.error('Error occurred:', err);
        return throwError(err); 
      })
    );
  }
  
  updatePrices(price: Price): Observable<any> {
    return this.http.put(this.pricesUrl, price, this.httpOptions).pipe(
      catchError(err => {
        console.error('Error occurred:', err);
        return throwError(err);
      })
    );
  }
  
}
