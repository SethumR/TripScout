"use client";

import { useState } from "react";
import { SearchBarProps } from "@/types";

const EXAMPLE_QUERIES = [
  "a chilled beach weekend with surfing vibes under $100",
  "historical sites with amazing views",
  "adventure with wildlife and photography",
  "something cold and nature-focused",
];

export default function SearchBar({ onSearch, loading, error }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 sm:gap-4">
          <label
            htmlFor="search"
            className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white"
          >
            What kind of experience are you looking for?
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., beach getaway under $100"
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl sm:transform sm:hover:-translate-y-0.5 whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Searching...
                </span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Example Queries */}
      <div className="mt-4 sm:mt-6">
        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
          Try these examples:
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(example)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors touch-manipulation"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded text-sm sm:text-base">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}
