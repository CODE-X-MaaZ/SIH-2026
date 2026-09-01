import { Incident, IncidentEvidence } from "@/types";
import { DEMO_COMPLAINTS } from "./complaints";
import { buildIncidents, generateEvidenceForIncident } from "@/lib/radar/clustering";
import { determineRelationship } from "@/lib/radar/correlation";

// Compute incidents deterministically running the correlation engine on mock dataset
const generatedIncidents = buildIncidents(DEMO_COMPLAINTS);

export const DEMO_INCIDENTS: Incident[] = generatedIncidents;

// Compute evidence securely
export const DEMO_EVIDENCE: IncidentEvidence[] = [];

// For detailed proofs (mocking relationship pairings)
const COMPLAINT_PAIRS = [];
for (let i = 0; i < DEMO_COMPLAINTS.length; i++) {
    for (let j = i + 1; j < DEMO_COMPLAINTS.length; j++) {
        const rel = determineRelationship(DEMO_COMPLAINTS[i], DEMO_COMPLAINTS[j]);
        if (rel) {
            COMPLAINT_PAIRS.push(rel);
        }
    }
}

for (const inc of generatedIncidents) {
    const evidenceList = generateEvidenceForIncident(inc, DEMO_COMPLAINTS, COMPLAINT_PAIRS);
    DEMO_EVIDENCE.push(...evidenceList);
}
