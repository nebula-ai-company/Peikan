
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Radio, Plus, Megaphone, Pin } from 'lucide-react';
import { Chat } from '../../../../types';

interface ChannelSidebarProps {
    channels: Chat[];
    selectedChannelId: string | null;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onSelect: (id: string) => void;
    onCreateClick: () => void;
}

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({ 
    channels, selectedChannelId, searchTerm, onSearchChange, onSelect, onCreateClick 
}) => {
    const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const pinnedChannels = filteredChannels.filter(c => c.isPinned);
    const otherChannels = filteredChannels.filter(c => !c.isPinned);

    const ChannelItem: React.FC<{ channel: Chat }> = ({ channel }) => {
        const isSelected = selectedChannelId === channel.id;
        return (
            <motion.div 
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onSelect(channel.id)}
                className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    isSelected 
                    ? 'bg-peikan-50 dark:bg-peikan-900/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/5'
                }`}
            >
                {/* Active Indicator Bar */}
                {isSelected && (
                    <motion.div 
                        layoutId="active-indicator"
                        className="absolute right-0 top-3 bottom-3 w-1 bg-peikan-700 rounded-l-full shadow-[0_0_10px_rgba(13,71,161,0.5)]" 
                    />
                )}

                <div className="relative shrink-0">
                    <img 
                        src={channel.avatar} 
                        alt={channel.name} 
                        className={`w-12 h-12 rounded-2xl object-cover transition-transform duration-300 ${isSelected ? 'scale-105 ring-2 ring-white dark:ring-[#1e1e1e] shadow-md' : 'group-hover:scale-105'}`} 
                    />
                </div>
                
                <div className="flex-1 min-w-0 pr-1">
                    <div className="flex justify-between items-center mb-0.5">
                        <h4 className={`font-bold text-sm truncate transition-colors ${isSelected ? 'text-peikan-900 dark:text-peikan-100' : 'text-gray-700 dark:text-gray-200'}`}>
                            {channel.name}
                        </h4>
                        {channel.isPinned && <Pin size={12} className="text-amber-500 fill-amber-500 rotate-45" />}
                    </div>
                    <div className="flex items-center justify-between">
                        <p className={`text-xs truncate max-w-[140px] ${isSelected ? 'text-peikan-600/80 dark:text-peikan-300/70' : 'text-gray-400'}`}>
                            {channel.description || 'بدون توضیحات'}
                        </p>
                        {channel.participants.length > 0 && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white dark:bg-black/20 text-peikan-700 dark:text-peikan-300' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>
                                {channel.participants.length}
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full md:w-80 flex flex-col bg-white dark:bg-[#1e1e1e] rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 overflow-hidden shrink-0 h-full">
            {/* Header */}
            <div className="p-6 pb-4 bg-white dark:bg-[#1e1e1e] z-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-gray-900 dark:text-white text-xl flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-peikan-50 dark:bg-peikan-900/20 rounded-2xl text-peikan-700 dark:text-peikan-400 flex items-center justify-center">
                            <Radio size={20} />
                        </div>
                        <span>کانال‌ها</span>
                    </h3>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onCreateClick}
                        className="w-10 h-10 flex items-center justify-center bg-peikan-700 text-white rounded-xl shadow-lg shadow-peikan-700/20 hover:bg-peikan-800 transition-all"
                        title="ایجاد کانال جدید"
                    >
                        <Plus size={20} />
                    </motion.button>
                </div>
                
                <div className="relative group">
                    <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-peikan-700 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="جستجو..." 
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pr-11 pl-4 text-sm outline-none focus:border-peikan-700 focus:ring-4 focus:ring-peikan-700/10 transition-all font-bold placeholder-gray-400 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            {/* List Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-6">
                {filteredChannels.length > 0 ? (
                    <>
                        {pinnedChannels.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-extrabold text-gray-400 px-2 flex items-center gap-1 uppercase tracking-wider">
                                    <Pin size={10} />
                                    سنجاق شده
                                </h4>
                                <div className="space-y-1">
                                    {pinnedChannels.map(channel => (
                                        <ChannelItem key={channel.id} channel={channel} />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            {pinnedChannels.length > 0 && (
                                <h4 className="text-[11px] font-extrabold text-gray-400 px-2 mt-4 uppercase tracking-wider">سایر کانال‌ها</h4>
                            )}
                            <div className="space-y-1">
                                {otherChannels.map(channel => (
                                    <ChannelItem key={channel.id} channel={channel} />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center px-4 pb-12">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Search size={32} className="opacity-20 text-peikan-700" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-300">کانالی یافت نشد</p>
                        <p className="text-xs mt-1 opacity-60 max-w-[150px]">
                            {searchTerm ? 'عبارت جستجو را تغییر دهید' : 'برای شروع یک کانال جدید ایجاد کنید'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChannelSidebar;
