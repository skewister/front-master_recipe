import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../shared/model/recipe';
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
}
