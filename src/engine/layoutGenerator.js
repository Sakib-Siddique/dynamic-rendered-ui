/**
 * Jaydii Advanced Layout Generator
 * Shuffles both components (outer) and their elements (inner).
 */

const COMPONENT_KEYS = [
  'DailyCheckin',
  'ScoreCards',
  'WearableInsights',
  'AssessmentCards',
  'SuggestedForYou',

  'PersonalizedInsights',
  'SupportBanner',
];

// Potential internal elements for components
const INTERNAL_ELEMENTS = {
  WearableInsights: ['Header', 'DeviceInfo', 'StepsTracker', 'VitalsRow', 'AITip'],

  PersonalizedInsights: ['Header', 'Insight1', 'Insight2', 'Insight3'],
  ScoreCards: ['ScoreTeal', 'ScoreBlue', 'ScoreCoral'],
  AssessmentCards: ['PHQ2', 'GAD2', 'DASS21'],
};

const GRID_SPANS = [2, 4];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const VARIANTS = ['default', 'glass', 'dark', 'gradient-border', 'neon', 'minimal'];

export function generateUniqueLayout() {
  const shuffled = shuffle(COMPONENT_KEYS);

  const layout = shuffled.map((key, index) => {
    let gridSpan = randomPick(GRID_SPANS);
    
    if (key.includes('Banner') || key.includes('Checkin') || key.includes('Suggested')) {
        gridSpan = 4; 
    } else if (key === 'ScoreCards' || key === 'AssessmentCards') {
        gridSpan = 4;
    }

    // Generate INTERNAL layout for components that support it
    let internalLayout = null;
    if (INTERNAL_ELEMENTS[key]) {
        internalLayout = shuffle(INTERNAL_ELEMENTS[key]).map((elKey, i) => ({
            id: `${key}-internal-${elKey}-${i}`,
            elementKey: elKey,
            isVisible: Math.random() > 0.1, // 90% visibility
            order: i,
            designVariant: randomPick(VARIANTS)
        }));
    }

    return {
      id: `${key}-${Date.now()}-${index}`,
      componentKey: key,
      gridSpan,
      isVisible: true,
      order: index,
      designVariant: randomPick(VARIANTS),
      internalLayout 
    };
  });

  return {
    sessionId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    timestamp: new Date().toISOString(),
    layout,
  };
}
