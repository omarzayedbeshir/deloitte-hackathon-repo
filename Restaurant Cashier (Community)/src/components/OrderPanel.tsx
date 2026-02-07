import React, { useState } from "react";
import { CartItem } from "@/data/menuData";
import { OrderItem } from "./OrderItem";
import { OrderMenuDropdown } from "./OrderMenuDropdown";

interface OrderPanelProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onHistory?: () => void;
}

export const OrderPanel: React.FC<OrderPanelProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onHistory,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSavedOrders = () => {
    alert("Saved Orders - Feature coming soon!");
  };

  const handleHistory = () => {
    if (onHistory) {
      onHistory();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white text-lg">
            📋
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order Menu</h2>
            <p className="text-xs text-gray-400">Order No. 16</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <button className="hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hover:text-gray-600 transition-colors relative"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
          <OrderMenuDropdown
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onSaved={handleSavedOrders}
            onHistory={handleHistory}
          />
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-gray-300 text-4xl mb-4">🛒</div>
            <p className="text-gray-500">No items selected</p>
            <p className="text-gray-400 text-sm mt-2">
              Add items from the menu
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Checkout Bar */}
      <div className="bg-primary p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-medium">{totalItems} items</p>
          <p className="text-xl font-bold">DKK. {totalPrice.toLocaleString("en-US")}</p>
        </div>
        <button
          onClick={onCheckout}
          disabled={cartItems.length === 0}
          className="w-full bg-white text-primary font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Order
        </button>
      </div>
    </div>
  );
};
