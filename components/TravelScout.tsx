"use client";

import { useState } from "react";
import { SearchResult, SearchResponse } from "@/types";
import SearchBar from "./SearchBar";
import TravelCard from "./TravelCard";

export default function TravelScout() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError("");
    setResults([]);
    setMessage("");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Search failed" }));
        throw new Error(errorData.error || "Search failed");
      }

      const data: SearchResponse = await response.json();
      setResults(data.results);
      setMessage(data.message || "");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to search. Please try again.";
      setError(errorMessage);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            🏝️ TripScout
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Describe your dream trip in natural language, and our AI will find
            the perfect match from our curated collection of Sri Lankan
            experiences.
          </p>
          <div className="mt-4 inline-block px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
              ✨ AI-powered | 🔒 Grounded | 🚀 Instant
            </p>
          </div>
        </header>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} loading={loading} error={error} />

        {/* Results */}
        {message && results.length === 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-yellow-800 dark:text-yellow-200">{message}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Found {results.length} {results.length === 1 ? "match" : "matches"}
              </h2>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {results.length === 1 ? "Perfect fit!" : "Top recommendations"}
              </span>
            </div>

            {message && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-xl p-3 sm:p-4">
                <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200">{message}</p>
              </div>
            )}

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {results.map((result) => (
                <TravelCard key={result.id} package={result} />
              ))}
            </div>
          </div>
        )}

        {/* Info Footer */}
        <footer className="mt-8 sm:mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg max-w-3xl mx-auto">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
              🔒 How it works
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>
                Our AI analyzes your natural language query and matches it with
                our curated inventory of travel experiences.
              </p>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                All recommendations are grounded to real packages - we never
                suggest destinations outside our verified inventory.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
