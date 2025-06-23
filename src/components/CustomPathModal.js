// src/components/CustomPathModal.js
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export const CustomPathModal = ({ onClose, onCreate }) => {
  const [pathData, setPathData] = useState({
    name: '',
    icon: '⭐',
    color: 'from-purple-600 to-indigo-800',
    dailyTasks: [],
    weeklyTasks: [],
    titles: ['Novice', 'Adept', 'Master'],
    primaryAttribute: 'resilience',
    attributes: ['resilience']
  });

  const [newTask, setNewTask] = useState({
    name: '',
    type: 'daily',
    xpReward: 10,
    frequency: 1
  });

  const addTask = () => {
    if (!newTask.name) return;

    const taskList = newTask.type === 'daily' ? 'dailyTasks' : 'weeklyTasks';
    const task = {
      id: Date.now(),
      ...newTask,
      attributeRewards: {
        [pathData.primaryAttribute]: newTask.type === 'daily' ? 1 : 2
      }
    };

    setPathData(prev => ({
      ...prev,
      [taskList]: [...prev[taskList], task]
    }));

    setNewTask({
      name: '',
      type: 'daily',
      xpReward: 10,
      frequency: 1
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-800 rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Create Custom Path</h3>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Path Name"
            value={pathData.name}
            onChange={e => setPathData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-gray-800 rounded-lg px-4 py-2"
          />

          <div className="space-y-2">
            <h4 className="font-medium">Add Tasks</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Task Name"
                value={newTask.name}
                onChange={e => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                className="flex-1 bg-gray-800 rounded-lg px-4 py-2"
              />
              <select
                value={newTask.type}
                onChange={e => setNewTask(prev => ({ ...prev, type: e.target.value }))}
                className="bg-gray-800 rounded-lg px-4 py-2"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <button
                onClick={addTask}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Tasks</h4>
            {pathData.dailyTasks.map(task => (
              <div key={task.id} className="bg-gray-800 rounded-lg px-4 py-2">
                {task.name} (Daily)
              </div>
            ))}
            {pathData.weeklyTasks.map(task => (
              <div key={task.id} className="bg-gray-800 rounded-lg px-4 py-2">
                {task.name} (Weekly)
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => onCreate(pathData)}
            disabled={!pathData.name || (!pathData.dailyTasks.length && !pathData.weeklyTasks.length)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 py-2 rounded-lg"
          >
            Create Path
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
