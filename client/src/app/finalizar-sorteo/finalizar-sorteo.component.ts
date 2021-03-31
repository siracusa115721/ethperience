import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ContractService } from '../services/contract.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-finalizar-sorteo',
  templateUrl: './finalizar-sorteo.component.html',
  styleUrls: ['./finalizar-sorteo.component.css']
})
export class FinalizarSorteoComponent implements OnInit {

  id: any;
  recaudacion: any;
  dialogRef: any;
  cs: ContractService;
  esperandoRespuesta: boolean;

  constructor( _cs: ContractService, _dialogRef: MatDialogRef<FinalizarSorteoComponent>, @Inject(MAT_DIALOG_DATA) public data) { 
    this.id = data.id;
    this.recaudacion = data.recaudacion;
    this.cs = _cs;
    this.dialogRef = _dialogRef;
    this.esperandoRespuesta = false;
  }

  ngOnInit(): void {
  }

  async confirmar() {
    this.esperandoRespuesta = true;
    await this.cs.finalizarSorteo(this.id).then( response => {
      this.esperandoRespuesta = false;
      this.dialogRef.close(response);
    });    
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}
