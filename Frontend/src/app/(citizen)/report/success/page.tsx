"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
    const router = useRouter();
    const [submissionData, setSubmissionData] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const data = sessionStorage.getItem("nagrik_last_submitted");
        if (!data) {
            router.push("/");
            return;
        }
        setSubmissionData(JSON.parse(data));
    }, [router]);

    if (!submissionData) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(submissionData.trackingId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 py-4 max-w-sm mx-auto min-h-[calc(100vh-100px)]">
            <div className="flex flex-col items-center text-center mt-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Your report has been submitted</h1>
                    <p className="text-gray-500 mt-2">Thank you for helping improve your area.</p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center mt-4 border border-gray-100 shadow-inner">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Tracking ID</span>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-mono font-bold tracking-widest text-primary">{submissionData.trackingId}</span>
                    <button onClick={handleCopy} className="text-gray-400 hover:text-gray-700 transition" title="Copy tracking ID">
                        <Copy className="w-5 h-5" />
                    </button>
                </div>
                {copied && <span className="text-xs text-green-600 font-medium mt-2">Copied to clipboard!</span>}
            </div>

            <div className="space-y-4 px-2">
                <h3 className="font-semibold text-gray-900">Status</h3>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-green-700 font-medium">
                        <CheckCircle className="w-5 h-5" /> Submitted
                    </li>
                    <li className="flex items-center gap-3 text-green-700 font-medium">
                        <CheckCircle className="w-5 h-5" /> Understood by AI
                    </li>
                    <li className="flex items-center gap-3 text-gray-500">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        Being reviewed
                    </li>
                </ul>
            </div>

            <div className="mt-auto pt-4 space-y-3 flex flex-col">
                <Link href={`/track/${submissionData.trackingId}`} className="w-full">
                    <Button className="w-full h-14 text-lg rounded-xl">
                        Track this report
                    </Button>
                </Link>
                <Link href="/" className="w-full">
                    <Button variant="outline" className="w-full h-14 text-lg rounded-xl">
                        Report another problem
                    </Button>
                </Link>
            </div>
        </div>
    );
}
