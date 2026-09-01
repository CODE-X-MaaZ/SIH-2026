"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ComplaintUnderstanding } from "@/lib/ai/types";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { DemoComplaintRepository } from "@/lib/data/demo-repository";

export default function ReviewPage() {
    const router = useRouter();
    const [understanding, setUnderstanding] = useState<ComplaintUnderstanding | null>(null);
    const [location, setLocation] = useState<any>(null);

    useEffect(() => {
        const storedUnderstanding = sessionStorage.getItem("nagrik_understanding");
        const storedLocation = sessionStorage.getItem("nagrik_draft_location");

        if (!storedUnderstanding) {
            router.push("/report");
            return;
        }

        setUnderstanding(JSON.parse(storedUnderstanding));
        if (storedLocation) {
            setLocation(JSON.parse(storedLocation));
        }
    }, [router]);

    const handleSubmit = () => {
        // Generate a random tracking ID for demo
        const trackingId = `NR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        // Save to demo state
        sessionStorage.setItem("nagrik_last_submitted", JSON.stringify({
            trackingId,
            understanding,
            location
        }));

        if (understanding) {
            const repo = new DemoComplaintRepository();
            repo.createComplaint({
                trackingId,
                originalText: understanding.originalText,
                normalizedText: understanding.normalizedText,
                detectedLanguage: understanding.detectedLanguage,
                category: understanding.category,
                issueTitle: understanding.issueTitle,
                priority: understanding.priority as any,
                confidence: understanding.confidence,
                explanation: understanding.explanation,
                latitude: location?.latitude,
                longitude: location?.longitude,
                locationLabel: location?.displayName,
                status: "SUBMITTED"
            });
        }

        // Add to a mock list of tracking IDs so tracking page works seamlessly for phase 2 citizen UI (legacy bridge for track/[trackingId])
        const existingTrackings = JSON.parse(localStorage.getItem("nagrik_trackings") || "{}");
        existingTrackings[trackingId] = {
            trackingId,
            understanding,
            location,
            status: "Being reviewed",
            timeline: [
                { title: "Report submitted", done: true },
                { title: "Classified by AI", done: true },
                { title: "Sent for review", done: true },
                { title: "Investigation", done: false },
                { title: "Resolution", done: false }
            ],
            timestamp: Date.now()
        };
        localStorage.setItem("nagrik_trackings", JSON.stringify(existingTrackings));

        // Clear draft states
        sessionStorage.removeItem("nagrik_understanding");
        sessionStorage.removeItem("nagrik_draft_report");
        sessionStorage.removeItem("nagrik_draft_location");

        router.push("/report/success");
    };

    if (!understanding) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    const priorityColor =
        understanding.priority === "Critical" ? "text-red-600 bg-red-50 border-red-200" :
            understanding.priority === "High" ? "text-orange-600 bg-orange-50 border-orange-200" :
                understanding.priority === "Medium" ? "text-yellow-600 bg-yellow-50 border-yellow-200" :
                    "text-green-600 bg-green-50 border-green-200";

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Water": return "💧";
            case "Roads": return "🛣️";
            case "Garbage": return "🗑️";
            case "Streetlights": return "💡";
            case "Electricity": return "⚡";
            case "Drainage": return "🕳️";
            case "Public Safety": return "🛡️";
            default: return "📋";
        }
    };

    return (
        <div className="flex flex-col gap-6 py-4 max-w-sm mx-auto min-h-[calc(100vh-100px)]">
            <div>
                <Link href="/report" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to edit
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    We understood your report
                </h1>
            </div>

            <div className="bg-white border shadow-sm rounded-xl p-5 space-y-6">
                <div className="flex items-start gap-4">
                    <div className="text-4xl bg-gray-50 p-3 rounded-lg">
                        {getCategoryIcon(understanding.category)}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">
                            {understanding.issueTitle}
                        </h2>
                        <span className="inline-flex items-center text-sm font-medium text-gray-500 mt-1">
                            {understanding.category}
                        </span>
                    </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <MapPin className="text-gray-400 w-5 h-5" />
                        <span className="text-gray-700 font-medium">{location?.displayName || "Unknown location"}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-gray-400 w-5 h-5" />
                        <span className={`px-2 py-0.5 rounded text-sm font-semibold border ${priorityColor}`}>
                            {understanding.priority.toUpperCase()} PRIORITY
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 w-5 h-5 text-center font-serif">Aअ</span>
                        <span className="text-gray-700 font-medium">Language: {understanding.detectedLanguage}</span>
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-baseline justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">Why we classified it this way</h3>
                        <div className="flex items-center text-xs font-semibold text-primary/80 bg-primary/10 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            AI Assessment
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {understanding.explanation}
                    </p>
                    {understanding.confidence < 0.5 && (
                        <div className="mt-3 bg-orange-50 text-orange-800 p-3 rounded-lg text-sm flex gap-2">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <p>We&apos;re not completely sure what the problem is. If this seems incorrect, please edit your report.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto pt-4 space-y-3 flex flex-col">
                <Button className="w-full h-14 text-lg rounded-xl" onClick={handleSubmit}>
                    Looks correct — submit
                </Button>
                <Link href="/report" className="w-full">
                    <Button variant="outline" className="w-full h-14 text-lg rounded-xl">
                        Edit report
                    </Button>
                </Link>
            </div>
        </div>
    );
}
