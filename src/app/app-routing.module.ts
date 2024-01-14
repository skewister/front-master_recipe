import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {RecipeDetailComponent} from "./pages/recipe-detail/recipe-detail.component";
import {RecipesListComponent} from "./pages/recipes-list/recipes-list.component";
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {LoginSuccessComponent} from "./pages/login-success/login-success.component";
import {UserProfileComponent} from "./pages/user-profile/user-profile.component";
import { CreateRecipeComponent } from './components/create-recipe/create-recipe.component';
import { AuthGuard } from './auth.guard';
import {EditRecipeComponent} from "./components/edit-recipe/edit-recipe.component";
import {AllRecipesComponent} from "./components/all-recipes/all-recipes.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'recipes', component: AllRecipesComponent, canActivate: [AuthGuard] },
  { path: 'recipes/:id', component: RecipeDetailComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'login/success', component: LoginSuccessComponent, canActivate: [AuthGuard] },
  { path: 'create-recipe', component: CreateRecipeComponent, canActivate: [AuthGuard] },
  { path: 'edit-recipe/:id', component: EditRecipeComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: '/home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

