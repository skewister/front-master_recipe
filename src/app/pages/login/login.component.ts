import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from "@angular/router";
import { ApiService } from '../../services/api.service';
import {environment} from "../../../environments/environment";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginData = {
    email: '',
    password: '',

  };
  errorMessage = '';

  constructor(
      private authService: AuthService,
      private router: Router,
      private apiService: ApiService,
  ) {}

  signInWithGoogle(): void {
    window.open(`${environment.Url}/login/google`, '_self');
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this.authService.login(this.loginData).subscribe(
          (success) => {
            console.log('Connexion réussie', success);
            this.apiService.saveTokens(success);
            this.router.navigate(["/"]);
          },
          (error) => {
            this.errorMessage = this.authService.handleError(error);
          }
      );
    }
  }

}
