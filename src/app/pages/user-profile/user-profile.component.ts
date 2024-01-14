import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from "../../shared/model/recipe";
import {AuthService} from "../../services/auth.service"; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  recipes: Recipe[] = [];
  currentUserId: number | null = null;

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService, // AuthService must have the getCurrentUserId method
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId !== null) {
      this.recipeService.getRecipesByUserId(userId).subscribe(
        // ... existing logic ...
      );
    } else {
      // Handle the scenario when there's no user logged in
    }
  }

  onLogout(): void {
    // Implement logout logic
    this.authService.logout();
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

