// src/components/ui/AttributeIcon.js
import React from 'react';
import { Heart, Zap, Brain, Dumbbell, Palette, Shield } from 'lucide-react';

const attributeIcons = {
  spiritual: Heart,
  health: Zap,
  intelligence: Brain,
  physical: Dumbbell,
  creativity: Palette,
  resilience: Shield
};

export const AttributeIcon = ({ attribute, size = "w-5 h-5" }) => {
  const Icon = attributeIcons[attribute];
  const colors = {
    spiritual: "text-purple-400",
    health: "text-green-400",
    intelligence: "text-blue-400",
    physical: "text-red-400",
    creativity: "text-pink-400",
    resilience: "text-yellow-400"
  };
  
  return <Icon className={`${size} ${colors[attribute]}`} />;
};
