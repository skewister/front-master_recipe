import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { RecipesListComponent } from './pages/recipes-list/recipes-list.component';
import { RecipeDetailComponent } from './pages/recipe-detail/recipe-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    RecipesListComponent,
    RecipeDetailComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
