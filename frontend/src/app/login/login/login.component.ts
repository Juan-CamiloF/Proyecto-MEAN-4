import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formulario!: FormGroup;
  enviar = false;
  constructor(
    private usuario: UsuarioService,
    private formbuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formulario = this.formbuilder.group({
      usuario: ['', Validators.required],
      contrasenia: ['', Validators.required],
    });
  }
  get f() {
    return this.formulario.controls;
  }
  iniciar() {
    this.enviar = true;
    if (this.formulario.invalid) return;
    this.usuario.iniciarSesion(this.formulario.value).subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        this.usuario.informacion().subscribe((res) => {
          if (res.rol == 'Administrador') {
            Swal.fire('Inicio Sesión', 'Bienvenido', 'success').then(
              (result) => {
                this.router.navigate(['administrador']);
              }
            );
          } else if (res.rol == 'Scrum Master') {
            Swal.fire('Inicio Sesión', 'Bienvenido', 'success').then(
              (result) => {
                this.router.navigate(['scrumMaster']);
              }
            );
          } else if (res.rol == 'Desarrollador') {
            Swal.fire('Inicio Sesión', 'Bienvenido', 'success').then(
              (result) => {
                this.router.navigate(['desarrollador']);
              }
            );
          }
        });
      },
      (err) => {
        Swal.fire('Hubo un problema', `${err.error}`, 'error');
      }
    );
  }
  administrador = {
    usuario:'admin',
    contrasenia:'admin'
  }
  admin(){
    this.usuario.admin(this.administrador).subscribe(
      (res)=>{
        Swal.fire('Administrador por defecto', 'usuario: admin \n contraseña: admin', 'success')
      },(err)=>{
        Swal.fire('Hubo un problema!',`${err.error}`, 'error')
        console.log(err)
      }
    )
  }
}
