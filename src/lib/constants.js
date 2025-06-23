export const pathTemplates = {
  'football': {
    name: 'Jugador',
    icon: '⚽',
    attributes: ['physical', 'health', 'resilience'],
    primaryAttribute: 'physical',
    prerequisites: [
      '1 technical drill session',
      '1 tactical awareness video',
      '1 fitness component'
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
      '30 tactical puzzles',
      '2 games (standard/blitz)',
      '1 pro match analysis'
    ],
    titles: ['Student', 'Strategist', 'Mastermind'],
    perk: 'Streak-based Intelligence bonus',
    color: 'from-purple-600 to-indigo-800'
  },
  // ... more path templates
};

export const attributeIcons = {
  spiritual: 'Heart',
  health: 'Zap',
  intelligence: 'Brain',
  physical: 'Dumbbell',
  creativity: 'Palette',
  resilience: 'Shield'
};

export const ranks = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
