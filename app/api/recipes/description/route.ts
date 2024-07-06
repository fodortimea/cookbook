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
    const prompt = `In 100 characters or less explain why this recipe is exceptional. Highlight the flavors and experience without listing steps or ingredients. Be persuasive and concise. This is the recipe: ${JSON.stringify(
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
