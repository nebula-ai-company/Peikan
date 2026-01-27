import React from 'react';
import { Chat } from '../types';
import { X, Bell, Image as ImageIcon, FileText, Ban, Trash2, Link } from 'lucide-react';
import { motion } from 'framer-motion';

interface RightPanelProps {
  chat: Chat | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ chat, isOpen, onClose }) => {
  if (!chat) return null;

  return (
    <motion.div 
      initial={{ x: '-100%' }} // RTL: Start from left
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className={`fixed inset-y-0 right-auto left-0 w-80 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border z-30 shadow-2xl flex flex-col overflow-hidden md:relative md:w-80 md:shadow-none md:translate-x-0 ${isOpen ? 'block' : 'hidden md:hidden'}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center gap-3">
        <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
            <X size={20} />
        </button>
        <span className="font-bold text-gray-700 dark:text-gray-200">اطلاعات {chat.type === 'group' ? 'گروه' : 'مخاطب'}</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center mb-8">
            <img src={chat.avatar} alt={chat.name} className="w-24 h-24 rounded-full object-cover shadow-lg mb-4 ring-4 ring-gray-50 dark:ring-white/5" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 text-center">{chat.name}</h2>
            {chat.type === 'direct' && (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                    {chat.participants.find(p => p.id !== 'me')?.status === 'online' ? 'آنلاین' : 'آخرین بازدید به تازگی'}
                </p>
            )}
            {chat.type === 'direct' && chat.participants[0].bio && (
                 <p className="mt-3 text-center text-gray-600 dark:text-gray-300 text-sm px-4">
                    {chat.participants[0].bio}
                 </p>
            )}
        </div>

        {/* Actions */}
        <div className="space-y-6">
            <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">تنظیمات</h3>
                
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                        <Bell size={20} />
                        <span className="text-sm font-medium">اعلان‌ها</span>
                    </div>
                    <div className="w-10 h-5 bg-peikan-200 dark:bg-peikan-900 rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-peikan-600 rounded-full absolute -top-0 -left-0 shadow-sm"></div>
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">رسانه و فایل</h3>
                
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors">
                    <ImageIcon size={20} />
                    <span className="text-sm font-medium">تصاویر و ویدیوها</span>
                    <span className="mr-auto text-xs text-gray-400">۱۲</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors">
                    <FileText size={20} />
                    <span className="text-sm font-medium">فایل‌ها</span>
                    <span className="mr-auto text-xs text-gray-400">۳</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors">
                    <Link size={20} />
                    <span className="text-sm font-medium">لینک‌ها</span>
                    <span className="mr-auto text-xs text-gray-400">۵</span>
                </button>
            </div>

            <div className="space-y-1 pt-4 border-t border-gray-100 dark:border-dark-border">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors">
                    <Ban size={20} />
                    <span className="text-sm font-medium">مسدود کردن</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors">
                    <Trash2 size={20} />
                    <span className="text-sm font-medium">حذف گفتگو</span>
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RightPanel;