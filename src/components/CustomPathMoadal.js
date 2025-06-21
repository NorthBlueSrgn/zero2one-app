// src/components/CustomPathModal.js
import React from 'react';

export const CustomPathModal = ({ customPath, setCustomPath, onClose, onCreate }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
    <div className="bg-gray-900 border border-purple-800 rounded-lg p-6 max-w-lg w-full mx-4">
      <h3 className="text-xl font-bold mb-4 text-white">Create Custom Path</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Path Name</label>
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
          <label className="block text-sm font-medium mb-2 text-white">
            Custom Prerequisites (Optional)
          </label>
          {customPath.prerequisites.map((prereq, index) => (
            <div key={index} className="mb-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prereq.name}
                  onChange={(e) => {
                    const newPrereqs = [...customPath.prerequisites];
                    newPrereqs[index] = { ...prereq, name: e.target.value };
                    setCustomPath(prev => ({ ...prev, prerequisites: newPrereqs }));
                  }}
                  placeholder={`Prerequisite ${index + 1}...`}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
                <select
                  value={prereq.frequency}
                  onChange={(e) => {
                    const newPrereqs = [...customPath.prerequisites];
                    newPrereqs[index] = { 
                      ...prereq, 
                      frequency: e.target.value,
                      timesPerWeek: e.target.value === 'weekly' ? 3 : undefined
                    };
                    setCustomPath(prev => ({ ...prev, prerequisites: newPrereqs }));
                  }}
                  className="w-24 bg-gray-800 border border-gray-600 rounded-lg px-2 py-2 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              {prereq.frequency === 'weekly' && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-400">Times per week:</span>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={prereq.timesPerWeek || 3}
                    onChange={(e) => {
                      const newPrereqs = [...customPath.prerequisites];
                      newPrereqs[index] = { 
                        ...prereq, 
                        timesPerWeek: parseInt(e.target.value) 
                      };
                      setCustomPath(prev => ({ ...prev, prerequisites: newPrereqs }));
                    }}
                    className="w-16 bg-gray-800 border border-gray-600 rounded-lg px-2 py-1 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              setCustomPath(prev => ({
                ...prev,
                prerequisites: [
                  ...prev.prerequisites,
                  { name: '', frequency: 'daily', xpReward: 5, attributeRewards: {} }
                ]
              }));
            }}
            className="text-sm text-purple-400 hover:text-purple-300 mt-2"
          >
            + Add prerequisite
          </button>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          onClick={onCreate}
          disabled={!customPath.name.trim()}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-2 rounded-lg transition-colors font-medium text-white"
        >
          Create Path
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);
