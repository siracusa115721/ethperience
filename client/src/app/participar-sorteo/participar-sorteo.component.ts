import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-participar-sorteo',
  templateUrl: './participar-sorteo.component.html',
  styleUrls: ['./participar-sorteo.component.css']
})
export class ParticiparSorteoComponent implements OnInit {

  cs: ContractService;
  dialogRef: any;
  id: any;
  premium: any;
  tokens: any;
  participaciones: any;
  participacionesActuales: any;
  participacionesRestantes: any;
  maximoTokens: any;
  paso: number;
  esperandoRespuesta: boolean;

  constructor( @Inject(MAT_DIALOG_DATA) data: {id: any, premium: any, tokens: any, participacionesActuales: any}, _cs: ContractService, _dialogRef: MatDialogRef<ParticiparSorteoComponent>) {
    this.id = data.id;
    this.premium = data.premium;
    this.tokens = data.tokens;
    this.participaciones = 0;
    this.participacionesActuales = data.participacionesActuales;
    this.participacionesRestantes = 5 - this.participacionesActuales;
    this.maximoTokens = Math.min(this.tokens, this.participacionesRestantes);
    this.cs = _cs;    
    this.dialogRef = _dialogRef;
    this.paso = 1;
    this.esperandoRespuesta = false;
  }

  ngOnInit(): void {
  }

  actualizarParticipaciones(event){
    this.participaciones = +(<HTMLInputElement>document.getElementById("participaciones")).value;
  }

  async confirmarParticipacion(){
    this.esperandoRespuesta = true;
    console.log('Participando en el sorteo ' + this.id + ' con ' + this.participaciones + ' tokens y es premium: ' + this.premium);
    await this.cs.participar(this.id, this.participaciones, this.premium).then( response => {
      this.esperandoRespuesta = false;
      this.dialogRef.close(response);
    });    
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}
