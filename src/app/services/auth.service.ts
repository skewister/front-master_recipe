// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {API_URL, environment} from "../../environments/environment";
import {jwtDecode} from "jwt-decode";
import {Router} from "@angular/router";
import { user } from '../shared/model/user';

interface DecodedToken {
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(API_URL+'/login', credentials);
  }

  register(data: { name: string, email: string, password: string }): Observable<any> {
    return this.http.post(API_URL+'/register', data);
  }
  getCurrentUser(): user | null {
    if (typeof localStorage === 'undefined') {
      return null; // localStorage is not available
    }

    try {
      const userJson = localStorage.getItem('currentUser');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  }

  getCurrentUserId(): number {
    const user = this.getCurrentUser();
    return user ? user.id : 0; // Default to 0 or another suitable default value
  }

  handleError(error: HttpErrorResponse): string {
    let errorMessage = 'Une erreur inconnue est survenue.';
    if (error.status === 422) {
      errorMessage = Object.values(error.error.errors).join(' ');
    } else {
      errorMessage = error.error.message || errorMessage;
    }
    console.error(errorMessage);
    return errorMessage;
  }



  isLoggedIn(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return false;
    }
    return true;
  }

}
