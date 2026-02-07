import React from "react";
import { OrderHistory } from "@/data/orderHistory";

interface OrderDetailModalProps {
  isOpen: boolean;
  order: OrderHistory | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const formattedDate = new Date(order.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-96 shadow-lg max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
          <p className="text-sm text-gray-500">{order.time}</p>
        </div>

        {/* Items List */}
        <div className="space-y-4 mb-6">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-primary">
                DKK. {(item.price * item.quantity).toLocaleString("en-US")}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-gray-900">Total:</p>
            <p className="text-2xl font-bold text-primary">
              DKK. {order.totalPrice.toLocaleString("en-US")}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};
