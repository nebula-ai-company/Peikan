import React, { useState } from 'react';
import { User } from '../types';
import { ALL_CONTACTS } from '../constants';
import { Search, X, UserPlus, Phone, Users, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (userId: string) => void;
  onOpenCreateGroup: () => void;
  currentUser: User;
}

const ContactsModal: React.FC<ContactsModalProps> = ({ 
    isOpen, 
    onClose, 
    onStartChat, 
    onOpenCreateGroup, 
    currentUser 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = ALL_CONTACTS.filter(user => 
    user.id !== currentUser.id && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-[#181818] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col max-h-[80vh] z-10"
          >
             {/* Modal Header */}
             <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-white/5 backdrop-blur-md">
                 <div>
                     <h3 className="text-lg font-black text-gray-900 dark:text-white">مخاطبین</h3>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">انتخاب کنید یا جستجو کنید</p>
                 </div>
                 <button 
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-500 dark:text-gray-300 transition-colors"
                 >
                    <X size={18} />
                 </button>
             </div>

             {/* Search Input */}
             <div className="p-4 bg-gray-50 dark:bg-[#121212]">
                 <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-peikan-700 transition-colors">
                        <Search size={20} />
                    </div>
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="نام، شماره موبایل یا ایمیل..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl py-3.5 pr-11 pl-4 focus:border-peikan-700 focus:ring-4 focus:ring-peikan-700/10 outline-none transition-all placeholder-gray-400 text-sm font-medium"
                    />
                 </div>
             </div>

             {/* Contacts List */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                 {/* Create Group Button (Top Item) */}
                 <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                        onClose(); // Close contacts modal
                        onOpenCreateGroup(); // Open group modal
                    }}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors group mb-1"
                 >
                     <div className="w-12 h-12 rounded-full bg-peikan-100 dark:bg-peikan-900/30 flex items-center justify-center text-peikan-700 dark:text-peikan-400">
                         <Users size={22} />
                     </div>
                     <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-peikan-700 transition-colors">ایجاد گروه جدید</h4>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">افزودن چندین نفر به یک گفتگو</p>
                     </div>
                 </motion.div>

                 {/* Divider */}
                 <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-3" />

                 {filteredContacts.length > 0 ? (
                     <div className="space-y-1">
                         {filteredContacts.map(contact => (
                             <motion.div
                                key={contact.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => {
                                    onStartChat(contact.id);
                                    setSearchTerm('');
                                    onClose();
                                }}
                                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                             >
                                 <div className="relative">
                                     <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                                     <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#181818] ${
                                         contact.status === 'online' ? 'bg-green-500' : 
                                         contact.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                                     }`}></div>
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-peikan-700 transition-colors">{contact.name}</h4>
                                     <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{contact.bio || 'بدون بیوگرافی'}</p>
                                 </div>
                                 <div className="text-gray-400 group-hover:text-peikan-700 transition-colors">
                                     <UserPlus size={20} strokeWidth={1.5} />
                                 </div>
                             </motion.div>
                         ))}
                     </div>
                 ) : (
                     <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                         <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                             <Search size={32} className="opacity-50" />
                         </div>
                         <p className="text-sm font-medium">کاربری یافت نشد</p>
                     </div>
                 )}
                 
                 {/* Invite Section (Mock) */}
                 {searchTerm && filteredContacts.length === 0 && (
                     <div className="border-t border-gray-100 dark:border-white/5 mt-4 pt-4 px-2">
                         <p className="text-xs font-bold text-gray-500 mb-2 px-2">دعوت به پیکان</p>
                         <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-left transition-colors">
                             <div className="w-10 h-10 rounded-full bg-peikan-100 dark:bg-peikan-900/30 flex items-center justify-center text-peikan-700 dark:text-peikan-400">
                                 <Phone size={18} />
                             </div>
                             <div className="flex-1">
                                 <h4 className="font-bold text-sm text-gray-900 dark:text-white dir-ltr text-right">{searchTerm}</h4>
                                 <p className="text-xs text-peikan-700 dark:text-peikan-400 mt-0.5">ارسال دعوت‌نامه پیامکی</p>
                             </div>
                         </button>
                     </div>
                 )}
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactsModal;