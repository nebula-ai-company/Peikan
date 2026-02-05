
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Building2, Upload, Users, Briefcase, Check, Globe, MapPin, Phone, Mail, User as UserIcon, LayoutGrid } from 'lucide-react';
import { Company } from '../../../../types';

interface AddCompanyModalProps {
    onClose: () => void;
    onAdd: (company: Partial<Company>) => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ onClose, onAdd }) => {
    // General Info
    const [name, setName] = useState('');
    const [industry, setIndustry] = useState('');
    const [website, setWebsite] = useState('');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    
    // Contact Info
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactEmail, setContactEmail] = useState('');

    // Subscription
    const [plan, setPlan] = useState<'basic' | 'enterprise'>('basic');
    const [employees, setEmployees] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setLogoPreview(url);
        }
    };

    const handleSubmit = () => {
        if (!name) return;
        
        onAdd({
            name,
            industry,
            website,
            phone,
            address,
            contactPerson,
            contactEmail,
            plan,
            employeeCount: parseInt(employees) || 1,
            logo: logoPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            status: 'active',
            registeredAt: new Date().toLocaleDateString('fa-IR')
        });
        onClose();
    };

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
                className="relative w-full max-w-2xl bg-white dark:bg-[#1e1e1e] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col max-h-[90vh]"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e1e1e] z-10">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Building2 size={24} className="text-peikan-700" />
                        ثبت سازمان جدید
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8">
                    
                    {/* Header Section with Logo */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="flex flex-col items-center gap-2">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-peikan-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-white/5"
                            >
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Upload size={24} className="text-gray-400 mb-1" />
                                        <span className="text-[10px] text-gray-400 font-bold">بارگذاری لوگو</span>
                                    </>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>

                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">نام سازمان <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm font-bold text-gray-900 dark:text-white"
                                    placeholder="مثلاً: شرکت فناوران پیشرو"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">زمینه فعالیت</label>
                                <div className="relative">
                                    <LayoutGrid size={16} className="absolute right-3.5 top-3.5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        className="w-full pl-2 pr-10 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm text-gray-900 dark:text-white"
                                        placeholder="مثلاً: تکنولوژی، مالی..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">وب‌سایت</label>
                                <div className="relative">
                                    <Globe size={16} className="absolute right-3.5 top-3.5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="w-full pl-2 pr-10 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm dir-ltr text-right text-gray-900 dark:text-white"
                                        placeholder="peikan.ir"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2">اطلاعات تماس و مسئول</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">نام مسئول</label>
                                <div className="relative">
                                    <UserIcon size={16} className="absolute right-3.5 top-3.5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={contactPerson}
                                        onChange={(e) => setContactPerson(e.target.value)}
                                        className="w-full pl-2 pr-10 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm text-gray-900 dark:text-white"
                                        placeholder="نام نماینده شرکت"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">ایمیل مسئول</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute right-3.5 top-3.5 text-gray-400" />
                                    <input 
                                        type="email" 
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        className="w-full pl-2 pr-10 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm dir-ltr text-right text-gray-900 dark:text-white"
                                        placeholder="admin@company.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">شماره تماس</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute right-3.5 top-3.5 text-gray-400" />
                                    <input 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-2 pr-10 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm dir-ltr text-right text-gray-900 dark:text-white"
                                        placeholder="021-..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">آدرس</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute right-3.5 top-3.5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full pl-2 pr-10 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm truncate text-gray-900 dark:text-white"
                                        placeholder="آدرس دفتر مرکزی"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>

                    {/* Subscription */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-2">اشتراک و منابع</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">تعداد پرسنل</label>
                                <div className="relative">
                                    <Users size={16} className="absolute right-3.5 top-3.5 text-gray-400" />
                                    <input 
                                        type="number" 
                                        value={employees}
                                        onChange={(e) => setEmployees(e.target.value)}
                                        className="w-full pl-2 pr-10 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm font-bold text-gray-900 dark:text-white"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">پلن اشتراک</label>
                                <div className="relative">
                                    <Briefcase size={16} className="absolute right-3.5 top-3.5 text-gray-400" />
                                    <select 
                                        value={plan}
                                        onChange={(e) => setPlan(e.target.value as any)}
                                        className="w-full pl-2 pr-10 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm font-bold appearance-none cursor-pointer text-gray-900 dark:text-white"
                                    >
                                        <option value="basic">پایه (تا ۵۰ کاربر)</option>
                                        <option value="enterprise">سازمانی (نامحدود)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        انصراف
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!name}
                        className="flex-[2] py-3.5 bg-peikan-700 hover:bg-peikan-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-peikan-700/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        ثبت نهایی سازمان
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AddCompanyModal;
