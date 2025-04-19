import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Motorista } from './motorista';
//import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class MotoristaService {

}