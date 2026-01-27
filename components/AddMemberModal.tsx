import React, { useState } from 'react';
import { User } from '../types';
import { ALL_CONTACTS } from '../constants';
import { Search, X, Check, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMembers: User[];
  onAddMembers: (userIds: string[]) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, currentMembers, onAddMembers }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter out users who are already in the group
  const availableContacts = ALL_CONTACTS.filter(user => 
    !currentMembers.some(member => member.id === user.id) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (selectedIds.length > 0) {
      onAddMembers(selectedIds);
      setSelectedIds([]);
      setSearchTerm('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-[#181818] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] z-10"
          >
             <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                 <h3 className="text-lg font-black text-gray-900 dark:text-white">افزودن عضو جدید</h3>
                 <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                    <X size={20} className="text-gray-500" />
                 </button>
             </div>

             <div className="p-4 bg-gray-50 dark:bg-[#121212]">
                 <div className="relative">
                    <Search className="absolute right-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="جستجو..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:border-peikan-700 outline-none dark:text-white"
                    />
                 </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                 {availableContacts.length === 0 ? (
                     <div className="text-center py-8 text-gray-400 text-sm">مخاطبی یافت نشد</div>
                 ) : (
                     availableContacts.map(user => {
                         const isSelected = selectedIds.includes(user.id);
                         return (
                             <div 
                                key={user.id}
                                onClick={() => toggleSelection(user.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-peikan-50 dark:bg-peikan-900/20' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                             >
                                 <div className="relative">
                                     <img src={user.avatar} className="w-10 h-10 rounded-full" alt={user.name} />
                                     {isSelected && (
                                         <div className="absolute -bottom-1 -right-1 bg-peikan-700 text-white rounded-full p-0.5 border-2 border-white dark:border-[#181818]">
                                             <Check size={10} />
                                         </div>
                                     )}
                                 </div>
                                 <div className="flex-1">
                                     <h4 className={`text-sm font-bold ${isSelected ? 'text-peikan-900 dark:text-peikan-400' : 'text-gray-900 dark:text-white'}`}>{user.name}</h4>
                                 </div>
                             </div>
                         );
                     })
                 )}
             </div>

             <div className="p-4 border-t border-gray-100 dark:border-white/5">
                 <button 
                    disabled={selectedIds.length === 0}
                    onClick={handleAdd}
                    className="w-full bg-peikan-700 hover:bg-peikan-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                 >
                     <UserPlus size={18} />
                     <span>افزودن ({selectedIds.length})</span>
                 </button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddMemberModal;