// components/ui/Toast.tsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
} from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type ToastVariant = "success" | "error";

interface Toast {
    id: number;
    message: string;
    variant: ToastVariant;
}

interface ToastContextValue {
    showToast: (message: string, variant?: ToastVariant) => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const nextId = useRef(0);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, variant: ToastVariant = "success") => {
            const id = ++nextId.current;
            setToasts((prev) => [...prev, { id, message, variant }]);
            setTimeout(() => removeToast(id), 4000);
        },
        [removeToast]
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast stack – bottom-right */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              pointer-events-auto flex items-center gap-2 px-4 py-3
              rounded-xl shadow-lg text-sm font-medium
              animate-slide-in
              ${t.variant === "success"
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }
            `}
                    >
                        {t.variant === "success" ? (
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        ) : (
                            <XCircle className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span>{t.message}</span>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="ml-2 p-0.5 rounded hover:bg-black/5"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
