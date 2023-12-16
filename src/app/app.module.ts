import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { RecipesListComponent } from './pages/recipes-list/recipes-list.component';
import { RecipeDetailComponent } from './pages/recipe-detail/recipe-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { NavComponent } from './components/layout/nav/nav.component';
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { LoginSuccessComponent } from './pages/login-success/login-success.component';
import {AuthInterceptorService} from "./auth-interceptor.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RecipesListComponent,
    RecipeDetailComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    LoginSuccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
