import { useState } from 'react';

const CustomPathForm = ({ onSubmit, onClose }) => {
  const [customPath, setCustomPath] = useState({
    name: '',
    prerequisites: ['', '', '']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customPath.name.trim()) return;
    onSubmit(customPath);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-800 rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Create Custom Path</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              disabled={!customPath.name.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-2 rounded-lg transition-colors font-medium"
            >
              Create Path
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomPathForm;
