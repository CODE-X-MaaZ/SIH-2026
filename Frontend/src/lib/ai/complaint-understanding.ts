import { ComplaintUnderstanding } from "./types";
import { getFallbackUnderstanding } from "./fallback";

export async function understandComplaint(text: string): Promise<ComplaintUnderstanding> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.warn("No OPENAI_API_KEY found, using deterministic fallback.");
        return getFallbackUnderstanding(text);
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // or gpt-3.5-turbo
                messages: [
                    {
                        role: "system",
                        content: `You are an AI assistant for a civic reporting app called Nagrik Radar.
Your goal is to parse citizen complaints into a structured JSON format.

Categories allowed: "Roads", "Garbage", "Water", "Streetlights", "Electricity", "Drainage", "Public Safety", "Other".
Priorities allowed: "Critical", "High", "Medium", "Low".

Output ONLY valid JSON in the following schema:
{
  "originalText": "exact text from user",
  "normalizedText": "english translation or formal summary",
  "detectedLanguage": "English, Hindi, Hinglish, Marathi, etc",
  "category": "one of the allowed categories",
  "issueTitle": "short clear title of the issue",
  "priority": "one of the allowed priorities",
  "locationHint": "any location mentioned in the text (optional)",
  "confidence": number between 0 and 1,
  "explanation": "short plain-language explanation of why you classified it this way"
}`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error("OpenAI API request failed");
        }

        const data = await response.json();
        const resultText = data.choices[0].message.content;
        const result = JSON.parse(resultText) as ComplaintUnderstanding;

        // Ensure we keep the original text exactly as provided
        result.originalText = text;

        return result;

    } catch (error) {
        console.error("AI understanding failed, falling back:", error);
        return getFallbackUnderstanding(text);
    }
}
