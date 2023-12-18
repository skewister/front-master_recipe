import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {NgIf, CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { RecipeService } from "../../services/recipe.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { TagService } from '../../services/tag.service';
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
export class CreateRecipeComponent implements OnInit {
  recipeForm: FormGroup;
  recipeId: number | undefined;
  difficultyTags: any[] = [];
  cookTimeTags: any[] = [];
  prepTimeTags: any[] = [];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private cd: ChangeDetectorRef,
    private TagService: TagService
  ) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      steps: this.fb.array([]),
      difficulty: ['', Validators.required],
      prepTime: ['', Validators.required],
      cookTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
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
      file: [""],
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
    formData.append('difficulty', this.recipeForm.value.difficulty);
    formData.append('prep_time', this.recipeForm.value.prepTime);
    formData.append('cook_time', this.recipeForm.value.cookTime);


    this.steps.controls.forEach((step, index) => {
      console.log(step,index)
      formData.append(`steps[${index}][description]`, step.value.description);
      formData.append(`steps[${index}][step_number]`, step.value.step_number);


      if (step.value.file) {
        const fileExtension = step.value.file.url.split('.').pop()?.toLowerCase();
        if (fileExtension === 'mp4' || fileExtension === 'avi' || fileExtension === 'mov') {
          formData.append(`steps[${index}][file]`, step.value.file.url);
        } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
          formData.append(`steps[${index}][file]`, step.value.file.url);
        } else {
          console.log('Type de fichier non pris en charge:', step.value.file.url);
        }
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
