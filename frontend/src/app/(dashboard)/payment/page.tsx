import type { Metadata } from "next";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
    title: "Payment - AMO Dashboard",
    description: "Manage payments and transactions",
};

export default function PaymentPage() {
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
                                d="M17.5 8.33333H2.5M9.16667 11.6667H5.83333M2.5 6.5L2.5 13.5C2.5 14.4319 2.5 14.8978 2.68166 15.2654C2.84144 15.5903 3.09641 15.8459 3.42096 16.0065C3.78782 16.1889 4.25295 16.1889 5.18322 16.1889H14.8168C15.747 16.1889 16.2122 16.1889 16.579 16.0065C16.9036 15.8459 17.1586 15.5903 17.3183 15.2654C17.5 14.8978 17.5 14.4319 17.5 13.5V6.5C17.5 5.56812 17.5 5.10218 17.3183 4.73463C17.1586 4.40973 16.9036 4.15412 16.579 3.99349C16.2122 3.81111 15.747 3.81111 14.8168 3.81111H5.18322C4.25295 3.81111 3.78782 3.81111 3.42096 3.99349C3.09641 4.15412 2.84144 4.40973 2.68166 4.73463C2.5 5.10218 2.5 5.56812 2.5 6.5Z"
                                stroke="#6941C6"
                                strokeWidth="1.67"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-[#101828] mb-2">Payments</h2>
                    <p className="text-[#667085] max-w-md mx-auto">
                        Track payments, manage transactions, and view financial reports.
                        This page is under development.
                    </p>
                </div>
            </Card>
        </div>
    );
}
