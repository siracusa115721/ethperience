import { Component, OnInit } from '@angular/core';
import { ContractService } from '../services/contract.service';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-comprar-tokens',
  templateUrl: './comprar-tokens.component.html',
  styleUrls: ['./comprar-tokens.component.css']
})
export class ComprarTokensComponent implements OnInit {

  cs: ContractService;
  balance: any;
  coste: string;
  dialogRef;
  factorConversionStandard: number;
  factorConversionPremium: number;
  tokensStandard: number;
  tokensPremium: number;
  errorMessage: string;
  paso: number;
  esperandoRespuesta: boolean;

  constructor(_cs: ContractService, _dialogRef: MatDialogRef<ComprarTokensComponent>) {
    this.cs = _cs;
    this.coste = '0';
    this.dialogRef = _dialogRef;
    this.factorConversionStandard = 0.0045;
    this.factorConversionPremium = 2 * this.factorConversionStandard;
    this.tokensStandard = 0;
    this.tokensPremium = 0;
    this.paso = 1;
    this.esperandoRespuesta = false;
    this.loadPage();    
  }

  ngOnInit(): void {
  }

  async loadPage() {
    this.balance = await this.cs.accountBalance();
  }

  actualizaSaldo(premium, event): any {
    console.log(event);
    if(premium){
      this.tokensPremium = +(<HTMLInputElement>document.getElementById("token-premium")).value;
      console.log('Token premium: ' + this.tokensPremium);
    }else{
      this.tokensStandard = +(<HTMLInputElement>document.getElementById("token-standard")).value;
      console.log('Token standard: ' + this.tokensStandard);
    }
    this.coste = (this.tokensStandard * this.factorConversionStandard + this.tokensPremium * this.factorConversionPremium).toFixed(4);
    if(+this.coste > +this.balance){
      this.errorMessage = 'No dispone de saldo suficiente para realizar esta compra'
    }
  }

  async confirmarCompra(){
    this.esperandoRespuesta = true;
    await this.cs.comprarToken(this.tokensStandard, this.tokensPremium).then( response => {
      this.esperandoRespuesta = false;
      this.dialogRef.close(response);
    });    
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}
