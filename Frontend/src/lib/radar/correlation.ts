import { Complaint, RelationshipType } from "@/types";
import { PairwiseRelationship, DEFAULT_CLUSTERING_CONFIG, ClusteringConfig } from "./types";
import {
    calculateSemanticSimilarityApproximation,
    getGeographicSimilarity,
    getTemporalSimilarity
} from "./similarity";

export function determineRelationship(
    c1: Complaint,
    c2: Complaint,
    config: ClusteringConfig = DEFAULT_CLUSTERING_CONFIG
): PairwiseRelationship | null {
    if (c1.id === c2.id) return null; // do not compare with self

    const semanticScore = calculateSemanticSimilarityApproximation(c1, c2);
    if (semanticScore === 0) return null; // Not related at all (e.g. different categories)

    const geo = getGeographicSimilarity(c1, c2, config);
    const temp = getTemporalSimilarity(c1, c2, config);

    // Calculate deterministic combined score
    const correlationScore =
        (semanticScore * config.semanticWeight) +
        (geo.normalizedScore * config.geoWeight) +
        (temp.normalizedScore * config.timeWeight);

    let type: RelationshipType | null = null;

    // Strict threshold logic
    if (correlationScore >= config.possibleDuplicateThreshold &&
        semanticScore > 0.8 && geo.normalizedScore >= 0.8 && temp.normalizedScore >= 0.8) {
        type = "possible_duplicate";
    } else if (correlationScore >= config.relatedThreshold && geo.normalizedScore > 0) {
        type = "related";
    }

    if (!type) return null; // No meaningful relationship

    return {
        sourceComplaintId: c1.id,
        targetComplaintId: c2.id,
        semanticSimilarity: semanticScore,
        distance: geo.rawDistance,
        timeDifference: temp.rawDifference,
        correlationScore,
        relationshipType: type
    };
}
