import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from "@angular/router";
import {NgForm} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    password: '',
    confirmpassword: ''
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

  onSubmit(registerForm: NgForm): void {
    this.errorMessage = '';

    if (this.registerData.password !== this.registerData.confirmpassword){
      this.errorMessage = "La confirmation du mot de passe ne correspond pas.";
      return;
    }

    const dataToSubmit = {
      name: this.registerData.name,
      email: this.registerData.email,
      password: this.registerData.password,
    };

    this.authService.register(dataToSubmit).subscribe(
      response => {
        console.log('Inscription réussie', response);
        this.apiService.saveTokens(response);
        this.router.navigate(['/']);
      },
      error => {
          this.errorMessage = this.authService.handleError(error);
      }
    );
  }
}
