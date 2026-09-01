import { Complaint } from "@/types";

function nowMinus(hours: number): string {
    return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

const complaints: Complaint[] = [];

// 1. Water Outage Cluster (47 complaints)
const waterTemplates = [
    { text: "No water supply in our area since yesterday.", lang: "English", norm: "No water supply since yesterday." },
    { text: "Paani nahi aa raha since morning.", lang: "Hinglish", norm: "No water coming since morning." },
    { text: "Water stopped near the school.", lang: "English", norm: "Water stopped near school." },
    { text: "There has been no water since last night.", lang: "English", norm: "No water since last night." },
    { text: "Kal se tap sookha hai", lang: "Hindi", norm: "Tap is dry since yesterday." }
];

for (let i = 1; i <= 47; i++) {
    const template = waterTemplates[i % waterTemplates.length];

    // Deterministic small jitter for cluster
    const latJitter = (i % 5) * 0.0001;
    const lonJitter = (i % 3) * 0.0001;

    complaints.push({
        id: `CMP-W-${i.toString().padStart(3, '0')}`,
        trackingId: `NR-W${i.toString().padStart(4, '0')}`,
        originalText: template.text,
        normalizedText: template.norm,
        detectedLanguage: template.lang,
        category: "Water",
        issueTitle: "Water Supply Outage",
        priority: i % 10 === 0 ? "CRITICAL" : "HIGH", // Mix of high and some critical to boost incident to Critical or High
        confidence: 0.90 + ((i % 10) * 0.01),
        explanation: "Indicates complete stoppage of water supply.",
        latitude: 19.1136 + latJitter,
        longitude: 72.8697 + lonJitter,
        locationLabel: "Andheri East",
        status: "INVESTIGATING",
        createdAt: nowMinus((47 - i) * 0.1), // Deterministic staggered times over last ~4.7 hours
        updatedAt: nowMinus((47 - i) * 0.1)
    });
}

// 2. Road Damage Cluster (31 complaints)
const roadTemplates = [
    { text: "Huge pothole causing traffic jam near the signal", lang: "English", norm: "Large pothole causing traffic congestion at signal." },
    { text: "Raasta bohot kharab hai, gaadi fas gayi", lang: "Hindi", norm: "Road is in terrible condition, vehicle got stuck." },
    { text: "Deep crater on the main road", lang: "English", norm: "Deep crater on main road." }
];

for (let i = 1; i <= 31; i++) {
    const template = roadTemplates[i % roadTemplates.length];

    const latJitter = (i % 4) * 0.0001;
    complaints.push({
        id: `CMP-R-${i.toString().padStart(3, '0')}`,
        trackingId: `NR-R${i.toString().padStart(4, '0')}`,
        originalText: template.text,
        normalizedText: template.norm,
        detectedLanguage: template.lang,
        category: "Roads",
        issueTitle: "Severe Road Damage",
        priority: "MEDIUM",
        confidence: 0.88,
        explanation: "Complaint about bad roads stalling vehicles.",
        latitude: 19.0594 + latJitter,
        longitude: 72.8290,
        locationLabel: "Bandra SV Road",
        status: "CLASSIFIED",
        createdAt: nowMinus((31 - i) * 0.2), // over last ~6 hours
        updatedAt: nowMinus((31 - i) * 0.2)
    });
}

// 3. Garbage Collection Cluster (15 complaints)
const garbageTemplates = [
    { text: "Garbage truck hasn't come for 4 days here", lang: "English", norm: "Garbage truck hasn't come for 4 days." },
    { text: "Kachra jama hua hai society ke bahar", lang: "Hindi", norm: "Garbage accumulated outside society." }
];

for (let i = 1; i <= 15; i++) {
    const template = garbageTemplates[i % garbageTemplates.length];
    complaints.push({
        id: `CMP-G-${i.toString().padStart(3, '0')}`,
        trackingId: `NR-G${i.toString().padStart(4, '0')}`,
        originalText: template.text,
        normalizedText: template.norm,
        detectedLanguage: template.lang,
        category: "Garbage",
        issueTitle: "Uncollected Garbage",
        priority: "MEDIUM",
        confidence: 0.96,
        explanation: "Specifies no garbage collection.",
        latitude: 19.2183,
        longitude: 72.9781 + ((i % 5) * 0.0001),
        locationLabel: "Thane West",
        status: "SUBMITTED",
        createdAt: nowMinus((15 - i) * 0.5), // over 7.5 hours
        updatedAt: nowMinus((15 - i) * 0.5)
    });
}

// 4. Unrelated Complaints (Not clustered significantly)
complaints.push({
    id: "CMP-S-001",
    trackingId: "NR-S0001",
    originalText: "The streetlight outside my house gives random shocks to dogs",
    normalizedText: "Streetlight is giving electric shocks to stray dogs.",
    detectedLanguage: "English",
    category: "Electricity",
    issueTitle: "Electrified Streetlight Pole",
    priority: "CRITICAL",
    confidence: 0.99,
    explanation: "Extremely hazardous situation involving live electricity in public.",
    latitude: 18.9220,
    longitude: 72.8347,
    locationLabel: "Colaba Causeway",
    status: "INVESTIGATING",
    createdAt: nowMinus(0.5),
    updatedAt: nowMinus(0.5)
});
complaints.push({
    id: "CMP-S-002",
    trackingId: "NR-S0002",
    originalText: "Tree branch fell near the park",
    normalizedText: "Tree branch fell near the park.",
    detectedLanguage: "English",
    category: "Other",
    issueTitle: "Fallen Tree Branch",
    priority: "LOW",
    confidence: 0.8,
    explanation: "Routine obstruction.",
    latitude: 19.05,
    longitude: 72.90,
    locationLabel: "Chembur",
    status: "SUBMITTED",
    createdAt: nowMinus(2),
    updatedAt: nowMinus(2)
});

export const DEMO_COMPLAINTS: Complaint[] = complaints;
