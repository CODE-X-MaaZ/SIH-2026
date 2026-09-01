"use client";

import { useEffect, useState } from "react";
import { DemoIncidentRepository, DemoComplaintRepository } from "@/lib/data/demo-repository";
import { Incident } from "@/types";
import { CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ResolutionPage() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const incRepo = new DemoIncidentRepository();
            const incs = await incRepo.listIncidents();

            // Artificial generation of post-resolution demonstration if none exists explicitly
            // (Only for demo purposes, as per instructions)
            const resolvedMock = incs.find(i => i.status === 'RESOLVED');
            const unresolvedMock = incs.find(i => i.status === 'POSSIBLY_UNRESOLVED');

            if (!resolvedMock && incs.length > 0) {
                // If there are no resolved incidents, we'll temporally fake a state on one 
                // incident ONLY if we absolutely have to, or we just rely on realistic transitions holding
            }

            setIncidents(incs);
            setIsLoading(false);
        }
        load();
    }, []);

    const resolved = incidents.filter(i => i.status === "RESOLVED");
    const attention = incidents.filter(i => i.status === "POSSIBLY_UNRESOLVED");

    const handleReopen = async (incident: Incident) => {
        if (window.confirm(`Reopen incident for ${incident.title}?\n\nThis will transition the incident back to active monitoring.`)) {
            const repo = new DemoIncidentRepository();
            const updated = await repo.updateIncident(incident.id, { status: "REOPENED" });
            setIncidents(prev => prev.map(i => i.id === incident.id ? updated : i));
        }
    };

    const handleKeepResolved = async (incident: Incident) => {
        if (window.confirm(`Keep ${incident.title} resolved?\n\nThis will suppress further possibly unresolved alerts for this incident temporarily.`)) {
            const repo = new DemoIncidentRepository();
            const updated = await repo.updateIncident(incident.id, { status: "RESOLVED" });
            setIncidents(prev => prev.map(i => i.id === incident.id ? updated : i));
        }
    };

    if (isLoading) return <div className="max-w-7xl mx-auto p-4 animate-pulse">Loading resolution intelligence...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Resolution monitoring</h1>
                <p className="text-gray-500 mt-2 text-lg">Check whether resolved incidents remain quiet after closure.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Needs Attention */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Needs Attention
                    </h2>

                    {attention.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500 italic">
                            All recently resolved incidents are currently quiet.
                        </div>
                    ) : (
                        attention.map(inc => (
                            <div key={inc.id} className="bg-white rounded-xl border-l-4 border-l-amber-500 border-y border-r border-gray-200 shadow-sm p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mb-2 uppercase text-xs font-bold">Possibly Unresolved</Badge>
                                        <h3 className="font-bold text-lg text-gray-900">{inc.title}</h3>
                                        <p className="text-gray-500 text-sm font-medium">{inc.locationLabel}</p>
                                    </div>
                                    <div className="text-right text-gray-400 text-xs font-medium">
                                        Resolved recently
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-center justify-between text-sm">
                                    <div>
                                        <p className="text-gray-500">Original reports:</p>
                                        <p className="font-bold text-gray-900">{inc.reportCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">New related reports:</p>
                                        <p className="font-bold text-amber-600">Post-resolution activity detected</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Evidence</h4>
                                    <ul className="text-sm space-y-1">
                                        <li className="flex gap-2 items-center text-gray-700"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Same geographic area</li>
                                        <li className="flex gap-2 items-center text-gray-700"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Similar descriptions</li>
                                        <li className="flex gap-2 items-center text-gray-700"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> New reports after closure</li>
                                    </ul>
                                </div>

                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                    <p className="text-sm text-amber-900 font-medium mb-3">Recommended: Review the incident again.</p>
                                    <div className="flex gap-3 flex-wrap">
                                        <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => handleReopen(inc)}>Reopen incident</Button>
                                        <Button variant="outline" className="bg-white" onClick={() => handleKeepResolved(inc)}>Keep resolved</Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Recently Resolved */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Recently Resolved
                    </h2>

                    {resolved.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500 italic">
                            No recently resolved incidents.
                        </div>
                    ) : (
                        resolved.map(inc => (
                            <div key={inc.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 group hover:border-gray-300 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">{inc.title}</h3>
                                        <p className="text-gray-500 text-sm font-medium">{inc.locationLabel}</p>
                                    </div>
                                    <div className="text-right text-gray-400 text-xs font-medium">
                                        Resolved recently
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 mb-4">
                                    <p>{inc.reportCount} supporting reports</p>
                                    <p className="text-emerald-600 font-medium flex items-center gap-1 mt-1">
                                        <CheckCircle2 className="w-4 h-4" /> No new related reports
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-flex items-center gap-1">
                                        ✓ Resolution holding
                                    </span>
                                    <Link href={`/admin/incidents/${inc.id}`}>
                                        <Button variant="ghost" size="sm" className="text-gray-500 group-hover:text-primary">
                                            View detail <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
