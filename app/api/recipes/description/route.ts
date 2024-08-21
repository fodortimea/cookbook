import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(request: NextRequest) {
  const { userInput, recipe } = await request.json();
  let description: string;
  if (!recipe) {
    return NextResponse.json({ error: "Missing recipe" }, { status: 400 });
  } else if ((userInput ?? "").length === 0) {
    return NextResponse.json({
      description: "This is a placeholder until the fun starts.",
    });
  } else {
    const prompt = `Write a description for a recipe in a recipe application while following these rules: In exactly 2 sentences explain why this recipe is exceptional, based on the user's search criteria. Highlight the flavors and experience without listing steps or ingredients. Be persuasive and concise, do not confirm that you understood the task. Be formal and use passive tense instead of I. This is the recipe: ${JSON.stringify(
        recipe
      )}. User's search criteria: ${userInput}`;      

    const generateDescription = await ollama.generate({
      model: "foodie",
      prompt: prompt,
    });

    description = generateDescription.response;

    return NextResponse.json({ description });
  }
}
