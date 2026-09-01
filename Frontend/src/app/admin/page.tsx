"use client";

import Link from "next/link";
import { ArrowUpRight, AlertCircle, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DemoIncidentRepository, DemoComplaintRepository } from "@/lib/data/demo-repository";
import { Incident } from "@/types";

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
                {/* Left: Map Area placeholder */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
                    <div className="bg-gray-200 w-full h-[600px] rounded-2xl flex items-center justify-center border border-gray-300 relative overflow-hidden bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/72.8777,19.0760,11/800x600?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example')] bg-cover bg-center">
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]"></div>
                        <div className="z-10 flex flex-col items-center text-gray-700 bg-white/90 p-4 rounded-xl shadow-sm border border-gray-200">
                            <MapPin className="w-8 h-8 mb-2" />
                            <p className="font-medium text-sm">Interactive Map (Pending Phase 5)</p>
                            <p className="text-xs text-gray-500 mt-1">Showing deterministic overview</p>
                        </div>
                        {/* Mock dots mapping directly to incidents roughly */}
                        {incidents.slice(0, 3).map((inc, i) => (
                            <div key={inc.id} className={`absolute w-6 h-6 rounded-full border-4 border-white shadow-lg animate-pulse ${inc.priority === 'CRITICAL' || inc.priority === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}`} style={{ top: `${30 + (i * 15)}%`, left: `${40 + (i * 10)}%` }}></div>
                        ))}
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
