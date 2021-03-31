import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-registro-anunciante',
  templateUrl: './registro-anunciante.component.html',
  styleUrls: ['./registro-anunciante.component.css']
})
export class RegistroAnuncianteComponent implements OnInit {

  account: string;
  dialogRef: any;
  nombreEmpresa: string;
  cs: ContractService;
  paso: number;
  esperandoRespuesta: boolean;

  constructor( _cs: ContractService, _dialogRef: MatDialogRef<RegistroAnuncianteComponent>) { 
    this.account = localStorage.getItem('account');
    this.cs = _cs;
    this.dialogRef = _dialogRef;
    this.paso = 1;
    this.nombreEmpresa = '';
    this.esperandoRespuesta = false;
  }

  ngOnInit(): void {
  }

  actualizarNombreEmpresa() {
    this.nombreEmpresa = (<HTMLInputElement>document.getElementById("nombreEmpresa")).value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  async confirmarRegistro() {
    this.esperandoRespuesta = true;
    await this.cs.addAnunciante(this.nombreEmpresa).then( response => {
      this.esperandoRespuesta = false;
      this.dialogRef.close(response);
    });    
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}
