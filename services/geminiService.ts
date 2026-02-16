import { GoogleGenAI } from "@google/genai";
import { Company } from "../types";

// Safe access for Vite environment or fallback
const API_KEY = (import.meta as any).env?.VITE_GOOGLE_API_KEY || '';

export const calculateMatchScore = async (
  opportunitySummary: string, 
  providerProfile: string
): Promise<number> => {
  if (!API_KEY) return 50; // Fallback

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
      Act as a procurement expert. 
      Requirement: "${opportunitySummary}"
      Provider Capabilities: "${providerProfile}"
      
      Output strictly a JSON object: { "score": number } where score is 0-100 based on fit.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const json = JSON.parse(response.text || "{}");
    return json.score || 0;
  } catch (e) {
    console.error("AI Match Error", e);
    return 0;
  }
};

export const analyzeRequirement = async (text: string): Promise<{capabilities: string[], summary: string}> => {
    if(!API_KEY) {
        return {
            capabilities: ["Manufactura General"],
            summary: text.substring(0, 100)
        };
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const prompt = `Analyze this automotive requirement: "${text}". 
        Extract a JSON object with: 
        1. "capabilities": array of strings (standard manufacturing capabilities).
        2. "summary": a professional short summary (max 20 words).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-latest',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return { capabilities: [], summary: text };
    }
};

export const calculateLocalMatchScore = (query: string, company: Company): number => {
    const text = (company.tradeName + " " + (company.publicCoreSummary || "") + " " + company.publicCapabilities.join(" ")).toLowerCase();
    const terms = query.toLowerCase().split(" ");
    let hits = 0;
    terms.forEach(term => {
        if(text.includes(term)) hits++;
    });
    return Math.min(100, Math.round((hits / terms.length) * 100));
};

export const getGeminiMatches = async (query: string, companies: Company[], apiKey: string) => {
    const ai = new GoogleGenAI({ apiKey });
    // Optimize payload to avoid token limits
    const companyData = companies.map(c => ({ id: c.id, name: c.tradeName, summary: c.publicCoreSummary, capabilities: c.publicCapabilities }));
    
    const prompt = `
    I have a user query for a supplier: "${query}".
    I have a list of companies: ${JSON.stringify(companyData)}.
    
    Return a JSON object with a property "matches" which is an array of objects.
    Each object in the array must have:
    - "companyId": string
    - "score": number (0-100 relevance)
    - "reason": string (short explanation)
    
    Only include companies with score > 0. Sort by score descending.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-latest',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        const json = JSON.parse(response.text || "{}");
        return json.matches || [];
    } catch (e) {
        console.error("Gemini Search Error", e);
        return [];
    }
};