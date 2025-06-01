import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Turno } from '../turno';
import { catchError, first, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private turnosUrl = 'http://10.101.151.25:3028/turnos';  // URL to web api
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  getTurnos(): Observable<Turno[]>{
    return this.http.get<Turno[]>(this.turnosUrl).pipe(
      catchError(err => {
        if (err.status === 404) {
          return of([]);
        }
        return throwError(() => err);
      })
    );
  }


  getTurnosByMotorista(motorista_id: string): Observable<Turno[]>{
    const url = `${this.turnosUrl}/${motorista_id}`;
    return this.http.get<Turno[]>(url).pipe(
      catchError(err => {
        if (err.status === 404) {
          return of([]);
        }
        return throwError(() => err);
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
  getTurnosByTaxi(taxi_id: string): Observable<Turno[]> {
    const url = `${this.turnosUrl}/taxi/${taxi_id}`;
    return this.http.get<{ turnos: Turno[] }>(url).pipe(
      map(response => response.turnos), // Extrai só o array
      catchError(err => {
        console.error('Error occurred:', err);
        return throwError(err);
      })
    );
  }


  getTurnoById(turno_id: string): Observable<Turno> {
    const url = `${this.turnosUrl}/turno/${turno_id}`;
    return this.http.get<Turno>(url).pipe(
      catchError(err => {
        console.error('Error occurred:', err);
        return throwError(err);
      })
    );
  }

  incrementaTurno(turnoId: string): Observable<Turno> {
    const url = `${this.turnosUrl}/maisum/${turnoId}`;
    return this.http.patch<Turno>(url, {}, this.httpOptions).pipe(
      catchError(err => {
        console.error('Erro ao incrementar turno:', err);
        return throwError(() => err);
      })
    );
  }



  getTurnoAtual(motorista_id: string): Observable<Turno | undefined> {
    const dateAtual = new Date();
    return this.getTurnosByMotorista(motorista_id).pipe(
      map(turnos => {
        // Sort by start time
        turnos.sort((a, b) => new Date(a.periodo.inicio).getTime() - new Date(b.periodo.inicio).getTime());

        // Filter those that haven't ended yet
        const upcomingTurnos = turnos.filter(turno => new Date(turno.periodo.fim) > dateAtual);

        // Check only the first turno
        const firstTurno = upcomingTurnos[0];
        if (!firstTurno) return undefined;

        let inicio = new Date(firstTurno.periodo.inicio);
        let fim = new Date(firstTurno.periodo.fim);
        if (dateAtual >= inicio && dateAtual <= fim) {
          return firstTurno;
        }
        return undefined;
      })
    );
  }



  deleteTurno(turno: Turno): Observable<Turno>{
    const url = `${this.turnosUrl}/${turno._id}`;
    return this.http.delete<Turno>(url, this.httpOptions).pipe(
    );
  }
  private log(message: string): void {
    console.log(`TurnoService: ${message}`);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Optional: log to remote logging infrastructure
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}

