import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../../shared/model/recipe';
import { RecipeService } from '../../services/recipe.service';
import {Ingredient} from "../../shared/model/ingredient";
import {Step} from "../../shared/model/step";
import { tag } from "../../shared/model/tag";
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | undefined;
  ingredients: Ingredient[] = [];
  steps: Step[] = [];
  tags: tag[] = [];
  currentStepIndex = 0;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute
  ) {}


  goToNextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    }
  }

  goToPreviousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  ngOnInit(): void {
    this.loadRecipe();
  }

  loadRecipe(): void {
    const recipeId = +this.route.snapshot.params['id'];
    this.recipeService.getRecipeDetails(recipeId).subscribe(
      data => {
        this.recipe = data;
        this.loadIngredients(recipeId);
        this.loadSteps(recipeId);
        this.loadTags(recipeId);
      },
      error => console.error('Erreur lors du chargement de la recette', error)
    );
  }

  loadIngredients(recipeId: number): void {
    this.recipeService.getIngredientsByRecipe(recipeId).subscribe(
      data => {
        console.log('Ingrédients chargés:', data); // Pour vérifier la structure des données.
        this.ingredients = data;
      },
      error => console.error('Erreur lors du chargement des ingrédients', error)
    );
  }



  loadSteps(recipeId: number): void {

    this.recipeService.getStepsByRecipe(recipeId).subscribe(
      data => this.steps = data,
      error => console.error('Erreur lors du chargement des étapes', error)
    );

  }

  loadTags(recipeId: number): void {
    this.recipeService.getTagsByRecipe(recipeId).subscribe(
      data => {
        console.log(data); // Ajoutez ceci pour déboguer
        this.tags = data;
      },
      error => console.error('Erreur lors du chargement des tags', error)
    );
  }
}
