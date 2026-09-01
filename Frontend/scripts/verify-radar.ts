import { Complaint } from "../src/types";
import { determineRelationship } from "../src/lib/radar/correlation";
import { buildIncidents } from "../src/lib/radar/clustering";
import { DEMO_COMPLAINTS } from "../src/data/demo/complaints";
import { calculateGrowthMultiple } from "../src/lib/utils/math";

console.log("=== RADAR ENGINE DETERMINISTIC VERIFICATION ===\n");

function nowMinus(hours: number): string {
    return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

const baseLocation = { latitude: 19.11, longitude: 72.86 };
const c1: Complaint = {
    id: "Test-1", trackingId: "T1", originalText: "Water is completely stopped.", normalizedText: "Water is completely stopped.",
    detectedLanguage: "English", category: "Water", priority: "HIGH", issueTitle: "No water", confidence: 0.9,
    explanation: "",
    latitude: baseLocation.latitude, longitude: baseLocation.longitude, status: "SUBMITTED",
    createdAt: nowMinus(1), updatedAt: nowMinus(1)
};

// 1. Two identical complaints -> possible_duplicate
const c2: Complaint = { ...c1, id: "Test-2", trackingId: "T2", createdAt: nowMinus(1.1) };
let rel = determineRelationship(c1, c2);
console.log(`Test 1 (Identical): Expected possible_duplicate -> Got:`, rel?.relationshipType);

// 2. Same underlying issue with different wording -> related
const c3: Complaint = {
    ...c1, id: "Test-3", originalText: "Taps ran dry today", normalizedText: "Taps ran dry today", trackingId: "T3",
    createdAt: nowMinus(2)
};
rel = determineRelationship(c1, c3);
console.log(`Test 2 (Diff wording): Expected related -> Got:`, rel?.relationshipType);

// 3. Same category but far apart -> weaker/unrelated
const c4: Complaint = { ...c1, id: "Test-4", latitude: 19.5, nonce: "far" } as any;
rel = determineRelationship(c1, c4);
console.log(`Test 3 (Far apart): Expected null -> Got:`, rel?.relationshipType || "null");

// 4. Different categories -> unrelated
const c5: Complaint = { ...c2, category: "Roads", id: "Test-5", normalizedText: "Huge pothole" };
rel = determineRelationship(c1, c5);
console.log(`Test 4 (Diff category): Expected null -> Got:`, rel?.relationshipType || "null");

// 5. Same location but very different issues -> unrelated
const c6: Complaint = { ...c1, id: "Test-6", category: "Garbage", normalizedText: "Trash not collected." };
rel = determineRelationship(c1, c6);
console.log(`Test 5 (Diff issue same loc): Expected null -> Got:`, rel?.relationshipType || "null");

// Clustering Tests on Demo Dataset
console.log("\n=== CLUSTERING ON FLAGSHIP DATASET ===");
const incidents = buildIncidents(DEMO_COMPLAINTS);
const waterIncident = incidents.find(i => i.category === "Water");
const roadIncident = incidents.find(i => i.category === "Roads");

console.log(`Test 6 (Water cluster): Expected 1 Incident -> Found:`, !!waterIncident);
if (waterIncident) {
    console.log(`   -> Report Count (Expected 47):`, waterIncident.reportCount);
    console.log(`   -> Priority (Expected HIGH/CRITICAL):`, waterIncident.priority);
    console.log(`   -> Growth Multiple (Expected ~10.7x):`, waterIncident.growthMultiple);
}

console.log(`Test 7 (Pothole cluster): Expected 1 Incident -> Found:`, !!roadIncident);
if (roadIncident) {
    console.log(`   -> Report Count (Expected 31):`, roadIncident.reportCount);
}

// 8. Unrelated complaints -> no incident
const hasStreetlightIncident = incidents.some(i => i.category === "Electricity");
console.log(`Test 8 (Unrelated complaints): Expected Streetlights to not cluster -> Found Incident:`, hasStreetlightIncident);

// 9. Growth calculation
console.log(`Test 9 (Deterministic Growth): calculateGrowthMultiple(47, 4.39) =`, calculateGrowthMultiple(47, 4.39));

console.log("\n=== VERIFICATION COMPLETE ===");
