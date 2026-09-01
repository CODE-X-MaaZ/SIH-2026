import React from 'react';
import { MapPin, Target } from 'lucide-react';

interface Point {
    latitude: number;
    longitude: number;
    color: string;
    label?: string;
    isCenter?: boolean;
}

interface MapViewProps {
    points: Point[];
    centerPoint?: { latitude: number; longitude: number };
    className?: string;
}

export function MapView({ points, centerPoint, className = "h-64" }: MapViewProps) {
    return (
        <div className={`bg-gray-200 w-full rounded-xl flex items-center justify-center border border-gray-300 relative overflow-hidden bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/72.8777,19.0760,11/800x600?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example')] bg-cover bg-center ${className}`}>
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

            <div className="z-10 flex flex-col items-center text-gray-700 bg-white/90 p-3 rounded-lg shadow-sm border border-gray-200">
                <MapPin className="w-5 h-5 mb-1" />
                <p className="font-medium text-xs">Deterministic Cluster Map</p>
            </div>

            {/* Render mock points loosely relative to center */}
            {points.map((p, i) => {
                // Determine mock visual position logically
                // Since this is a demo, we map the coordinates roughly if available
                const top = 30 + (i * 7) % 40;
                const left = 30 + (i * 12) % 40;

                return (
                    <div
                        key={i}
                        className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-md ${p.isCenter ? 'w-6 h-6 animate-pulse' : ''} ${p.color}`}
                        style={{ top: `${top}%`, left: `${left}%` }}
                        title={p.label || "Report"}
                    >
                        {p.isCenter && <Target className="w-full h-full text-white/50" />}
                    </div>
                );
            })}
        </div>
    );
}
