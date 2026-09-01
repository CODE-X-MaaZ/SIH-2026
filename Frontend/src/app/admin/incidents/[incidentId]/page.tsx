"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Building2, Users, AlertTriangle, TrendingUp, Clock, CheckCircle2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";
import { DemoIncidentRepository, DemoComplaintRepository } from "@/lib/data/demo-repository";
import { Incident, Complaint } from "@/types";
import { DEMO_EVIDENCE } from "@/data/demo/incidents";
import { MapView } from "@/components/ui/map-view";

export default function IncidentDetail({ params }: { params: Promise<{ incidentId: string }> }) {
    const { incidentId } = use(params);
    const [incident, setIncident] = useState<Incident | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const incRepo = new DemoIncidentRepository();
            const compRepo = new DemoComplaintRepository();
            const inc = await incRepo.getIncident(incidentId);
            if (inc) {
                const allComps = await compRepo.listComplaints();
                const related = allComps.filter(c => inc.complaintIds.includes(c.id)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setIncident(inc);
                setComplaints(related);
            }
            setIsLoading(false);
        }
        load();
    }, [incidentId]);

    const handleUpdateStatus = async (status: Incident["status"]) => {
        if (!incident) return;
        if (status === "RESOLVED") {
            const confirm = window.confirm("Resolve incident?\n\nThis will mark the incident as resolved. The system will continue monitoring for related reports.");
            if (!confirm) return;
        }

        const incRepo = new DemoIncidentRepository();
        const updated = await incRepo.updateIncident(incident.id, { status });
        setIncident(updated);
    };

    if (isLoading) return <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-pulse text-gray-500">Loading incident detail...</div>;

    if (!incident) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>
                <div className="p-8 bg-white border border-gray-200 rounded-xl text-center">
                    <p className="text-gray-500 font-medium">Incident not found</p>
                </div>
            </div>
        );
    }

    const isHighOrCrit = incident.priority === 'HIGH' || incident.priority === 'CRITICAL';
    const colorTheme = isHighOrCrit ? 'red' : 'amber';
    const textColor = `text-${colorTheme}-600`;
    const bgColor = `bg-${colorTheme}-100`;

    // Filter evidence specific to this incident safely
    const activeEvidence = DEMO_EVIDENCE.filter(e => e.incidentId === incident.id);

    // AI Interpretation logic based on priority and report count
    const aiInterpretation = incident.category === "Water"
        ? `The pattern is consistent with a localized ${incident.category.toLowerCase()} supply disruption.`
        : `An unusually dense cluster of ${incident.category.toLowerCase()} reports indicates a systemic infrastructure issue.`;

    const mapPoints = [
        { id: incident.id, latitude: incident.latitude || 0, longitude: incident.longitude || 0, color: "bg-indigo-600", isCenter: true, type: "incident" as const, label: "Incident Center" },
        ...complaints.slice(0, 10).map(c => ({
            id: c.id,
            latitude: c.latitude || 0,
            longitude: c.longitude || 0,
            color: "bg-indigo-400 opacity-60",
            type: "complaint" as const,
            label: c.issueTitle,
            popupContent: (
                <div className="space-y-1">
                    <div className="font-bold">{c.issueTitle}</div>
                    <div className="text-xs text-gray-500">Tracking: {c.trackingId}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{c.originalText}</div>
                </div>
            )
        }))
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Back & Breadcrumbs */}
            <div>
                <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <Badge variant={incident.priority === "CRITICAL" || incident.priority === "HIGH" ? "destructive" : "secondary"} className="font-semibold px-3 py-1 text-sm rounded-md uppercase">
                        {incident.priority} PRIORITY
                    </Badge>
                    <Badge variant="outline" className={`font-semibold px-3 py-1 text-sm uppercase ${incident.status === "EMERGING" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}`}>{incident.status}</Badge>
                    <span className="text-gray-400 font-mono text-sm tracking-tight">{incident.id}</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">{incident.title}</h1>

                <div className="flex items-center gap-6 mt-4 text-gray-600 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin className="w-5 h-5 text-gray-400" /> {incident.locationLabel}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="w-5 h-5 text-gray-400" /> {incident.category} Department</span>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Related reports</p>
                    <p className="text-3xl font-bold text-gray-900 flex items-center gap-2">{incident.reportCount} <Users className="w-6 h-6 text-indigo-500" /></p>
                </div>
                <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">vs normal activity</p>
                    <p className={`text-3xl font-bold ${textColor} flex items-baseline gap-1`}><TrendingUp className="w-6 h-6 inline translate-y-[2px]" /> {incident.growthMultiple.toFixed(1)}×</p>
                </div>
                <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Detection confidence</p>
                    <p className="text-3xl font-bold text-gray-900 flex items-center gap-2">{Math.round((incident.aiConfidence || 0.9) * 100)}% <CheckCircle2 className="w-6 h-6 text-emerald-500" /></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* AI Assessment */}
                    <section className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-indigo-900 mb-4">
                            <span className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600"><AlertTriangle className="w-5 h-5" /></span>
                            AI Assessment
                        </h2>
                        <div className="space-y-4">
                            <div className="mb-4">
                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">OBSERVED EVIDENCE</h3>
                                <p className="text-indigo-950/80 leading-relaxed text-md">
                                    {incident.reportCount} reports are concentrated around {incident.locationLabel}.
                                </p>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">AI INTERPRETATION</h3>
                                <p className="text-indigo-950/80 leading-relaxed text-md">
                                    {aiInterpretation}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-indigo-50">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Why was this flagged?</h3>
                                {activeEvidence.length > 0 ? (
                                    <ul className="space-y-3">
                                        {activeEvidence.map(ev => (
                                            <li key={ev.id} className="flex items-start gap-2 text-gray-700">
                                                <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                                <span>{ev.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2 text-gray-700">
                                            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                            <span><b>Similar descriptions</b> across multiple independent reports</span>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Action Step */}
                    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Recommended next step</h2>
                        <p className="text-gray-600 mb-6">Review the {incident.category.toLowerCase()} supply status for {incident.locationLabel} and assign the incident to the {incident.category} Department.</p>

                        <div className="flex gap-4">
                            {incident.status === "EMERGING" && (
                                <>
                                    <Button size="lg" className="px-8 shadow-md" onClick={() => handleUpdateStatus("INVESTIGATING")}>Mark Investigating</Button>
                                    <Button size="lg" variant="outline" className="bg-white" onClick={() => handleUpdateStatus("RESOLVED")}>Mark Resolved</Button>
                                </>
                            )}
                            {incident.status === "INVESTIGATING" && (
                                <Button size="lg" className="px-8 shadow-md" onClick={() => handleUpdateStatus("RESOLVED")}>Mark Resolved</Button>
                            )}
                            {incident.status === "RESOLVED" && (
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Incident represents closed status workflow</Badge>
                            )}
                        </div>
                    </section>

                    {/* Evidence */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" /> Supporting reports
                        </h2>
                        <div className="space-y-3">
                            {complaints.length === 0 ? (
                                <p className="text-gray-500 italic p-4 bg-gray-50 rounded-xl border border-gray-100">No related reports found yet.</p>
                            ) : (
                                complaints.slice(0, 10).map((c) => (
                                    <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-start gap-4 hover:border-indigo-200 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{c.trackingId}</span>
                                            </div>
                                            <p className="font-medium text-gray-900 line-clamp-2">&quot;{c.originalText}&quot;</p>
                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {c.locationLabel}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Recent</span>
                                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">Original in {c.detectedLanguage}</span>
                                            </div>
                                        </div>
                                        <Link href={`/admin/complaints`}>
                                            <Button variant="secondary" size="sm">View detail</Button>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Affected Area</h2>
                        <MapView points={mapPoints} className="h-48 rounded-xl" />
                    </section>

                    <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Incident Growth</h2>
                        <div className="bg-gray-50 w-full h-40 rounded-xl border border-gray-100 flex items-end px-2 pt-8 pb-2 gap-1.5">
                            {(() => {
                                if (complaints.length === 0) return null;
                                const bucketCount = 6;
                                const now = Date.now();
                                const min = Math.min(...complaints.map(c => new Date(c.createdAt).getTime()));
                                const span = Math.max(now - min, 3600000); // Minimum scale 1 hour
                                const size = span / bucketCount;
                                const buckets = Array(bucketCount).fill(0);

                                complaints.forEach(c => {
                                    const time = new Date(c.createdAt).getTime();
                                    const idx = Math.min(bucketCount - 1, Math.floor((time - min) / size));
                                    if (idx >= 0) buckets[idx]++;
                                });

                                // Compute cumulative growth for visualizing surge natively
                                let runningTotal = 0;
                                const growthBuckets = buckets.map(b => { runningTotal += b; return runningTotal; });
                                const maxVal = Math.max(...growthBuckets, 1);

                                return growthBuckets.map((val, i) => (
                                    <div key={i} className="w-full bg-indigo-500 rounded-sm hover:bg-indigo-600 transition-colors cursor-pointer group relative" style={{ height: `${Math.max(10, (val / maxVal) * 100)}%` }}>
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 shadow-sm rounded-sm">{val}</span>
                                    </div>
                                ));
                            })()}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium bg-gray-50/50 p-2 rounded">
                            <span>Older baseline</span>
                            <span>Recent surge</span>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
