"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Point } from './map-view-types'; // We'll create this
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Fix typical Leaflet icon issue in NextJS
let iconsInitialized = false;
const initLeafletIcons = () => {
    if (iconsInitialized) return;
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
    iconsInitialized = true;
};

interface MapViewClientProps {
    points: Point[];
    centerPoint?: { latitude: number; longitude: number };
    className?: string;
    onSelect?: (id: string) => void;
}

// Component to handle auto-fitting bounds based on points
function MapBounds({ points, centerPoint }: { points: Point[], centerPoint?: { latitude: number; longitude: number } }) {
    const map = useMap();

    useEffect(() => {
        if (!points || points.length === 0) return;

        const lats = points.map(p => p.latitude);
        const lons = points.map(p => p.longitude);

        if (centerPoint) {
            lats.push(centerPoint.latitude);
            lons.push(centerPoint.longitude);
        }

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        // Calculate bounds with some padding
        const bounds = L.latLngBounds(
            L.latLng(minLat, minLon),
            L.latLng(maxLat, maxLon)
        );

        if (minLat === maxLat && minLon === maxLon) {
            map.setView([minLat, minLon], 14);
        } else {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
    }, [points, centerPoint, map]);

    return null;
}


// Create custom div icons based on the Tailwind classes passed in point.color
const createCustomIcon = (point: Point) => {
    // Extract background color from tailwind class roughly
    let hex = '#6366f1'; // default indigo-500
    if (point.color?.includes('red')) hex = '#ef4444';
    else if (point.color?.includes('amber')) hex = '#f59e0b';
    else if (point.color?.includes('emerald')) hex = '#10b981';

    // For centers/incidents make them a bit larger
    const size = point.isCenter || point.type === 'incident' || point.type === 'hotspot' ? 24 : 14;
    const pulseStyle = point.isCenter ? 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;' : '';

    const html = `
        <div style="
            background-color: ${hex};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ${pulseStyle}
        "></div>
    `;

    return L.divIcon({
        html,
        className: 'custom-leaflet-icon',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
    });
};


export default function MapViewClient({ points, centerPoint, className = "h-64", onSelect }: MapViewClientProps) {
    useEffect(() => {
        initLeafletIcons();
    }, []);

    // Default to Mumbai if no points
    const defaultCenter: [number, number] = [19.0760, 72.8777];

    return (
        <div className={`relative w-full z-0 overflow-hidden ${className}`} style={{ borderRadius: 'inherit' }}>
            <MapContainer
                center={defaultCenter}
                zoom={11}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', minHeight: '200px' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {points.length > 0 && <MapBounds points={points} centerPoint={centerPoint} />}

                {centerPoint && (
                    <Circle
                        center={[centerPoint.latitude, centerPoint.longitude]}
                        radius={500}
                        pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.1, weight: 1 }}
                    />
                )}

                {points.filter(p => !isNaN(p.latitude) && !isNaN(p.longitude)).map((p, i) => (
                    <Marker
                        key={p.id || `pt-${i}`}
                        position={[p.latitude, p.longitude]}
                        icon={createCustomIcon(p)}
                        eventHandlers={{
                            click: () => p.id && onSelect?.(p.id)
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                            <span className="font-medium text-sm">{p.label || (p.type === 'incident' ? 'Incident' : 'Report')}</span>
                        </Tooltip>

                        {(p.popupContent || (p.type === 'incident' && p.id)) && (
                            <Popup>
                                <div className="text-sm min-w-[200px]">
                                    {p.popupContent ? (
                                        p.popupContent
                                    ) : (
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-gray-900">{p.label}</h3>
                                            <Link href={`/admin/incidents/${p.id}`} className="text-indigo-600 hover:underline flex items-center text-xs">
                                                View incident details <ArrowRight className="w-3 h-3 ml-1" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        )}
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
