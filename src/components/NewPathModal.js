// src/components/NewPathModal.js
import React from 'react';
import { PATH_TEMPLATES } from '../constants';

export const NewPathModal = ({ onClose, onCreatePath, onCustomPath }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Choose Your Path</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {Object.entries(PATH_TEMPLATES).map(([key, template]) => (
            <button
              key={key}
              onClick={() => onCreatePath(template)}
              className="p-4 border border-gray-700 rounded-lg hover:border-purple-500 transition-colors text-left"
            >
              <div className="text-2xl mb-2">{template.icon}</div>
              <div className="font-medium">{template.name}</div>
              <div className="text-sm text-gray-400">{key}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {template.attributes.map(attr => (
                  <span 
                    key={attr}
                    className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-200"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={onCustomPath}
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors font-medium"
          >
            ✨ Create Custom Path
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
