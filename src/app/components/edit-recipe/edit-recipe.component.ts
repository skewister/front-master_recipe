import { ActivatedRoute } from '@angular/router';

import { Recipe } from '../../shared/model/recipe';
import {Component, ChangeDetectorRef, OnInit, TemplateRef} from '@angular/core';
import {NgIf, CommonModule, NgIfContext} from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { RecipeService } from "../../services/recipe.service";
import { HttpClient } from "@angular/common/http";
import { debounceTime } from 'rxjs/operators';
import {Observable, switchMap} from 'rxjs';
import { TagService } from '../../services/tag.service';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  standalone: true
})
export class EditRecipeComponent implements OnInit {

  recipeForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  recipeId: number | undefined;
  difficultyTags: any[] = [];
  cookTimeTags: any[] = [];
  prepTimeTags: any[] = [];
  searchControl = new FormControl();
  ingredientSearchResults: any[] = [];
  temporaryIngredients: any[] = [];
  selectedIngredient: any;
  ingredientsControl: FormArray<any>;
  showDropdown: boolean = false;
  currentStep: number = 1;
  status: string="";

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private cd: ChangeDetectorRef,
    private TagService: TagService,
    private route: ActivatedRoute

  ) {
    this.ingredientsControl = new FormArray<FormGroup>([]);

    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      steps: this.fb.array([]),
      difficulty: ['', Validators.required],
      prepTime: ['', Validators.required],
      cookTime: ['', Validators.required],
      ingredients: this.ingredientsControl
    });
  }


  ngOnInit(): void {
    // Recherche d'ingrédients
    this.searchControl.valueChanges.pipe(
      debounceTime(100), // Attente de 100ms après chaque frappe de touche
      switchMap(value => this.recipeService.searchIngredients(value)) // Recherche d'ingrédients
    ).subscribe(data => {
      this.ingredientSearchResults = data; // Stockage des résultats de recherche
    });

    // Chargement des tags
    this.loadTags();

    // Chargement des données de la recette
    this.loadRecipeData();
  }

  private loadTags(): void {
    this.TagService.getTagsByType(5).subscribe(data => {
      this.difficultyTags = data;
    });

    this.TagService.getTagsByType(4).subscribe(data => {
      this.cookTimeTags = data;
    });

    this.TagService.getTagsByType(3).subscribe(data => {
      this.prepTimeTags = data;
    });
  }

  private loadRecipeData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id)
    this.recipeId = id ? Number(id) : undefined; // Gérer le cas où id est undefined

    if (this.recipeId) {
      this.recipeService.getRecipeById(this.recipeId).subscribe(response => {
        if (response && response.data) {
          console.log(response)
          this.initializeFormWithRecipeData(response.data);
        }
      });
    }
  }

  private initializeFormWithRecipeData(recipe: Recipe): void {
    // Initialisation des valeurs de base du formulaire
    this.recipeForm.patchValue({
      title: recipe.title,
      description: recipe.description,
      difficulty: recipe.difficulty,
      prepTime: recipe.timeToPrep,
      cookTime: recipe.timeToCook
    });

    // Initialisation des ingrédients et des étapes
    const ingredientFormGroups = recipe.ingredient.map(ingredient =>
      this.fb.group({
        ingredientId: [ingredient.id, Validators.required],
        ingredientName: [ingredient.name, Validators.required],
        quantity: [ingredient.quantity, Validators.required],
        unit: [ingredient.unit, Validators.required]
      })
    );
    this.ingredients.clear();
    ingredientFormGroups.forEach(group => this.ingredients.push(group));

    const stepFormGroups = recipe.steps.map(step =>
      this.fb.group({
        description: [step.description, Validators.required],
        step_number: [step.step_number, Validators.required],
        file: [null] // Ajouter la logique de gestion des fichiers si nécessaire
      })
    );
    this.steps.clear();
    stepFormGroups.forEach(group => this.steps.push(group));
  }



  private updateRecipe(formData: FormData): void {
    if (this.recipeId !== undefined) {
      this.loading = true;
      this.recipeService.updateRecipe(this.recipeId, formData).subscribe(
        response => {
          this.loading = false;
          console.log('Recette mise à jour', response);
        },
        error => {
          this.loading = false;
          this.errorMessage = "Erreur lors de la mise à jour de la recette";
        }
      );
    } else {
      console.log("Erreur: ID de recette est undefined.");
      this.loading = false;
      // Vous pouvez également définir un message d'erreur ou effectuer une autre action ici
    }
  }

  onSearch(): void {
    if (this.searchControl.value) {
      this.showDropdown = true;
    }
  }

  toggleStepCollapse(index: number): void {
    this.steps.controls.forEach((control, idx) => {
      if (idx !== index) {
        control.get('isCollapsed')?.setValue(true);
      }
    });

    const step = this.steps.at(index) as FormGroup;
    const isCollapsed = step.get('isCollapsed')?.value;
    step.get('isCollapsed')?.setValue(!isCollapsed);
  }

  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  addStep(): void {
    const newStep = this.fb.group({
      description: ['', Validators.required],
      step_number: [this.steps.length + 1, Validators.required],
      file: [null]
    });

    this.steps.push(newStep);
  }

  handleFileInput(event: any, stepIndex: number): void {
    const file = event.target.files[0];
    if (file) {
      const stepFormGroup = this.steps.at(stepIndex) as FormGroup;
      stepFormGroup.patchValue({ file: file });
    }
  }

  removeStepFromForm(index: number): void {
    this.steps.removeAt(index);
  }

  private setFormArrayData(formArray: FormArray, data: any[]): void {
    data.forEach(item => {
      formArray.push(this.createItemFormGroup(item));
    });
  }

  private createItemFormGroup(item: any): FormGroup {
    return this.fb.group({
      // Créer un FormGroup en fonction des données de l'item (ingrédient ou étape)
    });
  }

  selectIngredient(ingredient: any): void {
    // Créer un nouveau FormGroup pour l'ingrédient sélectionné
    const ingredientFormGroup = this.fb.group({
      ingredientId: new FormControl(ingredient.id, Validators.required),
      ingredientName: new FormControl(ingredient.name),
      image: new FormControl(ingredient.picture),
      quantity: new FormControl('', Validators.required), // La valeur initiale est vide, l'utilisateur la remplira
      unit: new FormControl('g', Validators.required) // La valeur initiale peut être 'g' ou toute autre unité

    });

    // Ajouter le FormGroup au FormArray des ingrédients
    this.ingredientsControl.push(ingredientFormGroup);

    // Optionnel : Masquer l'ingrédient de la liste de recherche après la sélection
    this.ingredientSearchResults = this.ingredientSearchResults.filter(i => i.id !== ingredient.id);
    this.showDropdown = false;
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }


  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  onSubmitRecipe(): void {
    if (this.recipeForm.valid && this.recipeId !== undefined) {
      const formData = new FormData();
      // Ajouter les données de base de la recette
      formData.append('title', this.recipeForm.value.title);
      formData.append('description', this.recipeForm.value.description);
      formData.append('difficulty', this.recipeForm.value.difficulty);
      formData.append('prepTime', this.recipeForm.value.prepTime);
      formData.append('cookTime', this.recipeForm.value.cookTime);

      // Ajouter les ingrédients à FormData
      this.ingredients.controls.forEach((control, index) => {
        formData.append(`ingredients[${index}][ingredientId]`, control.value.ingredientId);
        formData.append(`ingredients[${index}][name]`, control.value.ingredientName);
        formData.append(`ingredients[${index}][quantity]`, control.value.quantity);
        formData.append(`ingredients[${index}][unit]`, control.value.unit);
        // Ajouter l'image de l'ingrédient si disponible
        if (control.value.image && control.value.image instanceof File) {
          formData.append(`ingredients[${index}][image]`, control.value.image, control.value.image.name);
        }
      });

      // Ajouter les étapes à FormData
      this.steps.controls.forEach((control, index) => {
        formData.append(`steps[${index}][description]`, control.value.description);
        formData.append(`steps[${index}][step_number]`, control.value.step_number);
        if (control.value.file && control.value.file instanceof File) {
          formData.append(`steps[${index}][file]`, control.value.file, control.value.file.name);
        }
      });

      // Logique d'envoi de données
      this.recipeService.updateRecipe(this.recipeId, formData).subscribe(response => {
        console.log('Recette mise à jour', response);
        // Gérer la réponse ici...
      }, error => {
        console.log('Erreur lors de la mise à jour de la recette', error);
        // Gérer l'erreur ici...
      }
      );
    }else {
      console.log("ID de recette est undefined ou le formulaire n'est pas valide.");
    }
  }

  onSubmit(): void {
    console.log('Recipe ID:', this.recipeId); // Pour le débogage
    if (this.recipeForm.valid && this.recipeId !== undefined) { // Assurez-vous que recipeId n'est pas undefined
      const formData = new FormData();
      formData.append('title', this.recipeForm.value.title);
      formData.append('description', this.recipeForm.value.description);
      formData.append('difficulty', this.recipeForm.value.difficulty);
      formData.append('prepTime', this.recipeForm.value.prepTime);
      formData.append('cookTime', this.recipeForm.value.cookTime);

      this.ingredients.controls.forEach((control, index) => {
        formData.append(`ingredients[${index}][id]`, control.value.id);
        formData.append(`ingredients[${index}][name]`, control.value.name);
        formData.append(`ingredients[${index}][quantity]`, control.value.quantity);
        formData.append(`ingredients[${index}][unit]`, control.value.unit);
      });

      // Ajouter les étapes
      this.steps.controls.forEach((control, index) => {
        formData.append(`steps[${index}][id]`, control.value.id);
        formData.append(`steps[${index}][description]`, control.value.description);
        formData.append(`steps[${index}][step_number]`, control.value.step_number);
        // Gérer l'ajout de fichier si nécessaire
      });

      // Appel à updateRecipe seulement si recipeId n'est pas undefined
      this.recipeService.updateRecipe(this.recipeId, formData).subscribe(
        response => {
          console.log('Recette mise à jour', response);
          // Gérer la réponse ici...
        },
        error => {
          console.log('Erreur lors de la mise à jour de la recette', error);
          // Gérer l'erreur ici...
        }
      );
    } else {
      console.log("ID de recette est undefined ou le formulaire n'est pas valide.");
      // Gérer le cas où recipeId est undefined ou le formulaire n'est pas valide
    }
  }



}
