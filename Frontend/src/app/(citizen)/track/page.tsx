"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackPage() {
    const [trackingId, setTrackingId] = useState("");
    const router = useRouter();

    const handleTrack = () => {
        if (!trackingId.trim()) return;
        router.push(`/track/${trackingId.trim().toUpperCase()}`);
    };

    return (
        <div className="flex flex-col gap-6 py-4 max-w-sm mx-auto h-[calc(100vh-100px)]">
            <div>
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    Track your report
                </h1>
                <p className="text-gray-600 mt-2">Enter your tracking ID.</p>
            </div>

            <div className="flex-1 flex flex-col gap-4 mt-6">
                <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                    className="w-full h-16 px-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-xl font-mono uppercase text-center placeholder:normal-case placeholder:text-gray-400 placeholder:font-sans placeholder:text-lg tracking-widest"
                    placeholder="e.g. NR-7K4P2"
                />
            </div>

            <div className="mt-auto pt-4">
                <Button
                    className="w-full h-14 text-lg rounded-xl flex items-center gap-2"
                    onClick={handleTrack}
                    disabled={!trackingId.trim()}
                >
                    <Search className="w-5 h-5" /> Track report
                </Button>
            </div>
        </div>
    );
}
