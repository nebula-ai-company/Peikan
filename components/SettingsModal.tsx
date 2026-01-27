import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { 
  X, User as UserIcon, Bell, Shield, HardDrive, 
  LogOut, ChevronLeft, Palette
} from 'lucide-react';

// Import Section Components
import SettingsAccount from './settings/SettingsAccount';
import SettingsAppearance from './settings/SettingsAppearance';
import SettingsPrivacy from './settings/SettingsPrivacy';
import SettingsNotifications from './settings/SettingsNotifications';
import SettingsStorage from './settings/SettingsStorage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

type Category = 'account' | 'appearance' | 'privacy' | 'notifications' | 'storage';

const categories: { id: Category; label: string; icon: any }[] = [
  { id: 'account', label: 'حساب کاربری', icon: UserIcon },
  { id: 'appearance', label: 'ظاهر و قالب', icon: Palette },
  { id: 'privacy', label: 'حریم خصوصی', icon: Shield },
  { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
  { id: 'storage', label: 'داده‌ها و حافظه', icon: HardDrive },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  isDarkMode, 
  toggleTheme,
  onLogout
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>('account');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-[#181818] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-white/10"
      >
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#181818] z-10">
             <span className="font-bold text-gray-900 dark:text-white">تنظیمات</span>
             <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
             </button>
        </div>

        {/* Sidebar (Categories) */}
        <div className="w-full md:w-72 bg-gray-50/50 dark:bg-black/20 border-l border-gray-100 dark:border-white/5 p-4 flex flex-col overflow-x-auto md:overflow-visible flex-shrink-0">
          <div className="hidden md:flex items-center justify-between mb-8 px-2 pt-2">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">تنظیمات</h2>
          </div>

          <div className="flex md:flex-col gap-2 min-w-max md:min-w-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  activeCategory === cat.id 
                    ? 'text-peikan-700 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.div 
                    layoutId="activeSettingTab"
                    className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-gray-100 dark:border-white/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3 w-full">
                    <cat.icon size={20} strokeWidth={2} className={`${activeCategory === cat.id ? 'text-peikan-700 dark:text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                    <span className="font-bold text-sm flex-1 text-right">{cat.label}</span>
                    {activeCategory === cat.id && <ChevronLeft size={16} className="opacity-50" />}
                </span>
              </button>
            ))}
          </div>

          <div className="hidden md:block mt-auto pt-4 border-t border-gray-200 dark:border-white/5">
             <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-bold text-sm"
             >
                 <LogOut size={20} />
                 <span>خروج از حساب</span>
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex flex-col h-full overflow-hidden bg-white dark:bg-[#181818]">
            <div className="absolute top-4 left-4 hidden md:block z-10">
                <button 
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 pb-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-2xl mx-auto"
                    >
                        {activeCategory === 'account' && (
                            <SettingsAccount currentUser={currentUser} />
                        )}
                        {activeCategory === 'appearance' && (
                            <SettingsAppearance isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                        )}
                        {activeCategory === 'privacy' && (
                            <SettingsPrivacy />
                        )}
                        {activeCategory === 'notifications' && (
                            <SettingsNotifications />
                        )}
                        {activeCategory === 'storage' && (
                            <SettingsStorage />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Sticky Footer Buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#181818]/90 backdrop-blur-md border-t border-gray-100 dark:border-white/5 flex justify-end gap-3 z-10">
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    انصراف
                </button>
                <button onClick={onClose} className="px-8 py-2.5 rounded-xl font-bold text-white bg-peikan-700 hover:bg-peikan-800 shadow-lg shadow-peikan-700/20 transition-all active:scale-95">
                    ذخیره تغییرات
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;