// src/components/ui/ProgressBar.js
import React from 'react';

export const ProgressBar = ({ value, max, color = "purple" }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const colors = {
    purple: "from-purple-500 to-pink-500",
    green: "from-green-500 to-emerald-500",
    blue: "from-blue-500 to-cyan-500"
  };

  return (
    <div className="w-full bg-gray-800 rounded-full h-2">
      <div
        className={`bg-gradient-to-r ${colors[color]} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
