"use client";

import Link from "next/link";
import { ArrowUpRight, AlertCircle, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DemoIncidentRepository, DemoComplaintRepository } from "@/lib/data/demo-repository";
import { Incident } from "@/types";
import { MapView } from "@/components/ui/map-view";

export default function AdminOverview() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [complaintCount, setComplaintCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const incidentRepo = new DemoIncidentRepository();
            const complaintRepo = new DemoComplaintRepository();
            const incs = await incidentRepo.listIncidents();
            const comps = await complaintRepo.listComplaints();
            setIncidents(incs.sort((a, b) => b.growthMultiple - a.growthMultiple));
            setComplaintCount(comps.length);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const emergingIncidents = incidents.filter(i => i.status === "EMERGING");
    const criticalIncidents = incidents.filter(i => i.priority === "CRITICAL");
    const needsReview = incidents.filter(i => i.status === "POSSIBLY_UNRESOLVED" || i.status === "EMERGING");

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "CRITICAL": return "destructive";
            case "HIGH": return "destructive";
            case "MEDIUM": return "secondary"; // Should be amber basically
            default: return "outline";
        }
    };

    if (isLoading) {
        return <div className="max-w-7xl mx-auto space-y-8 animate-pulse text-gray-500">Loading authority radar...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">What needs attention now?</h1>
                <p className="text-gray-500 mt-2 text-lg">Emerging civic problems detected from citizen reports.</p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-4xl font-bold text-gray-900">{emergingIncidents.length}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Emerging incidents</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm border-l-4 border-l-red-500">
                    <p className="text-4xl font-bold text-red-600">{criticalIncidents.length}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Critical</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-4xl font-bold text-gray-900">{complaintCount}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Active reports</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm border-l-4 border-l-amber-500">
                    <p className="text-4xl font-bold text-amber-600">{needsReview.length}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Needs review</p>
                </div>
            </div>

            {/* Main Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Map Area */}
                <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
                    <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
                    <div className="w-full h-[600px] rounded-2xl border border-gray-300 relative overflow-hidden shadow-sm flex-1 z-0">
                        <MapView
                            className="h-full w-full"
                            points={incidents.map(inc => ({
                                id: inc.id,
                                latitude: inc.latitude || 0,
                                longitude: inc.longitude || 0,
                                color: (inc.priority === 'CRITICAL' || inc.priority === 'HIGH') ? 'red' : 'amber',
                                label: inc.title,
                                type: 'incident',
                                isCenter: true,
                                popupContent: (
                                    <div className="space-y-2 min-w-[200px]">
                                        <div className="font-bold flex items-center justify-between">
                                            <span>{inc.title}</span>
                                            <Badge variant={inc.priority === 'CRITICAL' || inc.priority === 'HIGH' ? 'destructive' : 'secondary'} className="ml-2 text-[10px] uppercase">
                                                {inc.priority}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">
                                            {inc.locationLabel}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100">
                                            <div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Reports</div>
                                                <div className="font-medium">{inc.reportCount}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Growth</div>
                                                <div className="font-bold text-red-600">{inc.growthMultiple.toFixed(1)}×</div>
                                            </div>
                                        </div>
                                        <Link href={`/admin/incidents/${inc.id}`} className="block mt-2 text-indigo-600 font-medium hover:underline text-xs flex items-center">
                                            View incident details <ChevronRight className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>
                                )
                            }))}
                        />
                    </div>
                </div>

                {/* Right: queue */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Needs Attention Now</h2>
                        <Link href="/admin/incidents" className="text-sm font-medium text-primary hover:underline">View all</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        {incidents.length === 0 ? (
                            <div className="p-6 bg-white border border-gray-200 rounded-xl text-center">
                                <p className="text-gray-500">No emerging incidents right now.</p>
                                <p className="text-sm text-gray-400 mt-1">We&apos;ll continue monitoring new reports.</p>
                            </div>
                        ) : (
                            incidents.slice(0, 5).map((incident) => {
                                const isHighOrCrit = incident.priority === 'HIGH' || incident.priority === 'CRITICAL';
                                const colorTheme = isHighOrCrit ? 'red' : 'amber';
                                return (
                                    <div key={incident.id} className={`bg-white rounded-xl border border-${colorTheme}-200 shadow-sm overflow-hidden flex flex-col hover:border-${colorTheme}-300 transition-colors`}>
                                        <div className="p-5 border-b border-gray-100 flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className={`flex items-center gap-2 text-${colorTheme}-600 font-semibold`}>
                                                    <AlertCircle className="w-5 h-5" />
                                                    <span className="line-clamp-1">{incident.title}</span>
                                                </div>
                                                <Badge variant={getPriorityColor(incident.priority)}>{incident.priority}</Badge>
                                            </div>

                                            <p className="text-gray-600 text-sm font-medium mb-4 flex items-center gap-1.5 line-clamp-1">
                                                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                                {incident.locationLabel || "Unknown Area"}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-900">{incident.reportCount}</p>
                                                    <p className="text-xs text-gray-500 font-medium">Related reports</p>
                                                </div>
                                                <div>
                                                    <p className={`text-2xl font-bold text-${colorTheme}-600 flex items-center gap-1`}>
                                                        <ArrowUpRight className="w-5 h-5" /> {incident.growthMultiple.toFixed(1)}×
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-medium">vs baseline</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 flex items-center justify-between">
                                            <Badge variant="outline" className={`bg-${colorTheme}-50 text-${colorTheme}-700 border-${colorTheme}-200 font-medium border-transparent`}>{incident.status}</Badge>
                                            <Link href={`/admin/incidents/${incident.id}`}>
                                                <Button variant={isHighOrCrit ? "default" : "secondary"} size="sm" className={`w-full sm:w-auto ${!isHighOrCrit && 'bg-white border border-gray-200'}`}>
                                                    Review incident <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </Link>
                                        </div>
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
