import { Recipe } from "../../models/Recipe";
import { supabase } from "../../../../lib/supabaseClient";
import ollama from "ollama";

export const fetchRecipe = async (id: string): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
        id,
        name,
        imageUrl,
        cookTime,
        serves,
        description,
        recipeingredients (
          ingredient:ingredients (
            id,
            name,
            measurement
          ),
          quantity
        )
      `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching recipe:", error);
  } else {
    if (!data) null;

    const transformedRecipe: Recipe = {
      id: data.id,
      name: data.name,
      imageurl: data.imageUrl,
      cooktime: data.cookTime,
      serves: data.serves,
      description: data.description,
      ingredients: data.recipeingredients.map((ri: any) => ({
        id: ri.ingredient.id,
        name: ri.ingredient.name,
        quantity: ri.quantity,
        measurement: ri.ingredient.measurement,
      })),
    };
    return transformedRecipe;
  }
  return null;
};

export const fetchDescription = async (fetchedRecipe: Recipe): Promise<string> => {
  try {
    if (fetchedRecipe) {
      const describedUserInput = localStorage.getItem('describedUserInput') || '';
      const response = await fetch('/api/recipes/description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: describedUserInput,
          recipe: fetchedRecipe,
        }),
      });
      const data = await response.json();
      return data.description;
    } else {
      return "This is a placeholder until the fun starts.";
    }
  } catch (error) {
    console.error("Error fetching description:", error);
    return "Error while generating description";
  }
};
