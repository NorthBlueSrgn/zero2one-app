// src/components/ui/RankBadge.js
import React from 'react';

export const RankBadge = ({ rank }) => {
  const colors = {
    'E': 'bg-gray-600',
    'D': 'bg-green-600',
    'C': 'bg-blue-600',
    'B': 'bg-purple-600',
    'A': 'bg-pink-600',
    'S': 'bg-yellow-600',
    'SS': 'bg-orange-600',
    'SSS': 'bg-red-600'
  };

  return (
    <div className={`${colors[rank]} px-2 py-1 rounded-full text-xs font-bold`}>
      {rank}
    </div>
  );
};
