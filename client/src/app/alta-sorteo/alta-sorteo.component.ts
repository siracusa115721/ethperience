import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import * as DTF from 'dateformat';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-alta-sorteo',
  templateUrl: './alta-sorteo.component.html',
  styleUrls: ['./alta-sorteo.component.css']
})
export class AltaSorteoComponent implements OnInit {

  today = new Date();
  month = this.today.getMonth();
  year = this.today.getFullYear();

  cs: ContractService;
  dialogRef: any;
  errorText: string;
  paso: number;

  tipo: string;
  premium: string;

  formData: any;

  esperandoRespuesta: boolean;

  addSorteoForm: FormGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    fechaInicio: new FormControl('', [Validators.required]),
    fechaFin: new FormControl('', [Validators.required]),
    precioExp: new FormControl('', [Validators.required]),
    tipo: new FormControl('', [Validators.required]),
    premium: new FormControl(false, [Validators.required])
  });

  constructor( _cs: ContractService, _dialogRef: MatDialogRef<AltaSorteoComponent>) { 
    this.cs = _cs;
    this.dialogRef = _dialogRef;
    this.paso = 1;
    this.esperandoRespuesta = false;
  }

  ngOnInit(): void {
  }

  async submitForm(form){
    if(this.addSorteoForm.valid){
      this.formData = this.formatSorteoData(form);
      this.paso = 2;
      this.errorText = '';
    }else{
      this.errorText = 'Por favor, revise todos los campos introducidos o complete los que no haya rellenado.'
    }
  }

  async confirmSorteo(){
    this.esperandoRespuesta = true;
    this.cs.addSorteo(this.formData.titulo, this.formData.descripcion, this.formData.fechasExp, this.formData.precioExp, this.formData.tipo, this.formData.premium).then( response => {
      this.esperandoRespuesta = false;
      this.dialogRef.close(response);
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  private formatSorteoData(data) {
    const titulo = data.value.titulo.replace(/[\r\n\v]+/g, '. ').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const descripcion = data.value.descripcion.replace(/[\r\n\v]+/g, '. ').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const fechaInicio = DTF(data.value.fechaInicio,'dd/mm/yyyy');
    const fechaFin = DTF(data.value.fechaFin,'dd/mm/yyyy');
    const fechasExp = fechaInicio + '-' + fechaFin;
    const precioExp = data.value.precioExp;
    const tipo = data.value.tipo;
    const premium = data.value.premium;
    const sorteoData = {
      titulo: titulo,
      descripcion: descripcion,
      fechasExp: fechasExp,
      precioExp: precioExp,
      tipo: tipo,
      premium: premium
    };

    this.tipo = this.getTipo(tipo);
    this.premium = premium ? 'Sí' : 'No';
    return sorteoData;
  }

  private getTipo(tipo: string){
    switch(tipo){
      case '1':
        return 'Montaña';
      case '2':
        return 'Ciudad';
      case '3':
        return 'Restaurante';
      case '4':
        return 'Campo';
      case '5':
        return 'Aventura';
      case '6':
        return 'Playa';
    }
  }

}
