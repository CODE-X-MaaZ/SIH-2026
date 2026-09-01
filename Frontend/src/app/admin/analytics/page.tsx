"use client";

import { useEffect, useState } from "react";
import { DemoIncidentRepository, DemoComplaintRepository } from "@/lib/data/demo-repository";
import { Incident, Complaint } from "@/types";
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

export default function AnalyticsPage() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const incRepo = new DemoIncidentRepository();
            const compRepo = new DemoComplaintRepository();

            const [incs, comps] = await Promise.all([
                incRepo.listIncidents(),
                compRepo.listComplaints()
            ]);

            setIncidents(incs);
            setComplaints(comps);
            setIsLoading(false);
        }
        load();
    }, []);

    if (isLoading) return <div className="max-w-7xl mx-auto p-4 animate-pulse">Loading analytics...</div>;

    if (complaints.length === 0) {
        return (
            <div className="max-w-7xl mx-auto space-y-6 pb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics</h1>
                    <p className="text-gray-500 mt-2 text-lg">Civic activity overview.</p>
                </div>
                <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                    <p className="text-gray-500 italic">No reports available for this period.</p>
                </div>
            </div>
        );
    }

    // 1. Calculate Reports over time (bucketing by roughly simulated time chunks)
    // Since demo data is over last ~6-7 hours. Let's make 5 buckets.
    const nowTime = Date.now();
    const minTime = Math.min(...complaints.map(c => new Date(c.createdAt).getTime()));
    const timeSpan = nowTime - minTime;
    const bucketCount = 6;
    const bucketSize = timeSpan / bucketCount;

    const timeBuckets = Array(bucketCount).fill(0);
    complaints.forEach(c => {
        const time = new Date(c.createdAt).getTime();
        const index = Math.min(bucketCount - 1, Math.floor((time - minTime) / bucketSize));
        if (index >= 0) timeBuckets[index]++;
    });
    const maxBucket = Math.max(...timeBuckets, 1);

    // 2. Category distribution
    const categories = ["Roads", "Garbage", "Water", "Streetlights", "Electricity", "Drainage", "Public Safety", "Other"];
    const categoryCounts = categories.map(cat => ({
        name: cat,
        count: complaints.filter(c => c.category === cat).length
    })).sort((a, b) => b.count - a.count);
    const maxCategory = Math.max(...categoryCounts.map(c => c.count), 1);

    // 3. Status Performance
    const statuses = ["EMERGING", "INVESTIGATING", "RESOLVED", "POSSIBLY_UNRESOLVED", "REOPENED"];
    const statusCounts = statuses.map(s => ({
        name: s,
        count: incidents.filter(i => i.status === s).length
    }));

    // 4. Emerging Trend
    const emergingCount = incidents.filter(i => i.status === "EMERGING").length;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics</h1>
                <p className="text-gray-500 mt-2 text-lg">Lightweight overview of civic activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Reports over time (Trend) */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-500" />
                        Reports over time
                    </h2>

                    <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto px-4 pb-2 border-b border-gray-100">
                        {timeBuckets.map((count, i) => (
                            <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                                <div
                                    className="w-full bg-indigo-500/80 rounded-t-sm hover:bg-indigo-600 transition-colors"
                                    style={{ height: `${Math.max(4, (count / maxBucket) * 100)}%` }}
                                ></div>
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium px-4">
                        <span>Older</span>
                        <span>Recent</span>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-500" />
                        Category Distribution
                    </h2>

                    <div className="space-y-4">
                        {categoryCounts.filter(c => c.count > 0).map(cat => (
                            <div key={cat.name} className="space-y-1">
                                <div className="flex justify-between text-sm font-medium text-gray-700">
                                    <span>{cat.name}</span>
                                    <span>{cat.count}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-indigo-500 h-2.5 rounded-full"
                                        style={{ width: `${(cat.count / maxCategory) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resolution Performance */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
                        Resolution Performance
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        {statusCounts.map(stat => (
                            <div key={stat.name} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.name.replace("_", " ")}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.count}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emerging Trend Highlight */}
                <div className="bg-indigo-900 p-6 rounded-xl shadow-sm text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-indigo-800/50 px-3 py-1 rounded-full text-indigo-200 text-sm font-medium">
                            <AlertTriangle className="w-4 h-4" /> Live Insights
                        </div>
                        <h2 className="text-4xl font-bold">{emergingCount}</h2>
                        <p className="text-indigo-200 font-medium">Emerging incidents currently require authority assignment and review.</p>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
                        <AlertTriangle className="w-64 h-64" />
                    </div>
                </div>

            </div>
        </div>
    );
}
