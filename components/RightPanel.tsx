import React from 'react';
import { Chat } from '../types';
import { X, Bell, Image as ImageIcon, FileText, Ban, Trash2, Link, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RightPanelProps {
  chat: Chat | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { 
            when: "beforeChildren",
            staggerChildren: 0.1 
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
        opacity: 1, 
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

const RightPanel: React.FC<RightPanelProps> = ({ chat, isOpen, onClose }) => {
  if (!chat) return null;

  return (
    <motion.div 
      initial={{ x: '-100%' }} // RTL: Start from left
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className={`fixed inset-y-0 right-auto left-0 w-80 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 z-30 shadow-2xl flex flex-col overflow-hidden md:relative md:w-80 md:shadow-none md:translate-x-0 ${isOpen ? 'block' : 'hidden md:hidden'}`}
    >
      {/* Header */}
      <div className="h-20 px-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4 bg-white/50 dark:bg-white/5">
        <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
        </button>
        <span className="font-extrabold text-lg text-gray-800 dark:text-gray-100">پروفایل کاربری</span>
      </div>

      <motion.div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={chat.id} // Re-animate on new chat
      >
        {/* Profile Info Card */}
        <motion.div variants={itemVariants} className="relative mb-6">
            <div className="h-28 bg-peikan-50 dark:bg-peikan-900/10"></div>
            <div className="px-6 -mt-14 flex flex-col items-center">
                 <motion.img 
                    whileHover={{ scale: 1.05 }}
                    src={chat.avatar} 
                    alt={chat.name} 
                    className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white dark:border-[#1a1a1a]" 
                 />
                 <h2 className="text-xl font-black text-gray-900 dark:text-white mt-4 text-center">{chat.name}</h2>
                 {chat.type === 'direct' && (
                     <p className={`text-sm font-medium mt-1 ${chat.participants.find(p => p.id !== 'me')?.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                         {chat.participants.find(p => p.id !== 'me')?.status === 'online' ? 'آنلاین' : 'آخرین بازدید به تازگی'}
                     </p>
                 )}
                 {chat.type === 'direct' && chat.participants[0].bio && (
                      <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-4 py-3 rounded-xl w-full">
                         {chat.participants[0].bio}
                      </p>
                 )}
            </div>
        </motion.div>

        {/* Actions */}
        <div className="px-4 pb-8 space-y-6">
            <motion.div variants={itemVariants} className="space-y-1">
                <h3 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">تنظیمات گفتگو</h3>
                
                <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3.5 text-gray-700 dark:text-gray-200">
                        <Bell size={20} className="text-gray-400 group-hover:text-peikan-700 transition-colors" />
                        <span className="text-sm font-bold">اعلان‌ها</span>
                    </div>
                    <div className="w-10 h-6 bg-peikan-100 dark:bg-peikan-900/50 rounded-full relative cursor-pointer border border-peikan-200 dark:border-peikan-800">
                        <div className="w-4 h-4 bg-peikan-700 rounded-full absolute top-1 left-1 shadow-sm"></div>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1">
                <h3 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">رسانه اشتراکی</h3>
                
                <button className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors group">
                    <ImageIcon size={20} className="text-gray-400 group-hover:text-peikan-700 transition-colors" />
                    <span className="text-sm font-bold flex-1 text-right">تصاویر و ویدیوها</span>
                    <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-xs font-mono">12</span>
                        <ChevronLeft size={16} />
                    </div>
                </button>

                <button className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors group">
                    <FileText size={20} className="text-gray-400 group-hover:text-peikan-700 transition-colors" />
                    <span className="text-sm font-bold flex-1 text-right">فایل‌ها</span>
                    <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-xs font-mono">3</span>
                        <ChevronLeft size={16} />
                    </div>
                </button>

                <button className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors group">
                    <Link size={20} className="text-gray-400 group-hover:text-peikan-700 transition-colors" />
                    <span className="text-sm font-bold flex-1 text-right">لینک‌ها</span>
                    <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-xs font-mono">5</span>
                        <ChevronLeft size={16} />
                    </div>
                </button>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2 pt-4 border-t border-gray-100 dark:border-white/5">
                <button className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors font-bold text-sm">
                    <Ban size={20} />
                    <span>مسدود کردن کاربر</span>
                </button>
                <button className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors font-bold text-sm">
                    <Trash2 size={20} />
                    <span>حذف تاریخچه گفتگو</span>
                </button>
            </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RightPanel;