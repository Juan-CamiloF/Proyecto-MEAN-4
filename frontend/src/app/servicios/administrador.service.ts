import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AdministradorService {
  private agregarUsuariosUrl =
    'http://localhost:3000/scrum/usuario/registrarUsuarios';
  private listarUsuariosUrl =
    'http://localhost:3000/scrum/usuario/listarUsuarios';
  private eliminarUsuariosUrl = 
    'http://localhost:3000/scrum/usuario/borrar/';
  private actualizarUsuariosUrl =
    'http://localhost:3000/scrum/usuario/actualizarUsuarios';
  private listarTodosLosProyectosUrl =
    'http://localhost:3000/scrum/proyecto/listarTodos';

  constructor(private Http: HttpClient) {}
  agregarUsuarios(usuario: any) {
    return this.Http.post<any>(this.agregarUsuariosUrl, usuario);
  }
  listarUsuarios() {
    return this.Http.get<any>(this.listarUsuariosUrl);
  }
  eliminarUsuario(usuario: any) {
    const _id = usuario._id;
    const url = `${this.eliminarUsuariosUrl}` + `${_id}`;
    return this.Http.delete<any>(url);
  }
  actualizarUsuario(usuario: any) {
    return this.Http.put(this.actualizarUsuariosUrl, usuario);
  }
  listarProyecto(){
    return this.Http.get<any>(this.listarTodosLosProyectosUrl);
  }
}
