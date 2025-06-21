
// src/constants/index.js
export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

export const XP_THRESHOLDS = {
  'E': 0,
  'D': 270,
  'C': 540,
  'B': 1080,
  'A': 2160,
  'S': 4320,
  'SS': 8640,
  'SSS': 17280
};

export const ATTRIBUTE_THRESHOLDS = {
  'E': 0,
  'D': 20,
  'C': 40,
  'B': 60,
  'A': 80,
  'S': 100,
  'SS': 120,
  'SSS': 150
};

export const INITIAL_USER_STATS = {
  attributes: {
    intelligence: 0,
    resilience: 0,
    physical: 0,
    creativity: 0,
    health: 0,
    spiritual: 0
  },
  attributeRanks: {
    intelligence: 'E',
    resilience: 'E',
    physical: 'E',
    creativity: 'E',
    health: 'E',
    spiritual: 'E'
  },
  overallRank: 'E',
  xp: 0,
  xpToNext: 270,
  streakDays: 0,
  totalTitles: 0
};

export const PATH_TEMPLATES = {
  'gym': {
    name: 'Physical Mastery',
    icon: '💪',
    attributes: ['physical', 'health', 'resilience'],
    primaryAttribute: 'physical',
    prerequisites: [
      {
        name: 'Workout Session',
        frequency: 'weekly',
        timesPerWeek: 4,
        xpReward: 15,
        attributeRewards: { physical: 2, health: 1, resilience: 1 }
      },
      {
        name: 'Track Nutrition',
        frequency: 'daily',
        xpReward: 5,
        attributeRewards: { health: 1 }
      },
      {
        name: 'Mobility Work',
        frequency: 'daily',
        xpReward: 5,
        attributeRewards: { physical: 1 }
      }
    ],
    titles: ['Novice', 'Athlete', 'Elite'],
    perk: '+10% Physical gains',
    color: 'from-red-600 to-orange-800'
  },
  'study': {
    name: 'Scholar\'s Path',
    icon: '📚',
    attributes: ['intelligence', 'resilience'],
    primaryAttribute: 'intelligence',
    prerequisites: [
      {
        name: 'Deep Focus Session',
        frequency: 'daily',
        xpReward: 10,
        attributeRewards: { intelligence: 2 }
      },
      {
        name: 'Review & Practice',
        frequency: 'weekly',
        timesPerWeek: 3,
        xpReward: 20,
        attributeRewards: { intelligence: 2, resilience: 1 }
      },
      {
        name: 'Knowledge Application',
        frequency: 'weekly',
        timesPerWeek: 2,
        xpReward: 15,
        attributeRewards: { intelligence: 1, creativity: 1 }
      }
    ],
    titles: ['Student', 'Scholar', 'Master'],
    color: 'from-blue-600 to-indigo-800'
  },
  'meditation': {
    name: 'Inner Path',
    icon: '🧘',
    attributes: ['spiritual', 'resilience', 'health'],
    primaryAttribute: 'spiritual',
    prerequisites: [
      {
        name: 'Meditation Session',
        frequency: 'daily',
        xpReward: 10,
        attributeRewards: { spiritual: 2, resilience: 1 }
      },
      {
        name: 'Mindfulness Practice',
        frequency: 'daily',
        xpReward: 5,
        attributeRewards: { spiritual: 1 }
      },
      {
        name: 'Deep Reflection',
        frequency: 'weekly',
        timesPerWeek: 2,
        xpReward: 15,
        attributeRewards: { spiritual: 2, creativity: 1 }
      }
    ],
    titles: ['Seeker', 'Practitioner', 'Sage'],
    color: 'from-purple-600 to-pink-800'
  },
  'creativity': {
    name: 'Artist\'s Way',
    icon: '🎨',
    attributes: ['creativity', 'intelligence', 'spiritual'],
    primaryAttribute: 'creativity',
    prerequisites: [
      {
        name: 'Creative Session',
        frequency: 'daily',
        xpReward: 10,
        attributeRewards: { creativity: 2 }
      },
      {
        name: 'Skill Practice',
        frequency: 'weekly',
        timesPerWeek: 3,
        xpReward: 15,
        attributeRewards: { creativity: 2, intelligence: 1 }
      },
      {
        name: 'Project Work',
        frequency: 'weekly',
        timesPerWeek: 1,
        xpReward: 25,
        attributeRewards: { creativity: 3, spiritual: 1 }
      }
    ],
    titles: ['Explorer', 'Creator', 'Visionary'],
    color: 'from-pink-600 to-rose-800'
  }
};
