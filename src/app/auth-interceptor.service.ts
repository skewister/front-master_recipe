import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      const tokenObj = localStorage.getItem('auth_token');
      const token = tokenObj ? JSON.parse(tokenObj).token : null;

      if (token) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });

        return next.handle(cloned);
      } else {
        return next.handle(req);
      }
    }
}
