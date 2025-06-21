import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Zap, Brain, Heart, Dumbbell, Palette, Shield, Target, ChevronRight, Star, Flame } from 'lucide-react';

// Constants
const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
const XP_THRESHOLDS = {
  'E': 0,
  'D': 270,
  'C': 540,
  'B': 1080,
  'A': 2160,
  'S': 4320,
  'SS': 8640,
  'SSS': 17280
};

const ATTRIBUTE_THRESHOLDS = {
  'E': 0,
  'D': 20,
  'C': 40,
  'B': 60,
  'A': 80,
  'S': 100,
  'SS': 120,
  'SSS': 150
};

const initialUserStats = {
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

const pathTemplates = {
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
  // ... other path templates
};

const Zero2OneApp = () => {
  // Core State
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : initialUserStats;
  });
  
  const [paths, setPaths] = useState(() => {
    const saved = localStorage.getItem('paths');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('paths');
  const [showNewPath, setShowNewPath] = useState(false);
  const [showCustomPath, setShowCustomPath] = useState(false);
  
  // Custom path state
  const [customPath, setCustomPath] = useState({
    name: '',
    attributes: [],
    prerequisites: [
      { name: '', frequency: 'daily', xpReward: 5, attributeRewards: {} },
      { name: '', frequency: 'daily', xpReward: 5, attributeRewards: {} },
      { name: '', frequency: 'weekly', xpReward: 10, attributeRewards: {} }
    ]
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('paths', JSON.stringify(paths));
  }, [paths]);

  // Rank Calculation Functions
  const calculateAttributeRank = (value) => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (value >= ATTRIBUTE_THRESHOLDS[RANKS[i]]) {
        return RANKS[i];
      }
    }
    return 'E';
  };

  const calculateOverallRank = (attributes) => {
    const ranks = Object.values(attributes).map(value => calculateAttributeRank(value));
    const rankValues = ranks.map(rank => RANKS.indexOf(rank));
    const avgRankValue = rankValues.reduce((a, b) => a + b, 0) / rankValues.length;
    return RANKS[Math.round(avgRankValue)];
  };

  // Reset Function
  const resetProgress = () => {
    setUserStats(initialUserStats);
    setPaths([]);
    localStorage.clear();
  };

  // Export Progress
  const exportProgress = () => {
    const data = {
      userStats,
      paths,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zero2one-progress.json';
    a.click();
  };

  // Import Progress
  const importProgress = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setUserStats(data.userStats);
          setPaths(data.paths);
        } catch (error) {
          console.error('Error importing progress:', error);
        }
      };
      reader.readAsText(file);
    }
  };


  // Path Management Functions
    const createPath = (pathKey) => {
    const template = pathTemplates[pathKey];
    if (!template) return;

    const newPath = {
      id: Date.now(),
      ...template,
      level: 1,
      completedToday: [],
      weeklyProgress: {},
      streak: 0,
      totalXP: 0,
      currentTitle: template.titles[0],
      mastery: 0,
      lastCompletionDate: null,
      weekStartDate: getWeekStartDate()
    };

    setPaths(prev => [...prev, newPath]);
    setShowNewPath(false);
  };

  const generateCustomPathTemplate = (input) => {
    const name = input.trim();
    const defaultAttributes = ['intelligence', 'resilience'];
    
    // Attribute mapping based on keywords
    const keywordAttributes = {
      'gym': ['physical', 'health'],
      'study': ['intelligence', 'creativity'],
      'art': ['creativity', 'spiritual'],
      'meditation': ['spiritual', 'resilience'],
      // Add more mappings as needed
    };

    // Find matching attributes from keywords
    const matchedAttributes = Object.entries(keywordAttributes)
      .filter(([keyword]) => name.toLowerCase().includes(keyword))
      .flatMap(([, attrs]) => attrs);

    const attributes = [...new Set([...defaultAttributes, ...matchedAttributes])];

    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      icon: '⭐',
      attributes,
      primaryAttribute: attributes[0],
      prerequisites: [
        {
          name: `Daily ${name} practice`,
          frequency: 'daily',
          xpReward: 7,
          attributeRewards: Object.fromEntries(attributes.map(attr => [attr, 1]))
        },
        {
          name: `${name} skill development`,
          frequency: 'daily',
          xpReward: 5,
          attributeRewards: { [attributes[0]]: 2 }
        },
        {
          name: `${name} weekly challenge (3x/week)`,
          frequency: 'weekly',
          timesPerWeek: 3,
          xpReward: 15,
          attributeRewards: Object.fromEntries(attributes.map(attr => [attr, 2]))
        }
      ],
      titles: ['Novice', 'Adept', 'Master', 'Legend'],
      perk: `Enhanced ${name} mastery gains`,
      color: 'from-purple-600 to-indigo-800'
    };
  };

  const createCustomPath = () => {
    if (!customPath.name.trim()) return;
    
    const template = generateCustomPathTemplate(customPath.name);
    const newPath = {
      id: Date.now(),
      ...template,
      level: 1,
      completedToday: [],
      weeklyProgress: {},
      streak: 0,
      totalXP: 0,
      currentTitle: template.titles[0],
      mastery: 0,
      lastCompletionDate: null,
      weekStartDate: getWeekStartDate()
    };

    setPaths(prev => [...prev, newPath]);
    setShowCustomPath(false);
    setCustomPath({ name: '', attributes: [], prerequisites: [] });
  };

  // Quest Completion Functions
  const togglePrerequisite = (pathId, prereqIndex) => {
    setPaths(prev => prev.map(path => {
      if (path.id !== pathId) return path;

      const prereq = path.prerequisites[prereqIndex];
      const today = new Date().toISOString().split('T')[0];
      const newCompletedToday = [...path.completedToday];
      const newWeeklyProgress = { ...path.weeklyProgress };

      if (prereq.frequency === 'weekly') {
        // Handle weekly prerequisites
        if (!newWeeklyProgress[prereqIndex]) {
          newWeeklyProgress[prereqIndex] = 0;
        }

        if (newWeeklyProgress[prereqIndex] < prereq.timesPerWeek) {
          newWeeklyProgress[prereqIndex]++;
          awardRewards(path, prereq);
        }
      } else {
        // Handle daily prerequisites
        if (newCompletedToday.includes(prereqIndex)) {
          newCompletedToday.splice(newCompletedToday.indexOf(prereqIndex), 1);
        } else {
          newCompletedToday.push(prereqIndex);
          awardRewards(path, prereq);
        }
      }

      return {
        ...path,
        completedToday: newCompletedToday,
        weeklyProgress: newWeeklyProgress,
        lastCompletionDate: today
      };
    }));
  };

  const awardRewards = (path, prereq) => {
    // Award XP and attribute points
    setUserStats(prev => {
      const newXP = prev.xp + prereq.xpReward;
      const newAttributes = { ...prev.attributes };

      // Apply attribute rewards
      Object.entries(prereq.attributeRewards).forEach(([attr, value]) => {
        newAttributes[attr] += value;
      });

      // Apply path perk bonuses if applicable
      if (path.perk.includes('+10%')) {
        const attributeBonus = path.primaryAttribute;
        newAttributes[attributeBonus] += Math.floor(prereq.attributeRewards[attributeBonus] * 0.1);
      }

      // Calculate new ranks
      const newAttributeRanks = Object.entries(newAttributes).reduce((acc, [attr, value]) => {
        acc[attr] = calculateAttributeRank(value);
        return acc;
      }, {});

      const newOverallRank = calculateOverallRank(newAttributes);

      return {
        ...prev,
        xp: newXP,
        attributes: newAttributes,
        attributeRanks: newAttributeRanks,
        overallRank: newOverallRank,
        xpToNext: getNextRankThreshold(newXP)
      };
    });
  };

  // Utility Functions
  const getWeekStartDate = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - dayOfWeek);
    return startDate.toISOString().split('T')[0];
  };

  const getNextRankThreshold = (currentXP) => {
    for (const [rank, threshold] of Object.entries(XP_THRESHOLDS)) {
      if (threshold > currentXP) {
        return threshold;
      }
    }
    return XP_THRESHOLDS.SSS;
  };

  // Daily Reset Check
  useEffect(() => {
    const checkDailyReset = () => {
      const today = new Date().toISOString().split('T')[0];
      
      setPaths(prev => prev.map(path => {
        if (path.lastCompletionDate !== today) {
          return {
            ...path,
            completedToday: []
          };
        }
        return path;
      }));
    };

    checkDailyReset();
    const interval = setInterval(checkDailyReset, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval);
  }, []);

  // Weekly Reset Check
  useEffect(() => {
    const checkWeeklyReset = () => {
      const currentWeekStart = getWeekStartDate();
      
      setPaths(prev => prev.map(path => {
        if (path.weekStartDate !== currentWeekStart) {
          return {
            ...path,
            weeklyProgress: {},
            weekStartDate: currentWeekStart
          };
        }
        return path;
      }));
    };

    checkWeeklyReset();
    const interval = setInterval(checkWeeklyReset, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval);
  }, []);

const Zero2OneApp = () => {
  // Additional State Management
  const [notifications, setNotifications] = useState([]);
  const [lastSave, setLastSave] = useState(null);
  const [pathFilter, setPathFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('progress'); // 'progress', 'level', 'streak'
  
  // Path Management Extended Functions
  const calculatePathLevel = (totalXP) => {
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
  };

  const updatePathProgress = (pathId, prereqIndex, value) => {
    setPaths(prev => prev.map(path => {
      if (path.id !== pathId) return path;

      const prereq = path.prerequisites[prereqIndex];
      const newWeeklyProgress = { ...path.weeklyProgress };
      
      if (prereq.frequency === 'weekly') {
        newWeeklyProgress[prereqIndex] = Math.min(
          (newWeeklyProgress[prereqIndex] || 0) + value,
          prereq.timesPerWeek
        );
      }

      // Calculate new total XP
      const newTotalXP = path.totalXP + (value * prereq.xpReward);
      const newLevel = calculatePathLevel(newTotalXP);

      // Check for level up
      if (newLevel > path.level) {
        addNotification(`${path.name} reached level ${newLevel}!`);
      }

      return {
        ...path,
        weeklyProgress: newWeeklyProgress,
        totalXP: newTotalXP,
        level: newLevel
      };
    }));
  };

  const addNotification = (message) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message,
      type: 'success'
    }]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.message !== message));
    }, 5000);
  };

  // Streak Management
  const updateStreaks = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setPaths(prev => prev.map(path => {
      const isCompleted = path.prerequisites.every((prereq, index) => {
        if (prereq.frequency === 'weekly') {
          return (path.weeklyProgress[index] || 0) >= prereq.timesPerWeek;
        }
        return path.completedToday.includes(index);
      });

      const lastComplete = new Date(path.lastCompletionDate || 0);
      const daysSinceLastComplete = Math.floor((new Date() - lastComplete) / (1000 * 60 * 60 * 24));

      let newStreak = path.streak;
      if (isCompleted) {
        if (daysSinceLastComplete <= 1) {
          newStreak += 1;
          if (newStreak % 7 === 0) {
            addNotification(`🔥 ${path.name} ${newStreak} day streak!`);
          }
        } else {
          newStreak = 1;
        }
      } else if (daysSinceLastComplete > 1) {
        newStreak = 0;
      }

      return {
        ...path,
        streak: newStreak,
        lastCompletionDate: isCompleted ? today : path.lastCompletionDate
      };
    }));
  };

  // Decay System
  const applyDecay = () => {
    const today = new Date();
    
    setPaths(prev => prev.map(path => {
      const lastComplete = new Date(path.lastCompletionDate || 0);
      const daysSinceLastComplete = Math.floor((today - lastComplete) / (1000 * 60 * 60 * 24));

      if (daysSinceLastComplete >= 4) {
        // Apply decay to related attributes
        setUserStats(prev => {
          const newAttributes = { ...prev.attributes };
          path.attributes.forEach(attr => {
            newAttributes[attr] = Math.max(0, newAttributes[attr] - Math.floor(daysSinceLastComplete / 4));
          });
          return {
            ...prev,
            attributes: newAttributes,
            attributeRanks: Object.entries(newAttributes).reduce((acc, [attr, value]) => {
              acc[attr] = calculateAttributeRank(value);
              return acc;
            }, {})
          };
        });

        if (daysSinceLastComplete === 4) {
          addNotification(`⚠️ ${path.name} attributes starting to decay!`);
        }
      }

      return path;
    }));
  };

  // Title Progress System
  const checkTitleProgress = (path) => {
    const titleThresholds = [0, 1000, 2500, 5000, 10000]; // XP thresholds for titles
    const currentTitleIndex = path.titles.indexOf(path.currentTitle);
    const nextTitleThreshold = titleThresholds[currentTitleIndex + 1];

    if (nextTitleThreshold && path.totalXP >= nextTitleThreshold) {
      const newTitle = path.titles[currentTitleIndex + 1];
      addNotification(`🏆 ${path.name} achieved title: ${newTitle}!`);
      
      setUserStats(prev => ({
        ...prev,
        totalTitles: prev.totalTitles + 1
      }));

      return {
        ...path,
        currentTitle: newTitle
      };
    }

    return path;
  };

  // Save System
  const saveProgress = () => {
    const saveData = {
      userStats,
      paths,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('zero2oneProgress', JSON.stringify(saveData));
    setLastSave(new Date());
    addNotification('Progress saved! 💾');
  };

  // Auto-save
  useEffect(() => {
    const autoSaveInterval = setInterval(saveProgress, 300000); // Every 5 minutes
    return () => clearInterval(autoSaveInterval);
  }, [userStats, paths]);

  // Daily checks
  useEffect(() => {
    const dailyChecks = () => {
      updateStreaks();
      applyDecay();
    };

    const checkInterval = setInterval(dailyChecks, 3600000); // Every hour
    dailyChecks(); // Initial check
    
    return () => clearInterval(checkInterval);
  }, []);

  // Path Filtering and Sorting
  const getFilteredPaths = () => {
    let filtered = [...paths];
    
    if (pathFilter !== 'all') {
      filtered = filtered.filter(path => 
        path.attributes.includes(pathFilter)
      );
    }

    switch (sortOrder) {
      case 'level':
        filtered.sort((a, b) => b.level - a.level);
        break;
      case 'streak':
        filtered.sort((a, b) => b.streak - a.streak);
        break;
      case 'progress':
        filtered.sort((a, b) => {
          const progressA = calculatePathProgress(a);
          const progressB = calculatePathProgress(b);
          return progressB - progressA;
        });
        break;
    }

    return filtered;
  };

  const calculatePathProgress = (path) => {
    return path.prerequisites.reduce((acc, prereq, index) => {
      if (prereq.frequency === 'weekly') {
        return acc + ((path.weeklyProgress[index] || 0) / prereq.timesPerWeek);
      }
      return acc + (path.completedToday.includes(index) ? 1 : 0);
    }, 0) / path.prerequisites.length * 100;
  };

// ... (previous code)

const Zero2OneApp = () => {
  // ... (previous state and functions)

  // Notification Component
  const NotificationToast = ({ notification }) => (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-lg animate-slide-up">
      <p className="text-white">{notification.message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-800/50 bg-black/50 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Zero2One
              </h1>
              <div className="flex items-center space-x-2">
                <RankBadge rank={userStats.overallRank} />
                <div className="text-sm text-purple-300">
                  {userStats.xp}/{userStats.xpToNext} XP
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>{paths.reduce((max, path) => Math.max(max, path.streak), 0)} day streak</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>{userStats.totalTitles} titles</span>
              </div>
              <button 
                onClick={saveProgress}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-full text-xs"
              >
                Save
              </button>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-3">
            <ProgressBar 
              value={userStats.xp} 
              max={userStats.xpToNext} 
              color="purple" 
            />
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-black/30 sticky top-16 z-20 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex space-x-4">
            {['paths', 'stats', 'evolution'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Paths Tab */}
        {activeTab === 'paths' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">Active Paths</h2>
                <div className="flex space-x-2">
                  <select
                    value={pathFilter}
                    onChange={(e) => setPathFilter(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="all">All Attributes</option>
                    {Object.keys(userStats.attributes).map(attr => (
                      <option key={attr} value={attr}>
                        {attr.charAt(0).toUpperCase() + attr.slice(1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="progress">Progress</option>
                    <option value="level">Level</option>
                    <option value="streak">Streak</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setShowNewPath(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Path</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredPaths().map(path => (
                <PathCard key={path.id} path={path} />
              ))}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Attribute Distribution</h3>
                <StatsRadar attributes={userStats.attributes} />
              </div>

              {/* Attribute Details */}
              <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Attributes</h3>
                <div className="space-y-4">
                  {Object.entries(userStats.attributes).map(([attr, value]) => (
                    <div key={attr} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AttributeIcon attribute={attr} />
                          <span className="capitalize font-medium">{attr}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RankBadge rank={userStats.attributeRanks[attr]} />
                          <span className="text-sm font-bold">{value}</span>
                        </div>
                      </div>
                      <ProgressBar 
                        value={value} 
                        max={ATTRIBUTE_THRESHOLDS[userStats.attributeRanks[attr]]} 
                        color="blue" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Recent Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paths.filter(path => path.streak > 0).map(path => (
                  <div key={path.id} className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{path.icon}</span>
                      <div>
                        <h4 className="font-medium">{path.name}</h4>
                        <p className="text-sm text-gray-400">
                          {path.streak} day streak
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Evolution Tab */}
        {activeTab === 'evolution' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Path Evolution System</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                As you progress through your paths, they will evolve with new challenges, 
                unlock advanced prerequisites, and grant powerful perks.
              </p>
            </div>

            {paths.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paths.map(path => (
                  <div key={path.id} className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">{path.icon}</span>
                      <div>
                        <h4 className="font-bold">{path.name}</h4>
                        <p className="text-sm text-gray-400">Evolution Track</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {path.titles.map((title, index) => (
                        <div
                          key={title}
                          className={`flex items-center justify-between p-3 rounded ${
                            title === path.currentTitle
                              ? 'bg-purple-600/30 border border-purple-500/50'
                              : index < path.titles.indexOf(path.currentTitle)
                              ? 'bg-green-600/20 border border-green-500/30'
                              : 'bg-gray-800/30 border border-gray-600/30'
                          }`}
                        >
                          <span className="font-medium">{title}</span>
                          {title === path.currentTitle && (
                            <span className="text-xs bg-purple-500 px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-black/20 rounded border border-yellow-500/30">
                      <div className="text-sm font-medium text-yellow-400 mb-1">
                        Path Perk
                      </div>
                      <div className="text-sm text-gray-300">{path.perk}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showNewPath && (
        <NewPathModal
          onClose={() => setShowNewPath(false)}
          onCreatePath={createPath}
          onShowCustom={() => {
            setShowNewPath(false);
            setShowCustomPath(true);
          }}
        />
      )}

      {showCustomPath && (
        <CustomPathModal
          customPath={customPath}
          setCustomPath={setCustomPath}
          onClose={() => setShowCustomPath(false)}
          onCreate={createCustomPath}
        />
      )}

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map(notification => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

// Modal Components
const NewPathModal = ({ onClose, onCreatePath, onShowCustom }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
    <div className="bg-gray-900 border border-purple-800 rounded-lg p-6 max-w-md w-full mx-4">
      <h3 className="text-xl font-bold mb-4">Choose Your Path</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Object.entries(pathTemplates).map(([key, template]) => (
          <button
            key={key}
            onClick={() => onCreatePath(key)}
            className="p-4 border border-gray-700 rounded-lg hover:border-purple-500 transition-colors text-left"
          >
            <div className="text-2xl mb-2">{template.icon}</div>
            <div className="font-medium">{template.name}</div>
            <div className="text-sm text-gray-400">{key}</div>
          </button>
        ))}
      </div>
      <button
        onClick={onShowCustom}
        className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors font-medium mb-2"
      >
        ✨ Create Custom Path
      </button>
      <button
        onClick={onClose}
        className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
);

const CustomPathModal = ({ customPath, setCustomPath, onClose, onCreate }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
    <div className="bg-gray-900 border border-purple-800 rounded-lg p-6 max-w-lg w-full mx-4">
      <h3 className="text-xl font-bold mb-4">Create Custom Path</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Path Name</label>
          <input
            type="text"
            value={customPath.name}
            onChange={(e) => setCustomPath(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Music, Cooking, Photography..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prerequisites</label>
          {customPath.prerequisites.map((prereq, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={prereq.name}
                onChange={(e) => {
                  const newPrereqs = [...customPath.prerequisites];
                  newPrereqs[index] = { ...prereq, name: e.target.value };
                  setCustomPath(prev => ({ ...prev, prerequisites: newPrereqs }));
                }}
                placeholder={`Prerequisite ${index + 1}...`}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          onClick={onCreate}
          disabled={!customPath.name.trim()}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-2 rounded-lg transition-colors font-medium"
        >
          Create Path
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default Zero2OneApp;
