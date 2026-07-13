// MatchDay Aura - Gemini Pro Live Integration Layer
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function handleStadiumQuery(userInput, userMetadata) {
    const systemInstruction = `
    You are MatchDay Aura, the official AI Smart Stadium Assistant for the FIFA World Cup 2026.
    Rule 1: Prioritize step-free, ramp-accessible navigation whenever accessibility flags are detected.
    Rule 2: Detect language automatically and reply in that system preference instantly.
    Rule 3: Mitigate congestion dynamically by routing traffic to lesser-utilized zones.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-pro',
            contents: userInput,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2, // Kept low for accurate operational answers
                maxOutputTokens: 300
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Operational fallback activated:", error);
        return "I am currently optimizing routes. Please proceed to the nearest information desk or speak to a volunteer.";
    }
}

module.exports = { handleStadiumQuery };

