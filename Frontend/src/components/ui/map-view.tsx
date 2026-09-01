"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { MapViewProps } from './map-view-types';

// Show a fallback skeleton or basic map placeholder while loading
const MapFallback = ({ className = "h-64" }: { className?: string }) => (
    <div className={`bg-gray-100 flex items-center justify-center border border-gray-200 relative overflow-hidden ${className}`} style={{ borderRadius: 'inherit' }}>
        <div className="flex flex-col items-center text-gray-400 p-4 animate-pulse">
            <MapPin className="w-8 h-8 mb-2" />
            <p className="font-medium text-sm">Loading map...</p>
        </div>
    </div>
);

// Dynamically import the real Leaflet map, avoiding SSR issues
const MapViewClient = dynamic(() => import('./map-view-client'), {
    ssr: false,
    loading: () => <MapFallback className="h-full w-full" />
});

export function MapView(props: MapViewProps) {
    return (
        <React.Suspense fallback={<MapFallback className={props.className} />}>
            <MapViewClient {...props} />
        </React.Suspense>
    );
}

// Re-export type for consumers
export type { Point, MapViewProps } from './map-view-types';
