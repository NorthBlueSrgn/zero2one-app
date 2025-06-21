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

export const initialUserStats = {
  attributes: {
    spiritual: 0,
    health: 0,
    intelligence: 0,
    physical: 0,
    creativity: 0,
    resilience: 0
  },
  attributeRanks: {
    spiritual: 'E',
    health: 'E',
    intelligence: 'E',
    physical: 'E',
    creativity: 'E',
    resilience: 'E'
  },
  overallRank: 'E',
  xp: 0,
  xpToNext: 270,
  streakDays: 0,
  totalTitles: 0
};

export const pathTemplates = {
  'football': {
    name: 'Jugador',
    icon: '⚽',
    attributes: ['physical', 'health', 'resilience'],
    primaryAttribute: 'physical',
    prerequisites: [
      {
        name: 'Technical drill session',
        frequency: 'daily',
        xpReward: 7,
        attributeRewards: { physical: 2, health: 1 }
      },
      {
        name: 'Tactical awareness video',
        frequency: 'daily',
        xpReward: 5,
        attributeRewards: { intelligence: 2, resilience: 1 }
      },
      {
        name: 'Gym workout (4x/week)',
        frequency: 'weekly',
        timesPerWeek: 4,
        xpReward: 15,
        attributeRewards: { physical: 3, health: 2, resilience: 1 }
      }
    ],
    titles: ['Amateur', 'Semi-Pro', 'Pro', 'World-Class'],
    perk: '+10% Physical XP from sports tasks',
    color: 'from-green-600 to-emerald-800'
  },
  'chess': {
    name: "Hunter's Mind",
    icon: '♟️',
    attributes: ['intelligence', 'resilience', 'creativity'],
    primaryAttribute: 'intelligence',
    prerequisites: [
      {
        name: '30 tactical puzzles',
        frequency: 'daily',
        xpReward: 7,
        attributeRewards: { intelligence: 2, creativity: 1 }
      },
      {
        name: '2 games (standard/blitz)',
        frequency: 'daily',
        xpReward: 8,
        attributeRewards: { intelligence: 2, resilience: 1 }
      },
      {
        name: 'Pro match analysis (3x/week)',
        frequency: 'weekly',
        timesPerWeek: 3,
        xpReward: 12,
        attributeRewards: { intelligence: 2, resilience: 1, creativity: 1 }
      }
    ],
    titles: ['Student', 'Strategist', 'Mastermind'],
    perk: 'Streak-based Intelligence bonus',
    color: 'from-purple-600 to-indigo-800'
  },
  'language': {
    name: 'Tower of Babel',
    icon: '🗣️',
    attributes: ['intelligence', 'creativity', 'resilience'],
    primaryAttribute: 'intelligence',
    prerequisites: [
      {
        name: '20 min reading/Duolingo',
        frequency: 'daily',
        xpReward: 5,
        attributeRewards: { intelligence: 2 }
      },
      {
        name: '10+ vocabulary + recall',
        frequency: 'daily',
        xpReward: 7,
        attributeRewards: { intelligence: 1, creativity: 1 }
      },
      {
        name: 'Speaking practice (4x/week)',
        frequency: 'weekly',
        timesPerWeek: 4,
        xpReward: 10,
        attributeRewards: { intelligence: 2, creativity: 1, resilience: 1 }
      }
    ],
    titles: ['Seeker', 'Interpreter', 'Polyglot'],
    perk: 'Faster decay protection',
    color: 'from-blue-600 to-cyan-800'
  },
  'art': {
    name: 'Creative Flow',
    icon: '🎨',
    attributes: ['creativity', 'intelligence'],
    primaryAttribute: 'creativity',
    prerequisites: [
      {
        name: 'Daily sketch/practice',
        frequency: 'daily',
        xpReward: 5,
        attributeRewards: { creativity: 2 }
      },
      {
        name: 'Study composition/color',
        frequency: 'daily',
        xpReward: 7,
        attributeRewards: { creativity: 1, intelligence: 1 }
      },
      {
        name: 'Complete artwork (2x/week)',
        frequency: 'weekly',
        timesPerWeek: 2,
        xpReward: 15,
        attributeRewards: { creativity: 3, intelligence: 1 }
      }
    ],
    titles: ['Novice', 'Artist', 'Visionary'],
    perk: 'Reduced creative fatigue',
    color: 'from-pink-600 to-rose-800'
  }
};
