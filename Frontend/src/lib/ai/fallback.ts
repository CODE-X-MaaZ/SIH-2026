import { ComplaintUnderstanding } from "./types";

export function getFallbackUnderstanding(text: string): ComplaintUnderstanding {
    const lowerText = text.toLowerCase();

    let category: ComplaintUnderstanding["category"] = "Other";
    let priority: ComplaintUnderstanding["priority"] = "Low";
    let issueTitle = "Unspecified Issue";

    if (lowerText.includes("water") || lowerText.includes("paani") || lowerText.includes("tap") || lowerText.includes("pani")) {
        category = "Water";
        priority = "High";
        issueTitle = "Water Supply Issue";
    } else if (lowerText.includes("road") || lowerText.includes("pothole") || lowerText.includes("broken")) {
        category = "Roads";
        priority = "Medium";
        issueTitle = "Road Damage / Pothole";
    } else if (lowerText.includes("garbage") || lowerText.includes("trash") || lowerText.includes("waste") || lowerText.includes("kachra")) {
        category = "Garbage";
        priority = "Medium";
        issueTitle = "Garbage Accumulation";
    } else if (lowerText.includes("light") || lowerText.includes("street light") || lowerText.includes("bulb")) {
        category = "Streetlights";
        priority = "Low";
        issueTitle = "Broken Streetlight";
    } else if (lowerText.includes("electricity") || lowerText.includes("power") || lowerText.includes("bijli")) {
        category = "Electricity";
        priority = "High";
        issueTitle = "Power Outage";
    }

    return {
        originalText: text,
        normalizedText: lowerText,
        detectedLanguage: getLanguageHint(text),
        category,
        issueTitle,
        priority,
        confidence: 0.3, // appropriate low value for deterministic fallback
        explanation: "AI understanding is temporarily unavailable. We classified this based on keywords."
    };
}

function getLanguageHint(text: string): string {
    // Simple heuristic for demo
    if (/[अ-ह]/.test(text)) {
        return "Hindi";
    }
    return "Unknown";
}
