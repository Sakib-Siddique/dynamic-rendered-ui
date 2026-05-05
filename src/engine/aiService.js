import { GoogleGenerativeAI } from "@google/generative-ai";

const PRIMARY_MODEL = "gemini-2.0-flash";
const FALLBACK_MODEL = "gemini-2.0-flash-lite";

const AVAILABLE_COMPONENTS = [
  'DailyCheckin',
  'ScoreCards',
  'WearableInsights',
  'AssessmentCards',
  'SuggestedForYou',

  'PersonalizedInsights',
  'SupportBanner',
];

const SYSTEM_PROMPT = `
You are a Senior Generative UI Architect. Your goal is to design a personalized Wellness Dashboard layout for a user based on their current mood or goal.

Available Components: ${AVAILABLE_COMPONENTS.join(', ')}

Rules for Layout Design:
1. gridSpan (Outer): 1, 2, or 4 (full width).
2. order: determines the position in the main grid.
3. internalLayout (Inner):
   - Shuffle elements inside cards to create a fresh "redesigned" feel.
   - Use "span": 1 (half-width) or 2 (full-width) for internal elements.
   - Important: Mix spans (e.g., two span-1s followed by a span-2) to create interesting, balanced combinations.
   - components that support internalLayout: WearableInsights, ScoreCards, AssessmentCards, PersonalizedInsights.

STRICT BRANDING: Do NOT change colors. Focus on layout and sizing variety.

Output MUST be a valid JSON object matching this structure:
{
  "layout": [
    {
      "id": "string",
      "componentKey": "string",
      "gridSpan": number,
      "isVisible": boolean,
      "order": number,
      "internalLayout": [
        { "elementKey": "string", "isVisible": boolean, "order": number, "span": number }
      ]
    }
  ],
  "aiReasoning": "A short explanation of why this layout and sizing combination was chosen."
}
`;

/**
 * Extract text safely from response
 */
function extractText(response) {
  if (typeof response.text === 'function') return response.text();
  
  const candidate = response.candidates?.[0];
  const part = candidate?.content?.parts?.[0];

  return part?.text || "";
}

/**
 * Safe JSON parse (prevents crashes)
 */
function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn("JSON parse failed, attempting cleanup...");

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      throw new Error("AI returned invalid JSON");
    }
  }
}

async function callModel(genAI, modelName, prompt) {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = extractText(response);

  return safeParseJSON(text);
}

export async function generateAILayout(userVibe) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Vercel/Local Error: VITE_GEMINI_API_KEY is missing.");
    throw new Error("API Key not found. Please set VITE_GEMINI_API_KEY in Vercel settings.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `${SYSTEM_PROMPT}

User's Current Vibe/Goal: "${userVibe}"

STRICT RULE:
Return ONLY valid JSON. No markdown, no explanation.`;

  try {
    return await callModel(genAI, PRIMARY_MODEL, prompt);
  } catch (err) {
    console.warn("Primary failed, switching to fallback...", err);

    try {
      return await callModel(genAI, FALLBACK_MODEL, prompt);
    } catch (fallbackErr) {
      console.error("All models failed:", fallbackErr);

      // ✅ graceful fallback (VERY IMPORTANT for UI apps)
      throw new Error("Generative AI could not produce a layout");
    }
  }
}