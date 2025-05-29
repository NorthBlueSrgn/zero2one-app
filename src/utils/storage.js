// src/utils/storage.js
export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('zero2one_state', serializedState);
    } catch (err) {
      console.error('Error saving state:', err);
    }
  };
  
  export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('zero2one_state');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      console.error('Error loading state:', err);
      return undefined;
    }
  };
  
  // Decay calculation
  export const calculateDecay = (attributes, lastActive) => {
    const daysSinceActive = (Date.now() - lastActive) / (1000 * 60 * 60 * 24);
    if (daysSinceActive >= 4) {
      const decayRate = 0.05; // 5% decay per day after 4 days
      const decayMultiplier = Math.max(0, 1 - ((daysSinceActive - 4) * decayRate));
      
      return Object.entries(attributes).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: Math.floor(value * decayMultiplier)
      }), {});
    }
    return attributes;
  };