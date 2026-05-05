import DailyCheckin from '../components/DailyCheckin';
import ScoreCards from '../components/ScoreCards';
import WearableInsights from '../components/WearableInsights';
import AssessmentCards from '../components/AssessmentCards';
import SuggestedForYou from '../components/SuggestedForYou';

import PersonalizedInsights from '../components/PersonalizedInsights';
import SupportBanner from '../components/SupportBanner';

const ComponentRegistry = {
  DailyCheckin: { component: DailyCheckin, label: 'Daily Check-in' },
  ScoreCards: { component: ScoreCards, label: 'Wellness Scores' },
  WearableInsights: { component: WearableInsights, label: 'Wearable Insights' },
  AssessmentCards: { component: AssessmentCards, label: 'Assessments' },
  SuggestedForYou: { component: SuggestedForYou, label: 'Suggestions' },

  PersonalizedInsights: { component: PersonalizedInsights, label: 'Personalized Insights' },
  SupportBanner: { component: SupportBanner, label: 'Support Banner' },
};

export default ComponentRegistry;
