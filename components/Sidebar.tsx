import React, { useState } from 'react';
import { User, Chat } from '../types';
import { Search, PenSquare, Menu, Settings, Moon, Sun, LogOut } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-white dark:bg-dark-surface border-l border-gray-200 dark:border-dark-border">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
               <img src={currentUser.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-dark-surface" />
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-dark-surface rounded-full"></div>
            </div>
            <div>
               <h3 className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-peikan-700 transition-colors">پیکان</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400">آنلاین</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 rounded-full transition-colors"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
                onClick={onLogout}
                className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-full transition-colors"
                title="خروج"
            >
                <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 dark:bg-[#2A2A2A] text-gray-900 dark:text-white text-sm rounded-xl py-2.5 pr-10 pl-4 focus:ring-2 focus:ring-peikan-300 dark:focus:ring-peikan-800 transition-all outline-none placeholder-gray-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredChats.map(chat => {
          const isActive = chat.id === activeChatId;
          const lastMsg = chat.messages[chat.messages.length - 1];
          
          return (
            <div 
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center gap-3 p-3 mx-2 my-1 rounded-xl cursor-pointer transition-all ${
                isActive 
                  ? 'bg-peikan-700 shadow-md shadow-peikan-200 dark:shadow-none' 
                  : 'hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative shrink-0">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                {chat.type === 'direct' && chat.participants[0].status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-dark-surface rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {chat.name}
                  </h4>
                  {lastMsg && (
                    <span className={`text-[11px] ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                      {lastMsg.timestamp}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate ${isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {lastMsg 
                        ? (lastMsg.senderId === 'me' ? 'شما: ' : '') + 
                          (lastMsg.type === 'image' ? '🖼 تصویر' : 
                           lastMsg.type === 'voice' ? '🎤 پیام صوتی' : 
                           lastMsg.type === 'file' ? '📎 فایل' : lastMsg.content)
                        : 'پیامی نیست'}
                  </p>
                  
                  {chat.unreadCount > 0 && (
                    <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white text-peikan-700' : 'bg-peikan-500 text-white'
                    }`}>
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB (New Chat) */}
      <div className="absolute bottom-6 left-6">
        <button className="bg-peikan-600 hover:bg-peikan-700 text-white p-4 rounded-full shadow-lg shadow-peikan-300 dark:shadow-black/50 transition-transform hover:scale-105 active:scale-95">
          <PenSquare size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;