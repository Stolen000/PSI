import { Injectable } from '@angular/core';
import { Taxi } from '../taxi';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TaxiService {

  private taxiUrl = 'http://10.101.151.25:3028/taxis';  // URL to web api

  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** POST: add a new taxi to the server */
  addTaxi(taxi: Taxi): Observable<Taxi> {
    return this.http.post<Taxi>(this.taxiUrl, taxi, this.httpOptions).pipe(
      tap((newTaxi: Taxi) => this.log(`added taxi w/ matricula=${newTaxi._id}`)),
      catchError(this.handleError<Taxi>('addTaxi'))
    );
  }

  getTaxi(id: string): Observable<Taxi> {
    const url = `${this.taxiUrl}/${id}`;
    return this.http.get<Taxi>(url).pipe(
      tap(_ => this.log(`fetched taxi id=${id}`)),
      catchError(this.handleError<Taxi>(`getTaxi id=${id}`))
    );
  }

  getTaxis(): Observable<Taxi[]> {
    return this.http.get<Taxi[]>(this.taxiUrl)

      .pipe(
        tap(_ => this.log('fetched taxis')),
        catchError(this.handleError<Taxi[]>('getTaxis', []))
      );
  }

  updateTaxi(taxi: Taxi, id: string): Observable<Taxi> {
    //quero que esta funcao envie o taxi no body e o id na url
    const url = `${this.taxiUrl}/${id}`;
    return this.http.put<Taxi>(url, taxi, this.httpOptions).pipe(
      tap(_ => this.log(`updated taxi id=${id}`)),
      catchError(this.handleError<Taxi>('updateTaxi'))
    );
  }

  deleteTaxi(id: string): Observable<Taxi> {
    console.log("delete no taxiService.ts")
    const url = `${this.taxiUrl}/${id}`;
    console.log(url)

    return this.http.delete<Taxi>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted taxi id=${id}`)),
      catchError(this.handleError<Taxi>('deleteTaxi'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a MotoristaService message with the MessageService */
  private log(message: string) {
    
  }
}
