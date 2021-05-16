import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private usuario: UsuarioService) {}
  intercept(req: any, next: any) {
    const token = localStorage.getItem('token');

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);

    // // if(this.usuario.obtenerToken()){
    //   const token = req.clone({
    //     setHeaders: {
    //       Authorization: 'Bearer ' + this.usuario.obtenerToken(),
    //     },
    //   });
    //   return next.handle(token);
    // // }
  }
}
