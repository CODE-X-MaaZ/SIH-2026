export interface ComplaintUnderstanding {
  originalText: string;
  normalizedText: string;
  detectedLanguage: string;
  category: "Roads" | "Garbage" | "Water" | "Streetlights" | "Electricity" | "Drainage" | "Public Safety" | "Other";
  issueTitle: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  locationHint?: string;
  confidence: number;
  explanation: string;
}
