import React from 'react';
import { motion } from 'framer-motion';

interface SettingsToggleItemProps {
  icon?: any;
  title: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}

const SettingsToggleItem: React.FC<SettingsToggleItemProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  checked, 
  onChange 
}) => {
  return (
    <div 
      className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group select-none border border-transparent hover:border-gray-100 dark:hover:border-white/5" 
      onClick={onChange}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${checked ? 'bg-peikan-50 dark:bg-peikan-900/20 text-peikan-700 dark:text-peikan-400' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
            <Icon size={22} strokeWidth={1.5} />
          </div>
        )}
        <div>
          <span className={`block text-[15px] font-bold transition-colors ${checked ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {title}
          </span>
          {description && (
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block leading-relaxed max-w-[250px] sm:max-w-xs">
              {description}
            </span>
          )}
        </div>
      </div>
      
      {/* Premium Toggle Switch */}
      <div 
        className={`relative w-[52px] h-[32px] rounded-full p-[4px] transition-colors duration-300 ${checked ? 'bg-peikan-700' : 'bg-gray-200 dark:bg-white/10'}`}
        dir="ltr"
        style={{ isolation: 'isolate' }}
      >
        <motion.div 
          className="w-[24px] h-[24px] bg-white rounded-full shadow-sm"
          initial={false}
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 30, mass: 0.8 }}
          style={{ willChange: 'transform' }}
        />
      </div>
    </div>
  );
};

export default SettingsToggleItem;