import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

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
1. gridSpan can be 1, 2, or 4 (full width).
2. order determines the position in the grid.
3. isVisible can be true or false.
4. internalLayout shuffles elements inside cards:
   - WearableInsights: 'Header', 'DeviceInfo', 'StepsTracker', 'VitalsRow', 'AITip'

   - ScoreCards: 'ScoreTeal', 'ScoreBlue', 'ScoreCoral'

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
        { "elementKey": "string", "isVisible": boolean, "order": number }
      ]
    }
  ],
  "aiReasoning": "A short explanation of why this layout was chosen for the user's vibe."
}
`;

/**
 * Extract text safely from response
 */
function extractText(response) {
  if (response.text) return response.text();

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

async function callModel(model, prompt) {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  const text = extractText(response);

  return safeParseJSON(text);
}

export async function generateAILayout(userVibe) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env file");
  }

  const prompt = `${SYSTEM_PROMPT}

User's Current Vibe/Goal: "${userVibe}"

STRICT RULE:
Return ONLY valid JSON. No markdown, no explanation.`;

  try {
    return await callModel(PRIMARY_MODEL, prompt);
  } catch (err) {
    console.warn("Primary failed, switching to fallback...", err);

    try {
      return await callModel(FALLBACK_MODEL, prompt);
    } catch (fallbackErr) {
      console.error("All models failed:", fallbackErr);

      // ✅ graceful fallback (VERY IMPORTANT for UI apps)
      throw new Error("Generative AI could not produce a layout");
    }
  }
}