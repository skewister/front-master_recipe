import {Component, ChangeDetectorRef, OnInit, TemplateRef} from '@angular/core';
import {NgIf, CommonModule, NgIfContext} from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { RecipeService } from "../../services/recipe.service";
import { HttpClient } from "@angular/common/http";
import { debounceTime } from 'rxjs/operators';
import {Observable, switchMap} from 'rxjs';
import { TagService } from '../../services/tag.service';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent implements OnInit {

  recipeForm: FormGroup;
  recipeId: number | undefined;
  difficultyTags: any[] = [];
  cookTimeTags: any[] = [];
  prepTimeTags: any[] = [];
  selectedTags:any[] =[];
  searchControl = new FormControl();
  ingredientSearchResults: any[] = [];
  temporaryIngredients: any[] = [];
  selectedIngredient: any;
  ingredientsControl: FormArray<any>;
  showDropdown: boolean = true;
  currentStep: number = 1;
  status: string="";


  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private cd: ChangeDetectorRef,
    private TagService: TagService
  ) {
    this.ingredientsControl = new FormArray<FormGroup>([]);

    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      steps: this.fb.array([]),
      difficulty: ['', Validators.required],
      prepTime: ['', Validators.required],
      cookTime: ['', Validators.required],
      ingredients: this.ingredientsControl,
      image : [null]
    });
  }

  handleFileInput(event: any, stepIndex: number): void {
    const file = event.target.files[0];
    if (file) {
      const stepFormGroup = this.steps.at(stepIndex) as FormGroup;
      stepFormGroup.patchValue({ file: file });
    }
    console.log(`Fichier attaché à l'étape ${stepIndex}:`, file);
  }

  loadAllIngredients(): void {
    this.recipeService.getAllIngredients().subscribe(data => {
      this.ingredientSearchResults = data;
    });
  }

  ngOnInit(): void {
    this.loadAllIngredients();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(100),
        switchMap(value => this.recipeService.searchIngredients(value))
      )
      .subscribe(data => {
        this.ingredientSearchResults = data.map(ingredient => {
          if (ingredient.picture) {
            return {
              ...ingredient,
              picture: ingredient.picture.replace(/\\/g, ''),
              name: ingredient.name // Assurez-vous que cette propriété est correcte
            };
          }
          return ingredient;
        });
      });

    this.TagService.getTagsByType(5).subscribe(data => {
      this.difficultyTags = []
      for(const item of data){
        const newItem = {...item, selected:false, type: "difficulty"}
        this.difficultyTags.push(newItem)
      }

    });

    this.TagService.getTagsByType(4).subscribe(data => {
      this.cookTimeTags =[]
      for(const item of data){
        const newItem = {...item, selected:false, type:"cook"}
        this.cookTimeTags.push(newItem)
      }

    });

    this.TagService.getTagsByType(3).subscribe(data => {
      this.prepTimeTags =[]
      for(const item of data){
        const newItem = {...item, selected:false,type:"prep"}
        this.prepTimeTags.push(newItem)
      }
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

    console.log('Nouvelle étape ajoutée:', newStep.value);
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
    this.showDropdown = true;
  }

  onIngredientFieldFocus(): void {
    this.showDropdown = true;
    if (this.ingredientSearchResults.length === 0) {
      this.loadAllIngredients();
    }
  }

  onSearch(): void {
    if (this.searchControl.value) {
      this.showDropdown = true;
    }
  }

  removeIngredient(index: number): void {
    this.ingredientsControl.removeAt(index);
  }




  handleImageInput(event:any):void {
    const file = event.target.files[0];
    if(file){
      this.recipeForm.patchValue({image:file});
      this.cd.detectChanges();
    }
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const formData = new FormData();
      // Ajouter les champs de base de la recette à formData
      formData.append('title', this.recipeForm.value.title);
      formData.append('description', this.recipeForm.value.description);
      formData.append('difficulty', this.recipeForm.value.difficulty);
      formData.append('prepTime', this.recipeForm.value.prepTime);
      formData.append('cookTime', this.recipeForm.value.cookTime);
      // Ajouter une image de la recette si elle existe
      if (this.recipeForm.value.image) {
        formData.append('image', this.recipeForm.value.image);
      }

      // Ajouter les ingrédients
      this.ingredientsControl.controls.forEach((control, index) => {
        formData.append(`ingredients[${index}][id]`, control.value.ingredientId);
        formData.append(`ingredients[${index}][quantity]`, control.value.quantity);
        formData.append(`ingredients[${index}][unit]`, control.value.unit);
      });

      // Ajouter les étapes
      this.steps.controls.forEach((control, index) => {
        formData.append(`steps[${index}][description]`, control.value.description);
        formData.append(`steps[${index}][step_number]`, control.value.step_number);
        if (control.value.file) {
          formData.append(`steps[${index}][file]`, control.value.file, control.value.file.name);
        }
      });
      console.log('Étapes actuelles:', this.steps.value);
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

  onSubmitRecipe(): void {

    const formData = new FormData();
    if (this.recipeForm.valid && this.currentStep === 3) {
      let imageFile = this.recipeForm.get('image')?.value;
      if(imageFile instanceof File){
        formData.append('image',imageFile,imageFile.name)
      }
      // Ajouter les informations de base de la recette
      formData.append('title', this.recipeForm.value.title);
      formData.append('description', this.recipeForm.value.description);
      formData.append('difficulty', this.recipeForm.value.difficulty);
      formData.append('prep_time', this.recipeForm.value.prepTime);
      formData.append('cook_time', this.recipeForm.value.cookTime);

      // Ajouter les ingrédients à partir du FormArray
      this.ingredientsControl.controls.forEach((ingredientControl, index) => {
        formData.append(`ingredients[${index}][ingredientId]`, ingredientControl.value.ingredientId);
        formData.append(`ingredients[${index}][name]`, ingredientControl.value.ingredientName);
        formData.append(`ingredients[${index}][quantity]`, ingredientControl.value.quantity);
        formData.append(`ingredients[${index}][unit]`, ingredientControl.value.unit);
        // Ajouter l'image de l'ingrédient si disponible
        if (ingredientControl.value.image instanceof File) {
          formData.append(`ingredients[${index}][image]`, ingredientControl.value.image, ingredientControl.value.image.name);
        }
      });

      // Ajouter les étapes à FormData
      this.steps.controls.forEach((control, index) => {
        formData.append(`steps[${index}][description]`, control.value.description);
        formData.append(`steps[${index}][step_number]`, control.value.step_number);
        if (control.value.file instanceof File) {
          formData.append(`steps[${index}][video]`, control.value.file, control.value.file.name);
        }

      });

      // Logique de soumission ou de mise à jour de la recette
      if (this.recipeId) {
        // Mise à jour de la recette existante
        this.recipeService.updateRecipe(this.recipeId, formData).subscribe(response => {
          console.log('Recette mise à jour', response);
        });
      } else {
        // Création d'une nouvelle recette
        this.recipeService.addRecipe(formData).subscribe((response: any) => {
          console.log('Recette créée', response);
          this.status = response.message;
          this.recipeId = response.data.id;
          this.currentStep ++;
        });
      }
    }
  }

  toggleTag(tag: any){

    if(tag.type === "difficulty"){
      this.difficultyTags.forEach(t => t.selected = false);
    }else if(tag.type === "prep"){
      this.prepTimeTags.forEach(t => t.selected = false);
    }else{
      this.cookTimeTags.forEach(t => t.selected = false);
    }

    tag.selected = !tag.selected;
    console.log('tag update')
  }
  getTagClasses(tag : any) :any{
    return{
      'bg-orange-400 border-orange-500': tag.selected,
      'bg-gray-200 border-gray-300': !tag.selected
    }
  }

  submitSteps(): void {
    this.steps.controls.forEach((stepControl, index) => {
      if (stepControl.value.file && stepControl.value.file instanceof File) {
        // Création de FormData pour chaque étape
        const stepFormData = new FormData();
        stepFormData.append('description', stepControl.value.description);
        stepFormData.append('step_number', stepControl.value.step_number.toString());
        stepFormData.append('video', stepControl.value.file, stepControl.value.file.name);

        // Appel de la méthode du service pour ajouter une étape avec le FormData
        if (this.recipeId) {
          this.recipeService.addStep(this.recipeId, stepFormData).subscribe(response => {
            console.log('Étape avec vidéo ajoutée', response);
            // Traiter la réponse ici
          });
        }
      } else {
        // Gestion des étapes sans fichier vidéo
        const stepData = {
          description: stepControl.value.description,
          step_number: stepControl.value.step_number,
        };

        if (this.recipeId) {
          this.recipeService.addStep(this.recipeId, stepData).subscribe(response => {
            console.log('Étape sans vidéo ajoutée', response);
          });
        }
      }
    });
  }

  removeStepFromForm(index: number): void {
    this.steps.removeAt(index);
    this.steps.controls.forEach((control, idx) => {
      if (control.get('step_number')) {
        control.get('step_number')!.setValue(idx + 1);
      }
    });
  }




}
