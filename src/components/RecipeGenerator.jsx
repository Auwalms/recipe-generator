import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { model } from "../firebase";

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

    const prompt = `You are a knowledgeable and passionate Nigerian chef with deep expertise
in traditional Nigerian and West African cuisine.
A user has the following ingredients available: ${ingredients}.
Suggest one authentic Nigerian or West African recipe they can make with these ingredients. Include:
- The name of the dish (in English and the local language name where applicable, e.g. Yoruba, Igbo, or Hausa)
- A short, mouth-watering description of the dish and its cultural significance
- A full list of ingredients with quantities, including any additional pantry staples they might need
- Clear step-by-step cooking instructions
- Any helpful tips on how the dish is traditionally served or enjoyed
Keep the tone warm, encouraging, and culturally proud. Write as if you're teaching a friend how to cook.`;

    try {
      const result = await model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        if (abortRef.current) break;
        setRecipe((prev) => prev + chunk.text());
      }
    } catch (err) {
      console.error("Firebase AI Logic error:", err);
      setError(
        "Something went wrong generating your recipe. Please try again.",
      );
    } finally {
      setLoading(false);
    }
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
          <div className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-3 mb-1" {...props} />,
                p: ({ node, ...props }) => <p className="mb-3" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                em: ({ node, ...props }) => <em className="italic" {...props} />,
              }}
            >
              {recipe}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
