import Link from "next/link";
import Image from "next/image";
import { Recipe } from "../../models/Recipe";
import Tag from "./Tag";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="block overflow-hidden rounded-lg">
        <div className="relative w-full h-64 overflow-hidden">
      <Image
        src={recipe.imageurl}
        alt={recipe.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
        style={{ objectFit: "cover", objectPosition: "center" }}
        className="transform hover:scale-105 transition-transform duration-300"
      />
    </div>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold hover:underline">
            {recipe.name}
          </h2>
          <p className="text-gray-600">
            Cooking Time: {recipe.cooktime} minutes
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {recipe.tags?.map((tag, index) => (
              <Tag key={index} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
