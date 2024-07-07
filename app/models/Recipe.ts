import { RecipeIngredient } from "./RecipeIngredients";

export interface Recipe {
    id: number;
    name: string;
    imageurl: string;
    cooktime: number;
    serves?: number;
    description: string;
    ingredients?: RecipeIngredient[];
    tags?: string[];
  };