import { attributeIcons } from '@/lib/constants';
import * as LucideIcons from 'lucide-react';

const AttributeList = ({ attributes }) => {
  return (
    <div className="space-y-3">
      {Object.entries(attributes).map(([attr, value]) => {
        const IconComponent = LucideIcons[attributeIcons[attr]];
        
        return (
          <div key={attr} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconComponent className="w-5 h-5 text-purple-400" />
              <span className="capitalize font-medium">{attr}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-24 bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${Math.min((value / 50) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm font-bold w-8 text-right">{value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttributeList;
