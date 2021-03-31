import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComprarTokensComponent } from './comprar-tokens/comprar-tokens.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ParticiparSorteoComponent } from './participar-sorteo/participar-sorteo.component';
import { AuthGuard } from './services/authguard.service';
import { RegistroAnuncianteComponent } from './registro-anunciante/registro-anunciante.component';
import { AltaSorteoComponent } from './alta-sorteo/alta-sorteo.component';
import { ContractActionResultComponent } from './contract-action-result/contract-action-result.component';
import { FinalizarSorteoComponent } from './finalizar-sorteo/finalizar-sorteo.component';

// Angular Material
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CanjearExperienciaComponent } from './canjear-experiencia/canjear-experiencia.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ComprarTokensComponent,
    ParticiparSorteoComponent,
    RegistroAnuncianteComponent,
    AltaSorteoComponent,
    ContractActionResultComponent,
    FinalizarSorteoComponent,
    CanjearExperienciaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatStepperModule,
    MatToolbarModule,
    ReactiveFormsModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
