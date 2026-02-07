import React from "react";
import { MenuItem } from "@/data/menuData";
import { MenuCard } from "./MenuCard";

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  onAddToCart,
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Menu Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-lg">No items in this category</p>
            <p className="text-gray-400 text-sm">Try another category</p>
          </div>
        )}
      </div>
    </div>
  );
};
