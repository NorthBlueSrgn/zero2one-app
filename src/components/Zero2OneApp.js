// src/components/Zero2OneApp.js
import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Zap, Brain, Heart, Dumbbell, Palette, Shield, Star, Flame, Trash } from 'lucide-react';
import { RANKS, INITIAL_USER_STATS, PATH_TEMPLATES } from '../constants';
import { TaskItem } from './TaskItem';
import { PathCard } from './PathCard';
import { NewPathModal } from './NewPathModal';
import { CustomPathModal } from './CustomPathModal';
import { useTaskReset } from '../hooks/useTaskReset';
import { useNotifications } from '../hooks/useNotifications';

const Zero2OneApp = () => {
  // State Management
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : INITIAL_USER_STATS;
  });

  const [paths, setPaths] = useState(() => {
    const saved = localStorage.getItem('paths');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('paths');
  const [showNewPath, setShowNewPath] = useState(false);
  const [showCustomPath, setShowCustomPath] = useState(false);

  // Custom Hooks
  useTaskReset(setPaths);
  const { notifications, addNotification } = useNotifications();

  // Persistence
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
    localStorage.setItem('paths', JSON.stringify(paths));
  }, [userStats, paths]);

  // Path Management
  const createPath = (template) => {
    const newPath = {
      id: Date.now(),
      ...template,
      level: 1,
      dailyTasks: template.dailyTasks.map(task => ({
        ...task,
        completed: false,
      })),
      weeklyTasks: template.weeklyTasks.map(task => ({
        ...task,
        completedCount: 0,
      })),
      streak: 0,
      experience: 0,
      currentTitle: template.titles[0],
    };

    setPaths(prev => [...prev, newPath]);
    addNotification(`Started new path: ${template.name}`);
    setShowNewPath(false);
  };

  const removePath = (pathId) => {
    setPaths(prev => prev.filter(path => path.id !== pathId));
    addNotification('Path removed successfully');
  };

  // Task Completion
  const completeTask = (pathId, taskId, taskType) => {
    setPaths(prev => prev.map(path => {
      if (path.id !== pathId) return path;

      const tasks = taskType === 'daily' ? 'dailyTasks' : 'weeklyTasks';
      const updatedTasks = path[tasks].map(task => {
        if (task.id !== taskId) return task;
        
        if (taskType === 'daily') {
          return { ...task, completed: !task.completed };
        } else {
          return {
            ...task,
            completedCount: Math.min((task.completedCount || 0) + 1, task.frequency)
          };
        }
      });

      return {
        ...path,
        [tasks]: updatedTasks,
        experience: path.experience + 10,
        streak: calculateNewStreak(path, updatedTasks)
      };
    }));

    updateUserStats(10); // Basic XP gain
  };

  // UI Rendering
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
                <div className="px-3 py-1 bg-purple-800/50 rounded-full font-bold">
                  Rank {userStats.rank}
                </div>
                <div className="text-sm text-purple-300">
                  {userStats.xp}/{userStats.xpToNext} XP
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
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
        {activeTab === 'paths' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
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
                  onRemove={removePath}
                  onCompleteTask={completeTask}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showNewPath && (
        <NewPathModal
          onClose={() => setShowNewPath(false)}
          onCreatePath={createPath}
          onCustomPath={() => {
            setShowNewPath(false);
            setShowCustomPath(true);
          }}
        />
      )}

      {showCustomPath && (
        <CustomPathModal
          onClose={() => setShowCustomPath(false)}
          onCreate={createPath}
        />
      )}

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-up"
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Zero2OneApp;


