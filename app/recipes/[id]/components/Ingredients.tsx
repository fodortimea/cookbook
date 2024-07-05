import { RecipeIngredient } from "../../models/RecipeIngredients";

export default function Ingredients({
  ingredients,
}: {
  ingredients: RecipeIngredient[] | undefined;
}) {
  return (
    <div className="h-full">
      {ingredients && ingredients.length > 0 ? (
        <div className="bg-orange-50 p-6 h-full">
          <h2 className="text-2xl font-semibold mb-4 text-orange-800">
            Ingredients
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity} {ingredient.measurement} {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-orange-50 p-6 h-full">
          <h2 className="text-2xl font-semibold mb-4 text-orange-800">
            Ingredients
          </h2>
          <p className="text-gray-600">No ingredients available.</p>
        </div>
      )}
    </div>
  );
}

