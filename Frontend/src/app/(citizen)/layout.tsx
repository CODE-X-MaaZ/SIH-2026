import Link from "next/link";
import { Search } from "lucide-react";

export default function CitizenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="font-bold text-lg text-primary tracking-tight">
                        Nagrik Radar
                    </Link>
                    <Link
                        href="/track"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
                    >
                        <Search className="w-4 h-4" />
                        Track
                    </Link>
                </div>
            </header>
            <main className="flex-1 max-w-3xl mx-auto w-full p-4">
                {children}
            </main>
        </div>
    );
}
