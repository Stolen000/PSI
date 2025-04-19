import { Component, OnInit } from '@angular/core';

import { Motorista } from '../motorista';
import { MotoristaService } from '../motorista.service';

@Component({
  selector: 'app-motorista',
  templateUrl: './motorista.component.html',
  standalone: false,
  styleUrls: ['./motorista.component.css']
})
export class MotoristaComponent implements OnInit {
  motoristas: Motorista[] = [];

  constructor(private motoristaService: MotoristaService) { }

  ngOnInit(): void {

  }


}