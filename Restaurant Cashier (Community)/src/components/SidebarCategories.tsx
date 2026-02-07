import React from "react";
import { CategoryItem } from "./CategoryItem";
import { Category } from "@/data/menuData";

interface SidebarCategoriesProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const SidebarCategories: React.FC<SidebarCategoriesProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const makananCategories = categories.filter((c) => c.section === "makanan");
  const minumanCategories = categories.filter((c) => c.section === "minuman");

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">AMO Inventory System</h1>
        <p className="text-xs text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Makanan Section */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
            Food
          </h3>
          <div className="space-y-2">
            {makananCategories.map((category) => (
              <CategoryItem
                key={category.id}
                name={category.name}
                isActive={activeCategory === category.id}
                onClick={() => onCategoryChange(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Minuman Section */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
            Beverages
          </h3>
          <div className="space-y-2">
            {minumanCategories.map((category) => (
              <CategoryItem
                key={category.id}
                name={category.name}
                isActive={activeCategory === category.id}
                onClick={() => onCategoryChange(category.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
