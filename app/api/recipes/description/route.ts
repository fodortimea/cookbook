import { getSession } from "@/lib/neo4j";
import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(request: NextRequest) {
  const { userInput, recipe, recommendedFor } = await request.json();
  if (!recipe) {
    return NextResponse.json({ error: "Missing recipe" }, { status: 400 });
  } else if ((userInput ?? "").length === 0) {
    return NextResponse.json({
      description: "This is a placeholder until the fun starts.",
    });
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

  const description = generateDescription.response;

  return NextResponse.json({ description });
}

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
    console.log('The propmt is: '+prompt);
  }

  return prompt;
}
