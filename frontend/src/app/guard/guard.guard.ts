import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class GuardGuard implements CanActivate {
  constructor(private usuario: UsuarioService, private router: Router) {}
  canActivate(): boolean {
    if (this.usuario.inicio()) {
      return true;
    } else {
      this.router.navigate(['inicio']);
      return false;
    }
  }
}
