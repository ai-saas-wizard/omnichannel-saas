"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignOutPage() {
    const { signOut } = useClerk();

    useEffect(() => {
        signOut({ redirectUrl: "/sign-in" });
    }, [signOut]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Signing out...</p>
            </div>
        </div>
    );
}
