import Link from "next/link";
import { AlertTriangle, Clock, MapPin, ChevronRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function IncidentsPage() {
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
                    <span className="text-sm text-gray-500 font-medium">Showing 2 of 7 incidents</span>
                </div>

                <div className="divide-y divide-gray-100">

                    {/* Row 1 */}
                    <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <Link href="/admin/incidents/INC-8924" className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">Water Supply Outage</Link>
                                <Badge variant="destructive">HIGH</Badge>
                                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">Emerging</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> Andheri East</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" /> detected 4h ago</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 sm:border-l sm:border-gray-200 sm:pl-6">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">47</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Reports</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> 10.7×</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Growth</p>
                            </div>
                            <div className="hidden sm:block">
                                <Link href="/admin/incidents/INC-8924">
                                    <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-primary">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="sm:hidden mt-2">
                            <Link href="/admin/incidents/INC-8924" className="w-full block">
                                <Button variant="outline" className="w-full">Review Incident</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <Link href="/admin/incidents/INC-8925" className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">Road Damage / Pothole</Link>
                                <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-transparent">MEDIUM</Badge>
                                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Growing</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> Bandra West</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" /> detected 1d ago</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 sm:border-l sm:border-gray-200 sm:pl-6">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">31</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Reports</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-600 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> 6.2×</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Growth</p>
                            </div>
                            <div className="hidden sm:block">
                                <Link href="/admin/incidents/INC-8925">
                                    <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-primary">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="sm:hidden mt-2">
                            <Link href="/admin/incidents/INC-8925" className="w-full block">
                                <Button variant="outline" className="w-full">Review Incident</Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
