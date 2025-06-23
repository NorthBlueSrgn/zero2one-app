import { Flame, Trophy } from 'lucide-react';

const Header = ({ userStats }) => {
  return (
    <div className="border-b border-purple-800/50 bg-black/50 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Zero2One
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="px-3 py-1 bg-purple-800/50 rounded-full font-bold">
                Rank {userStats.rank}
              </div>
              <div className="text-purple-300">
                {userStats.xp}/{userStats.xpToNext} XP
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>{userStats.streakDays} day streak</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>{userStats.totalTitles} titles</span>
            </div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
