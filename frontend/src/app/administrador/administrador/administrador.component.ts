import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AdministradorService } from '../../servicios/administrador.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MustMatch } from './mustfile';

import Swal from 'sweetalert2';
import { EquipoService } from 'src/app/servicios/equipo.service';
@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css'],
})
export class AdministradorComponent implements OnInit {
  hide = true;
  panelOpenState = false;
  listaUsuarios: any = [];
  listaProyectos: any = [];
  listaEquipo: any = [];
  formulario!: FormGroup;
  formularioActualizar!: FormGroup;
  enviar = false;
  enviarA = false;
  roles: any[] = [
    { value: 'Administrador', viewValue: 'Administrador' },
    { value: 'Scrum Master', viewValue: 'Scrum Master' },
    { value: 'Desarrollador', viewValue: 'Desarrollador' },
    { value: 'Lider Técnico', viewValue: 'Lider Técnico' },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private usuario: UsuarioService,
    private admin: AdministradorService,
    private equipo: EquipoService
  ) {}
  administrador = false;
  ngOnInit(): void {
    this.usuario.informacion().subscribe(
      (res) => {
        if (res.rol == 'Administrador') {
          this.administrador = true;
        }
      },
      (err) => console.log(err.error)
    );
    this.admin.listarUsuarios().subscribe(
      (res) => {
        this.listaUsuarios = res;
      },
      (err) => {
        console.log(err.error);
      }
    );
    this.admin.listarProyecto().subscribe(
      (res) => {
        this.listaProyectos = res;
      },
      (err) => console.log(err.error)
    );
    this.formulario = this.formBuilder.group(
      {
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        cedula: ['', Validators.required],
        usuario: ['', Validators.required],
        rol: ['', Validators.required],
        contrasenia: ['', [Validators.required, Validators.minLength(5)]],
        repetir: ['', Validators.required],
      },
      {
        validator: MustMatch('contrasenia', 'repetir'),
      }
    );
    this.formularioActualizar = this.formBuilder.group(
      {
        _id: [''],
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        cedula: ['', Validators.required],
        usuario: ['', Validators.required],
        rol: ['', Validators.required],
        contrasenia: ['', [Validators.required, Validators.minLength(5)]],
        repetir: ['', Validators.required],
      },
      {
        validator: MustMatch('contrasenia', 'repetir'),
      }
    );
  }
  get f() {
    return this.formulario.controls;
  }
  get fA() {
    return this.formularioActualizar.controls;
  }
  registrar() {
    this.enviar = true;
    if (this.formulario.invalid) return;
    this.admin.agregarUsuarios(this.formulario.value).subscribe(
      (res) => {
        Swal.fire(
          'Registro exitoso!',
          'Usuario agregado correctamente.',
          'success'
        ).then((result) => {
          this.formulario.reset();
          this.formulario.markAsPristine();
          this.formulario.markAsUntouched();
          this.formulario.updateValueAndValidity();
          this.enviar = false;
        });
        this.admin.listarUsuarios().subscribe(
          (res) => {
            this.listaUsuarios = res;
          },
          (err) => {
            Swal.fire('Hubo un problema', `${err.error}`, 'error');
          }
        );
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
  resetear(){
    this.enviar = false;
  }
  borrar(usuario: any) {
    Swal.fire({
      title: '¿Está seguro de borra a este usuario?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Si, Borrar`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.admin.eliminarUsuario(usuario).subscribe(
          (res) => {
            Swal.fire(
              'Usuario Eliminado',
              'Usuario eliminado correctamente.',
              'success'
            );
            const i = this.listaUsuarios.indexOf(usuario);
            if (i != -1) {
              this.listaUsuarios.splice(i, 1);
            }
          },
          (err) => {
            Swal.fire('Hubo un problema', `${err.error}`, 'error');
          }
        );
      } else if (result.isDenied) {
        Swal.fire('El usuario no se ha borrado', '', 'info');
      }
    });
  }
  _id = null;
  usuarioTemp = null;
  abrirModal(usuario: any) {
    document.getElementById('form')!.className = 'formulario';
    this.formularioActualizar.patchValue({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      cedula: usuario.cedula,
      usuario: usuario.usuario,
      contrasenia: usuario.contrasenia,
      rol: usuario.rol,
    });
    this._id = usuario._id;
    this.usuarioTemp = usuario;
  }
  cerrarModal() {
    document.getElementById('form')!.className = 'formulario Invisible';
  }
  actualizar() {
    this.enviarA = true;
    if (this.formularioActualizar.invalid) return;
    this.formularioActualizar.value._id = this._id;
    this.admin.actualizarUsuario(this.formularioActualizar.value).subscribe(
      (res) => {
        Swal.fire(
          'Actulización exitosa',
          'Usuario actualizado correctamente.',
          'success'
        );
        let indice = this.listaUsuarios.indexOf(this.usuarioTemp);
        this.listaUsuarios[indice] = this.formularioActualizar.value;
        document.getElementById('form')!.className = 'formulario Invisible';
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
        document.getElementById('form')!.className = 'formulario Invisible';
      }
    );
  }
  abrirModalEquipo(id: any) {
    document.getElementById('modalEquipo')!.className = 'modalEquipo';
    this.equipo.listarEquipo(id).subscribe(
      (res) => (this.listaEquipo = res),
      (err) => console.log(err)
    );
  }
  cerrarModalEquipo() {
    document.getElementById('modalEquipo')!.className = 'modalEquipo Invisible';
  }
}
