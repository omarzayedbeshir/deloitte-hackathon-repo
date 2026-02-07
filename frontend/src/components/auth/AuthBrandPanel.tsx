import React from "react";

export default function AuthBrandPanel() {
    return (
        <aside className="relative hidden lg:flex lg:w-1/2 bg-[var(--brand-purple)] rounded-[40px] m-4 mr-0 flex-col items-center justify-center p-8 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-md">
                {/* Logo Pill */}
                <div className="bg-white rounded-full px-8 py-4 shadow-lg mb-8">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[var(--brand-purple)]">
                            AMO
                        </span>
                        <span className="text-2xl font-bold text-[var(--brand-purple)]">
                            Inventory
                        </span>
                        <span className="text-2xl font-bold text-[var(--brand-purple)]">
                            System
                        </span>
                    </div>
                </div>

                {/* Tagline */}
                <p className="text-white/90 text-base leading-relaxed px-4">
                    Re-imagining inventory management experience with advance data
                    analytics for optimum performance
                </p>
            </div>

            {/* Footer */}
            <footer className="absolute bottom-6 left-8 text-white/70 text-sm">
                © AMO 2026
            </footer>
        </aside>
    );
}
