import Link from "next/link";
import { ArrowLeft, MapPin, Building2, Users, AlertTriangle, TrendingUp, Clock, CheckCircle2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function IncidentDetail({ params }: { params: { incidentId: string } }) {
    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Back & Breadcrumbs */}
            <div>
                <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <Badge variant="destructive" className="font-semibold px-3 py-1 text-sm bg-red-100 text-red-700 border-red-200 hover:bg-red-200 rounded-md">HIGH PRIORITY</Badge>
                    <Badge variant="outline" className="font-semibold px-3 py-1 text-sm bg-orange-50 text-orange-700 border-orange-200">Emerging Incident</Badge>
                    <span className="text-gray-400 font-mono text-sm tracking-tight">{params.incidentId || "INC-8924"}</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">Water Supply Outage</h1>

                <div className="flex items-center gap-6 mt-4 text-gray-600 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin className="w-5 h-5 text-gray-400" /> Andheri East, Mumbai</span>
                    <span className="flex items-center gap-1.5"><Building2 className="w-5 h-5 text-gray-400" /> Water Department</span>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Related reports</p>
                    <p className="text-3xl font-bold text-gray-900 flex items-center gap-2">47 <Users className="w-6 h-6 text-indigo-500" /></p>
                </div>
                <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">vs normal activity</p>
                    <p className="text-3xl font-bold text-red-600 flex items-baseline gap-1"><TrendingUp className="w-6 h-6 inline translate-y-[2px]" /> 10.7×</p>
                </div>
                <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Detected window</p>
                    <p className="text-3xl font-bold text-gray-900 flex items-center gap-2">4h <Clock className="w-6 h-6 text-blue-500" /></p>
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
                            <p className="text-indigo-950/80 leading-relaxed text-lg">
                                There is a sudden cluster of localized complaints indicating a total disruption of the water supply spanning multiple housing societies in Andheri East.
                            </p>
                            <div className="bg-white rounded-xl p-4 border border-indigo-50">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Why was this flagged?</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-gray-700">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                        <span><b>Similar descriptions</b> across multiple independent reports</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-gray-700">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                        <span><b>Same geographic area</b> localized within a 500m radius</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-gray-700">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                        <span><b>Sudden increase</b> in report volume (10.7x baseline)</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-gray-700">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                        <span><b>Multiple independent citizens</b> confirmed active issue</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Action Step */}
                    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Recommended Next Step</h2>
                        <p className="text-gray-600 mb-6">Dispatch exploratory team to main pipeline junction and notify residents of estimated repair timeline.</p>
                        <div className="flex gap-4">
                            <Button size="lg" className="px-8 shadow-md">Acknowledge & Assign</Button>
                            <Button size="lg" variant="outline" className="bg-white">Update Citizens</Button>
                        </div>
                    </section>

                    {/* Evidence */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" /> Supporting Reports
                        </h2>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">"No water since morning, tanks are empty now."</p>
                                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Shastri Nagar</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 2 hours ago</span>
                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">Original in Hindi</span>
                                        </div>
                                    </div>
                                    <Button variant="secondary" size="sm">View detail</Button>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Right Column */}
                <div className="space-y-6">

                    <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Affected Area</h2>
                        <div className="bg-gray-100 w-full h-48 rounded-xl border border-gray-200 overflow-hidden relative">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium text-sm">
                                Map Placeholder
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Incident Growth</h2>
                        <div className="bg-gray-50 w-full h-40 rounded-xl border border-gray-100 flex items-end px-2 pt-8 pb-2 gap-1.5">
                            {/* Mock bars */}
                            <div className="w-full bg-indigo-100 rounded-sm h-[10%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">1</span></div>
                            <div className="w-full bg-indigo-200 rounded-sm h-[15%]"></div>
                            <div className="w-full bg-indigo-300 rounded-sm h-[40%]"></div>
                            <div className="w-full bg-indigo-400 rounded-sm h-[80%]"></div>
                            <div className="w-full bg-indigo-500 rounded-sm h-[100%]"></div>
                            <div className="w-full bg-indigo-500 rounded-sm h-[90%]"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                            <span>-4h</span>
                            <span>Now</span>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
