import React, { useState } from "react";

interface OrderMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  onHistory: () => void;
}

export const OrderMenuDropdown: React.FC<OrderMenuDropdownProps> = ({
  isOpen,
  onClose,
  onSaved,
  onHistory,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop to close menu */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown Menu */}
      <div className="absolute top-16 right-6 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-max">
        <button
          onClick={() => {
            onSaved();
            onClose();
          }}
          className="w-full text-left px-6 py-3 text-gray-700 hover:bg-primary hover:bg-opacity-10 hover:text-primary transition-colors duration-200 flex items-center gap-2 border-b border-gray-100"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z"
            />
          </svg>
          Saved Orders
        </button>

        <button
          onClick={() => {
            onHistory();
            onClose();
          }}
          className="w-full text-left px-6 py-3 text-gray-700 hover:bg-primary hover:bg-opacity-10 hover:text-primary transition-colors duration-200 flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          History
        </button>
      </div>
    </>
  );
};
