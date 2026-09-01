"use client";

import Link from "next/link";
import { AlertTriangle, Clock, MapPin, ChevronRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { DemoIncidentRepository } from "@/lib/data/demo-repository";
import { Incident } from "@/types";

function IncidentsList() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const statusFilter = searchParams.get("status");

    useEffect(() => {
        async function load() {
            const incRepo = new DemoIncidentRepository();
            let incs = await incRepo.listIncidents();

            if (statusFilter) {
                incs = incs.filter(i => i.status === statusFilter);
            }

            // Sort by priority and growth
            setIncidents(incs.sort((a, b) => b.growthMultiple - a.growthMultiple));
            setIsLoading(false);
        }
        load();
    }, [statusFilter]);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "CRITICAL": return "destructive";
            case "HIGH": return "destructive";
            case "MEDIUM": return "secondary"; // amber mapping in layout
            default: return "outline";
        }
    };

    if (isLoading) return <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-pulse text-gray-500">Loading incidents...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Emerging incidents</h1>
                <p className="text-gray-500 mt-2 text-lg">Problems showing unusual growth or concentration.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-700">Currently Active</h2>
                    <span className="text-sm text-gray-500 font-medium">Showing {incidents.length} incidents</span>
                </div>

                <div className="divide-y divide-gray-100">
                    {incidents.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 italic">No emerging incidents right now.</div>
                    ) : (
                        incidents.map((incident) => {
                            const isHighOrCrit = incident.priority === 'HIGH' || incident.priority === 'CRITICAL';
                            const colorTheme = isHighOrCrit ? 'red' : 'amber';

                            return (
                                <div key={incident.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Link href={`/admin/incidents/${incident.id}`} className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">{incident.title}</Link>
                                            <Badge variant={getPriorityColor(incident.priority)}>{incident.priority}</Badge>
                                            <Badge variant="outline" className={`border-${colorTheme}-200 bg-${colorTheme}-50 text-${colorTheme}-700`}>{incident.status}</Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
                                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400 shrink-0" /> {incident.locationLabel}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400 shrink-0" /> detected recently</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 sm:border-l sm:border-gray-200 sm:pl-6">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{incident.reportCount}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Reports</p>
                                        </div>
                                        <div>
                                            <p className={`text-2xl font-bold text-${colorTheme}-600 flex items-center`}><TrendingUp className="w-4 h-4 mr-1" /> {incident.growthMultiple.toFixed(1)}×</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Growth</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <Link href={`/admin/incidents/${incident.id}`}>
                                                <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-primary">
                                                    <ChevronRight className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="sm:hidden mt-2">
                                        <Link href={`/admin/incidents/${incident.id}`} className="w-full block">
                                            <Button variant="outline" className="w-full">View incident</Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default function IncidentsPage() {
    return (
        <Suspense fallback={<div className="max-w-7xl mx-auto space-y-8 pb-12 p-8">Loading...</div>}>
            <IncidentsList />
        </Suspense>
    );
}
