import type { Metadata } from "next";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
    title: "Roles - AMO Dashboard",
    description: "Manage user roles and permissions",
};

export default function RolesPage() {
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
                                d="M10 10C12.3012 10 14.1667 8.13452 14.1667 5.83333C14.1667 3.53214 12.3012 1.66667 10 1.66667C7.69882 1.66667 5.83334 3.53214 5.83334 5.83333C5.83334 8.13452 7.69882 10 10 10ZM10 10C5.39763 10 1.66667 13.731 1.66667 18.3333M10 10C14.6024 10 18.3333 13.731 18.3333 18.3333"
                                stroke="#6941C6"
                                strokeWidth="1.67"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-[#101828] mb-2">Roles & Permissions</h2>
                    <p className="text-[#667085] max-w-md mx-auto">
                        Manage user roles, set permissions, and control access to different features.
                        This page is under development.
                    </p>
                </div>
            </Card>
        </div>
    );
}
