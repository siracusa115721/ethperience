import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AltaSorteoComponent } from '../alta-sorteo/alta-sorteo.component';
import { CanjearExperienciaComponent } from '../canjear-experiencia/canjear-experiencia.component';
import { ComprarTokensComponent } from '../comprar-tokens/comprar-tokens.component';
import { ContractActionResultComponent } from '../contract-action-result/contract-action-result.component';
import { FinalizarSorteoComponent } from '../finalizar-sorteo/finalizar-sorteo.component';
import { ParticiparSorteoComponent } from '../participar-sorteo/participar-sorteo.component';
import { RegistroAnuncianteComponent } from '../registro-anunciante/registro-anunciante.component';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [ContractService]
})

export class MainComponent implements OnInit {

  cs: ContractService;
  sorteos: any[];
  account: string;
  saldoStandard = 0;
  saldoPremium = 0;
  rol: string;
  pageLoaded: boolean;

  constructor(private router: Router, _cs: ContractService, public dialog: MatDialog) { 
    this.account = localStorage.getItem('account');
    if(localStorage['token'] != 'true'){
      this.router.navigateByUrl('/login');
    }
    this.cs = _cs;
    this.pageLoaded = false;
    this.sorteos = [];
    this.loadPage();
  }

  ngOnInit(): void {
  }

  async loadPage(){
    this.pageLoaded = false;
    const anunciante = await this.cs.anunciantes();
    if(anunciante){
      this.rol = 'anunciante';
      const pageData = await this.cs.getSorteos(localStorage.getItem('account'));
      this.formatData(pageData);
    }else{
      this.rol = 'usuario';
      const pageData = await this.cs.getSorteos('');
      this.saldoStandard = await this.cs.saldoUsuarios(this.account);
      this.saldoPremium = await this.cs.saldoUsuariosPremium(this.account);
      this.formatData(pageData);
    }
    this.pageLoaded = true;
  }

  private async formatData(data: any) {
    for(var i = 0; i < data[0].length; i++){
      const datosSorteo = JSON.parse((data[3].split('##')[i]));
      const id = data[0][i];
      let participaciones = null;
      let recaudacion= null;
      if(this.rol == 'anunciante'){
        participaciones = await this.cs.participaciones(id);
        recaudacion = data[2][i] ? (participaciones * 0.009).toFixed(4) : (participaciones * 0.045).toFixed(4);
      }else{
        participaciones = await this.cs.participacionesUsuario(id);
      }      
      const fechas = datosSorteo.fechasExp.split('-');
      const ganador = data[4][i].toLowerCase();
      let codigoExp = '';
      let experienciaCanjeada = false;
      if(ganador != '0x0000000000000000000000000000000000000000'){
        codigoExp = await this.cs.codigosExperiencias(i);
        experienciaCanjeada = await this.cs.experiencias(i, codigoExp);
      }    
      const sorteo = {
        id: id,
        titulo: datosSorteo.titulo,
        anunciante: data[1][i],
        premium: data[2][i],
        descripcion: datosSorteo.descripcion,
        fechaInicioExp: fechas[0],
        fechaFinExp: fechas[1],
        precioExp: datosSorteo.precioExp,
        tipo: datosSorteo.tipo,
        participaciones: participaciones,
        recaudacion: recaudacion,
        ganador: ganador,
        codigoExperiencia: codigoExp.toString(),
        experienciaCanjeada: experienciaCanjeada ? 'Sí' : 'No',
        participar: ((data[2][i] && this.saldoPremium > 0) || (!data[2][i] && this.saldoStandard > 0)) && participaciones < 5 ? true : false 
      };
      this.sorteos.push(sorteo);
      console.log(sorteo);
    }
  }

  comprarTokens(): any {
    console.log('Comprar tokens');
    const dialogRef = this.dialog.open(ComprarTokensComponent, {
      panelClass: 'comprar-token-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {   
        const dialogRef = this.dialog.open(ContractActionResultComponent, {
          data: result.status
        }); 
        dialogRef.afterOpened().subscribe(_ => {
          setTimeout(() => {
             dialogRef.close();
             window.location.reload();
          }, 2000)
        });   
    });
  }

  async participarSorteo(id: any, premium: boolean, participacionesActuales: number){
    console.log('Comprar tokens');
    var tokens = 0;
    if(premium){
      tokens = this.saldoPremium;
    }else{
      tokens = this.saldoStandard;
    }
    const dialogRef = this.dialog.open(ParticiparSorteoComponent, {
      data: {
        id: id,
        premium: premium,
        tokens: tokens,
        participacionesActuales: participacionesActuales
      },
      panelClass: 'participar-sorteo-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      const dialogRef = this.dialog.open(ContractActionResultComponent, {
        data: result.status
      }); 
      dialogRef.afterOpened().subscribe(_ => {
        setTimeout(() => {
           dialogRef.close();
           window.location.reload();
        }, 2000)
      });
    });
  }

  registroAnunciante() {
    const dialogRef = this.dialog.open(RegistroAnuncianteComponent, {
      panelClass: 'anunciante-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      const dialogRef = this.dialog.open(ContractActionResultComponent, {
        data: result.status
      }); 
      dialogRef.afterOpened().subscribe(_ => {
        setTimeout(() => {
           dialogRef.close();
           window.location.reload();
        }, 2000)
      });
    });
  }

  altaSorteo() {
    const dialogRef = this.dialog.open(AltaSorteoComponent, {
      panelClass: 'alta-sorteo-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      const dialogRef = this.dialog.open(ContractActionResultComponent, {
        data: result.status
      }); 
      dialogRef.afterOpened().subscribe(_ => {
        setTimeout(() => {
           dialogRef.close();
           window.location.reload();
        }, 2000)
      });
    });
  }

  finalizarSorteo(id: any, recaudacion: any){
    const dialogRef = this.dialog.open(FinalizarSorteoComponent, {
      data: {
        id: id,
        recaudacion: recaudacion
      },
      panelClass: 'finalizar-sorteo-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      const dialogRef = this.dialog.open(ContractActionResultComponent, {
        data: result.status
      }); 
      dialogRef.afterOpened().subscribe(_ => {
        setTimeout(() => {
           dialogRef.close();
           window.location.reload();
        }, 2000)
      });
    });
  }

  canjearExperiencia(id: any, ganador: string, codigoExp: string){
    const dialogRef = this.dialog.open(CanjearExperienciaComponent, {
      data: {
        id: id,
        ganador: ganador,
        codigoExp: codigoExp
      },
      panelClass: 'canejar-experiencia-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      const dialogRef = this.dialog.open(ContractActionResultComponent, {
        data: result.status
      }); 
      dialogRef.afterOpened().subscribe(_ => {
        setTimeout(() => {
           dialogRef.close();
           window.location.reload();
        }, 2000)
      });
    });
  }
}
