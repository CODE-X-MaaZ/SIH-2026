// Calculate distance between two coordinates in meters (Haversine formula)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Calculate time difference in hours between two ISO strings
export function calculateTimeDifference(isoString1: string, isoString2: string): number {
    const date1 = new Date(isoString1);
    const date2 = new Date(isoString2);
    const msDiff = Math.abs(date2.getTime() - date1.getTime());
    return msDiff / (1000 * 60 * 60);
}

// Calculate growth multiple based on current events vs baseline events
export function calculateGrowthMultiple(currentCount: number, baselineCount: number): number {
    if (baselineCount === 0 && currentCount === 0) return 0;
    if (baselineCount === 0) return currentCount; // Infinite growth capped to current count artificially
    return Number((currentCount / baselineCount).toFixed(1));
}
