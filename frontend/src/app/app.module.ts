import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio/inicio.component';
import { MenuComponent } from './menu/menu/menu.component';
import { LoginComponent } from './login/login/login.component';
import { AdministradorComponent } from './administrador/administrador/administrador.component';
import { ScrumComponent } from './scrum/scrum/scrum.component';
import { EquipoComponent } from './equipo/equipo/equipo.component';
//Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Http
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
//Forms
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

//Servicios
import { TokenInterceptorService } from './servicios/token-interceptor.service';
@NgModule({
  declarations: [AppComponent, MenuComponent, LoginComponent, AdministradorComponent, InicioComponent, ScrumComponent, EquipoComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTabsModule,
    MatExpansionModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [HttpClientModule,{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorService,multi:true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
