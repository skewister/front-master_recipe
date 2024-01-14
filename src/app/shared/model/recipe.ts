import {Ingredient} from "./ingredient";
import {Step} from "./step";
import {tag} from "./tag";
export interface Recipe {
  cookTimeTags: string;
  difficultyTags: string;
  id: number;
  user_id: number;
  title: string;
  description: string;
  timeToCook: number;
  timeToPrep: number;
  difficulty: string;
  image: string;
  image_url:string;
  video?: string;
  ingredient: Ingredient[];
  steps: Step[];
  tags: tag[];
}
