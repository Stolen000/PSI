import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodigoPostalService {
  private url = 'assets/codigos_postais.json';  // Caminho do arquivo JSON

  constructor(private http: HttpClient) {}

  // Método que retorna um Observable com todos os códigos postais
  getCodigosPostais(): Observable<any[]> {
    return this.http.get<any[]>(this.url);  // Faz a requisição HTTP para obter o JSON
  }
}
