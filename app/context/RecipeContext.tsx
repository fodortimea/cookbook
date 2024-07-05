"use client";

import { createContext, useState, ReactNode, useContext } from 'react';
import { Recipe } from '../recipes/models/Recipe';

interface RecipeContextType {
  formData: FormData | null;
  setFormData: (data: FormData) => void;
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormDataState] = useState<FormData | null>(null);
  const [recipes, setRecipesState] = useState<Recipe[]>([]);

  const setFormData = (data: FormData) => {
    setFormDataState(data);
  };

  const setRecipes = (recipes: Recipe[]) => {
    setRecipesState(recipes);
  };

  return (
    <RecipeContext.Provider value={{ formData, setFormData, recipes, setRecipes }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};
