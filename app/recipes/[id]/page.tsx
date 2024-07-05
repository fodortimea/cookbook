"use client";

import { useEffect, useState } from "react";
import Title from "./components/Title";
import Description from "./components/Description";
import Picture from "./components/Picture";
import { InfoCard } from "./components/InfoCard";
import Ingredients from "./components/Ingredients";
import Steps from "./components/Steps";
import { fetchRecipe } from "./util/recipeFetch";
import { Recipe } from "../models/Recipe";
import RecipeDetailsSkeleton from "@/app/components/RecipeDetailsSkeleton";



export default function RecipeDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (id) {
      console.log("Fetching recipe with id :", id);

      fetchRecipe(id).then(setRecipe);

    }
  }, [id]);

  if (!recipe) return <RecipeDetailsSkeleton />;
  if (!recipe) return <p>Recipe not found</p>;

  const steps: string[] = recipe.description
    .split(".")
    .filter((step: string) => step.trim().length > 0);
    return (
      <div className="min-h-screen bg-white p-6 relative">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {/* First Row */}
          <div className="-mx-8 bg-orange-300 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col justify-start">
                <Title name={recipe.name} />
                <Description description="This is a placeholder until the fun starts." />
              </div>
              <Picture source={recipe.imageurl} altSource={recipe.name} />
            </div>
          </div>
          {/* Icons */}
          <div className="relative flex justify-center -mt-8 z-20">
            <div className="absolute flex space-x-0 transform -translate-y-1/2">
              <InfoCard
                source="/icons/tray.png"
                altSource="Serving Tray Icon"
                title="Servings"
                value={recipe.serves?.toString()}
              />
              <InfoCard
                source="/icons/clock.png"
                altSource="Clock Icon"
                title="Prep Time"
                value={`${recipe.cooktime} minutes`}
              />
            </div>
          </div>
          {/* Second Row */}
          <div className="-mx-8 bg-orange-400 p-8 -mt-8 flex">
            <div className="w-1/2">
              <Ingredients ingredients={recipe.ingredients} />
            </div>
            <div className="w-1/2">
              <Steps steps={steps} />
            </div>
          </div>
        </div>
      </div>
    );
  }