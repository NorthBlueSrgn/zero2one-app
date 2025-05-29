import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Zap, Brain, Heart, Dumbbell, Palette, Shield, Target, ChevronRight, Star, Flame } from 'lucide-react';

const Zero2OneApp = () => {
    const [activeTab, setActiveTab] = useState('paths');
    const [paths, setPaths] = useState([]);
    const [newPathName, setNewPathName] = useState('');
    const [showNewPath, setShowNewPath] = useState(false);
    const [showCustomPath, setShowCustomPath] = useState(false);
    const [customPath, setCustomPath] = useState({
      name: '',
      attributes: [],
      prerequisites: ['', '', '']
    });
    const [userStats, setUserStats] = useState({
      rank: 'E',
      xp: 45,
      xpToNext: 270,
      attributes: {
        spiritual: 12,
        health: 18,
        intelligence: 25,
        physical: 8,
        creativity: 15,
        resilience: 20
      },
      streakDays: 3,
      totalTitles: 0
    });
  
    const ranks = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

    const pathTemplates = {
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
        'spanish': {
          name: 'Tower of Babel',
          icon: '🗣️',
          attributes: ['intelligence', 'creativity', 'resilience'],
          primaryAttribute: 'intelligence',
          prerequisites: [
            '20 min reading/Duolingo',
            '10+ vocabulary + recall',
            '1 speaking/writing exercise'
          ],
          titles: ['Seeker', 'Interpreter', 'Polyglot'],
          perk: 'Faster decay protection',
          color: 'from-blue-600 to-cyan-800'
        },
        'video editing': {
          name: 'Creative Flow',
          icon: '🎨',
          attributes: ['creativity', 'intelligence'],
          primaryAttribute: 'creativity',
          prerequisites: [
            '1 content idea in bank',
            '1 practical session',
            '1 inspiration piece'
          ],
          titles: ['Novice', 'Artist', 'Visionary'],
          perk: 'Reduced creative fatigue',
          color: 'from-pink-600 to-rose-800'
        }
      };
    
      const attributeIcons = {
        spiritual: Heart,
        health: Zap,
        intelligence: Brain,
        physical: Dumbbell,
        creativity: Palette,
        resilience: Shield
      };

      const createPath = (pathKey) => {
        const template = pathTemplates[pathKey];
        if (!template) return;
    
        const newPath = {
          id: Date.now(),
          ...template,
          level: 1,
          completedToday: [],
          streak: 0,
          totalXP: 0,
          currentTitle: template.titles[0],
          mastery: 0
        };
    
        setPaths(prev => [...prev, newPath]);
        setShowNewPath(false);
        setNewPathName('');
      };
    
      const generatePathFromInput = (userInput) => {
        const input = userInput.toLowerCase().trim();
        
        // AI-like path generation based on keywords
        const pathGenerators = {
          // Music-related
          music: () => ({
            name: 'Harmony Weaver',
            icon: '🎵',
            attributes: ['creativity', 'intelligence', 'resilience'],
            primaryAttribute: 'creativity',
            prerequisites: [
              '30 min practice session',
              '1 music theory study',
              '1 listening/analysis exercise'
            ],
            titles: ['Novice', 'Musician', 'Virtuoso', 'Maestro'],
            perk: '+15% Creativity XP from artistic tasks',
            color: 'from-purple-600 to-blue-800'
          }),
          // ... (other generators)
        };
    
        // Find matching generator
        for (const [keyword, generator] of Object.entries(pathGenerators)) {
          if (input.includes(keyword)) {
            return generator();
          }
        }
    
        // Default custom path
        return {
          name: `${input.charAt(0).toUpperCase() + input.slice(1)} Path`,
          icon: '⭐',
          attributes: ['intelligence', 'creativity', 'resilience'],
          primaryAttribute: 'intelligence',
          prerequisites: [
            `1 ${input} practice session`,
            `1 ${input} skill development`,
            `1 ${input} reflection/analysis`
          ],
          titles: ['Beginner', 'Practitioner', 'Expert'],
          perk: `Enhanced ${input} mastery`,
          color: 'from-slate-600 to-gray-800'
        };
      };

      const createCustomPath = () => {
        if (!customPath.name.trim()) return;
        
        const generatedPath = generatePathFromInput(customPath.name);
        
        const finalPath = {
          id: Date.now(),
          ...generatedPath,
          level: 1,
          completedToday: [],
          streak: 0,
          totalXP: 0,
          currentTitle: generatedPath.titles[0],
          mastery: 0,
          prerequisites: customPath.prerequisites.filter(p => p.trim()).length > 0 
            ? customPath.prerequisites.filter(p => p.trim())
            : generatedPath.prerequisites
        };
    
        setPaths(prev => [...prev, finalPath]);
        setShowCustomPath(false);
        setCustomPath({ name: '', attributes: [], prerequisites: ['', '', ''] });
      };
    
      const togglePrerequisite = (pathId, prereqIndex) => {
        setPaths(prev => prev.map(path => {
          if (path.id === pathId) {
            const newCompleted = [...path.completedToday];
            if (newCompleted.includes(prereqIndex)) {
              newCompleted.splice(newCompleted.indexOf(prereqIndex), 1);
            } else {
              newCompleted.push(prereqIndex);
            }
            
            if (newCompleted.length === path.prerequisites.length) {
              const xpGain = 15 + (path.level * 5);
              setUserStats(prev => ({
                ...prev,
                xp: prev.xp + xpGain,
                attributes: {
                  ...prev.attributes,
                  [path.primaryAttribute]: prev.attributes[path.primaryAttribute] + 2,
                  ...Object.fromEntries(
                    path.attributes.filter(attr => attr !== path.primaryAttribute)
                      .map(attr => [attr, prev.attributes[attr] + 1])
                  )
                }
              }));
            }
            
            return {
              ...path,
              completedToday: newCompleted,
              streak: newCompleted.length === path.prerequisites.length ? path.streak + 1 : path.streak,
              totalXP: newCompleted.length === path.prerequisites.length ? path.totalXP + (15 + path.level * 5) : path.totalXP
            };
          }
          return path;
        }));
      };
    
      const getCompletionPercentage = (path) => {
        return (path.completedToday.length / path.prerequisites.length) * 100;
      };
    
      const RadarChart = ({ attributes }) => {
        const maxValue = Math.max(...Object.values(attributes));
        const normalizedValues = Object.entries(attributes).map(([key, value]) => ({
          name: key,
          value: (value / maxValue) * 100
        }));
    
        return (
          <div className="relative w-48 h-48 mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Background circles */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(139, 69, 193, 0.2)" strokeWidth="1"/>
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(139, 69, 193, 0.2)" strokeWidth="1"/>
              <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(139, 69, 193, 0.2)" strokeWidth="1"/>
              <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(139, 69, 193, 0.2)" strokeWidth="1"/>
              
              {/* Radar lines */}
              {normalizedValues.map((_, index) => {
                const angle = (index / normalizedValues.length) * 2 * Math.PI - Math.PI / 2;
                const x = 100 + Math.cos(angle) * 80;
                const y = 100 + Math.sin(angle) * 80;
                return (
                  <line key={index} x1="100" y1="100" x2={x} y2={y} stroke="rgba(139, 69, 193, 0.3)" strokeWidth="1"/>
                );
              })}
              
              {/* Data polygon */}
              <polygon
                points={normalizedValues.map((item, index) => {
                  const angle = (index / normalizedValues.length) * 2 * Math.PI - Math.PI / 2;
                  const radius = (item.value / 100) * 80;
                  const x = 100 + Math.cos(angle) * radius;
                  const y = 100 + Math.sin(angle) * radius;
                  return `${x},${y}`;
                }).join(' ')}
                fill="rgba(139, 69, 193, 0.3)"
                stroke="rgb(139, 69, 193)"
                strokeWidth="2"
              />
              
              {/* Attribute labels */}
              {normalizedValues.map((item, index) => {
                const angle = (index / normalizedValues.length) * 2 * Math.PI - Math.PI / 2;
                const x = 100 + Math.cos(angle) * 95;
                const y = 100 + Math.sin(angle) * 95;
                return (
                  <text
                    key={index}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-purple-300 font-medium"
                  >
                    {item.name.charAt(0).toUpperCase()}
                  </text>
                );
              })}
            </svg>
          </div>
        );
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
          {/* Header */}
          <div className="border-b border-purple-800/50 bg-black/50 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Zero2One
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="px-3 py-1 bg-purple-800/50 rounded-full font-bold">
                      Rank {userStats.rank}
                    </div>
                    <div className="text-purple-300">
                      {userStats.xp}/{userStats.xpToNext} XP
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>{userStats.streakDays} day streak</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span>{userStats.totalTitles} titles</span>
                  </div>
                </div>
              </div>
              
              {/* XP Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
    
          {/* Navigation */}
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex space-x-4 mb-6">
              {['paths', 'stats', 'evolution'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
    
            {/* Paths Tab */}
            {activeTab === 'paths' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Active Paths</h2>
                  <button
                    onClick={() => setShowNewPath(true)}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Path</span>
                  </button>
                </div>
    
                {/* New Path Modal */}
                {showNewPath && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-purple-800 rounded-lg p-6 max-w-md w-full mx-4">
                      <h3 className="text-xl font-bold mb-4">Choose Your Path</h3>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {Object.entries(pathTemplates).map(([key, template]) => (
                          <button
                            key={key}
                            onClick={() => createPath(key)}
                            className="p-4 border border-gray-700 rounded-lg hover:border-purple-500 transition-colors text-left"
                          >
                            <div className="text-2xl mb-2">{template.icon}</div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-gray-400">{key}</div>
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-gray-700 pt-4">
                        <button
                          onClick={() => {
                            setShowNewPath(false);
                            setShowCustomPath(true);
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors font-medium"
                        >
                          ✨ Create Custom Path
                        </button>
                      </div>
                      <button
                        onClick={() => setShowNewPath(false)}
                        className="mt-2 w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
    
                {/* Custom Path Modal */}
                {showCustomPath && (
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
                          <p className="text-xs text-gray-400 mt-1">
                            The system will auto-generate appropriate prerequisites and themes!
                          </p>
                        </div>
    
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Custom Prerequisites (Optional)
                          </label>
                          {customPath.prerequisites.map((prereq, index) => (
                            <input
                              key={index}
                              type="text"
                              value={prereq}
                              onChange={(e) => {
                                const newPrereqs = [...customPath.prerequisites];
                                newPrereqs[index] = e.target.value;
                                setCustomPath(prev => ({ ...prev, prerequisites: newPrereqs }));
                              }}
                              placeholder={`Prerequisite ${index + 1}...`}
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none mb-2"
                            />
                          ))}
                          <p className="text-xs text-gray-400">
                            Leave empty to use auto-generated prerequisites
                          </p>
                        </div>
                      </div>
    
                      <div className="flex space-x-3 mt-6">
                        <button
                          onClick={createCustomPath}
                          disabled={!customPath.name.trim()}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-2 rounded-lg transition-colors font-medium"
                        >
                          Create Path
                        </button>
                        <button
                          onClick={() => {
                            setShowCustomPath(false);
                            setCustomPath({ name: '', attributes: [], prerequisites: ['', '', ''] });
                          }}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
    
                {/* Paths Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paths.map(path => (
                    <div key={path.id} className={`bg-gradient-to-br ${path.color} p-6 rounded-lg border border-purple-800/30`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{path.icon}</span>
                          <div>
                            <h3 className="font-bold">{path.name}</h3>
                            <p className="text-sm opacity-75">{path.currentTitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm opacity-75">Level {path.level}</div>
                          <div className="flex items-center space-x-1">
                            <Flame className="w-3 h-3" />
                            <span className="text-xs">{path.streak}</span>
                          </div>
                        </div>
                      </div>
    
                      {/* Prerequisites */}
                      <div className="space-y-2 mb-4">
                        {path.prerequisites.map((prereq, index) => (
                          <div
                            key={index}
                            onClick={() => togglePrerequisite(path.id, index)}
                            className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-all ${
                              path.completedToday.includes(index)
                                ? 'bg-green-600/30 border-green-500/50'
                                : 'bg-black/20 border-gray-600/50 hover:bg-black/30'
                            } border`}
                          >
                            <div className={`w-4 h-4 rounded border-2 ${
                              path.completedToday.includes(index)
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-500'
                            }`}>
                              {path.completedToday.includes(index) && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                            <span className={`text-sm ${
                              path.completedToday.includes(index) ? 'line-through opacity-75' : ''
                            }`}>
                              {prereq}
                            </span>
                          </div>
                        ))}
                      </div>
    
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Daily Progress</span>
                          <span>{Math.round(getCompletionPercentage(path))}%</span>
                        </div>
                        <div className="w-full bg-black/30 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getCompletionPercentage(path)}%` }}
                          />
                        </div>
                      </div>
                    </div>
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
                    <RadarChart attributes={userStats.attributes} />
                  </div>
    
                  {/* Attribute Details */}
                  <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Attributes</h3>
                    <div className="space-y-3">
                      {Object.entries(userStats.attributes).map(([attr, value]) => {
                        const Icon = attributeIcons[attr];
                        return (
                          <div key={attr} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Icon className="w-5 h-5 text-purple-400" />
                              <span className="capitalize font-medium">{attr}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-24 bg-gray-800 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                  style={{ width: `${Math.min((value / 50) * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold w-8 text-right">{value}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
    
                {/* Rank Progress */}
                <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Rank Evolution</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {ranks.map((rank, index) => (
                        <div
                          key={rank}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${
                            rank === userStats.rank
                              ? 'border-purple-500 bg-purple-500 text-white'
                              : ranks.indexOf(userStats.rank) > index
                              ? 'border-green-500 bg-green-500/20 text-green-300'
                              : 'border-gray-600 text-gray-500'
                          }`}
                        >
                          {rank}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    Next rank in {userStats.xpToNext - userStats.xp} XP
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
    
            {/* Evolution Tab */}
            {activeTab === 'evolution' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-purple-400 mx
    
    -auto mb-4" />
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
                                <span className="text-xs bg-purple-500 px-2 py-1 rounded-full">Current</span>
                              )}
                              {index < path.titles.indexOf(path.currentTitle) && (
                                <span className="text-xs bg-green-500 px-2 py-1 rounded-full">Mastered</span>
                              )}
                            </div>
                          ))}
                        </div>
    
                        <div className="mt-4 p-3 bg-black/20 rounded border border-yellow-500/30">
                          <div className="text-sm font-medium text-yellow-400 mb-1">Mastery Perk</div>
                          <div className="text-sm text-gray-300">{path.perk}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    };
    
    export default Zero2OneApp;