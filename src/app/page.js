'use client';

import { useState } from 'react';
import { Plus, Trophy, Zap, Brain, Heart, Dumbbell, Palette, Shield } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('paths');
  const [paths, setPaths] = useState([]);
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

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Zero2One
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-purple-300">
              {userStats.xp}/{userStats.xpToNext} XP
            </span>
          </div>
        </div>

        {/* Navigation */}
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

        {/* Content */}
        <div className="mt-8">
          {activeTab === 'paths' && <div>Paths content coming soon...</div>}
          {activeTab === 'stats' && <div>Stats content coming soon...</div>}
          {activeTab === 'evolution' && <div>Evolution content coming soon...</div>}
        </div>
      </div>
    </main>
  );
}
