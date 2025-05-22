import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Viagem } from '../viagem';
import { catchError, Observable, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViagemService {
  private viagemUrl = 'http://localhost:3000/viagens';
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getViagens(): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(this.viagemUrl);
  }

  getViagem(id: string): Observable<Viagem> {
    return this.http.get<Viagem>(`${this.viagemUrl}/${id}`);
  }

  criarViagem(viagem: Viagem): Observable<Viagem> {
    console.log(viagem.pedido_id);
    return this.http.post<Viagem>(this.viagemUrl, viagem).pipe(
      catchError(err => {
        console.error('Error occurred:', err);
        return throwError(err); 
      })
    );
  }

  //metodo para enviar o inicio date para o backend
  atualizarViagemInicio(inicio: Date, viagem: Viagem): Observable<Viagem> {
    const body = { inicio_viagem: inicio };
    return this.http.put<Viagem>(`${this.viagemUrl}/${viagem._id}/inicio`, body);
  }


  //metodo para enviar o fim date para o backend
  atualizarViagemFim(fim: Date, viagem: Viagem): Observable<Viagem> {
    const body = { fim_viagem: fim };
    return this.http.put<Viagem>(`${this.viagemUrl}/${viagem._id}/fim`, body);
  }


  atualizarViagem(id: string, viagem: Viagem): Observable<Viagem> {
    return this.http.put<Viagem>(`${this.viagemUrl}/${id}`, viagem);
  }

  apagarViagem(id: string): Observable<any> {
    return this.http.delete(`${this.viagemUrl}/${id}`);
  }


  getViagemAtualDoMotorista(motorista_id: string): Observable<Viagem | null> {
  const url = `${this.viagemUrl}/${motorista_id}`;
  return this.http.get<Viagem | null>(url);
}

  doesTaxiHaveViagem(taxi_id: string): Observable<number> {
    const url = `${this.viagemUrl}/taxi/${taxi_id}`;
    return this.http.get<{ status: number }>(url).pipe(
      map((response: { status: number }) => response.status)
    );
  }
  
}
