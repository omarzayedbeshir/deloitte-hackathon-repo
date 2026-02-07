import type { Metadata } from "next";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
    title: "Supplier - AMO Dashboard",
    description: "Manage your suppliers",
};

export default function SupplierPage() {
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
                                d="M13.3333 17.5V4.16667C13.3333 3.24619 12.5871 2.5 11.6667 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V17.5M13.3333 17.5H2.5M13.3333 17.5H17.5M2.5 17.5H0.833336M13.3333 7.5H15.8333C16.7538 7.5 17.5 8.24619 17.5 9.16667V17.5M17.5 17.5H19.1667M5.83334 5.83333H8.33334M5.83334 9.16667H8.33334"
                                stroke="#6941C6"
                                strokeWidth="1.67"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-[#101828] mb-2">Suppliers</h2>
                    <p className="text-[#667085] max-w-md mx-auto">
                        Manage your supplier relationships, track orders, and maintain contact information.
                        This page is under development.
                    </p>
                </div>
            </Card>
        </div>
    );
}
