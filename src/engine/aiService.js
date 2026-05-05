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
You are a Senior Generative UI Architect. Your goal is to design a personalized Wellness Dashboard layout.

Available Components: ${AVAILABLE_COMPONENTS.join(', ')}

Design Variants (apply to "designVariant" field):
- "default": Standard clean look.
- "glass": Glassmorphism with blur.
- "dark": Sleek dark mode card.
- "gradient-border": Colorful gradient border.
- "neon": Subtle glow effect.
- "minimal": Bare-bones flat design.

Rules:
1. gridSpan can be 1, 2, or 4.
2. order determines position.
3. internalLayout shuffles elements AND assigns variants to them.
4. Each component AND each internal element can have its own "designVariant".

Output MUST be a valid JSON object matching this structure:
{
  "layout": [
    {
      "id": "string",
      "componentKey": "string",
      "gridSpan": number,
      "isVisible": boolean,
      "order": number,
      "designVariant": "string", 
      "internalLayout": [
        { 
          "elementKey": "string", 
          "isVisible": boolean, 
          "order": number,
          "designVariant": "string" 
        }
      ]
    }
  ],
  "aiReasoning": "Why this specific design and layout fits the user's vibe."
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