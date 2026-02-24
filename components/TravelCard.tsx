import { TravelCardProps } from "@/types";

export default function TravelCard({ package: pkg }: TravelCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
              {pkg.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex items-center gap-1">
              📍 {pkg.location}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${pkg.price}
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">per person</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {pkg.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 sm:px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* AI Reasoning */}
        <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-2">
            <div className="shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Why this matches:
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {pkg.reasoning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
