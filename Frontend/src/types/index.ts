export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ComplaintStatus = 'SUBMITTED' | 'CLASSIFIED' | 'UNDER_REVIEW' | 'INVESTIGATING' | 'RESOLVED';
export type IncidentStatus = 'EMERGING' | 'INVESTIGATING' | 'RESOLVED' | 'POSSIBLY_UNRESOLVED' | 'REOPENED';
export type EvidenceType = 'SEMANTIC_SIMILARITY' | 'GEOGRAPHIC_PROXIMITY' | 'TEMPORAL_CONCENTRATION' | 'REPORT_SURGE' | 'MULTIPLE_INDEPENDENT_REPORTERS';
export type RelationshipType = 'related' | 'possible_duplicate';

export interface Location {
    latitude: number;
    longitude: number;
    label?: string;
}

export interface Department {
    id: string;
    name: string;
    category: string[];
}

export interface Authority {
    id: string;
    name: string;
    role: string;
    departmentId: string;
}

export interface AIAssessment {
    category: string;
    priority: Priority;
    confidence: number;
    explanation: string;
    model?: string;
    createdAt: string;
}

export interface ComplaintEvent {
    id: string;
    complaintId: string;
    type: string;
    status?: ComplaintStatus;
    note: string;
    actorId?: string;
    createdAt: string;
}

export interface Complaint {
    id: string;
    trackingId: string;
    originalText: string;
    normalizedText: string;
    detectedLanguage: string;
    category: string;
    issueTitle: string;
    priority: Priority;
    confidence: number;
    explanation: string;

    latitude?: number;
    longitude?: number;
    locationLabel?: string;

    status: ComplaintStatus;
    incidentId?: string;

    // Decoupled AI assessment if needed separated
    aiAssessment?: AIAssessment;

    createdAt: string;
    updatedAt: string;
}

export interface RelatedComplaint {
    sourceComplaintId: string;
    targetComplaintId: string;
    similarityScore: number;
    distance: number;
    timeDifference: number;
    relationshipType: RelationshipType;
}

export interface IncidentEvidence {
    id: string;
    incidentId: string;
    type: EvidenceType;
    description: string;
    strength: number; // 0 to 1
    relatedComplaintIds: string[];
}

export interface Incident {
    id: string;
    title: string;
    category: string;
    priority: Priority;
    status: IncidentStatus;

    locationLabel?: string;
    latitude?: number;
    longitude?: number;

    complaintIds: string[];
    reportCount: number;
    baselineCount: number;
    growthMultiple: number;

    detectedAt: string;
    windowStart: string;
    windowEnd: string;

    departmentId?: string;
    aiConfidence?: number;
}
