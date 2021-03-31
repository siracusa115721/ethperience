import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-canjear-experiencia',
  templateUrl: './canjear-experiencia.component.html',
  styleUrls: ['./canjear-experiencia.component.css']
})
export class CanjearExperienciaComponent implements OnInit {

  id: any;
  ganador: any;
  codigoExp: string;
  dialogRef: any;
  cs: ContractService;
  esperandoRespuesta: boolean;

  constructor( _cs: ContractService, _dialogRef: MatDialogRef<CanjearExperienciaComponent>, @Inject(MAT_DIALOG_DATA) public data) { 
    this.id = data.id;
    this.ganador = data.ganador;
    this.codigoExp = data.codigoExp;
    this.cs = _cs;
    this.dialogRef = _dialogRef;
    this.esperandoRespuesta = false;
  }

  ngOnInit(): void {
  }

  async confirmar() {
    this.esperandoRespuesta = true;
    await this.cs.canjearExperiencia(this.id, this.codigoExp).then( response => {
      this.esperandoRespuesta = false;
      this.dialogRef.close(response);
    });    
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}
