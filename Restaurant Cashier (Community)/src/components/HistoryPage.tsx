import React, { useState } from "react";
import { OrderHistory } from "@/data/orderHistory";
import { OrderDetailModal } from "./OrderDetailModal";

interface HistoryCardProps {
  order: OrderHistory;
  onDelete: (orderId: string) => void;
  onSelect: (order: OrderHistory) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ order, onDelete, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(order)}
      className="w-full bg-white border-2 border-primary rounded-xl p-4 flex items-center justify-between hover:shadow-lg hover:border-opacity-100 transition-all text-left"
    >
      {/* Left Content */}
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900">
          {order.items.length} item{order.items.length > 1 ? "s" : ""}
        </p>
        <p className="text-lg font-bold text-primary mt-1">
          DKK. {order.totalPrice.toLocaleString("id-ID")}
        </p>
      </div>

      {/* Time */}
      <div className="text-right mr-4">
        <p className="text-sm text-gray-500">{order.time}</p>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(order.id);
        }}
        className="text-red-500 hover:text-red-700 transition-colors p-2"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
      </button>
    </button>
  );
};

interface HistoryPageProps {
  orders: OrderHistory[];
  onBack: () => void;
  onSelectOrder?: (order: OrderHistory) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  orders,
  onBack,
  onSelectOrder,
}) => {
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleDelete = (orderId: string) => {
    setOrderHistory(orderHistory.filter((o) => o.id !== orderId));
  };

  const handleSelectOrder = (order: OrderHistory) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Group orders by date
  const groupedByDate = orderHistory.reduce(
    (groups, order) => {
      const dateKey = order.date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
      return groups;
    },
    {} as Record<string, OrderHistory[]>
  );

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-sm text-gray-500">Your previous orders</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {orderHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-gray-300 text-5xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">No Orders Yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Your past orders will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([dateKey, dateOrders]) => (
              <div key={dateKey}>
                {/* Date Header */}
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  {dateKey}
                </h2>

                {/* Orders for this date */}
                <div className="space-y-3 mb-4">
                  {dateOrders.map((order) => (
                    <HistoryCard
                      key={order.id}
                      order={order}
                      onDelete={handleDelete}
                      onSelect={handleSelectOrder}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={showDetailModal}
        order={selectedOrder}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
};
