// src/components/Zero2OneApp.js - Part 1
import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Zap, Brain, Heart, Dumbbell, Palette, Shield, Star, Flame } from 'lucide-react';
import { PathCard } from './PathCard';
import { StatsRadar } from './StatsRadar';
import { NewPathModal } from './NewPathModal';
import { CustomPathModal } from './CustomPathModal';
import { NotificationToast } from './NotificationToast';
import { AttributeIcon, RankBadge, ProgressBar } from './ui';
import { 
  RANKS, 
  XP_THRESHOLDS, 
  ATTRIBUTE_THRESHOLDS, 
  initialUserStats, 
  pathTemplates 
} from '../constants';

const Zero2OneApp = () => {
  // State Management
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : initialUserStats;
  });
  
  const [paths, setPaths] = useState(() => {
    const saved = localStorage.getItem('paths');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('paths');
  const [notifications, setNotifications] = useState([]);
  const [showNewPath, setShowNewPath] = useState(false);
  const [showCustomPath, setShowCustomPath] = useState(false);
  const [pathFilter, setPathFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('progress');
  
  const [customPath, setCustomPath] = useState({
    name: '',
    attributes: [],
    prerequisites: [
      { name: '', frequency: 'daily', xpReward: 5, attributeRewards: {} },
      { name: '', frequency: 'daily', xpReward: 5, attributeRewards: {} },
      { name: '', frequency: 'weekly', timesPerWeek: 3, xpReward: 10, attributeRewards: {} }
    ]
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('paths', JSON.stringify(paths));
  }, [paths]);

  // Utility Functions
  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

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

  const getWeekStartDate = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - dayOfWeek);
    return startDate.toISOString().split('T')[0];
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
    addNotification(`Started new path: ${template.name}`);
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
      prerequisites: customPath.prerequisites.map(prereq => ({
        ...prereq,
        attributeRewards: Object.fromEntries(attributes.map(attr => [attr, 1]))
      })),
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
    setCustomPath({
      name: '',
      attributes: [],
      prerequisites: [
        { name: '', frequency: 'daily', xpReward: 5, attributeRewards: {} },
        { name: '', frequency: 'daily', xpReward: 5, attributeRewards: {} },
        { name: '', frequency: 'weekly', timesPerWeek: 3, xpReward: 10, attributeRewards: {} }
      ]
    });
    addNotification(`Created custom path: ${template.name}`);
  };
// src/components/Zero2OneApp.js - Part 2 (continuing from previous part)

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
          if (newWeeklyProgress[prereqIndex] === prereq.timesPerWeek) {
            addNotification(`Weekly goal completed: ${prereq.name}`);
          }
        }
      } else {
        // Handle daily prerequisites
        if (!newCompletedToday.includes(prereqIndex)) {
          newCompletedToday.push(prereqIndex);
          awardRewards(path, prereq);
          addNotification(`Task completed: ${prereq.name}`);
        } else {
          newCompletedToday.splice(newCompletedToday.indexOf(prereqIndex), 1);
        }
      }

      const updatedPath = {
        ...path,
        completedToday: newCompletedToday,
        weeklyProgress: newWeeklyProgress,
        lastCompletionDate: today
      };

      // Check for streak updates
      const isAllComplete = path.prerequisites.every((p, idx) => {
        if (p.frequency === 'weekly') {
          return (newWeeklyProgress[idx] || 0) >= p.timesPerWeek;
        }
        return newCompletedToday.includes(idx);
      });

      if (isAllComplete) {
        const newStreak = path.streak + 1;
        updatedPath.streak = newStreak;
        if (newStreak % 7 === 0) {
          addNotification(`🔥 ${path.name} ${newStreak} day streak!`);
        }
      }

      return updatedPath;
    }));
  };

  const awardRewards = (path, prereq) => {
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
      const currentRankIndex = RANKS.indexOf(prev.overallRank);
      const newRankIndex = RANKS.indexOf(newOverallRank);

      if (newRankIndex > currentRankIndex) {
        addNotification(`🎉 Rank Up! You are now rank ${newOverallRank}!`);
      }

      return {
        ...prev,
        xp: newXP,
        attributes: newAttributes,
        attributeRanks: newAttributeRanks,
        overallRank: newOverallRank,
        xpToNext: XP_THRESHOLDS[RANKS[RANKS.indexOf(newOverallRank) + 1]] || XP_THRESHOLDS.SSS
      };
    });
  };

  // Reset and Decay Systems
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
      default:
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

  // Render Component (continuing in Part 3 // src/components/Zero2OneApp.js - Part 3 (continuing from previous parts)

  // Render
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
                <span>
                  {paths.reduce((max, path) => Math.max(max, path.streak), 0)} day streak
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>{userStats.totalTitles} titles</span>
              </div>
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
                <PathCard 
                  key={path.id} 
                  path={path} 
                  onTogglePrerequisite={togglePrerequisite} 
                />
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

export default Zero2OneApp;
