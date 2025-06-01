import { Injectable } from '@angular/core';
import { Pedido_Viagem } from '../pedido-viagem';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PedidosViagemService {
  private pedidosUrl = 'http://10.101.151.25:3028/pedidos';  


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** POST: add a new pedido to the server */
  addPedido(pedido: Pedido_Viagem): Observable<{ pedido: Pedido_Viagem, pedidos: Pedido_Viagem[] }> {
    return this.http.post<{ pedido: Pedido_Viagem, pedidos: Pedido_Viagem[] }>(this.pedidosUrl, pedido, this.httpOptions)
      .pipe(
        tap(response => this.log(`Pedido criado com id=${response.pedido._id}`)),
        catchError(this.handleError<{ pedido: Pedido_Viagem, pedidos: Pedido_Viagem[] }>('addPedido'))
      );
  }

  getPedidos(): Observable<Pedido_Viagem[]> {
    return this.http.get<Pedido_Viagem[]>(this.pedidosUrl)

      .pipe(
        tap(_ => this.log('fetched pedidos')),
        catchError(this.handleError<Pedido_Viagem[]>('getPedidos', []))
      );
  }

  deletePedido(id: string): Observable<Pedido_Viagem> {
    const url = `${this.pedidosUrl}/${id}`; // DELETE api/pedidos_viagem/1
    return this.http.delete<Pedido_Viagem>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted pedido id=${id}`)),
      catchError(this.handleError<Pedido_Viagem>('deletePedido'))
    );
  }

  updatePedido(pedido: Pedido_Viagem): Observable<any> {
    const url = `${this.pedidosUrl}/${pedido._id}`; // PUT api/pedidos_viagem/1
    return this.http.put(url, pedido, this.httpOptions).pipe(
      tap(_ => this.log(`updated pedido id=${pedido._id}`)),
      catchError(this.handleError<any>('updatePedido'))
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



aceitarPedido(id: string, motoristaId: string, taxiId: string, distanciaMotorista: number, turno_id: String): Observable<Pedido_Viagem> {
  const url = `${this.pedidosUrl}/${id}/aceitar-pedido`;  // URL do PUT para aceitar o pedido

  // Corpo da requisição com os dados adicionais
  const body = { 
    id, 
    motoristaId, 
    taxiId, 
    distanciaMotorista,
    turno_id
  };

  return this.http.put<Pedido_Viagem>(url, body, this.httpOptions)
    .pipe(
      tap(_ => this.log(`Pedido aceito com id=${id}`)),
      catchError(this.handleError<Pedido_Viagem>('aceitarPedido'))
    );
}






   aguardarMotorista(id: string): Observable<Pedido_Viagem> {
    const url = `${this.pedidosUrl}/${id}/aguardar`;
    console.log("Id no service dos pedidos",id)
    return this.http.put<Pedido_Viagem>(url, {}, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Pedido ${id} atualizado para 'aguardar motorista'`)),
        catchError(this.handleError<Pedido_Viagem>('aguardarMotorista'))
      );
  }

  iniciarPedidoViagem(id: string): Observable<Pedido_Viagem> {
    const url = `${this.pedidosUrl}/${id}/iniciar`;
    return this.http.put<Pedido_Viagem>(url, {}, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Pedido ${id} atualizado para 'em curso'`)),
        catchError(this.handleError<Pedido_Viagem>('iniciarPedidoViagem'))
      );
  }

  terminarPedido(id: string): Observable<Pedido_Viagem> {
  const url = `${this.pedidosUrl}/${id}/terminar`;
  return this.http.put<Pedido_Viagem>(url, {}, this.httpOptions).pipe(
    tap(_ => this.log(`Pedido terminado com id=${id}`)),
    catchError(this.handleError<Pedido_Viagem>('terminarPedido'))
  );
}



  /** Log a MotoristaService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }


}
