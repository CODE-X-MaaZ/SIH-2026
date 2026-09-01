import { Complaint } from "@/types";
import { calculateDistance, calculateTimeDifference } from "@/lib/utils/math";
import { ClusteringConfig, DEFAULT_CLUSTERING_CONFIG } from "./types";

/**
 * Calculates a lexical similarity proxy to substitute for vector embeddings.
 * Normalizes text, matches keywords, and returns a 0 to 1 score.
 */
export function calculateSemanticSimilarityApproximation(c1: Complaint, c2: Complaint): number {
    if (c1.category !== c2.category) {
        return 0; // Distinct categories represent fundamentally different incident domains in MVP
    }

    const t1 = (c1.normalizedText || "").toLowerCase();
    const t2 = (c2.normalizedText || "").toLowerCase();

    // Very simple exact match implies duplicate
    if (t1 === t2 && t1.length > 0) return 1.0;

    const getKeywords = (text: string) => {
        return text.split(/[\s,.-]+/).filter(w => w.length > 3);
    };

    const words1 = new Set(getKeywords(t1));
    const words2 = new Set(getKeywords(t2));

    if (words1.size === 0 && words2.size === 0) return 0;

    // Check intersection
    let matchCount = 0;
    words1.forEach(w1 => {
        if (words2.has(w1)) matchCount++;
    });

    const unionSize = new Set([...Array.from(words1), ...Array.from(words2)]).size;
    const jaccard = unionSize === 0 ? 0 : matchCount / unionSize;

    // Boost if categories match + they have overlapping keywords
    return Math.min(1.0, jaccard + 0.3); // artificial bump because category matched
}

export function getGeographicSimilarity(
    c1: Complaint,
    c2: Complaint,
    config: ClusteringConfig = DEFAULT_CLUSTERING_CONFIG
): { rawDistance: number; normalizedScore: number } {
    if (c1.latitude === undefined || c1.longitude === undefined ||
        c2.latitude === undefined || c2.longitude === undefined) {
        return { rawDistance: 99999, normalizedScore: 0 };
    }

    const dist = calculateDistance(c1.latitude, c1.longitude, c2.latitude, c2.longitude);

    let score = 0;
    if (dist <= config.geoThresholdVeryStrong) score = 1.0;
    else if (dist <= config.geoThresholdStrong) score = 0.8;
    else if (dist <= config.geoThresholdModerate) score = 0.5;
    else if (dist <= config.geoThresholdWeak) score = 0.2;

    return { rawDistance: dist, normalizedScore: score };
}

export function getTemporalSimilarity(
    c1: Complaint,
    c2: Complaint,
    config: ClusteringConfig = DEFAULT_CLUSTERING_CONFIG
): { rawDifference: number; normalizedScore: number } {
    const hours = calculateTimeDifference(c1.createdAt, c2.createdAt);

    let score = 0;
    if (hours <= config.timeThresholdVeryStrong) score = 1.0;
    else if (hours <= config.timeThresholdStrong) score = 0.8;
    else if (hours <= config.timeThresholdModerate) score = 0.5;
    else if (hours <= config.timeThresholdWeak) score = 0.2;

    return { rawDifference: hours, normalizedScore: score };
}
