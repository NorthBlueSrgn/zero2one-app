// Update the pathTemplates object in constants/index.js or at the top of your component:

const pathTemplates = {
  'gym': {
    name: 'Strength Path',
    icon: '💪',
    attributes: ['physical', 'health', 'resilience'],
    prerequisites: [
      {
        name: 'Workout Session',
        frequency: 'weekly',
        timesPerWeek: 4,
        xpReward: 15,
        attributeRewards: { physical: 2, health: 1 }
      },
      {
        name: 'Track Nutrition',
        frequency: 'daily',
        xpReward: 5,
        attributeRewards: { health: 1 }
      }
    ],
    titles: ['Beginner', 'Intermediate', 'Advanced'],
    color: 'from-red-600 to-orange-800'
  },
  'study': {
    name: 'Knowledge Path',
    icon: '📚',
    attributes: ['intelligence', 'resilience'],
    prerequisites: [
      {
        name: 'Study Session',
        frequency: 'daily',
        xpReward: 10,
        attributeRewards: { intelligence: 2 }
      },
      {
        name: 'Practice Problems',
        frequency: 'weekly',
        timesPerWeek: 3,
        xpReward: 20,
        attributeRewards: { intelligence: 2, resilience: 1 }
      }
    ],
    titles: ['Student', 'Scholar', 'Master'],
    color: 'from-blue-600 to-indigo-800'
  }
  // Add more templates as needed
};

// Update Zero2OneApp.js with the core functionality:

import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Flame } from 'lucide-react';

const Zero2OneApp = () => {
  // Basic state
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      attributes: {
        physical: 0,
        health: 0,
        intelligence: 0,
        creativity: 0,
        resilience: 0,
        spiritual: 0
      },
      xp: 0,
      rank: 'E'
    };
  });

  const [paths, setPaths] = useState(() => {
    const saved = localStorage.getItem('paths');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('paths');
  const [showNewPath, setShowNewPath] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
    localStorage.setItem('paths', JSON.stringify(paths));
  }, [userStats, paths]);

  // Calculate rank based on attribute values
  const calculateRank = (value) => {
    if (value >= 100) return 'SSS';
    if (value >= 85) return 'SS';
    if (value >= 70) return 'S';
    if (value >= 55) return 'A';
    if (value >= 40) return 'B';
    if (value >= 25) return 'C';
    if (value >= 10) return 'D';
    return 'E';
  };

  // Task completion handler
  const handleTaskComplete = (pathId, taskIndex) => {
    setPaths(prevPaths => {
      return prevPaths.map(path => {
        if (path.id !== pathId) return path;

        const task = path.prerequisites[taskIndex];
        const newProgress = { ...path.progress };
        
        if (task.frequency === 'weekly') {
          newProgress[taskIndex] = (newProgress[taskIndex] || 0) + 1;
          if (newProgress[taskIndex] > task.timesPerWeek) return path;
        } else {
          newProgress[taskIndex] = !newProgress[taskIndex];
        }

        // Award XP and attributes
        setUserStats(prev => {
          const newAttributes = { ...prev.attributes };
          Object.entries(task.attributeRewards).forEach(([attr, value]) => {
            newAttributes[attr] += value;
          });

          return {
            ...prev,
            attributes: newAttributes,
            xp: prev.xp + task.xpReward
          };
        });

        return {
          ...path,
          progress: newProgress
        };
      });
    });
  };

  // Create new path
  const createPath = (templateKey) => {
    const template = pathTemplates[templateKey];
    const newPath = {
      id: Date.now(),
      ...template,
      progress: {},
      createdAt: new Date().toISOString()
    };

    setPaths(prev => [...prev, newPath]);
    setShowNewPath(false);
  };

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
              <div className="px-2 py-1 bg-purple-600 rounded-lg">
                Rank {calculateRank(Object.values(userStats.attributes).reduce((a, b) => a + b) / 6)}
              </div>
              <div className="text-sm text-purple-300">
                {userStats.xp} XP
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map(path => (
            <div key={path.id} className={`bg-gradient-to-br ${path.color} p-6 rounded-lg`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{path.icon}</span>
                <h3 className="font-bold">{path.name}</h3>
              </div>
              
              <div className="space-y-2">
                {path.prerequisites.map((task, index) => (
                  <div 
                    key={index}
                    onClick={() => handleTaskComplete(path.id, index)}
                    className={`p-2 rounded cursor-pointer ${
                      task.frequency === 'weekly'
                        ? `bg-black/20 ${(path.progress[index] || 0) >= task.timesPerWeek ? 'bg-green-500/20' : ''}`
                        : `bg-black/20 ${path.progress[index] ? 'bg-green-500/20' : ''}`
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>{task.name}</span>
                      {task.frequency === 'weekly' && (
                        <span>{(path.progress[index] || 0)}/{task.timesPerWeek}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowNewPath(true)}
          className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 rounded-full p-4"
        >
          <Plus className="w-6 h-6" />
        </button>
      </main>

      {/* New Path Modal */}
      {showNewPath && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Choose a Path</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(pathTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => createPath(key)}
                  className="p-4 border border-purple-500/20 rounded-lg hover:border-purple-500"
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <div className="font-medium">{template.name}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNewPath(false)}
              className="w-full mt-4 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Zero2OneApp;
