'use client';

import { useState } from 'react';
import { Plus, Trophy, Zap, Brain, Heart, Dumbbell, Palette, Shield } from 'lucide-react';
import PathCard from '@/components/paths/PathCard';
import NewPathModal from '@/components/paths/NewPathModal';
import CustomPathForm from '@/components/paths/CustomPathForm';
import RadarChart from '@/components/stats/RadarChart';
import AttributeList from '@/components/stats/AttributeList';
import Header from '@/components/shared/Header';
import Navigation from '@/components/shared/Navigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState('paths');
  const [paths, setPaths] = useState([]);
  const [showNewPath, setShowNewPath] = useState(false);
  const [showCustomPath, setShowCustomPath] = useState(false);
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
        return {
          ...path,
          completedToday: newCompleted,
          streak: newCompleted.length === path.prerequisites.length ? path.streak + 1 : path.streak
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
            onSubmit={(customPath) => {
              // Handle custom path creation
              setShowCustomPath(false);
            }}
            onClose={() => setShowCustomPath(false)}
          />
        )}
      </div>
    </main>
  );
}
