import React, { useState } from 'react';
import { Plus, Trophy, Flame } from 'lucide-react';
import { NewPathModal } from './NewPathModal';

const Zero2OneApp = () => {
  const [activeTab, setActiveTab] = useState('paths');
  const [showNewPath, setShowNewPath] = useState(false);
  const [paths, setPaths] = useState([]);

  const createPath = (pathKey) => {
    const newPath = {
      id: Date.now(),
      key: pathKey,
      level: 1,
      streak: 0,
      completedToday: [],
      // We'll add more properties as we build features
    };

    setPaths(prev => [...prev, newPath]);
    setShowNewPath(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header - Same as before */}
      <header className="border-b border-purple-800/50 bg-black/50">
        {/* ... header content ... */}
      </header>

      {/* Navigation - Same as before */}
      <nav className="bg-black/30">
        {/* ... navigation content ... */}
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
            
            {paths.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                No active paths. Click "New Path" to begin your journey!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paths.map(path => (
                  <div 
                    key={path.id}
                    className="bg-gray-800 rounded-lg p-4 border border-purple-500/20"
                  >
                    <div className="text-xl mb-2">
                      Path: {path.key}
                    </div>
                    <div className="text-sm text-gray-400">
                      Level: {path.level} • Streak: {path.streak}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other tabs remain the same */}
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

      {/* Modal */}
      {showNewPath && (
        <NewPathModal
          onClose={() => setShowNewPath(false)}
          onCreatePath={createPath}
        />
      )}
    </div>
  );
};

export default Zero2OneApp;
