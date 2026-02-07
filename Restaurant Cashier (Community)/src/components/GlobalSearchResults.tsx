import React from "react";
import { MenuItem, Category } from "@/data/menuData";

interface GlobalSearchResultsProps {
  isOpen: boolean;
  results: MenuItem[];
  searchQuery: string;
  categories: Category[];
  onSelectResult: (item: MenuItem) => void;
  onClose: () => void;
}

export const GlobalSearchResults: React.FC<GlobalSearchResultsProps> = ({
  isOpen,
  results,
  searchQuery,
  categories,
  onSelectResult,
  onClose,
}) => {
  if (!isOpen || !searchQuery.trim()) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Search Results Dropdown */}
      <div className="absolute top-16 left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
        {results.length === 0 ? (
          <div className="p-6 text-center">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try searching for different keywords
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <div className="px-4 py-2 bg-gray-50 sticky top-0">
              <p className="text-xs font-semibold text-gray-600">
                Found {results.length} product{results.length !== 1 ? "s" : ""}
              </p>
            </div>
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors duration-150 flex items-start gap-3"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                  <p className="text-sm font-bold text-primary mt-1">
                    DKK. {item.price.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
