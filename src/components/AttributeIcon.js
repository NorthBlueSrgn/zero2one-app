// src/components/ui/AttributeIcon.jsx
import React from 'react';
import { Heart, Brain, Dumbbell, Palette, Shield, Sun } from 'lucide-react';

const iconMap = {
  spiritual: Sun,
  health: Heart,
  intelligence: Brain,
  physical: Dumbbell,
  creativity: Palette,
  resilience: Shield
};

export const AttributeIcon = ({ attribute, className }) => {
  const Icon = iconMap[attribute] || Shield;
  return <Icon className={className} />;
};
