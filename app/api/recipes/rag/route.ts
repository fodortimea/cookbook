import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import { Result } from "@/app/models/Result";
import ollama from "ollama";
import { Recipe } from "@/app/models/Recipe";

export async function POST(request: NextRequest) {
  let messagetoEmbed: string;

  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const message = formData.get("message") as string;
    messagetoEmbed = message;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const images = [uint8Array];

      const generateResponse = await ollama.generate({
        model: "foodie",
        prompt:
          "Try to guess the food on this image. Do not detail the plating, aesthetics focus only on the food and what it could be made of.",
        images,
      });
      messagetoEmbed += " " + generateResponse.response;
    }
  } catch (error) {
    console.error("Error handling form data:", error);
    return NextResponse.json(
      { error: "Error handling form data" },
      { status: 500 }
    );
  }

  try {
    const embeddingsResponse = await ollama.embeddings({
      model: "all-minilm",
      prompt: messagetoEmbed,
    });

    const embeddedMessage = embeddingsResponse.embedding;

    const { data, error } = await supabase.rpc("match_recipies", {
      query_embedding: embeddedMessage,
      match_threshold: 0.01,
      match_count: 3,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const detailedRecipes = await Promise.all(
      data.map(async (recipe: Recipe) => {
        const generateTags = await ollama.generate({
          model: "foodie",
          prompt: `Generate exactly 3 tags for this recipe: ${JSON.stringify(
            recipe
          )}, separated by comma`,
        });

        const tags = generateTags.response.split(",").map((tag) => tag.trim());

        return { ...recipe, tags };
      })
    );

    const result: Result = {
      recipes: detailedRecipes,
      inputText: messagetoEmbed,
    };
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating embeddings or fetching recipes:", error);
    return NextResponse.json(
      { error: "Error generating embeddings or fetching recipes" },
      { status: 500 }
    );
  }
}
