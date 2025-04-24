import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Motorista } from '../motorista';

@Injectable({ providedIn: 'root' })
export class MotoristaService {

  private motoristaUrl = 'http://localhost:3000/motoristas';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }


  /** POST: add a new motorista to the server */
  addMotorista(motorista: Motorista): Observable<Motorista> {
    return this.http.post<Motorista>(this.motoristaUrl, motorista, this.httpOptions).pipe(
      tap((newMotorista: Motorista) => this.log(`added motorista w/ id=${newMotorista._id}`)),
      catchError(this.handleError<Motorista>('addMotorista'))
    );
  }


  getMotoristas(): Observable<Motorista[]> {
    return this.http.get<Motorista[]>(this.motoristaUrl)

      .pipe(
        tap(_ => this.log('fetched motoristas')),
        catchError(this.handleError<Motorista[]>('getMotoristas', []))
      );
  }

  deleteMotorista(id: string): Observable<Motorista> {
    console.log("delete no motoristaService.ts")
    const url = `${this.motoristaUrl}/${id}`;
    console.log(url)

    return this.http.delete<Motorista>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted motorista id=${id}`)),
      catchError(this.handleError<Motorista>('deleteMotorista'))
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