import { useState, useRef } from "react";

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(false);

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setError("");
    setRecipe("");
    setLoading(true);
    abortRef.current = false;

    /**
     * TODO: Write a prompt that encourages the model to generate a creative and practical recipe based on the user's ingredients.
     * The prompt should ask for a recipe title, description, ingredient list with quantities, and step-by-step instructions.
     * Make sure to specify that the tone should be friendly and the instructions should be easy to follow.
     */
  };

  const handleReset = () => {
    abortRef.current = true;
    setIngredients("");
    setRecipe("");
    setError("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-8xl"> 🍽️ </h1>
        <h1 className="text-4xl font-bold text-orange-600">
          Smart Recipe Generator
        </h1>
        <p className="mt-2 text-gray-500 text-lg">
          Tell me what ingredients you have and I'll suggest a recipe.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your ingredients
        </label>
        <textarea
          className="w-full h-32 border border-gray-300 rounded-xl p-3 text-sm resize-none
                     focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          placeholder="e.g. chicken, garlic, lemon, rosemary, olive oil..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          disabled={loading}
        />

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 mt-4">
          <button
            onClick={generateRecipe}
            disabled={loading}
            className="flex-1 bg-orange-400 hover:bg-orange-500 disabled:bg-gray-300
                       text-white font-medium py-3 rounded-xl transition"
          >
            {loading ? "Generating..." : "Generate Recipe"}
          </button>

          {(recipe || loading) && (
            <button
              onClick={handleReset}
              className="px-5 py-3 rounded-xl border border-gray-300
                         text-gray-600 hover:bg-gray-100 transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Loading skeleton — visible while waiting for first chunk */}
      {loading && !recipe && (
        <div className="mt-8 bg-white rounded-2xl shadow-md p-8 w-full max-w-xl animate-pulse">
          <div className="h-4 bg-orange-100 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-orange-100 rounded w-full mb-3"></div>
          <div className="h-4 bg-orange-100 rounded w-5/6 mb-3"></div>
          <div className="h-4 bg-orange-100 rounded w-2/3"></div>
        </div>
      )}

      {/* Streaming output — appears as chunks arrive */}
      {recipe && (
        <div className="mt-8 bg-white rounded-2xl shadow-md p-8 w-full max-w-xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🫕 Your Recipe
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {recipe}
          </p>
        </div>
      )}
    </div>
  );
}
