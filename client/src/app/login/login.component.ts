import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as cryptoJs from 'crypto-js';
import * as bip39 from 'bip39';
import {hdkey} from 'ethereumjs-wallet';
import * as util from 'ethereumjs-util';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    mnemonic: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  cs: ContractService;
  errorMessage: string;

  seed: string;

  constructor(private router: Router, _cs: ContractService) { 
    this.cs = _cs;
    this.seed = localStorage.getItem('seed');
    localStorage['token'] = 'false';
  }

  ngOnInit(): void {}

  async submitForm(form) {
    if (!this.loginForm.valid) {
        this.errorMessage = 'Por favor, complete todos los campos.';
    } else if (!bip39.validateMnemonic(form.controls.mnemonic.value)) {
        this.errorMessage = 'La seed introducida no es válida. Recuerde que es una lista de 12 palabras.';
    } else if (this.loginForm.controls.password.value.length < 8) {
        this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
    } else {
        bip39.mnemonicToSeed(form.controls.mnemonic.value).then(seed => {
            const pass = form.controls.password.value;
            let encrypted = cryptoJs.AES.encrypt(form.controls.mnemonic.value.trim(), pass).toString();
            if(this.seed != null){
              const seedStorage = cryptoJs.AES.decrypt(this.seed, pass).toString(cryptoJs.enc.Utf8);
              if(form.controls.mnemonic.value.trim() != seedStorage){
                this.errorMessage = 'Los datos introducidos son incorrectos. Deben coincidir con los introducidos al registrarte.';
              }else{
                const path = "m'/44'/60'/0'/0/0";
                const wallet = hdkey.fromMasterSeed(seed).derivePath(path).getWallet();
                const privateKey = wallet.getPrivateKey();
                const address = util.privateToAddress(privateKey).toString('hex');
                const account = '0x'+address;
                this.cs.getAccounts().then( accountMetamask => {
                  console.log('Cuenta generada con los datos introducisos: ' + account);
                  console.log('Cuenta conectada con metamask: ' + accountMetamask);
                  if(account.toLowerCase() != accountMetamask[0].toLowerCase()){
                    this.errorMessage = 'Los datos introducidos son incorrectos. la cuenta generada no coincide con la conectada en Metamask.';
                  }else{
                    localStorage['token'] = 'true';
                    this.router.navigateByUrl('/main');
                  }
                });
              }
            }else{
              localStorage.setItem('seed', encrypted);
              const path = "m'/44'/60'/0'/0/0";
              const wallet = hdkey.fromMasterSeed(seed).derivePath(path).getWallet();
              const privateKey = wallet.getPrivateKey();
              const address = util.privateToAddress(privateKey).toString('hex');
              const account = '0x'+address;
              this.cs.getAccounts().then( accountMetamask => {
                console.log('Cuenta generada con los datos introducisos: ' + account);
                console.log('Cuenta conectada con metamask: ' + accountMetamask);
                if(account.toLowerCase() != accountMetamask[0].toLowerCase()){
                  this.errorMessage = 'Los datos introducidos son incorrectos. la cuenta generada no coincide con la conectada en Metamask.';
                }else{
                  localStorage['token'] = 'true';
                  this.router.navigateByUrl('/main');
                }
              });
            }              
        });
    }
  }

}
