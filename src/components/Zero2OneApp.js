'use client';

import { useState, useEffect } from 'react';
import { Plus, Trophy, Zap, Brain, Heart, Dumbbell, Palette, Shield, Flame } from 'lucide-react';
import PathCard from '@/components/paths/PathCard';
import NewPathModal from '@/components/paths/NewPathModal';
import CustomPathForm from '@/components/paths/CustomPathForm';
import RadarChart from '@/components/stats/RadarChart';
import AttributeList from '@/components/stats/AttributeList';
import Header from '@/components/shared/Header';
import Navigation from '@/components/shared/Navigation';
import { pathTemplates } from '@/lib/constants';

function Zero2OneApp() {
  // Core State
  const [userStats, setUserStats] = useState(() => {
    // Try to load from localStorage, otherwise use default values
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      rank: 'E',
      xp: 0,
      xpToNext: 100,
      attributes: {
        spiritual: 0,
        health: 0,
        intelligence: 0,
        physical: 0,
        creativity: 0,
        resilience: 0
      },
      streakDays: 0,
      totalTitles: 0
    };
  });

  const [paths, setPaths] = useState(() => {
    const saved = localStorage.getItem('paths');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('paths');
  const [showNewPath, setShowNewPath] = useState(false);
  const [showCustomPath, setShowCustomPath] = useState(false);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
    localStorage.setItem('paths', JSON.stringify(paths));
  }, [userStats, paths]);

  // Path Management
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
  };

  const createCustomPath = (customPath) => {
    const newPath = {
      id: Date.now(),
      name: customPath.name,
      icon: '⭐',
      attributes: ['intelligence', 'creativity', 'resilience'],
      primaryAttribute: 'intelligence',
      prerequisites: customPath.prerequisites.filter(p => p.trim()),
      titles: ['Beginner', 'Practitioner', 'Expert'],
      level: 1,
      completedToday: [],
      streak: 0,
      totalXP: 0,
      currentTitle: 'Beginner',
      mastery: 0,
      color: 'from-slate-600 to-gray-800',
      perk: `Enhanced ${customPath.name} mastery`
    };

    setPaths(prev => [...prev, newPath]);
    setShowCustomPath(false);
  };

  const deletePath = (pathId) => {
    if (!window.confirm('Are you sure you want to delete this path?')) return;
    setPaths(prev => prev.filter(p => p.id !== pathId));
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
        
        // Update XP and attributes when all prerequisites are completed
        if (newCompleted.length === path.prerequisites.length) {
          const xpGain = 15 + (path.level * 5);
          setUserStats(prev => ({
            ...prev,
            xp: prev.xp + xpGain,
            attributes: {
              ...prev.attributes,
              [path.primaryAttribute]: prev.attributes[path.primaryAttribute] + 2,
              ...Object.fromEntries(
                path.attributes
                  .filter(attr => attr !== path.primaryAttribute)
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <Header userStats={userStats} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

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

            {paths.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-purple-800/30">
                <h3 className="text-xl font-bold mb-2">No Active Paths</h3>
                <p className="text-gray-400 mb-4">Start your journey by creating a new path!</p>
                <button
                  onClick={() => setShowNewPath(true)}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
                >
                  Create Your First Path
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paths.map(path => (
                  <PathCard
                    key={path.id}
                    path={path}
                    onDelete={deletePath}
                    onTogglePrerequisite={togglePrerequisite}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-center">Attribute Distribution</h3>
              <RadarChart attributes={userStats.attributes} />
            </div>
            <div className="bg-gray-900/50 border border-purple-800/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Attributes</h3>
              <AttributeList attributes={userStats.attributes} />
            </div>
          </div>
        )}

        {/* Evolution Tab */}
        {activeTab === 'evolution' && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold mb-2">Coming Soon!</h3>
            <p className="text-gray-400">
              The evolution system is currently under development.
            </p>
          </div>
        )}

        {/* Modals */}
        {showNewPath && (
          <NewPathModal
            isOpen={showNewPath}
            onClose={() => setShowNewPath(false)}
            onCreatePath={createPath}
            onShowCustomPath={() => {
              setShowNewPath(false);
              setShowCustomPath(true);
            }}
          />
        )}

        {showCustomPath && (
          <CustomPathForm
            onSubmit={createCustomPath}
            onClose={() => setShowCustomPath(false)}
          />
        )}
      </div>
    </main>
  );
}

export default Zero2OneApp;

