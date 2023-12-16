// api.service.ts
import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})


export class ApiService {
  constructor(
    private router: Router,
    private http: HttpClient
  ) {}


  saveTokens(apiToken: {token: string}) {
    localStorage.setItem('auth_token', JSON.stringify({
      token: apiToken.token,
    }));
  }

  getToken() {
    const tokenString = localStorage.getItem('apiToken');
    if (tokenString) {
      const apiToken = JSON.parse(tokenString);
      const expiresAt = DateTime.fromISO(apiToken.expires_at);

      if (DateTime.now() < expiresAt) {
        return apiToken.token;
      } else {
        // Token expired
        this.clearToken();
      }
    }
    return null;
  }

  clearToken() {
    localStorage.removeItem('apiToken');
  }
}
