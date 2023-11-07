export interface Recipe {
  id: number;
  title: string;
  description: string;
  timeToCook: number;
  timeToPrep: number;
  difficulty: string;
  image: string;
  video?: string;
}
