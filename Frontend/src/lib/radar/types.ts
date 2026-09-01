import { Complaint, RelationshipType } from "@/types";

export interface CorrelationContext {
    semanticSimilarity: number;
    distanceRawStr: number; // meters
    timeRawStr: number; // hours
    distanceNormalized: number;
    timeNormalized: number;
    correlationScore: number;
}

export interface PairwiseRelationship {
    sourceComplaintId: string;
    targetComplaintId: string;
    semanticSimilarity: number;
    distance: number; // raw distance in meters
    timeDifference: number; // raw time difference in hours
    correlationScore: number;
    relationshipType: RelationshipType;
}

export interface ClusteringConfig {
    geoThresholdVeryStrong: number; // meters
    geoThresholdStrong: number;
    geoThresholdModerate: number;
    geoThresholdWeak: number;

    timeThresholdVeryStrong: number; // hours
    timeThresholdStrong: number;
    timeThresholdModerate: number;
    timeThresholdWeak: number;

    semanticWeight: number;
    geoWeight: number;
    timeWeight: number;

    possibleDuplicateThreshold: number;
    relatedThreshold: number;
}

export const DEFAULT_CLUSTERING_CONFIG: ClusteringConfig = {
    geoThresholdVeryStrong: 100,
    geoThresholdStrong: 250,
    geoThresholdModerate: 500,
    geoThresholdWeak: 1000,

    timeThresholdVeryStrong: 1,
    timeThresholdStrong: 4,
    timeThresholdModerate: 12,
    timeThresholdWeak: 24,

    semanticWeight: 0.4,
    geoWeight: 0.4,
    timeWeight: 0.2,

    possibleDuplicateThreshold: 0.85,
    relatedThreshold: 0.50
};
