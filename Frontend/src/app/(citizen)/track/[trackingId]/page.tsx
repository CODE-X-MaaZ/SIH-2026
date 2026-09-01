"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function TrackDetail() {
    const params = useParams();
    const trackingId = params.trackingId as string;

    const [report, setReport] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const existingTrackings = JSON.parse(localStorage.getItem("nagrik_trackings") || "{}");
        if (existingTrackings[trackingId]) {
            setReport(existingTrackings[trackingId]);
        }
        setIsLoading(false);
    }, [trackingId]);

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

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    if (!report) {
        return (
            <div className="flex flex-col gap-6 py-10 max-w-sm mx-auto min-h-screen text-center">
                <h1 className="text-2xl font-bold text-gray-900">We couldn&apos;t find that report.</h1>
                <p className="text-gray-500">Tracking ID: {trackingId}</p>
                <Link href="/track" className="mt-4">
                    <Button className="w-full h-14 text-lg rounded-xl">Try again</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 py-4 max-w-sm mx-auto min-h-screen">
            <div>
                <Link href="/track" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Link>
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Tracking ID</p>
                    <h1 className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
                        {trackingId}
                    </h1>
                </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl">
                        {getCategoryIcon(report.understanding?.category)}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-lg">{report.understanding?.issueTitle || "Civic Issue"}</p>
                    </div>
                </div>
                <div className="border-t border-indigo-100 pt-3">
                    <p className="text-gray-700 font-medium flex items-center gap-2">
                        <span className="text-lg">📍</span> {report.location?.displayName || "Detected location"}
                    </p>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border text-gray-700 border-gray-200 rounded-2xl p-6 mt-4">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {report.timeline.map((event: any, idx: number) => {
                        const isDone = event.done;
                        const isCurrent = !isDone && (idx === 0 || report.timeline[idx - 1].done);

                        return (
                            <div key={idx} className="relative flex items-center justify-between">
                                {isDone ? (
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 shadow shrink-0 text-white z-10">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                ) : isCurrent ? (
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 bg-white shadow shrink-0 z-10">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300 bg-white shadow shrink-0 z-10">
                                    </div>
                                )}

                                <div className="w-[calc(100%-3rem)]">
                                    <p className={`${isDone ? "text-gray-900 font-medium" :
                                            isCurrent ? "text-blue-700 font-bold" : "text-gray-400 font-medium"
                                        } leading-none`}>
                                        {event.title}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
