import React from "react";

interface QuantityButtonProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const QuantityButton: React.FC<QuantityButtonProps> = ({
  quantity,
  onIncrease,
  onDecrease,
}) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
      <button
        onClick={onDecrease}
        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded transition-colors"
      >
        −
      </button>
      <span className="text-sm font-medium text-gray-800 w-6 text-center">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className="w-6 h-6 flex items-center justify-center text-primary hover:bg-purple-50 rounded transition-colors"
      >
        +
      </button>
    </div>
  );
};
