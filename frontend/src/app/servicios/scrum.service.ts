import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ScrumService {
  private crearProyectosUrl = 'http://localhost:3000/scrum/proyecto/crear';
  private listarProyectosUrl = 'http://localhost:3000/scrum/proyecto/listar';
  private crearSprintUrl = 'http://localhost:3000/scrum/sprint/crear';
  private listarSprintUrl = 'http://localhost:3000/scrum/sprint/listar';
  private listarTareasSprintUrl =  'http://localhost:3000/scrum/sprint/listarTareas';
  constructor(private Http: HttpClient) {}
  crearProyectos(proyecto:any){
    return this.Http.post<any>(this.crearProyectosUrl,proyecto);
  }
  listarProyectos(){
    return this.Http.get<any>(this.listarProyectosUrl);
  }
  crearSprint(sprint:any){
    return this.Http.post<any>(this.crearSprintUrl,sprint)
  }
  listarSprint(id:any){
    const url =  `${this.listarSprintUrl}/${id}`;
    return this.Http.get<any>(url);
  }
  listarTareasSprint(id:any){
    const url = `${this.listarTareasSprintUrl}/${id}`;
    return this.Http.get<any>(url);
  }
}
