import React, { useState } from 'react';
import { User, Chat } from '../types';
import { Search, PenSquare, Moon, Sun, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentUser: User;
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  chats, 
  activeChatId, 
  onSelectChat, 
  isDarkMode, 
  toggleTheme,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-surface border-l border-gray-200 dark:border-dark-border relative z-20 shadow-xl md:shadow-none">
      {/* Glassmorphic Header */}
      <div className="px-5 py-6 border-b border-gray-100 dark:border-dark-border bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3.5 group cursor-pointer">
            <div className="relative">
               <motion.img 
                 whileHover={{ scale: 1.05 }}
                 src={currentUser.avatar} 
                 alt="Profile" 
                 className="w-12 h-12 rounded-full object-cover ring-4 ring-gray-50 dark:ring-white/5 shadow-sm" 
               />
               <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-[3px] border-white dark:border-dark-surface rounded-full"></div>
            </div>
            <div className="flex flex-col">
               <h3 className="font-extrabold text-gray-800 dark:text-white text-base tracking-tight group-hover:text-peikan-700 transition-colors">{currentUser.name}</h3>
               <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{currentUser.bio || 'آنلاین'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-full">
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:bg-white dark:hover:bg-white/10 hover:shadow-sm dark:text-gray-400 rounded-full transition-all"
            >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={onLogout}
                className="p-2 text-gray-500 hover:bg-white hover:text-red-500 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-red-400 hover:shadow-sm rounded-full transition-all"
            >
                <LogOut size={18} />
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <input
            type="text"
            placeholder="جستجو در گفتگوها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#202020] text-gray-900 dark:text-white text-sm rounded-2xl py-3.5 pr-11 pl-4 focus:bg-white dark:focus:bg-[#252525] focus:ring-2 focus:ring-peikan-200 dark:focus:ring-peikan-900/30 border border-transparent focus:border-peikan-700 dark:focus:border-peikan-700 transition-all outline-none placeholder-gray-400 font-medium shadow-inner"
          />
          <Search className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-peikan-700 transition-colors" size={20} />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-1">
        {filteredChats.map((chat, i) => {
          const isActive = chat.id === activeChatId;
          const lastMsg = chat.messages[chat.messages.length - 1];
          
          return (
            <motion.div 
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectChat(chat.id)}
              className={`relative group flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-peikan-700 shadow-md shadow-peikan-700/20' // Solid Blue
                  : 'hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative shrink-0">
                <img src={chat.avatar} alt={chat.name} className={`w-14 h-14 rounded-full object-cover transition-transform ${isActive ? 'ring-2 ring-white/30' : 'group-hover:scale-105'}`} />
                {chat.type === 'direct' && chat.participants[0].status === 'online' && (
                  <div className={`absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-[3px] rounded-full ${isActive ? 'border-peikan-700' : 'border-white dark:border-dark-surface'}`}></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                <div className="flex justify-between items-center">
                  <h4 className={`text-[15px] font-bold truncate ${isActive ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                    {chat.name}
                  </h4>
                  {lastMsg && (
                    <span className={`text-[11px] font-medium ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                      {lastMsg.timestamp}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate leading-relaxed ${isActive ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                    {lastMsg 
                        ? (lastMsg.senderId === 'me' ? 'شما: ' : '') + 
                          (lastMsg.type === 'image' ? '🖼 تصویر' : 
                           lastMsg.type === 'voice' ? '🎤 پیام صوتی' : 
                           lastMsg.type === 'file' ? '📎 فایل' : lastMsg.content)
                        : <span className="italic opacity-70">پیامی نیست</span>}
                  </p>
                  
                  {chat.unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[11px] font-bold rounded-full shadow-sm ${
                        isActive ? 'bg-white text-peikan-700' : 'bg-peikan-700 text-white'
                      }`}>
                      {chat.unreadCount}
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FAB (New Chat) */}
      <div className="absolute bottom-6 left-6 z-10">
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="bg-peikan-700 hover:bg-peikan-800 text-white w-14 h-14 rounded-2xl shadow-xl shadow-peikan-700/30 flex items-center justify-center backdrop-blur-sm"
        >
          <PenSquare size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;