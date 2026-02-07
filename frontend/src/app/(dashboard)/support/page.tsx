import type { Metadata } from "next";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
    title: "Support - AMO Dashboard",
    description: "Get help and support",
};

export default function SupportPage() {
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
                                d="M7.57501 7.50001C7.77093 6.94306 8.15764 6.47343 8.66664 6.17428C9.17564 5.87514 9.7741 5.76579 10.3559 5.86561C10.9378 5.96542 11.4657 6.26795 11.8459 6.71961C12.2261 7.17127 12.4342 7.7435 12.4333 8.33334C12.4333 10 9.93334 10.8333 9.93334 10.8333M10 14.1667H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z"
                                stroke="#6941C6"
                                strokeWidth="1.67"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-[#101828] mb-2">Support</h2>
                    <p className="text-[#667085] max-w-md mx-auto">
                        Get help with your account, report issues, and access our knowledge base.
                        This page is under development.
                    </p>
                </div>
            </Card>
        </div>
    );
}
