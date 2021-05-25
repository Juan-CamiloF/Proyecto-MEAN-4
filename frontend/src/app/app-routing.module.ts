import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio/inicio.component';
import { LoginComponent } from './login/login/login.component';
import { AdministradorComponent } from './administrador/administrador/administrador.component';
import { EquipoComponent } from './equipo/equipo/equipo.component';
import { ScrumComponent } from './scrum/scrum/scrum.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GuardGuard } from './guard/guard.guard';
import { GuardLoginGuard } from './guard/guard-login.guard'; 

const routes: Routes = [
  {path:'',component:InicioComponent,pathMatch:'full'},
  {path:'inicio',component:InicioComponent},
  {path:'iniciarSesion',component:LoginComponent,canActivate:[GuardLoginGuard]},
  {path:'administrador',component:AdministradorComponent,canActivate:[GuardGuard]},
  {path:'scrumMaster',component:ScrumComponent,canActivate:[GuardGuard]},
  {path:'desarrollador',component:EquipoComponent,canActivate:[GuardGuard]},
  {path:'Oops',component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
