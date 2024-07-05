import { Recipe } from "../../models/Recipe";
import { supabase } from "../../../../lib/supabaseClient";

  export const  fetchRecipe = async (id: string): Promise<Recipe | null>  => {
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
      if (!data)  null;

      // Transform the response data to match the Recipe type
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