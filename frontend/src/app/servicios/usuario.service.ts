import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private inicioUrl = 'http://localhost:3000/scrum/usuario/iniciar';
  private adminUrl = 'http://localhost:3000/scrum/usuario/registrarAdmin';
  private informacionUrl = 'http://localhost:3000/scrum/usuario/informacion';
  constructor(private Http: HttpClient, private router: Router) {}
  iniciarSesion(usuario: any) {
    return this.Http.post<any>(this.inicioUrl, usuario);
  }
  inicio() {
    return !!localStorage.getItem('token');
  }
  obtenerToken() {
    return localStorage.getItem('token');
  }
  cerrar() {
    localStorage.removeItem('token');
    this.router.navigate(['/iniciarSesion']);
  }
  informacion(){
    return this.Http.get<any>(this.informacionUrl);
  }
  admin(admin:any){
    return this.Http.post<any>(this.adminUrl,admin);
  }
}
