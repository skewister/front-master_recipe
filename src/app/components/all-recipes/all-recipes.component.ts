import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from "../../shared/model/recipe"; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-all-recipes',
  templateUrl: './all-recipes.component.html',
  styleUrls: ['./all-recipes.component.scss']
})
export class AllRecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getAllRecipes().subscribe(
      async(response:any )=> {
        console.log('Réponse complète de l\'API:', response); // Log de la réponse complète
        this.recipes = response.data; // Ajustez en fonction de la structure réelle
        console.log('Recettes récupérées:', this.recipes);
      },
      error => {
        console.error('Erreur lors de la récupération des recettes', error);
      }
    );
  }

  getTagByName(tags: any[], typeName: string): string {
    const tag = tags.find(t => t.tag_type.type === typeName);
    return tag ? tag.name : 'Non spécifié';
  }

  addToFavorites(recipeId: number): void {
    // Logique pour ajouter une recette aux favoris
    console.log('Ajouter aux favoris:', recipeId);
    // Implémentez la logique ici si nécessaire
  }
}
