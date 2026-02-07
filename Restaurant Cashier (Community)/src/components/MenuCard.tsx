import React from "react";
import { MenuItem } from "@/data/menuData";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  return (
    <button
      onClick={() => onAddToCart(item)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 text-left">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 text-left">
          {item.description}
        </p>
        <p className="text-primary font-bold mt-3 text-left">
          Dkk. {item.price.toLocaleString("en-US")}
        </p>
      </div>
    </button>
  );
};
