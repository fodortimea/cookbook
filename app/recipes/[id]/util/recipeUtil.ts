import { Recipe } from "../../../models/Recipe";
import { supabase } from "../../../../lib/supabaseClient";
import ollama from "ollama";
//import { getSession } from "@/lib/neo4j";

export const fetchRecipe = async (id: string): Promise<Recipe | null> => {
  const isGraph = localStorage.getItem('isGraph') === 'true';
  if (isGraph) {
    return fetchRecipeFromGraph(id);
  } else {
    return fetchRecipeFromRelationalDB(id);
  }
};

//TODO make route for this!

const fetchRecipeFromGraph = async (id: string): Promise<Recipe | null> => {
  // const session = getSession();
  // const query = `
  //   MATCH (r:Recipe {id: $id})-[:CONTAINS]->(i:Ingredient)
  //   RETURN r, collect(i) AS ingredients
  // `;
  // const result = await session.run(query, { id });

  // const recipeRecord = result.records[0];
  // const recipe = recipeRecord.get('r');
  // const ingredients = recipeRecord.get('ingredients');

  // return {
  //   id: recipe.properties.id,
  //   name: recipe.properties.name,
  //   imageurl: recipe.properties.imageUrl,
  //   cooktime: recipe.properties.cookTime,
  //   serves: recipe.properties.serves,
  //   description: recipe.properties.description,
  //   ingredients: ingredients.map((i: any) => ({
  //     id: i.properties.id,
  //     name: i.properties.name,
  //     measurement: i.properties.measurement,
  //     quantity: i.properties.quantity,
  //   })),
  //   tags: [],
  // };
  return null;
};

 const fetchRecipeFromRelationalDB = async (id: string): Promise<Recipe | null> => {
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
      tags:[],
    };
    return transformedRecipe;
  }
  return null;
};

export const fetchDescription = async (fetchedRecipe: Recipe): Promise<string> => {
  try {
    if (fetchedRecipe) {
      const describedUserInput = localStorage.getItem('describedUserInput') || '';
      const recommendedFor = localStorage.getItem('recommendedFor') || '';
      const response = await fetch('/api/recipes/description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: describedUserInput,
          recipe: fetchedRecipe,
          recommendedFor
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
