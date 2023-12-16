import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.scss']
})
export class LoginSuccessComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {

    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      this.apiService.saveTokens({
        token: token
      })
      this.router.navigate(['/']);

    } else {

      this.router.navigate(['/login']);
    }
  }
}
