// components/ui/StatCard.tsx
import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  highlighted?: boolean;
}

export default function StatCard({
  title,
  value,
  highlighted = false,
}: StatCardProps) {
  return (
    <div
      className={`
        rounded-xl p-4 border
        ${
          highlighted
            ? "bg-[#6941C6] text-white border-[#6941C6]"
            : "bg-white text-gray-900 border-[#EAECF0]"
        }
      `}
    >
      <p
        className={`text-sm font-medium ${
          highlighted ? "text-purple-200" : "text-gray-500"
        }`}
      >
        {title}
      </p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
