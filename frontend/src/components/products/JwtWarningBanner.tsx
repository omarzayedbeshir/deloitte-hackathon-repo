// components/products/JwtWarningBanner.tsx
"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

export default function JwtWarningBanner() {
    return (
        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-yellow-600" />
            <span>
                <strong>Missing JWT token.</strong> Saving to backend is disabled. Products
                are stored locally only.
            </span>
        </div>
    );
}
