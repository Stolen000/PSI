import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Turno } from '../turno';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private turnosUrl = 'http://localhost:3000/turnos';  // URL to web api
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  getTurnos(): Observable<Turno[]>{
    return this.http.get<Turno[]>(this.turnosUrl).pipe(
      catchError(err => {
        console.error('Error occurred:', err);
        return throwError(err); 
      })
    );
  }


  getTurnosByMotorista(motorista_id: string): Observable<Turno[]>{
    const url = `${this.turnosUrl}/${motorista_id}`;
    return this.http.get<Turno[]>(url).pipe(
      catchError(err => {
        console.error('Error occurred:', err);
        return throwError(err); 
      })
    );
  }


  /** POST: add a new motorista to the server */
  addTurno(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(this.turnosUrl, turno, this.httpOptions).pipe(
      catchError(err => {
        console.error('Error occurred:', err);
        return throwError(err); 
      })
    );
  }


}

