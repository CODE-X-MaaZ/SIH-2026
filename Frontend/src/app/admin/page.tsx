import Link from "next/link";
import { ArrowUpRight, AlertCircle, Clock, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminOverview() {
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
                    <p className="text-4xl font-bold text-gray-900">7</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Emerging incidents</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm border-l-4 border-l-red-500">
                    <p className="text-4xl font-bold text-red-600">12</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Critical</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-4xl font-bold text-gray-900">184</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Active reports</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm border-l-4 border-l-amber-500">
                    <p className="text-4xl font-bold text-amber-600">5</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Needs review</p>
                </div>
            </div>

            {/* Main Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Map Area placeholder */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
                    <div className="bg-gray-200 w-full h-[600px] rounded-2xl flex items-center justify-center border border-gray-300 relative overflow-hidden">
                        {/* Map placeholder mock */}
                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/72.8777,19.0760,11/800x600?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example')] bg-cover bg-center opacity-50 grayscale mix-blend-multiply"></div>
                        <div className="z-10 flex flex-col items-center text-gray-500">
                            <MapPin className="w-12 h-12 mb-2 opacity-50" />
                            <p className="font-medium text-lg">Mapbox integration pending (Phase 2)</p>
                        </div>
                        {/* Mock dots */}
                        <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-400 rounded-full border-2 border-white shadow-md"></div>
                        <div className="absolute top-[40%] left-[60%] w-5 h-5 bg-amber-500 rounded-full border-2 border-white shadow-md"></div>
                    </div>
                </div>

                {/* Right: queue */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Needs Attention Now</h2>
                        <Link href="/admin/incidents" className="text-sm font-medium text-primary hover:underline">View all</Link>
                    </div>

                    <div className="flex flex-col gap-4">

                        {/* Mock Card 1 */}
                        <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden flex flex-col hover:border-red-300 transition-colors">
                            <div className="p-5 border-b border-gray-100 flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2 text-red-600 font-semibold">
                                        <AlertCircle className="w-5 h-5" />
                                        Water Supply Outage
                                    </div>
                                    <Badge variant="destructive">HIGH</Badge>
                                </div>

                                <p className="text-gray-600 font-medium mb-4 flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    Andheri East
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">47</p>
                                        <p className="text-xs text-gray-500 font-medium">Related reports</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-red-600 flex items-center gap-1">
                                            <ArrowUpRight className="w-5 h-5" /> 10.7×
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">vs baseline</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 flex items-center justify-between">
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium border-transparent">Emerging</Badge>
                                <Link href="/admin/incidents/INC-8924">
                                    <Button variant="default" size="sm" className="w-full sm:w-auto">
                                        Review incident <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Mock Card 2 */}
                        <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden flex flex-col hover:border-amber-300 transition-colors">
                            <div className="p-5 border-b border-gray-100 flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2 text-amber-600 font-semibold">
                                        <AlertCircle className="w-5 h-5" />
                                        Road Damage / Pothole
                                    </div>
                                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-transparent">MEDIUM</Badge>
                                </div>

                                <p className="text-gray-600 font-medium mb-4 flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    Bandra West
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">31</p>
                                        <p className="text-xs text-gray-500 font-medium">Related reports</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-amber-600 flex items-center gap-1">
                                            <ArrowUpRight className="w-5 h-5" /> 6.2×
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">vs baseline</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 flex items-center justify-between">
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium border-transparent">Growing</Badge>
                                <Link href="/admin/incidents/INC-8925">
                                    <Button variant="secondary" size="sm" className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-100">
                                        Review incident <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
