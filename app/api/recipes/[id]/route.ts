import { Recipe } from "@/app/models/Recipe";
import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";
import { getSession } from "@/lib/neo4j";

export async function POST(request: NextRequest, { params }) {
  const { id } = params;

  // Extract the data from the request body
  const { describedUserInput, recommendedFor, isGraph } = await request.json();

  try {
    const recipe = await fetchRecipe(id, isGraph); // Assuming fetchRecipe fetches from the graph or supabase

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }
    const description = await fetchDescription(
      recipe,
      describedUserInput,
      recommendedFor
    );
    // Generate description using the Ollama model
    const detailedRecipe: Recipe = {
      ...recipe, // other fields like id, name, etc.
      generatedDescription: description, // Generated description from your LLM or process
    };
    return NextResponse.json({
      detailedRecipe,
    });
  } catch (error) {
    console.error("Error fetching recipe or generating description:", error);
    return NextResponse.json(
      { error: "Error fetching recipe or description" },
      { status: 500 }
    );
  }
}

const fetchRecipe = async (
  id: string,
  isGraph: boolean
): Promise<Recipe | null> => {
  if (isGraph) {
    return fetchRecipeFromGraph(parseInt(id, 10));
  } else {
    return fetchRecipeFromRelationalDB(id);
  }
};

const fetchRecipeFromGraph = async (id: number): Promise<Recipe | null> => {
  const session = getSession();
  const query = `
      MATCH (r:Recipe {id: $id})-[rel:CONTAINS]->(i:Ingredient)
    RETURN r, collect(i) AS ingredients, collect(rel) AS relationships
    `;
  const result = await session.run(query, { id });

  const recipeRecord = result.records[0];
  const recipe = recipeRecord.get("r");
  const ingredients = recipeRecord.get("ingredients");
  const relationships = recipeRecord.get("relationships");

  return {
    id: recipe.properties.id,
    name: recipe.properties.name,
    imageurl: recipe.properties.imageUrl,
    cooktime: recipe.properties.cookTime.toNumber(),
    serves: recipe.properties.serves.toNumber(),
    description: recipe.properties.description,
    ingredients: ingredients.map((i: any, index: number) => ({
        id: i.properties.id,
      name: i.properties.name,
      measurement: i.properties.measurement,
      quantity: relationships[index].properties.quantity,
    })),
    tags: [],
  };
  return null;
};

const fetchRecipeFromRelationalDB = async (
  id: string
): Promise<Recipe | null> => {
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
      tags: [],
    };
    return transformedRecipe;
  }
  return null;
};

export const fetchDescription = async (
  fetchedRecipe: Recipe,
  describedUserInput: string,
  recommendedFor: string
): Promise<string> => {
  try {
    if (fetchedRecipe) {
      return generateDescription(
        describedUserInput,
        fetchedRecipe,
        recommendedFor
      );
    } else {
      return "This is a placeholder until the fun starts.";
    }
  } catch (error) {
    console.error("Error fetching description:", error);
    return "Error while generating description";
  }
};

async function getPersonRelationships(
  session: any,
  recommendedFor: string
): Promise<PersonRelationships> {
  const result = await session.run(
    `
      MATCH (p:Person {name: $recommendedFor})-[:LOVES]->(lovedRecipes:Recipe)
      OPTIONAL MATCH (p)-[:HATES]->(hatedRecipes:Recipe)
      OPTIONAL MATCH (p)-[:IS_ALLERGIC_TO]->(allergicIngredients:Ingredient)
      RETURN collect(lovedRecipes.name) AS lovedRecipes,
             collect(hatedRecipes.name) AS hatedRecipes,
             collect(allergicIngredients.name) AS allergicIngredients;
      `,
    { recommendedFor }
  );

  // Cast the result to the defined interface
  return result.records[0].toObject() as PersonRelationships;
}

function buildLLMPrompt(
  recipe: any,
  userInput: string,
  recommendedFor: string | null,
  relationships: PersonRelationships | null
) {
  let prompt = `Write a description for a recipe in a recipe application while following these rules: 
    In exactly 2 sentences explain why this recipe is exceptional, based on the user's search criteria. 
    Highlight the flavors and experience without listing steps or ingredients. Be persuasive and concise, do not confirm that you understood the task. 
    Be formal and use passive tense instead of I. This is the recipe: ${JSON.stringify(
      recipe
    )}. User's search criteria: ${userInput}`;

  // Add relationship-based context if applicable
  if (recommendedFor && relationships) {
    const { lovedRecipes, hatedRecipes, allergicIngredients } = relationships;

    if (lovedRecipes.length > 0) {
      prompt += ` Based on the fact that ${recommendedFor} loves these recipes: ${lovedRecipes.join(
        ", "
      )}.`;
    }
    if (hatedRecipes.length > 0) {
      prompt += ` Keep in mind that ${recommendedFor} hates these recipes: ${hatedRecipes.join(
        ", "
      )}.`;
    }
    if (allergicIngredients.length > 0) {
      prompt += ` Also, ${recommendedFor} is allergic to these ingredients: ${allergicIngredients.join(
        ", "
      )}.`;
    }
    console.log("The propmt is: " + prompt);
  }

  return prompt;
}

async function generateDescription(
  userInput: string,
  recipe: any,
  recommendedFor?: string
) {
  if ((userInput ?? "").length === 0) {
    return "This is a placeholder until the fun starts.";
  }

  // Initialize session for Neo4j
  const session = getSession();

  // Fetch relationships if a user is provided
  let relationships: PersonRelationships | null = null;
  if (recommendedFor) {
    relationships = await getPersonRelationships(session, recommendedFor);
  }

  // Build the LLM prompt
  const prompt = buildLLMPrompt(
    recipe,
    userInput,
    recommendedFor,
    relationships
  );

  const generateDescription = await ollama.generate({
    model: "foodie",
    prompt,
  });

  return generateDescription.response;
}
