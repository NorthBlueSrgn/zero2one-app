import React, { useState } from 'react';
import { Plus, Trophy, Flame } from 'lucide-react';

const Zero2OneApp = () => {
  const [activeTab, setActiveTab] = useState('paths');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-800/50 bg-black/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Zero2One
              </h1>
              <div className="text-sm text-purple-300">
                Rank E • 0/270 XP
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>0 day streak</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>0 titles</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/30">
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
        {activeTab === 'paths' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Paths</h2>
              <button
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Path</span>
              </button>
            </div>
            <div className="text-center text-gray-400 py-12">
              No active paths. Click "New Path" to begin your journey!
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="text-center text-gray-400 py-12">
            Stats will appear here as you progress on your paths.
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="text-center text-gray-400 py-12">
            Path evolution tracks will appear here once you create paths.
          </div>
        )}
      </main>
    </div>
  );
};

export default Zero2OneApp;
