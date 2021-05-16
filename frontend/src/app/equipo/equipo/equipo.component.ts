import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipoService } from 'src/app/servicios/equipo.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css'],
})
export class EquipoComponent implements OnInit {
  constructor(
    private equipo: EquipoService,
    private usuario: UsuarioService,
    private formBuilder: FormBuilder
  ) {}
  listaProyectos: any = [];
  listaSprint: any = [];
  listaEquipo: any = [];
  usuarioEquipo = false;
  proyecto!: FormGroup;
  formulario!: FormGroup;
  enviarProyecto = false;
  enviarTarea = false;

  ngOnInit(): void {
    this.usuario.informacion().subscribe(
      (res) => {
        if (res.rol == 'Desarrollador' || res.rol == 'Lider Técnico') {
          this.usuarioEquipo = true;
        }
      },
      (err) => console.log(err.error)
    );

    this.equipo.listarProyectos().subscribe(
      (res) => {
        this.listaProyectos = res;
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
    this.formulario = this.formBuilder.group({
      idSprint: ['', Validators.required],
      nombre: ['', Validators.required],
      prioridad: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
    this.proyecto = this.formBuilder.group({
      idProyecto: ['', Validators.required],
    });
  }
  get f() {
    return this.formulario.controls;
  }
  get p() {
    return this.proyecto.controls;
  }
  abrirModalEquipo(id: any) {
    this.equipo.listarEquipo(id).subscribe(
      (res) => {
        this.listaEquipo = res;
        document.getElementById('modalEquipo')!.className = 'modalEquipo';
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
  cerrarModalEquipo() {
    (<HTMLDivElement>document.getElementById('modalEquipo')).className =
      'modalEquipo Invisible';
  }
  sprints() {
    this.enviarProyecto = true;
    if (this.proyecto.invalid) return;
    this.equipo.listarSprint(this.proyecto.value.idProyecto).subscribe(
      (res) => {
        this.listaSprint = res;
      },
      (err) => Swal.fire('Hubo un problema', `${err.error}`, 'error')
    );
  }
  crearTarea(){
    this.enviarTarea = true;
    if(this.formulario.invalid) return;
    console.log(this.formulario.value)
  }
}
