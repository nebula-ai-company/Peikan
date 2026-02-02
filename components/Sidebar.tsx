import React, { useState } from 'react';
import { User, Chat } from '../types';
import { Search, Moon, Sun, LogOut, Settings, Plus, Pin, Megaphone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  currentUser: User;
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onOpenNewChat: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  chats, 
  activeChatId, 
  onSelectChat, 
  onOpenNewChat,
  isDarkMode, 
  toggleTheme,
  onLogout,
  onOpenSettings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'channels'>('chats');

  const filteredChats = chats
    .filter(chat => {
        const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'chats' 
            ? (chat.type === 'direct' || chat.type === 'group') 
            : chat.type === 'channel';
        return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      // Sort pinned chats to the top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0; 
    });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-surface border-l border-gray-200 dark:border-dark-border relative z-20 shadow-2xl md:shadow-none">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 bg-white dark:bg-dark-surface sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3.5 group cursor-pointer" onClick={onOpenSettings}>
            <div className="relative">
               <motion.img 
                 whileHover={{ scale: 1.05 }}
                 src={currentUser.avatar} 
                 alt="Profile" 
                 className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-white/5" 
               />
               <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[3px] border-white dark:border-dark-surface rounded-full"></div>
            </div>
            <div className="flex flex-col">
               <h3 className="font-extrabold text-gray-900 dark:text-white text-[15px] tracking-tight">{currentUser.name}</h3>
               <span className="text-xs font-medium text-gray-500 dark:text-gray-400">آنلاین</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={onOpenSettings}
                className="w-9 h-9 flex items-center justify-center text-gray-500 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
            >
                <Settings size={18} />
            </motion.button>
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center text-gray-500 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
            >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={onLogout}
                className="w-9 h-9 flex items-center justify-center text-gray-500 bg-gray-100 dark:bg-white/5 hover:bg-red-50 hover:text-red-500 dark:hover:bg-white/10 dark:hover:text-red-400 rounded-full transition-colors"
            >
                <LogOut size={18} />
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative group mb-4">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 dark:bg-[#151515] text-gray-900 dark:text-white text-sm rounded-xl py-3 pr-11 pl-4 focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-peikan-700/20 border border-transparent focus:border-peikan-700 transition-all outline-none placeholder-gray-500 font-medium"
          />
          <Search className="absolute right-3.5 top-3 text-gray-400 group-focus-within:text-peikan-700 transition-colors" size={20} />
        </div>

        {/* Section Tabs (Segmented Control) */}
        <div className="bg-gray-100 dark:bg-[#151515] p-1 rounded-xl flex items-center relative mb-2">
            <button 
                onClick={() => setActiveTab('chats')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all relative z-10 ${activeTab === 'chats' ? 'text-peikan-700 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
                <MessageCircle size={16} strokeWidth={2.5} />
                <span>گفتگوها</span>
            </button>
            <button 
                onClick={() => setActiveTab('channels')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all relative z-10 ${activeTab === 'channels' ? 'text-peikan-700 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
                <Megaphone size={16} strokeWidth={2.5} />
                <span>کانال‌ها</span>
            </button>
            
            {/* Sliding Background */}
            <motion.div 
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-[#252525] rounded-lg shadow-sm z-0"
                initial={false}
                animate={{ 
                    x: activeTab === 'chats' ? '0%' : '-100%' 
                }}
                style={{ right: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
        </div>
      </div>

      {/* Chat/Channel List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1.5 pb-4 pt-1">
        <AnimatePresence initial={false} mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'chats' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === 'chats' ? -20 : 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-1.5"
            >
              {filteredChats.length > 0 ? (
                  filteredChats.map((chat, i) => {
                    const isActive = chat.id === activeChatId;
                    const lastMsg = chat.messages[chat.messages.length - 1];
                    const isChannel = chat.type === 'channel';
                    
                    return (
                      <motion.div 
                        key={chat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        onClick={() => onSelectChat(chat.id)}
                        className={`relative flex items-center gap-3.5 p-3 rounded-xl cursor-pointer transition-colors duration-200 group isolate ${
                          isActive ? '' : 'hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                      >
                        {/* Gliding Active Background */}
                        {isActive && (
                          <motion.div
                            layoutId="activeChatBackground"
                            className="absolute inset-0 bg-peikan-700 rounded-xl shadow-lg shadow-peikan-700/25 -z-10"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 35, mass: 1 }}
                          />
                        )}

                        <div className="relative shrink-0">
                          <img 
                              src={chat.avatar} 
                              alt={chat.name} 
                              className={`w-[52px] h-[52px] ${isChannel ? 'rounded-2xl' : 'rounded-full'} object-cover transition-all ${
                                  isActive ? 'ring-2 ring-white/30' : ''
                              }`} 
                          />
                          {chat.type === 'direct' && chat.participants[0].status === 'online' && (
                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[2px] rounded-full ${isActive ? 'border-peikan-700' : 'border-white dark:border-dark-surface'}`}></div>
                          )}
                          {isChannel && (
                              <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-gray-100 dark:bg-dark-surface border-[2px] rounded-full flex items-center justify-center ${isActive ? 'border-peikan-700 text-peikan-700' : 'border-white dark:border-dark-surface text-gray-500'}`}>
                                  <Megaphone size={10} strokeWidth={3} />
                              </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                          <div className="flex justify-between items-center">
                            <h4 className={`text-[15px] font-bold truncate transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                              {chat.name}
                            </h4>
                            <div className="flex items-center gap-1.5">
                                {chat.isPinned && (
                                    <Pin size={12} className={`rotate-45 ${isActive ? 'text-white/80' : 'text-gray-400'}`} fill="currentColor" />
                                )}
                                {lastMsg && (
                                <span className={`text-[11px] font-medium transition-colors duration-200 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                                    {lastMsg.timestamp}
                                </span>
                                )}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className={`text-[13px] truncate leading-relaxed transition-colors duration-200 ${isActive ? 'text-white/80 font-normal' : 'text-gray-500 dark:text-gray-400'}`}>
                              {lastMsg 
                                  ? (lastMsg.senderId === 'me' ? 'شما: ' : '') + 
                                    (lastMsg.type === 'image' ? '🖼 تصویر' : 
                                     lastMsg.type === 'voice' ? '🎤 صدا' : 
                                     lastMsg.type === 'file' ? '📎 فایل' : lastMsg.content)
                                  : <span className="italic opacity-70">{isChannel ? 'بدون اعلان جدید' : 'پیامی نیست'}</span>}
                            </p>
                            
                            {chat.unreadCount > 0 && (
                              <span className={`flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[10px] font-bold rounded-full transition-colors duration-200 ${
                                  isActive ? 'bg-white text-peikan-700' : 'bg-peikan-700 text-white'
                                }`}>
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
              ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                          {activeTab === 'chats' ? <MessageCircle size={32} /> : <Megaphone size={32} />}
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {activeTab === 'chats' ? 'گفتگویی یافت نشد' : 'کانالی موجود نیست'}
                      </p>
                  </div>
              )}
            </motion.div>
        </AnimatePresence>
      </div>

      {/* New Chat Button (Fixed at Bottom) */}
      <div className="p-4 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-white/5 z-10">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenNewChat}
          className="w-full bg-peikan-700 hover:bg-peikan-800 text-white h-14 rounded-2xl shadow-xl shadow-peikan-700/30 flex items-center justify-center gap-2 transition-colors font-bold text-base"
        >
          <Plus size={24} strokeWidth={2.5} />
          <span>{activeTab === 'chats' ? 'شروع گفتگوی جدید' : 'ایجاد کانال جدید'}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;