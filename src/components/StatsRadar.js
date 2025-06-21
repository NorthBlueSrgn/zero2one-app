// src/components/StatsRadar.js
import React from 'react';

export const StatsRadar = ({ attributes }) => {
  const maxValue = Math.max(...Object.values(attributes));
  const normalizedValues = Object.entries(attributes).map(([key, value]) => ({
    name: key,
    value: (value / maxValue) * 100
  }));

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background circles */}
        {[80, 60, 40, 20].map(radius => (
          <circle
            key={radius}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(139, 69, 193, 0.2)"
            strokeWidth="1"
          />
        ))}
        
        {/* Radar lines */}
        {normalizedValues.map((_, index) => {
          const angle = (index / normalizedValues.length) * 2 * Math.PI - Math.PI / 2;
          const x = 100 + Math.cos(angle) * 80;
          const y = 100 + Math.sin(angle) * 80;
          return (
            <line
              key={index}
              x1="100"
              y1="100"
              x2={x}
              y2={y}
              stroke="rgba(139, 69, 193, 0.3)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data polygon */}
        <polygon
          points={normalizedValues.map((item, index) => {
            const angle = (index / normalizedValues.length) * 2 * Math.PI - Math.PI / 2;
            const radius = (item.value / 100) * 80;
            const x = 100 + Math.cos(angle) * radius;
            const y = 100 + Math.sin(angle) * radius;
            return `${x},${y}`;
          }).join(' ')}
          fill="rgba(139, 69, 193, 0.3)"
          stroke="rgb(139, 69, 193)"
          strokeWidth="2"
        />
        
        {/* Labels */}
        {normalizedValues.map((item, index) => {
          const angle = (index / normalizedValues.length) * 2 * Math.PI - Math.PI / 2;
          const x = 100 + Math.cos(angle) * 95;
          const y = 100 + Math.sin(angle) * 95;
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-purple-300 font-medium"
            >
              {item.name.charAt(0).toUpperCase() + item.name.slice(1, 3)}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
