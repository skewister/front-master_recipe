// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    console.log("oui stp");
    if (this.authService.isLoggedIn()) {

      if (url.includes('/login') || url.includes('/register')) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    } else {
      if (!url.includes('/login') && !url.includes('/register')) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
  }
}
