const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = ['paths', 'stats', 'evolution'];

  return (
    <div className="flex space-x-4 mb-6">
      {tabs.map(tab => (
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
  );
};

export default Navigation;
