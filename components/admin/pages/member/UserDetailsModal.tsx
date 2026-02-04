
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Company } from '../../../../types';
import { 
    X, Mail, Phone, Calendar, Clock, Ban, Trash2, 
    Save, Edit3, Camera, Search, ChevronDown, Check, User as UserIcon, Building2, Briefcase
} from 'lucide-react';
import Toast from '../../../Toast';

interface UserDetailsModalProps {
    user: User;
    companies: Company[];
    onClose: () => void;
    onUpdate: (updatedUser: User) => void;
    onDelete: (userId: string) => void;
    onBlock: (userId: string) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ 
    user, companies, onClose, onUpdate, onDelete, onBlock 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    
    // Local State for Form Fields
    const [editedUser, setEditedUser] = useState<User>({ ...user });
    
    // Generate a valid mock email based on ID if real one missing
    const defaultEmail = user.email || `user_${user.id.substring(0, 6)}@peikan.ir`;
    const [email, setEmail] = useState(defaultEmail);
    const [phone, setPhone] = useState('09121234567');
    
    // Company Selection State
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [companySearch, setCompanySearch] = useState('');

    // Success State
    const [showSuccess, setShowSuccess] = useState(false);

    // Avatar Input Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        onUpdate({ ...editedUser, email });
        setShowSuccess(true);
        setIsEditing(false);
        setIsCompanyOpen(false);
    };

    const handleDelete = () => {
        if (window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
            onDelete(user.id);
            onClose();
        }
    };

    const handleBlock = () => {
        if (window.confirm('آیا از مسدود کردن این کاربر اطمینان دارید؟')) {
            onBlock(user.id);
            onClose();
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setEditedUser({ ...editedUser, avatar: imageUrl });
        }
    };

    const joinDate = '۱۴۰۲/۰۵/۱۵'; // Mock date
    const selectedCompany = companies.find(c => c.id === editedUser.companyId);
    
    // Filter Logic: Show top 5 if no search, otherwise show matches
    const filteredCompanies = companySearch.trim() === '' 
        ? companies.slice(0, 5) 
        : companies.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Global Toast */}
            <Toast 
                message="تغییرات با موفقیت ذخیره شد" 
                isVisible={showSuccess} 
                onClose={() => setShowSuccess(false)} 
                type="success"
            />

            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="relative w-full max-w-2xl bg-white dark:bg-[#1e1e1e] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col max-h-[90vh]"
            >
                {/* Header - Clean Style */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e1e1e] sticky top-0 z-20">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        {isEditing ? 'ویرایش اطلاعات کاربر' : 'مشخصات کاربر'}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <img 
                                src={editedUser.avatar} 
                                className="w-32 h-32 rounded-full border-4 border-white dark:border-[#1e1e1e] shadow-xl object-cover bg-gray-100 dark:bg-white/5" 
                                alt={editedUser.name} 
                            />
                            
                            {isEditing && (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                >
                                    <Camera size={28} />
                                    <span className="text-xs font-bold mt-1">تغییر تصویر</span>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            
                            {!isEditing && (
                                <span className={`absolute bottom-2 right-2 w-7 h-7 rounded-full border-4 border-white dark:border-[#1e1e1e] ${editedUser.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                            )}
                        </div>

                        {!isEditing && (
                            <div className="text-center mt-5">
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{editedUser.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400 font-bold text-base opacity-80">{editedUser.bio || 'کاربر سیستم'}</p>
                                
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <span className={`px-4 py-1.5 rounded-xl text-sm font-bold border ${editedUser.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                        {editedUser.role === 'admin' ? 'مدیر سیستم' : 'عضو رسمی'}
                                    </span>
                                    {selectedCompany && (
                                        <span className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold border bg-gray-50 text-gray-600 border-gray-200 dark:bg-white/10 dark:text-gray-300 dark:border-white/10">
                                            <Building2 size={14} />
                                            {selectedCompany.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="space-y-6">
                        {/* Name & Bio (Only in Edit Mode or if not centered above) */}
                        {isEditing && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">نام کامل</label>
                                    <div className="relative">
                                        <UserIcon size={18} className="absolute right-4 top-3.5 text-gray-400" />
                                        <input 
                                            type="text"
                                            value={editedUser.name}
                                            onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                                            className="w-full pl-4 pr-11 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-base font-bold text-gray-900 dark:text-white transition-all shadow-sm focus:bg-white dark:focus:bg-black/40"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">سمت / بیوگرافی</label>
                                    <div className="relative">
                                        <Briefcase size={18} className="absolute right-4 top-3.5 text-gray-400" />
                                        <input 
                                            type="text"
                                            value={editedUser.bio || ''}
                                            onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                                            className="w-full pl-4 pr-11 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-base font-bold text-gray-900 dark:text-white transition-all shadow-sm focus:bg-white dark:focus:bg-black/40"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">ایمیل سازمانی</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute right-4 top-3.5 text-gray-400" />
                                    <input 
                                        type="email"
                                        readOnly={!isEditing}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full pl-4 pr-12 py-3 rounded-xl outline-none text-base font-bold transition-all text-left dir-ltr shadow-sm ${
                                            isEditing 
                                            ? 'bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-peikan-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black/40' 
                                            : 'bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-300 cursor-default'
                                        }`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">شماره تماس</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute right-4 top-3.5 text-gray-400" />
                                    <input 
                                        type="tel"
                                        readOnly={!isEditing}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className={`w-full pl-4 pr-12 py-3 rounded-xl outline-none text-base font-bold transition-all text-left dir-ltr shadow-sm ${
                                            isEditing 
                                            ? 'bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-peikan-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-black/40' 
                                            : 'bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-300 cursor-default'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Read-Only Stats (Only in View Mode) */}
                        {!isEditing && (
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <span className="text-xs font-bold text-gray-400 block mb-2">تاریخ عضویت</span>
                                    <span className="text-sm font-black text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <Calendar size={16} className="text-peikan-700" />
                                        {joinDate}
                                    </span>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <span className="text-xs font-bold text-gray-400 block mb-2">آخرین فعالیت</span>
                                    <span className="text-sm font-black text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <Clock size={16} className="text-peikan-700" />
                                        {user.lastSeen || 'آنلاین'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Editable Role & Company (Only in Edit Mode) */}
                        {isEditing && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">نقش کاربری</label>
                                    <div className="relative">
                                        <select 
                                            value={editedUser.role || 'user'}
                                            onChange={(e) => setEditedUser({...editedUser, role: e.target.value as 'admin' | 'user'})}
                                            className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm font-bold text-gray-900 dark:text-white appearance-none cursor-pointer shadow-sm focus:bg-white dark:focus:bg-black/40"
                                        >
                                            <option value="user" className="text-gray-900 dark:text-white bg-white dark:bg-[#1e1e1e]">عضو رسمی</option>
                                            <option value="admin" className="text-gray-900 dark:text-white bg-white dark:bg-[#1e1e1e]">مدیر سیستم</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Custom Inline Company Selector */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">سازمان</label>
                                    <div className={`relative border rounded-xl overflow-hidden transition-all duration-300 shadow-sm ${isCompanyOpen ? 'border-peikan-700 ring-4 ring-peikan-700/10' : 'border-gray-200 dark:border-white/10'}`}>
                                        
                                        {/* Trigger Button */}
                                        <button 
                                            onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-black/20 hover:bg-white dark:hover:bg-white/5 transition-colors outline-none"
                                        >
                                            <span className="flex items-center gap-2 truncate">
                                                {selectedCompany ? (
                                                    <>
                                                        <img src={selectedCompany.logo} className="w-5 h-5 rounded-md object-cover" alt="" />
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedCompany.name}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-500">بدون سازمان</span>
                                                )}
                                            </span>
                                            <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isCompanyOpen ? 'rotate-180 text-peikan-700' : ''}`} />
                                        </button>

                                        {/* Inline Expanded Content */}
                                        <AnimatePresence>
                                            {isCompanyOpen && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="bg-white dark:bg-[#222] border-t border-gray-100 dark:border-white/5"
                                                >
                                                    <div className="p-3 space-y-3">
                                                        {/* Search Input */}
                                                        <div className="relative">
                                                            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                            <input 
                                                                type="text" 
                                                                placeholder="جستجو در سازمان‌ها..." 
                                                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg py-2.5 pr-10 pl-3 text-xs font-bold outline-none focus:border-peikan-700 text-gray-900 dark:text-white"
                                                                value={companySearch}
                                                                onChange={(e) => setCompanySearch(e.target.value)}
                                                                autoFocus
                                                            />
                                                        </div>
                                                        
                                                        {/* List */}
                                                        <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                                            <button 
                                                                onClick={() => { setEditedUser({...editedUser, companyId: undefined}); setIsCompanyOpen(false); }}
                                                                className={`w-full text-right px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${!editedUser.companyId ? 'bg-peikan-50 text-peikan-700 dark:bg-peikan-900/20 dark:text-peikan-400' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'}`}
                                                            >
                                                                <span>بدون سازمان</span>
                                                                {!editedUser.companyId && <Check size={16} />}
                                                            </button>
                                                            {filteredCompanies.length > 0 ? filteredCompanies.map(c => (
                                                                <button 
                                                                    key={c.id}
                                                                    onClick={() => { setEditedUser({...editedUser, companyId: c.id}); setIsCompanyOpen(false); }}
                                                                    className={`w-full text-right px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${editedUser.companyId === c.id ? 'bg-peikan-50 text-peikan-700 dark:bg-peikan-900/20 dark:text-peikan-400' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'}`}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <img src={c.logo} className="w-5 h-5 rounded-md object-cover shadow-sm" alt="" />
                                                                        <span>{c.name}</span>
                                                                    </div>
                                                                    {editedUser.companyId === c.id && <Check size={16} />}
                                                                </button>
                                                            )) : (
                                                                <div className="py-4 text-center text-gray-400 text-xs">سازمانی یافت نشد</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex flex-wrap gap-4 sticky bottom-0 z-20">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            >
                                انصراف
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex-[2] py-3.5 rounded-xl bg-peikan-700 hover:bg-peikan-800 text-white font-bold text-sm shadow-lg shadow-peikan-700/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                ذخیره تغییرات
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl bg-peikan-700 hover:bg-peikan-800 text-white font-bold text-sm transition-all shadow-lg shadow-peikan-700/20 active:scale-95"
                            >
                                <Edit3 size={18} />
                                ویرایش اطلاعات
                            </button>
                            <button 
                                onClick={handleBlock}
                                className="px-5 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 font-bold text-sm transition-colors"
                                title="مسدود کردن"
                            >
                                <Ban size={20} />
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="px-5 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 font-bold text-sm transition-colors"
                                title="حذف کاربر"
                            >
                                <Trash2 size={20} />
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default UserDetailsModal;