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
You are a Senior Generative UI Architect. Your goal is to completely redesign a Wellness Dashboard layout to feel fresh and dynamic.

Available Components: ${AVAILABLE_COMPONENTS.join(', ')}

Redesign Strategy:
1. Outer Layout (gridSpan): 1, 2, or 4. Shuffle the order of components completely.
2. Internal Sizing (Inner Redesign):
   - This is CRITICAL. For components like WearableInsights, ScoreCards, AssessmentCards, and PersonalizedInsights, you MUST redesign the internal elements.
   - Use "span": 1 (small) or 2 (large/full-width) for internal elements.
   - DO NOT make everything the same size. Mix them up (e.g., a large element followed by two small ones, or vice versa).
   - Shuffle the "order" of elements inside each component to change the reading flow.
3. Visibility: You can occasionally set "isVisible": false for 1-2 components to keep the dashboard focused.

STRICT BRANDING: Do NOT change colors. Focus entirely on structural variety and element sizing.

Output MUST be a valid JSON object:
{
  "layout": [
    {
      "id": "unique_id",
      "componentKey": "string",
      "gridSpan": number,
      "isVisible": boolean,
      "order": number,
      "internalLayout": [
        { "elementKey": "string", "isVisible": boolean, "order": number, "span": number }
      ]
    }
  ],
  "aiReasoning": "Briefly explain the structural strategy used for this redesign."
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

export async function generateAILayout(userVibe = "Professional Wellness Dashboard") {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Vercel/Local Error: VITE_GEMINI_API_KEY is missing.");
    throw new Error("API Key not found. Please set VITE_GEMINI_API_KEY in Vercel settings.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `${SYSTEM_PROMPT}

Context/Goal: "${userVibe}"

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