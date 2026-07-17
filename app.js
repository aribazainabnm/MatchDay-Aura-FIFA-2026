// MatchDay Aura - Gemini Pro Live Integration Layer
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Minimalist in-memory cache to optimize API efficiency
const queryCache = new Map();

async function handleStadiumQuery(userInput, userMetadata) {
    // Efficiency check: Validate and trim input to save tokens
    const query = userInput?.trim();
    if (!query || query.length < 3) {
        return "Please ask a specific question about stadium directions or accessibility.";
    }

    // Efficiency check: Return cached response if identical query is made
    if (queryCache.has(query)) {
        return queryCache.get(query);
    }

    const systemInstruction = `
    You are MatchDay Aura, the official AI Smart Stadium Assistant for the FIFA World Cup 2026.
    Rule 1: Prioritize step-free, ramp-accessible navigation whenever accessibility flags are detected.
    Rule 2: Detect language automatically and reply in that system preference instantly.
    Rule 3: Mitigate congestion dynamically by routing traffic to lesser-utilized zones.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-pro',
            contents: query,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2,
                maxOutputTokens: 150 // Optimized token limit for faster response times
            }
        });
        
        const reply = response.text;
        // Store in cache (limit size to keep memory efficient)
        if (queryCache.size > 50) queryCache.clear();
        queryCache.set(query, reply);

        return reply;
    } catch (error) {
        console.error("Operational fallback activated:", error);
        return "I am currently optimizing routes. Please proceed to the nearest information desk or speak to a volunteer.";
    }
}

module.exports = { handleStadiumQuery };
