import { Component, ChangeDetectorRef } from '@angular/core';
import {NgIf, CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { RecipeService } from "../../services/recipe.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    CommonModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent {
  recipeForm: FormGroup;
  recipeId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private cd: ChangeDetectorRef
  ) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      steps: this.fb.array([])
    });
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  addStep(): void {
    console.log('Ajout d\'une étape avant:', this.steps.value);
    this.steps.controls.forEach(control => {
      (control as FormGroup).get('isCollapsed')?.setValue(true);
    });

    // Ajouter une nouvelle étape dépliée
    const newStep = this.fb.group({
      description: [''],
      step_number: [this.steps.length + 1],
      video: [null],
      isCollapsed: [false]
    });
    this.cd.detectChanges();
    this.steps.push(newStep);

    console.log('Ajout d\'une étape après:', this.steps.value);
  }

  toggleStepCollapse(index: number): void {
    const step = this.steps.at(index) as FormGroup;
    const isCollapsed = step.get('isCollapsed')?.value;

    step.get('isCollapsed')?.setValue(!isCollapsed);

    if (isCollapsed) {
      step.enable();
    } else {
      step.disable();
    }
  }

  onSubmitRecipe(): void {
    const formData = new FormData();
    formData.append('title', this.recipeForm.value.title);
    formData.append('description', this.recipeForm.value.description);

    this.steps.controls.forEach((step, index) => {
      formData.append(`steps[${index}][description]`, step.value.description);
      formData.append(`steps[${index}][step_number]`, step.value.step_number);
      // Gérer le fichier vidéo si présent
      if (step.value.video) {
        formData.append(`steps[${index}][video]`, step.value.video, step.value.video.name);
      }
    });

    if (this.recipeId) {
      // Mise à jour de la recette existante
      this.recipeService.updateRecipe(this.recipeId, formData).subscribe(response => {
        console.log('Recette mise à jour', response);
        // Traiter la réponse ici
      });
    } else {
      // Création d'une nouvelle recette
      this.recipeService.addRecipe(formData).subscribe((response: any) => {
        console.log('Recette créée', response);
        this.recipeId = response.data.id; // Stocker l'ID de la recette
        this.submitSteps(); // Soumettre les étapes
      });
    }
  }

  submitSteps(): void {
    this.steps.controls.forEach(stepControl => {
      const stepData = {
        description: stepControl.value.description,
        step_number: stepControl.value.step_number,
        // Ajouter d'autres champs si nécessaire
      };

      if (this.recipeId) {
        this.recipeService.addStep(this.recipeId, stepData).subscribe(response => {
          console.log('Étape ajoutée', response);
          // Traiter la réponse ici
        });
      }
    });
  }

  deleteStep(stepId: number): void {
    if (this.recipeId && stepId) {
      this.recipeService.deleteStep(this.recipeId, stepId).subscribe(response => {
        console.log('Étape supprimée', response);
        this.removeStepFromForm(stepId);
      }, error => {
        console.error('Erreur lors de la suppression de l’étape', error);
      });
    }
  }

  private removeStepFromForm(stepId: number): void {
    const index = this.steps.controls.findIndex(step => step.value.id === stepId);
    if (index !== -1) {
      this.steps.removeAt(index);
    }
  }
}
