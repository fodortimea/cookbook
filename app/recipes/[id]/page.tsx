"use client";

import { useEffect, useState } from "react";
import Title from "./components/Title";
import Description from "./components/Description";
import Picture from "./components/Picture";
import { InfoCard } from "./components/InfoCard";
import Ingredients from "./components/Ingredients";
import Steps from "./components/Steps";
import { fetchDescription, fetchRecipe } from "./util/recipeUtil";
import { Recipe } from "../../models/Recipe";
import RecipeDetailsSkeleton from "@/app/components/RecipeDetailsSkeleton";

export default function RecipeDetails({ params }: Readonly<{ params: { id: string } }>) {
  const { id } = params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      // Retrieve values from localStorage
      const describedUserInput = localStorage.getItem('describedUserInput') || '';
      const recommendedFor = localStorage.getItem('recommendedFor') || '';
      const isGraph = localStorage.getItem('isGraph') === 'true';

      // Make the fetch request and send the values to the server
      fetch(`/api/recipes/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          describedUserInput,
          recommendedFor,
          isGraph
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setRecipe(data.detailedRecipe);
        })
        .catch((error) => {
          console.error('Error generating data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);  

  if (loading) return <RecipeDetailsSkeleton />;
  if (!recipe) return <p>Recipe not found</p>;

  const steps: string[] = recipe.description
    .split(".")
    .filter((step: string) => step.trim().length > 0);

    return (
      <div className="min-h-screen bg-white p-6 relative">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {/* First Row */}
          <div className="-mx-8 bg-orange-300 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col justify-start">
                <Title name={recipe.name} />
                <Description description={recipe.generatedDescription} />
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