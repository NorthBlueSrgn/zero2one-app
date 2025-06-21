// src/constants/index.js
export * from './ranks';
export * from './paths';
export * from './attributes';
export * from './initialState';

// src/constants/ranks.js
export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

export const RANK_REQUIREMENTS = {
  'E': { xp: 0, daysRequired: 0 },
  'D': { xp: 600, daysRequired: 60 }, // 2 months
  'C': { xp: 1500, daysRequired: 90 }, // 3 months
  'B': { xp: 3000, daysRequired: 90 }, // 3 months
  'A': { xp: 5000, daysRequired: 120 }, // 4 months
  'S': { xp: 8000, daysRequired: 150 }, // 5 months
  'SS': { xp: 12000, daysRequired: 150 }, // 5 months
  'SSS': { xp: 17000, daysRequired: 150 }, // 5 months
};

// src/constants/paths.js
export const PATH_TEMPLATES = {
  'meditation': {
    name: 'Inner Peace',
    icon: '🧘',
    color: 'from-blue-600 to-indigo-800',
    attributes: ['spiritual', 'resilience'],
    primaryAttribute: 'spiritual',
    dailyTasks: [
      {
        id: 'meditation-1',
        name: 'Morning Meditation',
        xpReward: 15,
        attributeRewards: { spiritual: 2, resilience: 1 }
      },
      {
        id: 'meditation-2',
        name: 'Mindfulness Practice',
        xpReward: 10,
        attributeRewards: { spiritual: 1, resilience: 1 }
      }
    ],
    weeklyTasks: [
      {
        id: 'meditation-weekly-1',
        name: 'Extended Meditation Session',
        frequency: 2,
        xpReward: 30,
        attributeRewards: { spiritual: 3, resilience: 2 }
      }
    ],
    titles: ['Seeker', 'Practitioner', 'Master', 'Sage'],
    perk: '+10% Spiritual gains from meditation tasks'
  },
  'fitness': {
    name: 'Peak Performance',
    icon: '💪',
    color: 'from-green-600 to-emerald-800',
    attributes: ['physical', 'health', 'resilience'],
    primaryAttribute: 'physical',
    dailyTasks: [
      {
        id: 'fitness-1',
        name: 'Workout Session',
        xpReward: 20,
        attributeRewards: { physical: 2, health: 1, resilience: 1 }
      },
      {
        id: 'fitness-2',
        name: 'Stretching Routine',
        xpReward: 10,
        attributeRewards: { physical: 1, health: 1 }
      }
    ],
    weeklyTasks: [
      {
        id: 'fitness-weekly-1',
        name: 'Long Training Session',
        frequency: 2,
        xpReward: 40,
        attributeRewards: { physical: 3, health: 2, resilience: 2 }
      }
    ],
    titles: ['Rookie', 'Athlete', 'Elite', 'Champion'],
    perk: '+15% Physical gains from workout tasks'
  },
  'learning': {
    name: 'Knowledge Seeker',
    icon: '📚',
    color: 'from-purple-600 to-indigo-800',
    attributes: ['intelligence', 'creativity'],
    primaryAttribute: 'intelligence',
    dailyTasks: [
      {
        id: 'learning-1',
        name: 'Study Session',
        xpReward: 15,
        attributeRewards: { intelligence: 2, creativity: 1 }
      },
      {
        id: 'learning-2',
        name: 'Review Notes',
        xpReward: 10,
        attributeRewards: { intelligence: 1 }
      }
    ],
    weeklyTasks: [
      {
        id: 'learning-weekly-1',
        name: 'Deep Learning Project',
        frequency: 1,
        xpReward: 35,
        attributeRewards: { intelligence: 3, creativity: 2 }
      }
    ],
    titles: ['Student', 'Scholar', 'Researcher', 'Sage'],
    perk: '+10% Intelligence gains from study tasks'
  },
  'creativity': {
    name: 'Creative Flow',
    icon: '🎨',
    color: 'from-pink-600 to-rose-800',
    attributes: ['creativity', 'intelligence'],
    primaryAttribute: 'creativity',
    dailyTasks: [
      {
        id: 'creativity-1',
        name: 'Creative Practice',
        xpReward: 15,
        attributeRewards: { creativity: 2, intelligence: 1 }
      },
      {
        id: 'creativity-2',
        name: 'Inspiration Collection',
        xpReward: 10,
        attributeRewards: { creativity: 1 }
      }
    ],
    weeklyTasks: [
      {
        id: 'creativity-weekly-1',
        name: 'Major Creative Project',
        frequency: 1,
        xpReward: 35,
        attributeRewards: { creativity: 3, intelligence: 2 }
      }
    ],
    titles: ['Novice', 'Artist', 'Innovator', 'Maestro'],
    perk: '+15% Creativity gains from artistic tasks'
  }
};

// src/constants/attributes.js
export const ATTRIBUTES = {
  spiritual: {
    icon: '🧘',
    color: 'text-blue-400',
    description: 'Inner peace and mindfulness'
  },
  health: {
    icon: '❤️',
    color: 'text-red-400',
    description: 'Physical wellbeing and vitality'
  },
  intelligence: {
    icon: '🧠',
    color: 'text-purple-400',
    description: 'Mental acuity and knowledge'
  },
  physical: {
    icon: '💪',
    color: 'text-green-400',
    description: 'Strength and endurance'
  },
  creativity: {
    icon: '🎨',
    color: 'text-pink-400',
    description: 'Artistic and innovative thinking'
  },
  resilience: {
    icon: '🛡️',
    color: 'text-yellow-400',
    description: 'Mental toughness and perseverance'
  }
};

// src/constants/initialState.js
export const INITIAL_USER_STATS = {
  rank: 'E',
  xp: 0,
  xpToNext: RANK_REQUIREMENTS['D'].xp,
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
  streakDays: 0,
  totalTitles: 0,
  startDate: new Date().toISOString(),
  statistics: {
    tasksCompleted: 0,
    pathsCreated: 0,
    longestStreak: 0,
    totalXPGained: 0
  }
};

// src/constants/utils.js
export const calculateAttributeRank = (value) => {
  for (const [rank, requirements] of Object.entries(RANK_REQUIREMENTS).reverse()) {
    if (value >= requirements.xp) {
      return rank;
    }
  }
  return 'E';
};

export const getNextRank = (currentRank) => {
  const currentIndex = RANKS.indexOf(currentRank);
  return currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : currentRank;
};

export const calculateLevelProgress = (experience, level) => {
  const requiredXP = level * 100;
  return (experience / requiredXP) * 100;
};
