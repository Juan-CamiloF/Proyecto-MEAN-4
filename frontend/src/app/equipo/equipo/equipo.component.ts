import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  cargando = true;
  listaProyectos: any = [];
  listaSprintParaCrearTareas: any = [];
  listaSprintParaListarTareas: any = [];
  listaEquipo: any = [];
  listaTareas: any = [];
  usuarioEquipo = false;
  proyecto!: FormGroup;
  formulario!: FormGroup;
  sprint!: FormGroup;
  actualizar!: FormGroup;
  enviarProyecto = false;
  enviarTarea = false;
  enviarSprint = false;
  enviarActualizacion = false;

  ngOnInit(): void {
    this.usuario.informacion().subscribe(
      (res) => {
        if (res.rol == 'Desarrollador' || res.rol == 'Lider Técnico') {
          this.usuarioEquipo = true;
          this.cargando = false;
        } else {
          this.router.navigate(['/Oops']);
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
    this.sprint = this.formBuilder.group({
      idSprint: ['', Validators.required],
    });
    this.actualizar = this.formBuilder.group({
      _id: [''],
      nombre: ['', Validators.required],
      prioridad: ['', Validators.required],
      estado: [''],
      descripcion: ['', Validators.required],
    });
  }
  get f() {
    return this.formulario.controls;
  }
  get p() {
    return this.proyecto.controls;
  }
  get s() {
    return this.sprint.controls;
  }
  get a() {
    return this.actualizar.controls;
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
  sprintsParaCrearTareas() {
    this.enviarProyecto = true;
    if (this.proyecto.invalid) return;
    this.equipo.listarSprint(this.proyecto.value.idProyecto).subscribe(
      (res) => {
        this.listaSprintParaCrearTareas = res;
        if (!this.listaSprintParaCrearTareas.length)
          Swal.fire(
            "No hay Sprint's",
            'No se pueden crear tareas sin un Sprint',
            'info'
          );
      },
      (err) => Swal.fire('Hubo un problema', `${err.error}`, 'error')
    );
  }
  sprintsParaListarTareas() {
    this.enviarProyecto = true;
    this.listaSprintParaListarTareas = [];
    if (this.proyecto.invalid) return;
    this.equipo.listarSprint(this.proyecto.value.idProyecto).subscribe(
      (res) => {
        this.listaSprintParaListarTareas = res;
        if (!this.listaSprintParaListarTareas.length) {
          Swal.fire(
            "No hay Sprint's",
            'No se pueden listar tareas sin un Sprint',
            'info'
          );
          this.listaSprintParaListarTareas = [];
          this.listaTareas = [];
        }
      },
      (err) => Swal.fire('Hubo un problema', `${err.error}`, 'error')
    );
  }
  crearTarea(formularioProyecto: any, formularioTarea: any) {
    this.enviarTarea = true;
    if (this.formulario.invalid) return;
    this.equipo.crearActividad(this.formulario.value).subscribe(
      (res) => {
        Swal.fire(
          'Tarea registrada!',
          'La tarea guardada de manera exitosa',
          'success'
        ).then((result) => {
          formularioProyecto.resetForm();
          formularioTarea.resetForm();
          this.listaSprintParaCrearTareas = [];
          this.listaTareas = [];
          this.listaSprintParaListarTareas = [];
        });
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
  cancelarTarea(formularioProyeto: any, formularioTarea: any) {
    formularioTarea.resetForm();
    formularioProyeto.resetForm();
    this.listaSprintParaCrearTareas = [];
  }
  listarTareas() {
    this.enviarSprint = true;
    if (this.sprint.invalid) return;
    this.equipo.listarActividadesSprint(this.sprint.value.idSprint).subscribe(
      (res) => {
        this.listaTareas = res;
        if (!this.listaTareas.length) {
          Swal.fire(
            'No hay tareas',
            'No hay tareas en el Sprint para listar',
            'info'
          );
        }
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
  actualizarEstado(tarea: any, estado: string) {
    const estadoTemporal = tarea.estado;
    tarea.estado = estado;
    this.equipo.actualizarActividades(tarea).subscribe(
      (res) => {
        tarea.estado = estado;
      },
      (err) => {
        tarea.estado = estadoTemporal;
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
  tarea = {};
  abrirModal(tarea: any) {
    (<HTMLFormElement>document.getElementById('form')).className = 'formulario';
    this.actualizar.patchValue({
      _id: tarea._id,
      nombre: tarea.nombre,
      prioridad: tarea.prioridad,
      estado: tarea.estado,
      descripcion: tarea.descripcion,
    });
    this.tarea = tarea;
  }
  cerrarModal() {
    (<HTMLFormElement>document.getElementById('form')).className =
      'formulario Invisible';
  }
  actualizarTarea() {
    this.enviarActualizacion = true;
    if (this.actualizar.invalid) return;
    this.equipo.actualizarActividades(this.actualizar.value).subscribe(
      (res) => {
        Swal.fire('Actualizado', 'La tarea se actualizo con éxito', 'info');
        const index = this.listaTareas.indexOf(this.tarea);
        this.listaTareas[index] = this.actualizar.value;
        (<HTMLFormElement>document.getElementById('form')).className =
          'formulario Invisible';
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
  eliminar(tarea: any) {
    Swal.fire({
      title: '¿Quiere eliminar esta tarea?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        const _id = tarea._id;
        this.equipo.eliminarActividades(_id).subscribe(
          (res) => {
            const index = this.listaTareas.indexOf(tarea);
            if (index >= 0) {
              this.listaTareas.splice(index, 1);
              Swal.fire('Eliminada', `${res.message}`, 'success');
            }
          },
          (err) => {
            Swal.fire('Hubo un problema', `${err.error}`, 'error');
          }
        );
      } else if (result.isDenied) {
        Swal.fire('No se borro la actividad', '', 'info');
      }
    });
  }
}
