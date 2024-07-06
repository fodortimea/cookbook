"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Recipe } from "./models/Recipe";
import RecipeCard from "./components/RecipeCard";
import NoResultFound from "./components/NoResultFound";
import { useRecipeContext } from "../context/RecipeContext";
import { Result } from "../models/Result";
import RecipeSkeletonCard from "./components/RecipeSkeletonCard";

export default function Recipes() {
  const { formData, recipes, setRecipes } = useRecipeContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formData) {
      fetchRecipes();
    }
  }, [formData]);

  const fetchRecipes = async () => {
    const response = await fetch("/api/recipes/rag", {
      method: "POST",
      body: formData,
    });
    // const response = await fetch(
    //   `/api/recipes?search=${encodeURIComponent(
    //     formData!.get("message") as string
    //   )}`
    // );

    const data: Result = await response.json();
    if (data) {
      setRecipes(data.recipies);
      localStorage.setItem('describedUserInput', data.inputText);
    } else {
      console.error("Error fetching recipes:", data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {loading ? "Loading..." : "Recipes that match your search"}
        </h1>
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            [...Array(3)].map((_, index) => <RecipeSkeletonCard key={index} />)
          ) : recipes.length === 0 ? (
            <NoResultFound />
          ) : (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
