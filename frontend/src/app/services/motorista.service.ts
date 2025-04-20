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

  /** GET heroes from the server */
  getMotoristas(): Observable<Motorista[]> {
    return this.http.get<Motorista[]>(this.motoristaUrl)

  }

  

}