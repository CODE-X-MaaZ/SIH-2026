import Link from "next/link";
import { AlertTriangle, Map, Navigation, BarChart3, ListTodo, MapPin, CheckCircle2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">
            {/* Sidebar - Desktop First */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="font-bold text-xl text-white tracking-tight">Nagrik Radar</h1>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Authority Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors bg-slate-800/50 text-white font-medium">
                        <Map className="w-4 h-4" /> Overview
                    </Link>
                    <Link href="/admin/incidents" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
                        <AlertTriangle className="w-4 h-4" /> Emerging
                    </Link>
                    <Link href="/admin/incidents" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
                        <Navigation className="w-4 h-4" /> Incidents
                    </Link>
                    <Link href="/admin/hotspots" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
                        <MapPin className="w-4 h-4" /> Hotspots
                    </Link>
                    <Link href="/admin/complaints" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
                        <ListTodo className="w-4 h-4" /> Complaints
                    </Link>
                    <Link href="/admin/resolution" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
                        <CheckCircle2 className="w-4 h-4" /> Resolution
                    </Link>
                    <Link href="/admin/analytics" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
                        <BarChart3 className="w-4 h-4" /> Analytics
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-sm">
                            AD
                        </div>
                        <div className="text-sm">
                            <p className="text-white font-medium">Admin User</p>
                            <p className="text-slate-500 text-xs">Command Center</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen max-w-[1600px] overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-20">
                    <div>
                        <h1 className="font-bold text-lg">Nagrik Radar</h1>
                        <p className="text-xs text-slate-400">Authority Portal</p>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
