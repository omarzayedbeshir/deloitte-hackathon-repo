import React from "react";
import { CartItem } from "@/data/menuData";

interface OrderSummaryModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onEdit: () => void;
  onPay: () => void;
}

export const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
  isOpen,
  cartItems,
  onClose,
  onEdit,
  onPay,
}) => {
  if (!isOpen) return null;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-96 shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Order Summary
        </h2>

        {/* Items List Header */}
        <div className="flex justify-between mb-4 pb-3 border-b border-gray-300">
          <p className="text-sm font-semibold text-gray-600">Item</p>
          <p className="text-sm font-semibold text-gray-600">#Qty</p>
        </div>

        {/* Items List */}
        <div className="space-y-3 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.name}
                </p>
                <p className="text-sm text-primary font-bold">
                  DKK. {item.price.toLocaleString("id-ID")}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-700 w-12 text-right">
                #{item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-gray-900">Total:</p>
            <p className="text-lg font-bold text-primary">
              DKK. {totalPrice.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 bg-gray-200 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Cart
          </button>
          <button
            onClick={onPay}
            className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 6h20v12H2z M2 10h20 M6 15h6" />
            </svg>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};
