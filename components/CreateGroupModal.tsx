import React, { useState, useRef } from 'react';
import { User } from '../types';
import { ALL_CONTACTS } from '../constants';
import { Search, X, ArrowRight, ArrowLeft, Camera, Check, Users, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, participantIds: string[], description: string, avatar: string | null) => void;
  currentUser: User;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onCreateGroup, currentUser }) => {
  const [step, setStep] = useState<1 | 2>(1); // 1: Select Members, 2: Group Info
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredContacts = ALL_CONTACTS.filter(user => 
    user.id !== currentUser.id && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const toggleContact = (id: string) => {
    setSelectedContactIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleCreate = () => {
    if (!groupName.trim()) return;
    onCreateGroup(groupName, selectedContactIds, groupDescription, avatarPreview);
    // Reset state
    setStep(1);
    setSelectedContactIds([]);
    setGroupName('');
    setGroupDescription('');
    setAvatarPreview(null);
    setSearchTerm('');
    onClose();
  };

  const handleClose = () => {
      setStep(1);
      setSearchTerm('');
      onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
           {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-[#181818] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col h-[650px] max-h-[85vh] z-10"
          >
             {/* Header */}
             <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-white/5 backdrop-blur-md">
                 <div className="flex items-center gap-3">
                     {step === 2 && (
                         <button onClick={() => setStep(1)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                             <ArrowRight size={20} className="text-gray-600 dark:text-gray-300" />
                         </button>
                     )}
                     <div>
                         <h3 className="text-lg font-black text-gray-900 dark:text-white">
                             {step === 1 ? 'گروه جدید' : 'مشخصات گروه'}
                         </h3>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                             {step === 1 ? `${selectedContactIds.length} نفر انتخاب شده` : 'نام، تصویر و توضیحات گروه را تعیین کنید'}
                         </p>
                     </div>
                 </div>
                 <button 
                    onClick={handleClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-500 dark:text-gray-300 transition-colors"
                 >
                    <X size={18} />
                 </button>
             </div>

             {/* STEP 1: SELECT MEMBERS */}
             {step === 1 && (
                 <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="flex-1 flex flex-col overflow-hidden"
                 >
                     {/* Search */}
                     <div className="p-4 bg-gray-50 dark:bg-[#121212]">
                         <div className="relative group">
                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-peikan-700 transition-colors">
                                <Search size={20} />
                            </div>
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="جستجو افراد..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl py-3 pr-11 pl-4 focus:border-peikan-700 focus:ring-4 focus:ring-peikan-700/10 outline-none transition-all placeholder-gray-400 text-sm font-medium"
                            />
                         </div>
                     </div>

                     {/* Horizontal Selected List */}
                     {selectedContactIds.length > 0 && (
                         <div className="px-4 py-3 flex gap-3 overflow-x-auto custom-scrollbar border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#181818]">
                             {selectedContactIds.map(id => {
                                 const user = ALL_CONTACTS.find(u => u.id === id);
                                 if (!user) return null;
                                 return (
                                     <motion.div 
                                        key={id}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex flex-col items-center gap-1 min-w-[60px]"
                                     >
                                         <div className="relative">
                                             <img src={user.avatar} className="w-12 h-12 rounded-full object-cover" alt={user.name} />
                                             <button 
                                                onClick={() => toggleContact(id)}
                                                className="absolute -top-1 -right-1 bg-gray-500 text-white rounded-full p-0.5 border-2 border-white dark:border-[#181818] hover:bg-red-500 transition-colors"
                                             >
                                                 <X size={10} />
                                             </button>
                                         </div>
                                         <span className="text-[10px] text-gray-900 dark:text-white truncate max-w-full font-medium">{user.name.split(' ')[0]}</span>
                                     </motion.div>
                                 )
                             })}
                         </div>
                     )}

                     {/* Contact List */}
                     <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                         {filteredContacts.map(contact => {
                             const isSelected = selectedContactIds.includes(contact.id);
                             return (
                                 <motion.div
                                    key={contact.id}
                                    onClick={() => toggleContact(contact.id)}
                                    className={`flex items-center gap-3.5 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent ${
                                        isSelected 
                                            ? 'bg-peikan-50 dark:bg-peikan-900/20 border-peikan-100 dark:border-peikan-900/30' 
                                            : 'hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                                 >
                                     <div className="relative">
                                         <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                                         {isSelected && (
                                             <div className="absolute bottom-0 right-0 w-4 h-4 bg-peikan-700 border-2 border-white dark:border-[#181818] rounded-full flex items-center justify-center">
                                                 <Check size={10} className="text-white" strokeWidth={3} />
                                             </div>
                                         )}
                                     </div>
                                     <div className="flex-1 min-w-0">
                                         <h4 className={`font-bold text-sm transition-colors ${isSelected ? 'text-peikan-900 dark:text-peikan-400' : 'text-gray-900 dark:text-white'}`}>{contact.name}</h4>
                                         <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{contact.bio || 'بدون بیوگرافی'}</p>
                                     </div>
                                 </motion.div>
                             );
                         })}
                     </div>
                     
                     {/* Next Button */}
                     <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#181818]">
                         <button 
                            disabled={selectedContactIds.length === 0}
                            onClick={() => setStep(2)}
                            className="w-full h-12 bg-peikan-700 hover:bg-peikan-800 disabled:bg-gray-300 disabled:dark:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-peikan-700/20 disabled:shadow-none"
                         >
                             <span>ادامه</span>
                             <ArrowLeft size={20} />
                         </button>
                     </div>
                 </motion.div>
             )}

             {/* STEP 2: GROUP INFO */}
             {step === 2 && (
                 <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="flex-1 flex flex-col items-center p-6 overflow-y-auto custom-scrollbar"
                 >
                     {/* Avatar Upload */}
                     <div className="relative group cursor-pointer mb-8" onClick={() => fileInputRef.current?.click()}>
                         <div className={`w-32 h-32 rounded-full flex items-center justify-center border-2 border-dashed transition-all overflow-hidden ${avatarPreview ? 'border-transparent' : 'bg-peikan-50 dark:bg-white/5 border-peikan-300 dark:border-white/20 group-hover:border-peikan-700'}`}>
                             {avatarPreview ? (
                               <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                             ) : (
                               <Camera size={36} className="text-peikan-700 dark:text-peikan-400" />
                             )}
                         </div>
                         <div className="absolute bottom-0 right-0 w-9 h-9 bg-peikan-700 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-[#181818] shadow-md">
                             <ImageIcon size={16} />
                         </div>
                         <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                         />
                     </div>

                     {/* Name Input */}
                     <div className="w-full space-y-2 mb-6">
                         <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                             <Users size={16} className="text-peikan-700" />
                             نام گروه
                         </label>
                         <input 
                            autoFocus
                            type="text" 
                            placeholder="مثلاً: تیم طراحی محصول"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 focus:ring-4 focus:ring-peikan-700/10 outline-none transition-all text-gray-900 dark:text-white font-bold"
                         />
                     </div>

                     {/* Description Input */}
                     <div className="w-full space-y-2 mb-8">
                         <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                             <FileText size={16} className="text-peikan-700" />
                             توضیحات (اختیاری)
                         </label>
                         <textarea 
                            rows={3}
                            placeholder="توضیحاتی در مورد اهداف گروه..."
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 focus:ring-4 focus:ring-peikan-700/10 outline-none transition-all text-gray-900 dark:text-white font-medium text-sm resize-none"
                         />
                     </div>

                     <div className="w-full mt-auto">
                        <button 
                            disabled={!groupName.trim()}
                            onClick={handleCreate}
                            className="w-full h-12 bg-peikan-700 hover:bg-peikan-800 disabled:bg-gray-300 disabled:dark:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-peikan-700/20 disabled:shadow-none"
                        >
                            <span>ایجاد گروه</span>
                            <Check size={20} />
                        </button>
                     </div>
                 </motion.div>
             )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateGroupModal;