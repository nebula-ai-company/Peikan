
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Company } from '../../../../types';
import { 
    X, Building2, Users, Shield, HardDrive, Edit3, Trash2, 
    Activity, Phone, Mail, MapPin, Globe,
    Save, Camera, CheckCircle2, AlertTriangle, Briefcase
} from 'lucide-react';
import Toast from '../../../Toast';

interface CompanyDetailsModalProps {
    company: Company;
    onClose: () => void;
    onUpdate: (updatedCompany: Company) => void;
    onDelete: (id: string) => void;
}

const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({ company, onClose, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Company>({ ...company });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        onUpdate(formData);
        setShowSuccess(true);
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        if (isConfirmingDelete) {
            onDelete(company.id);
            onClose();
        } else {
            setIsConfirmingDelete(true);
            // Reset confirmation after 3 seconds
            setTimeout(() => setIsConfirmingDelete(false), 3000);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setFormData({ ...formData, logo: url });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Toast 
                message="اطلاعات سازمان با موفقیت به‌روزرسانی شد" 
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
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e1e1e] sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-peikan-50 dark:bg-peikan-900/20 text-peikan-700 dark:text-peikan-400 rounded-xl">
                            <Building2 size={20} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">
                            {isEditing ? 'ویرایش سازمان' : 'جزئیات سازمان'}
                        </h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                    {/* Hero Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-3xl border-4 border-white dark:border-[#1e1e1e] shadow-xl overflow-hidden bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                                <img src={formData.logo} alt={formData.name} className="w-full h-full object-cover" />
                            </div>
                            
                            {isEditing && (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 rounded-3xl bg-black/50 flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                >
                                    <Camera size={24} />
                                    <span className="text-[10px] font-bold mt-1">تغییر لوگو</span>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
                            
                            {!isEditing && (
                                <span className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white dark:border-[#1e1e1e] flex items-center justify-center ${formData.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {formData.status === 'active' ? <CheckCircle2 size={14} className="text-white" /> : <AlertTriangle size={14} className="text-white" />}
                                </span>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="text-center mt-5">
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{formData.name}</h2>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                                        #{formData.id.substring(0,6).toUpperCase()}
                                    </span>
                                    {formData.industry && (
                                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                                            {formData.industry}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-w-sm mt-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1">نام سازمان</label>
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-base font-bold text-center text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1">زمینه فعالیت</label>
                                    <input 
                                        type="text"
                                        value={formData.industry || ''}
                                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm font-bold text-center text-gray-900 dark:text-white"
                                        placeholder="مثلاً: تکنولوژی"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid - Only show in View Mode */}
                    {!isEditing && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 text-center">
                                <Users className="text-peikan-700 dark:text-peikan-400 mx-auto mb-1.5" size={20} />
                                <div className="text-lg font-black text-gray-900 dark:text-white">{formData.employeeCount}</div>
                                <div className="text-[10px] text-gray-500 font-bold">پرسنل</div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 text-center">
                                <Shield className="text-purple-600 dark:text-purple-400 mx-auto mb-1.5" size={20} />
                                <div className="text-lg font-black text-gray-900 dark:text-white">{formData.plan === 'enterprise' ? 'سازمانی' : 'پایه'}</div>
                                <div className="text-[10px] text-gray-500 font-bold">اشتراک</div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 text-center">
                                <Activity className="text-green-600 dark:text-green-400 mx-auto mb-1.5" size={20} />
                                <div className="text-lg font-black text-gray-900 dark:text-white">98%</div>
                                <div className="text-[10px] text-gray-500 font-bold">تعامل</div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 text-center">
                                <HardDrive className="text-amber-600 dark:text-amber-400 mx-auto mb-1.5" size={20} />
                                <div className="text-lg font-black text-gray-900 dark:text-white dir-ltr">45 GB</div>
                                <div className="text-[10px] text-gray-500 font-bold">فضا</div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-white/5 pb-2">اطلاعات تماس</h4>
                            
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <Globe size={14} /> وب‌سایت
                                    </label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={formData.website || ''}
                                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:border-peikan-700 outline-none dir-ltr text-right text-gray-900 dark:text-white"
                                            placeholder="example.com"
                                        />
                                    ) : (
                                        <a href={`https://${formData.website}`} target="_blank" rel="noreferrer" className="block text-sm font-bold text-peikan-700 hover:underline dir-ltr text-right">
                                            {formData.website || '-'}
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <Phone size={14} /> تلفن تماس
                                    </label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:border-peikan-700 outline-none dir-ltr text-right text-gray-900 dark:text-white"
                                            placeholder="021-..."
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-gray-900 dark:text-white dir-ltr text-right">{formData.phone || '-'}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <MapPin size={14} /> آدرس
                                    </label>
                                    {isEditing ? (
                                        <textarea 
                                            rows={2}
                                            value={formData.address || ''}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:border-peikan-700 outline-none resize-none text-gray-900 dark:text-white"
                                            placeholder="آدرس دفتر مرکزی"
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed">{formData.address || '-'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Admin & Plan Info */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-white/5 pb-2">مدیریت و اشتراک</h4>
                            
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <Users size={14} /> مسئول ارتباطات
                                    </label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={formData.contactPerson || ''}
                                            onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:border-peikan-700 outline-none text-gray-900 dark:text-white"
                                            placeholder="نام و نام خانوادگی"
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{formData.contactPerson || '-'}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <Mail size={14} /> ایمیل مسئول
                                    </label>
                                    {isEditing ? (
                                        <input 
                                            type="email" 
                                            value={formData.contactEmail || ''}
                                            onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:border-peikan-700 outline-none dir-ltr text-right text-gray-900 dark:text-white"
                                            placeholder="admin@company.com"
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-gray-900 dark:text-white dir-ltr text-right">{formData.contactEmail || '-'}</p>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                <Briefcase size={14} /> پلن
                                            </label>
                                            <select 
                                                value={formData.plan}
                                                onChange={(e) => setFormData({...formData, plan: e.target.value as any})}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:border-peikan-700 outline-none font-bold text-gray-900 dark:text-white"
                                            >
                                                <option value="basic">پایه</option>
                                                <option value="enterprise">سازمانی</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                <Users size={14} /> پرسنل
                                            </label>
                                            <input 
                                                type="number"
                                                value={formData.employeeCount}
                                                onChange={(e) => setFormData({...formData, employeeCount: parseInt(e.target.value) || 0})}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:border-peikan-700 outline-none font-bold text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex flex-wrap gap-4 sticky bottom-0 z-20">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => { setIsEditing(false); setFormData({...company}); }}
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
                            
                            {/* Two-step Delete Button */}
                            <button 
                                onClick={handleDeleteClick}
                                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border font-bold text-sm transition-all duration-200 ${
                                    isConfirmingDelete 
                                    ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 px-8' 
                                    : 'px-5 border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20'
                                }`}
                                title={isConfirmingDelete ? "تایید حذف" : "حذف سازمان"}
                            >
                                {isConfirmingDelete ? (
                                    <span>مطمئن هستید؟</span>
                                ) : (
                                    <Trash2 size={20} />
                                )}
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default CompanyDetailsModal;
