import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import { Recipe } from '../shared/model/recipe';
import { tag } from '../shared/model/tag';
import { Step } from '../shared/model/step';
import { Ingredient } from '../shared/model/ingredient';
import {environment} from "../../environments/environment";

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = environment.apiUrl + '/recipes';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  addRecipe(recipeData: FormData): Observable<ApiResponse<Recipe>> {
    return this.http.post<ApiResponse<Recipe>>(this.apiUrl, recipeData);
  }

  updateRecipe(recipeId: number, recipeData: FormData): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${recipeId}`, recipeData);
  }

  deleteRecipe(recipeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${recipeId}`);
  }

  deleteStep(recipeId: number, stepId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${recipeId}/steps/${stepId}`);
  }

  addStep(recipeId: number, stepData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${recipeId}/steps`, stepData);
  }

  searchIngredients(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ingredients/search?query=${query}`);
  }

  addIngredientToRecipe(recipeId: number, ingredientData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recipes/${recipeId}/ingredients`, ingredientData);
  }

  getRecipeById(recipeId: number): Observable<ApiResponse<Recipe>> {
    return this.http.get<ApiResponse<Recipe>>(`${this.apiUrl}/${recipeId}`);
  }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }


  getAllIngredients(): Observable<any[]> {
    // Remplacez `any[]` par le type approprié si vous avez un modèle pour les ingrédients
    return this.http.get<any[]>(`${environment.apiUrl}/ingredients`);
  }

  getRecipeDetails(recipeId: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${recipeId}`);
  }

  getTagsByRecipe(recipeId: number): Observable<tag[]> {
    return this.http.get<tag[]>(`${this.apiUrl}/${recipeId}/tags`);

  }

  // recipe.service.ts

  getStepsByRecipe(recipeId: number): Observable<Step[]> {
    return this.http.get<Step[]>(`${this.apiUrl}/${recipeId}/steps`);
  }


  getIngredientsByRecipe(recipeId: number): Observable<Ingredient[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${recipeId}/ingredients`).pipe(
      map(ingredients => ingredients.map(ingredient => ({
        ...ingredient,
        quantity: ingredient.pivot.quantity,
        unit: ingredient.pivot.unit
      })))
    );
  }

  getRecipesByUserId(userId: number): Observable<Recipe[]> {
    const url = `${this.apiUrl}/recipes/user/${userId}`; // Adjust URL to match your actual endpoint
    return this.http.get<Recipe[]>(url);
  }



}
