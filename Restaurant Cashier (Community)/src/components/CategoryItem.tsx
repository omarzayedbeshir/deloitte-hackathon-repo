import React from "react";

interface CategoryItemProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  name,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-primary text-white font-semibold shadow-md"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span className="text-sm font-medium">{name}</span>
    </button>
  );
};
