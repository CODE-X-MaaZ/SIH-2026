"use client";

import { useEffect, useState } from "react";
import { DemoComplaintRepository } from "@/lib/data/demo-repository";
import { Complaint } from "@/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const repo = new DemoComplaintRepository();
        repo.listComplaints().then(data => {
            // Sort by most recent first securely
            setComplaints(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            setIsLoading(false);
        });
    }, []);

    if (isLoading) return <div className="p-8 animate-pulse text-gray-500">Loading reports...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Reports</h1>
                <p className="text-gray-500 mt-2 text-lg">Raw report tracking natively parsed by Nagrik AI.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Tracking ID</th>
                                <th className="px-6 py-4 font-semibold">Issue</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Priority</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {complaints.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{c.trackingId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 line-clamp-1" title={c.originalText}>{c.originalText}</div>
                                        <div className="text-gray-500 text-xs mt-1">Norm: {c.normalizedText}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1 text-gray-600"><MapPin className="w-3.5 h-3.5" />{c.locationLabel}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="bg-gray-100">{c.category}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={c.priority === "CRITICAL" || c.priority === "HIGH" ? "destructive" : "secondary"}>
                                            {c.priority}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/track/${c.trackingId}`} target="_blank">
                                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
