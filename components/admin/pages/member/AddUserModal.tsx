
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, UserPlus, Camera, Mail, Lock, User as UserIcon, Phone, 
    Briefcase, Building2, ChevronDown, Eye, EyeOff, Wand2, Search, Check
} from 'lucide-react';
import { Company, User } from '../../../../types';

interface AddUserModalProps {
    companies: Company[];
    onClose: () => void;
    onAdd: (user: Partial<User> & { password?: string }) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ companies, onClose, onAdd }) => {
    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const [companyId, setCompanyId] = useState<string>(companies[0]?.id || '');
    const [avatar, setAvatar] = useState<string | null>(null);
    
    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [companySearch, setCompanySearch] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(pass);
    };

    const handleSubmit = () => {
        if (!name || !email || !password) return;

        const newUser: Partial<User> & { password?: string } = {
            name,
            email, 
            avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            status: 'offline', 
            bio: bio || 'عضو جدید',
            role,
            companyId: companyId || undefined,
            password 
        };

        onAdd(newUser);
        onClose();
    };

    const filteredCompanies = companySearch.trim() === '' 
        ? companies 
        : companies.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()));

    const selectedCompany = companies.find(c => c.id === companyId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                className="relative w-full max-w-2xl bg-white dark:bg-[#1e1e1e] rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-white/10"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e1e1e]">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <UserPlus size={24} className="text-peikan-700" />
                        افزودن عضو جدید
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                    
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className={`w-28 h-28 rounded-full border-4 border-white dark:border-[#1e1e1e] shadow-xl overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-white/5 transition-colors ${!avatar ? 'group-hover:bg-gray-200 dark:group-hover:bg-white/10' : ''}`}>
                                {avatar ? (
                                    <img src={avatar} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <Camera size={32} className="text-gray-400" />
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-peikan-700 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-[#1e1e1e] shadow-sm">
                                <PlusIconSmall />
                            </div>
                        </div>
                        <span className="text-xs font-bold text-gray-400 mt-3">تصویر پروفایل (اختیاری)</span>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* --- Personal Info --- */}
                        <div className="col-span-1 md:col-span-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-white/5 pb-2">اطلاعات فردی</h4>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">نام و نام خانوادگی <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <UserIcon size={18} className="absolute right-4 top-3.5 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-4 pr-11 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm font-bold text-gray-900 dark:text-white transition-all focus:bg-white dark:focus:bg-black/40"
                                    placeholder="مثلاً: علی محمدی"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">شماره تماس</label>
                            <div className="relative">
                                <Phone size={18} className="absolute right-4 top-3.5 text-gray-400" />
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-4 pr-11 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm font-bold text-gray-900 dark:text-white transition-all focus:bg-white dark:focus:bg-black/40 text-left dir-ltr placeholder:text-right placeholder:dir-rtl"
                                    placeholder="0912..."
                                />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">سمت / بیوگرافی</label>
                            <div className="relative">
                                <Briefcase size={18} className="absolute right-4 top-3.5 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full pl-4 pr-11 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm font-bold text-gray-900 dark:text-white transition-all focus:bg-white dark:focus:bg-black/40"
                                    placeholder="مثلاً: مدیر فروش"
                                />
                            </div>
                        </div>

                        {/* --- Account Info --- */}
                        <div className="col-span-1 md:col-span-2 mt-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-white/5 pb-2">اطلاعات حساب کاربری</h4>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">ایمیل سازمانی <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail size={18} className="absolute right-4 top-3.5 text-gray-400" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-4 pr-11 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm font-bold text-gray-900 dark:text-white transition-all focus:bg-white dark:focus:bg-black/40 text-left dir-ltr placeholder:text-right placeholder:dir-rtl"
                                    placeholder="user@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">رمز عبور <span className="text-red-500">*</span></label>
                            <div className="relative flex gap-2">
                                <div className="relative flex-1">
                                    <Lock size={18} className="absolute right-4 top-3.5 text-gray-400" />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-11 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm font-bold text-gray-900 dark:text-white transition-all focus:bg-white dark:focus:bg-black/40 text-left dir-ltr"
                                        placeholder="••••••••"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-3.5 text-gray-400 hover:text-peikan-700 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <button 
                                    onClick={generatePassword}
                                    className="px-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 rounded-xl transition-colors"
                                    title="ساخت رمز تصادفی"
                                >
                                    <Wand2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* --- Organization Info --- */}
                        <div className="col-span-1 md:col-span-2 mt-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-white/5 pb-2">سازمان و دسترسی</h4>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">سازمان مربوطه</label>
                            <div className="relative">
                                <button 
                                    onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-white dark:hover:bg-black/40 transition-colors outline-none focus:border-peikan-700"
                                >
                                    <div className="flex items-center gap-2">
                                        <Building2 size={18} className="text-gray-400" />
                                        <span className={`text-sm font-bold ${selectedCompany ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                            {selectedCompany ? selectedCompany.name : 'انتخاب سازمان'}
                                        </span>
                                    </div>
                                    <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isCompanyOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isCompanyOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#222] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-20 overflow-hidden"
                                        >
                                            <div className="p-2 border-b border-gray-100 dark:border-white/5">
                                                <div className="relative">
                                                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type="text" 
                                                        placeholder="جستجو..." 
                                                        value={companySearch}
                                                        onChange={(e) => setCompanySearch(e.target.value)}
                                                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg py-2 pr-9 pl-3 text-xs font-bold outline-none focus:border-peikan-700 text-gray-900 dark:text-white"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                                                {filteredCompanies.length > 0 ? filteredCompanies.map(comp => (
                                                    <button
                                                        key={comp.id}
                                                        onClick={() => { setCompanyId(comp.id); setIsCompanyOpen(false); }}
                                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                                                            companyId === comp.id 
                                                                ? 'bg-peikan-50 text-peikan-700 dark:bg-peikan-900/20 dark:text-peikan-400' 
                                                                : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <img src={comp.logo} className="w-5 h-5 rounded-md object-cover" alt="" />
                                                            <span>{comp.name}</span>
                                                        </div>
                                                        {companyId === comp.id && <Check size={16} />}
                                                    </button>
                                                )) : (
                                                    <div className="py-4 text-center text-gray-400 text-xs">موردی یافت نشد</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mr-1">سطح دسترسی</label>
                            <div className="flex bg-gray-50 dark:bg-black/20 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                                <button 
                                    onClick={() => setRole('user')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'user' ? 'bg-white dark:bg-[#333] text-peikan-700 dark:text-white shadow-sm' : 'text-gray-500'}`}
                                >
                                    عضو عادی
                                </button>
                                <button 
                                    onClick={() => setRole('admin')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'admin' ? 'bg-white dark:bg-[#333] text-purple-600 dark:text-purple-400 shadow-sm' : 'text-gray-500'}`}
                                >
                                    مدیر سیستم
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        انصراف
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!name || !email || !password}
                        className="flex-[2] py-3.5 rounded-xl bg-peikan-700 hover:bg-peikan-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-peikan-700/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <UserPlus size={18} />
                        ایجاد حساب کاربری
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const PlusIconSmall = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default AddUserModal;
