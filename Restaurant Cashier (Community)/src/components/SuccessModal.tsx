import React from "react";
import { CartItem } from "@/data/menuData";

interface SuccessModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  orderNumber: string;
  onHome: () => void;
  onPrint?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  cartItems,
  orderNumber,
  onHome,
  onPrint,
}) => {
  if (!isOpen) return null;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-96 shadow-lg text-center">
        {/* Success Checkmark */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h2>
        <p className="text-sm text-gray-500 mb-6">Order No. #{orderNumber}</p>

        {/* Order Details */}
        <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
          <div className="flex justify-between">
            <p className="text-gray-600">Total</p>
            <p className="font-bold text-primary">
              DKK. {totalPrice.toLocaleString("en-US")}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Amount Paid</p>
            <p className="font-bold text-gray-900">
              DKK. {totalPrice.toLocaleString("en-US")}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Change</p>
            <p className="font-bold text-gray-900">DKK. 0</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onHome}
            className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4" />
            </svg>
            Back to Menu
          </button>
          {onPrint && (
            <button
              onClick={onPrint}
              className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
