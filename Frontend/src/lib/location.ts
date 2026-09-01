export interface LocationResult {
    latitude: number;
    longitude: number;
    displayName: string;
}

export async function getCurrentLocation(): Promise<LocationResult> {
    // Try to use browser geolocation if available
    if (typeof window !== "undefined" && "geolocation" in navigator) {
        try {
            return await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            displayName: "Detected from device"
                        });
                    },
                    (error) => {
                        reject(error);
                    },
                    { timeout: 5000 }
                );
            });
        } catch (err) {
            console.warn("Geolocation failed or denied, using fallback", err);
        }
    }

    // Fallback demo location
    return {
        latitude: 19.1136,
        longitude: 72.8697,
        displayName: "Andheri East, Mumbai"
    };
}
