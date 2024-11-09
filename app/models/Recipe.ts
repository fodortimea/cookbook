import { RecipeIngredient } from "./RecipeIngredients";

export interface Recipe {
    id: number;
    name: string;
    imageurl: string;
    cooktime: number;
    cusine?: string;
    serves?: number;
    description: string;
    ingredients?: RecipeIngredient[];
    tags?: string[];
    generatedDescription?: string;
  };