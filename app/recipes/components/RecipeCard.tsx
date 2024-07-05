import Link from "next/link";
import { Recipe } from "../models/Recipe";

export default function RecipeCard({recipe}: {recipe : Recipe}){
    return (
        <Link href={`/recipes/${recipe.id}`}>
            <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="block overflow-hidden rounded-lg">
                <img
                  src={recipe.imageurl || 'https://via.placeholder.com/150'}
                  alt={recipe.name}
                  className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-semibold hover:underline">{recipe.name}</h2>
                <p className="text-gray-600">Cooking Time: {recipe.cooktime} minutes</p>
              </div>
            </div>
          </Link>
    );
}