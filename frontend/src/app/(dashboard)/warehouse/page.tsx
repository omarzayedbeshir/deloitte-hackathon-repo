import type { Metadata } from "next";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
    title: "Warehouse - AMO Dashboard",
    description: "Manage warehouse locations",
};

export default function WarehousePage() {
    return (
        <div className="space-y-6">
            <Card className="p-8">
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F4EBFF] flex items-center justify-center">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2.5 17.5V7.5L10 2.5L17.5 7.5V17.5M2.5 17.5H17.5M2.5 17.5H0.833336M17.5 17.5H19.1667M5.83334 10H14.1667M5.83334 13.3333H14.1667"
                                stroke="#6941C6"
                                strokeWidth="1.67"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-[#101828] mb-2">Warehouse</h2>
                    <p className="text-[#667085] max-w-md mx-auto">
                        Manage warehouse locations, track inventory across multiple sites, and optimize storage.
                        This page is under development.
                    </p>
                </div>
            </Card>
        </div>
    );
}
