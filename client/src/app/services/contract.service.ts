import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
const Web3 = require('web3');
const TruffleContract = require('truffle-contract');

declare let window: any;

let contractABI = require('../../../../build/contracts/Sorteos.json');

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  private web3Provider: null;
  private contracts: {};
  private contractInstance: any;
  
  constructor(private router: Router) {
    if(window.ethereum === undefined){
      alert('Instale la extensión de Metamask para poder utilizar esta web.');
    }else{
      if (typeof window.web3 !== 'undefined') {
        this.web3Provider = window.web3.currentProvider;
      } else {
        this.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/dfe3e68ffa1d4b8d99666e51ab5537e2');
      }
  
      const abi = contractABI.abi;
      window.web3 = new Web3(this.web3Provider);
      this.contractInstance = new window.web3.eth.Contract(abi, '0x95222C900327Aee78557b3F15dCFCB965a1D5470');
      console.log(this.contractInstance);
      window.ethereum.enable().then(function(res){
        localStorage.setItem('account', res);
      });
      window.ethereum.on('accountsChanged', function (accounts) {
        const account = accounts[0];
        localStorage.setItem('account', account);
        window.location.reload();
      });
    }    
  }

  async getAccounts() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts;
  }

  async accountBalance() {
    const balance = await window.web3.eth.getBalance(localStorage.getItem('account'));
    var balanceEther: number = +balance / Math.pow(10,18);
    return balanceEther.toFixed(4);
  }

  async addAnunciante(nombreEmpresa: string) {
    const res = await this.contractInstance.methods.addAnunciante(nombreEmpresa).send({ from: localStorage.getItem('account') });
    return res;
  }

  async addSorteo(titulo: string, descripcion: string, fechasExp: string, precioExp: string, tipo: string, premium: boolean) {
    const res = await this.contractInstance.methods.addSorteo(titulo, descripcion, fechasExp, precioExp, tipo, premium).send({ from: localStorage.getItem('account') });
    return res;
  }

  async participar(id: any, tokens, premium) {
    const res = await this.contractInstance.methods.participar(id, tokens, premium).send({ from: localStorage.getItem('account') });
    return res;
  }

  async comprarToken(tokenStandard: number, tokenPremium: number) {
    const factorConversionStandard = 0.0045;
    const factorConversionPremium = 2 * factorConversionStandard;
    const totalStandard = tokenStandard*factorConversionStandard;
    const totalPremium = tokenPremium*factorConversionPremium;
    const total = (totalStandard + totalPremium).toPrecision(4);
    const value = window.web3.utils.toWei(total.toString(), 'ether');
    console.log('Compramos ' + tokenStandard + ' tokens normales y ' + tokenPremium + ' premium y enviamos un value de ' + value);
    const res = await this.contractInstance.methods.comprarToken(tokenStandard, tokenPremium).send({ from: localStorage.getItem('account'), value: value });
    return res;
  }

  async getSorteos(anunciante: string) {
    var account: string;
    if(anunciante == ''){
      account = '0x0000000000000000000000000000000000000000';
    }else{
      account = anunciante;
    }
    const data = await this.contractInstance.methods.getSorteos(account).call({ from: localStorage.getItem('account') });
    return data;
  }
  
  async saldoUsuarios(address: string) {
    const saldo = await this.contractInstance.methods.saldoUsuarios(address).call({ from: localStorage.getItem('account') });
    return saldo;
  }

  async saldoUsuariosPremium(address: string) {
    const saldo = await this.contractInstance.methods.saldoUsuariosPremium(address).call({ from: localStorage.getItem('account') });
    return saldo;
  }

  async anunciantes() {
    const res = await this.contractInstance.methods.anunciantes(localStorage.getItem('account')).call({ from: localStorage.getItem('account') });
    if(res != ''){
      return true;
    }else{
      return false;
    }
  }

  async participacionesUsuario(id: number) {
    const response = await this.contractInstance.methods.participacionesUsuarios(localStorage.getItem('account'), id).call({ from: localStorage.getItem('account') });
    return response;
  }

  async participaciones(id: number) {
    const response = await this.contractInstance.methods.participaciones(id).call({ from: localStorage.getItem('account') });
    return response;
  }

  async finalizarSorteo(id: number) {
    const response = await this.contractInstance.methods.finalizarSorteo(id).send({ from: localStorage.getItem('account') });
    return response;
  }

  async experiencias(id: number, codigoExp: string) {
    const response = await this.contractInstance.methods.experiencias(id, codigoExp).call({ from: localStorage.getItem('account') });
    return response;
  }

  async canjearExperiencia(id: number, codigoExp: string) {
    const response = await this.contractInstance.methods.canjearExperiencia(id, +codigoExp).send({ from: localStorage.getItem('account') });
    return response;
  }

  async codigosExperiencias(id: number) {
    const response = await this.contractInstance.methods.codigosExperiencias(id).call({ from: localStorage.getItem('account') });
    return response;
  }
}