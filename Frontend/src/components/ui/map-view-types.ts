import { ReactNode } from "react";

export interface Point {
    id?: string;
    latitude: number;
    longitude: number;
    color: string;
    label?: string;
    isCenter?: boolean;
    type?: 'incident' | 'complaint' | 'hotspot';
    popupContent?: ReactNode;
}

export interface MapViewProps {
    points: Point[];
    centerPoint?: { latitude: number; longitude: number };
    className?: string;
    onSelect?: (id: string) => void;
}
