import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrumService } from 'src/app/servicios/scrum.service';
import Swal from 'sweetalert2';
import { EquipoService } from 'src/app/servicios/equipo.service';
@Component({
  selector: 'app-scrum',
  templateUrl: './scrum.component.html',
  styleUrls: ['./scrum.component.css'],
})
export class ScrumComponent implements OnInit {
  scrum = false;
  formulario!: FormGroup;
  formEquipo!: FormGroup;
  formSprint!: FormGroup;
  formSprintProyecto!: FormGroup;
  enviar = false;
  enviarE = false;
  enviarS = false;
  enviarP = false;
  listaProyecto: any = [];
  listaUsuarios: any = [];
  listaEquipo: any = [];
  listaSprint: any = [];
  listaSprintsProyecto: any = [];
  listaTareasSprint: any = [];
  constructor(
    private usuario: UsuarioService,
    private usuarioScrum: ScrumService,
    private equipo: EquipoService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.usuario.informacion().subscribe(
      (res) => {
        if (res.rol == 'Scrum Master') {
          this.scrum = true;
        }
      },
      (err) => {
        console.log(err.error);
      }
    );
    this.usuarioScrum.listarProyectos().subscribe(
      (res) => {
        this.listaProyecto = res;
      },
      (err) => console.log('Hubo un error', err.error)
    );
    this.equipo.listarUsuarios().subscribe(
      (res) => {
        this.listaUsuarios = res;
      },
      (err) => {
        console.log(err.error);
      }
    );
    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaDeInicio: ['', Validators.required],
      fechaDeFin: ['', Validators.required],
      estado: ['', Validators.required],
    });
    this.formEquipo = this.formBuilder.group({
      idProyecto: [''],
      usuario: ['', Validators.required],
    });
    this.formSprint = this.formBuilder.group({
      idProyecto: [''],
      sprint: [
        '',
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      nombre: ['', Validators.required],
      duracion: ['', Validators.required],
    });
    this.formSprintProyecto = this.formBuilder.group({
      idProyecto: ['', Validators.required],
    });
  }
  get f() {
    return this.formulario.controls;
  }
  get e() {
    return this.formEquipo.controls;
  }
  get s() {
    return this.formSprint.controls;
  }
  get p() {
    return this.formSprintProyecto.controls;
  }
  crearProyecto() {
    this.enviar = true;
    if (this.formulario.invalid) return;
    this.usuarioScrum.crearProyectos(this.formulario.value).subscribe(
      (res) => {
        Swal.fire(
          'Se registro un proyecto exitosamente',
          'En la lista de los proyectos puede agregar los usuarios',
          'success'
        ).then((result) => {
          location.reload();
        });
      },
      (err) => console.log('Hubo un problema', err.error)
    );
  }
  agregarUsuario(id: any) {
    this.enviarE = true;
    this.formEquipo.value.idProyecto = id;
    if (this.formEquipo.invalid) return;
    this.equipo.agregarEquipo(this.formEquipo.value).subscribe(
      (res) => {
        Swal.fire(
          'Usuario registrado en el equipo',
          'El usuario ya pertenece al equipo del proyecto',
          'success'
        );
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
  abrirModal(id: any) {
    document.getElementById('modal')!.className = 'modal';
    this.equipo.listarEquipo(id).subscribe(
      (res) => (this.listaEquipo = res),
      (err) => console.log(err)
    );
  }
  cerrarModal() {
    document.getElementById('modal')!.className = 'modal invisible';
  }
  eliminarEquipo(proyecto: any) {
    this.equipo.eliminarEquipo(proyecto._id).subscribe(
      (res) => {
        Swal.fire(
          'Usuario eliminado',
          'El usuario ha sido eliminado del equipo',
          'success'
        );
        const index = this.listaEquipo.indexOf(proyecto);
        this.listaEquipo.splice(index, 1);
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
  abrirModalSprint(id: any) {
    document.getElementById('modalSprint')!.className = 'modalSprint';
    this.usuarioScrum.listarSprint(id).subscribe(
      (res) => {
        this.listaSprint = res;
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
  cerrarModalSprint() {
    document.getElementById('modalSprint')!.className = 'modalSprint invisible';
  }
  agregarSprint(id: any) {
    this.enviarS = true;
    this.formSprint.value.idProyecto = id;
    if (this.formSprint.invalid) return;
    this.usuarioScrum.crearSprint(this.formSprint.value).subscribe(
      (res) => {
        Swal.fire(
          'Sprint creado',
          'El Sprint ha sido agregado al proyecto con éxito',
          'success'
        );
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
  proyecto() {
    this.enviarP = true;
    if (this.formSprintProyecto.invalid) return;
    this.usuarioScrum
      .listarSprint(this.formSprintProyecto.value.idProyecto)
      .subscribe(
        (res) => {
          this.listaSprintsProyecto = res;
        },
        (err) => console.log(err)
      );
  }
  listarTareas(id: any) {
    this.usuarioScrum.listarTareasSprint(id).subscribe(
      (res) => {
        this.listaTareasSprint = res;
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
}
