import React from "react";
import { CartItem } from "@/data/menuData";
import { QuantityButton } from "./QuantityButton";

interface OrderItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export const OrderItem: React.FC<OrderItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  return (
    <div className="flex gap-3 pb-4 border-b border-gray-200 last:border-b-0">
      {/* Item Image */}
      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate">
          {item.name}
        </h4>
        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-primary font-bold text-sm">
            DKK. {item.price.toLocaleString("en-US")}
          </p>
          <QuantityButton
            quantity={item.quantity}
            onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
            onDecrease={handleDecrease}
          />
        </div>
      </div>
    </div>
  );
};
