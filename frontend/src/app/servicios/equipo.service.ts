import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private listarUsuariosUrl = "http://localhost:3000/scrum/equipo/usuarios";
  private agregarEquipoUrl= "http://localhost:3000/scrum/equipo/agregar";
  private listarEquipoUrl = "http://localhost:3000/scrum/equipo/listar";
  private eliminarEquipoUrl = "http://localhost:3000/scrum/equipo/borrar";
  private listarProyectosUrl = "http://localhost:3000/scrum/equipo/listarProyectos";
  private listarSprintUrl = 'http://localhost:3000/scrum/sprint/listar';
  constructor(private Http: HttpClient) { }
  listarUsuarios(){
    return this.Http.get<any>(this.listarUsuariosUrl)
  }
  agregarEquipo(equipo:any){
    this.Http.post
    return this.Http.post<any>(this.agregarEquipoUrl,equipo);
  }
  listarEquipo(id:any){
    const url = `${this.listarEquipoUrl}/${id}`
    return this.Http.get<any>(url);
  }
  eliminarEquipo(id:any){
    const url = `${this.eliminarEquipoUrl}/${id}`;
    return this.Http.delete<any>(url)
  }
  listarProyectos(){
    return this.Http.get<any>(this.listarProyectosUrl);
  }
  listarSprint(id:any){
    const url =  `${this.listarSprintUrl}/${id}`;
    return this.Http.get<any>(url);
  }
  
}
