"use client";

import { useEffect, useState } from "react";
import { DemoIncidentRepository, DemoComplaintRepository } from "@/lib/data/demo-repository";
import { Incident, Complaint } from "@/types";
import { MapView } from "@/components/ui/map-view";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function HotspotsPage() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [mode, setMode] = useState<"hotspots" | "complaints" | "incidents">("hotspots");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const incRepo = new DemoIncidentRepository();
            const compRepo = new DemoComplaintRepository();

            const [incs, comps] = await Promise.all([
                incRepo.listIncidents(),
                compRepo.listComplaints()
            ]);

            setIncidents(incs.sort((a, b) => b.growthMultiple - a.growthMultiple));
            setComplaints(comps);
            setIsLoading(false);
        }
        load();
    }, []);

    // Derived Map Points
    const getMapPoints = () => {
        if (mode === "complaints") {
            return complaints.map(c => ({
                id: c.id,
                latitude: c.latitude || 0,
                longitude: c.longitude || 0,
                color: "bg-blue-400 opacity-60",
                label: c.issueTitle,
                type: "complaint" as const,
                popupContent: (
                    <div className="space-y-1">
                        <div className="font-bold">{c.issueTitle}</div>
                        <div className="text-xs text-gray-500">Tracking: {c.trackingId}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{c.originalText}</div>
                    </div>
                )
            }));
        } else if (mode === "incidents") {
            return incidents.map(i => ({
                id: i.id,
                latitude: i.latitude || 0,
                longitude: i.longitude || 0,
                color: i.priority === "CRITICAL" || i.priority === "HIGH" ? "red" : "amber", // Simplified to tailwind color substring
                label: i.title,
                isCenter: true,
                type: "incident" as const,
                popupContent: (
                    <div className="space-y-2">
                        <div className="font-bold">{i.title}</div>
                        <Badge variant={i.priority === 'CRITICAL' || i.priority === 'HIGH' ? 'destructive' : 'secondary'}>{i.priority}</Badge>
                        <div className="text-xs text-gray-500">{i.reportCount} related reports</div>
                        <div className="text-xs font-bold text-gray-800">{i.growthMultiple.toFixed(1)}× baseline</div>
                        <div className="text-xs text-gray-500">{i.locationLabel}</div>
                        <Link href={`/admin/incidents/${i.id}`} className="block mt-2 text-indigo-600 hover:underline text-xs flex items-center">
                            View incident details <ChevronRight className="w-3 h-3 ml-1" />
                        </Link>
                    </div>
                )
            }));
        } else {
            // Hotspots mode: Focus on high growth/density
            return incidents
                .filter(i => i.reportCount > 10) // deterministic rule
                .map(i => ({
                    id: i.id,
                    latitude: i.latitude || 0,
                    longitude: i.longitude || 0,
                    color: "indigo", // Simplified
                    label: i.title,
                    isCenter: true,
                    type: "hotspot" as const,
                    popupContent: (
                        <div className="space-y-2">
                            <div className="font-bold text-indigo-700">Civic Hotspot: {i.locationLabel}</div>
                            <div className="text-sm font-semibold">{i.title}</div>
                            <div className="text-xs text-gray-500">{i.reportCount} reports</div>
                            <div className="text-xs font-bold text-indigo-600">Top Issue: {i.category}</div>
                            <Link href={`/admin/incidents/${i.id}`} className="block mt-2 text-indigo-600 hover:underline text-xs flex items-center">
                                View incident details <ChevronRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    )
                }));
        }
    };

    if (isLoading) return <div className="max-w-7xl mx-auto p-4 animate-pulse">Loading GIS data...</div>;

    const hotspots = incidents.filter(i => i.reportCount > 10);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 flex flex-col h-[calc(100vh-2rem)]">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Civic hotspots</h1>
                <p className="text-gray-500 mt-2 text-lg">Areas with unusually high concentrations of reports or incidents.</p>
            </div>

            {/* Map and Detail Split */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">

                {/* Map Area */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                    {/* Controls */}
                    <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50">
                        <div className="inline-flex bg-gray-200/50 p-1 rounded-lg">
                            <button
                                onClick={() => setMode("hotspots")}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === "hotspots" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Hotspots
                            </button>
                            <button
                                onClick={() => setMode("incidents")}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === "incidents" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Incidents
                            </button>
                            <button
                                onClick={() => setMode("complaints")}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === "complaints" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Complaints
                            </button>
                        </div>
                        {/* Fake Filters for prototype */}
                        <div className="flex gap-2">
                            <select className="bg-white border border-gray-200 text-sm rounded-md px-3 py-1.5 text-gray-700 outline-none">
                                <option>All Categories</option>
                                <option>Water</option>
                                <option>Roads</option>
                            </select>
                            <select className="bg-white border border-gray-200 text-sm rounded-md px-3 py-1.5 text-gray-700 outline-none">
                                <option>Last 24h</option>
                                <option>Last 7 days</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <MapView points={getMapPoints()} className="h-full w-full rounded-none rounded-b-xl border-0" />
                    </div>
                </div>

                {/* Hotspot details sidebar */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-indigo-500" />
                            Detected Hotspots
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {hotspots.length === 0 ? (
                            <div className="text-center text-gray-500 italic p-8 text-sm">
                                No significant hotspots detected. New reports will appear here as concentrations emerge.
                            </div>
                        ) : (
                            hotspots.map(spot => {
                                const isCritical = spot.priority === "CRITICAL" || spot.priority === "HIGH";
                                const color = isCritical ? "red" : "amber";

                                return (
                                    <div key={spot.id} className={`border border-${color}-200 rounded-lg p-4 hover:border-${color}-300 transition-colors bg-${color}-50/30`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900">{spot.locationLabel}</h3>
                                            <Badge variant={isCritical ? "destructive" : "secondary"}>{spot.priority}</Badge>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Reports</span>
                                                <span className="font-bold text-gray-900">{spot.reportCount}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Active incidents</span>
                                                <span className="font-bold text-gray-900">1</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Growth</span>
                                                <span className={`font-bold text-${color}-600 flex items-center`}><TrendingUp className="w-4 h-4 mr-1" /> {spot.growthMultiple.toFixed(1)}× baseline</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Top issue</span>
                                                <span className="font-medium text-gray-900">{spot.category}</span>
                                            </div>
                                        </div>

                                        <Link href={`/admin/incidents/${spot.id}`} className="block">
                                            <Button className="w-full bg-white hover:bg-gray-50" variant="outline">
                                                View incident <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
