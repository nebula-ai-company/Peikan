
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit3, Hash, CheckCircle2, ArrowLeft, Plus, AlignLeft, Eye, Megaphone, Image as ImageIcon } from 'lucide-react';

interface CreateChannelFormProps {
    name: string;
    desc: string;
    onNameChange: (val: string) => void;
    onDescChange: (val: string) => void;
    onCreate: () => void;
    onCancel: () => void;
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({
    name, desc, onNameChange, onDescChange, onCreate, onCancel
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <motion.div 
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 overflow-hidden relative"
        >
            {/* Header */}
            <div className="px-6 py-5 md:px-8 md:py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-xl z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white">
                            ایجاد کانال جدید
                        </h2>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-5xl mx-auto w-full p-6 lg:p-10 pb-28">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
                        
                        {/* LEFT: Form Inputs */}
                        <div className="flex-1 w-full space-y-6 order-2 lg:order-1">
                            
                            {/* Mobile Avatar (Hidden on Desktop) */}
                            <div className="lg:hidden flex flex-col items-center mb-6">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className={`w-32 h-32 rounded-[2rem] border-4 border-white dark:border-[#1e1e1e] shadow-xl overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-white/5 transition-colors`}>
                                        {name ? (
                                            <img 
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D47A1&color=fff&size=200`} 
                                                className="w-full h-full object-cover" 
                                                alt="Avatar"
                                            />
                                        ) : (
                                            <Camera size={32} className="text-gray-400" />
                                        )}
                                        
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit3 className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-peikan-700 text-white rounded-xl flex items-center justify-center border-4 border-white dark:border-[#1e1e1e] shadow-md">
                                        <Camera size={16} />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-400 mt-3">تصویر پروفایل کانال</span>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block pr-1">نام کانال <span className="text-red-500">*</span></label>
                                <div className="group relative transition-all duration-300">
                                    <div className="absolute right-0 top-0 bottom-0 w-14 flex items-center justify-center text-gray-400 group-focus-within:text-peikan-700 transition-colors">
                                        <Hash size={20} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => onNameChange(e.target.value)}
                                        placeholder="مثلاً: اخبار فناوری"
                                        className="w-full pl-4 pr-14 py-4 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-peikan-700 focus:bg-white dark:focus:bg-black/40 rounded-2xl outline-none font-bold text-lg text-gray-900 dark:text-white transition-all placeholder-gray-400"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-[11px] text-gray-400 pr-2 leading-relaxed">نامی کوتاه و گویا انتخاب کنید که محتوای کانال را به خوبی توصیف کند.</p>
                            </div>
                            
                            {/* Description Input */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block pr-1">توضیحات (اختیاری)</label>
                                <div className="group relative transition-all duration-300">
                                    <div className="absolute right-0 top-4 w-14 flex justify-center text-gray-400 group-focus-within:text-peikan-700 transition-colors">
                                        <AlignLeft size={20} />
                                    </div>
                                    <textarea 
                                        rows={5}
                                        value={desc}
                                        onChange={(e) => onDescChange(e.target.value)}
                                        placeholder="هدف این کانال چیست؟"
                                        className="w-full pl-4 pr-14 py-4 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-peikan-700 focus:bg-white dark:focus:bg-black/40 rounded-2xl outline-none text-base resize-none text-gray-900 dark:text-white transition-all leading-relaxed placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Preview (Desktop) */}
                        <div className="hidden lg:block w-[380px] shrink-0 order-1 lg:order-2 sticky top-6">
                            <div className="text-center mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">پیش‌نمایش پروفایل</span>
                            </div>

                            {/* Card Container */}
                            <div className="bg-white dark:bg-[#252525] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5 relative">
                                
                                {/* Header / Cover Area */}
                                <div className="h-32 bg-gradient-to-r from-peikan-100 to-blue-50 dark:from-peikan-900/30 dark:to-blue-900/10 relative">
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#0D47A1 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                                </div>

                                {/* Content */}
                                <div className="px-8 pb-8 -mt-16 flex flex-col items-center relative z-10">
                                    
                                    {/* Avatar */}
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-32 h-32 rounded-[2rem] bg-white dark:bg-[#1e1e1e] p-1.5 shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300 group"
                                    >
                                        <div className="w-full h-full rounded-[1.7rem] bg-gray-50 dark:bg-white/5 overflow-hidden flex items-center justify-center border border-gray-100 dark:border-white/5 relative">
                                            {name ? (
                                                <img 
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D47A1&color=fff&size=200`} 
                                                    className="w-full h-full object-cover" 
                                                    alt="Avatar"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 text-gray-300">
                                                    <Camera size={28} />
                                                    <span className="text-[9px] font-bold">آپلود لوگو</span>
                                                </div>
                                            )}
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Edit3 className="text-white" size={20} />
                                            </div>
                                        </div>
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />

                                    {/* Name & Desc */}
                                    <div className="text-center mt-4 w-full">
                                        <h3 className={`text-xl font-black mb-2 transition-colors ${name ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}>
                                            {name || 'نام کانال شما'}
                                        </h3>
                                        <p className={`text-xs leading-relaxed transition-colors px-4 ${desc ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600'}`}>
                                            {desc || 'توضیحات کانال در اینجا نمایش داده می‌شود...'}
                                        </p>
                                    </div>

                                    {/* Fake Stats */}
                                    <div className="flex items-center gap-2 mt-6">
                                        <div className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                            <span>0</span> عضو
                                        </div>
                                        <div className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                            <span>0</span> پیام
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-center text-[10px] text-gray-400 mt-4 px-8 leading-relaxed opacity-60">
                                این پیش‌نمایش نحوه نمایش کانال شما را به کاربران در لیست و صفحه پروفایل نشان می‌دهد.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Sticky Footer Action Bar */}
            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-20 flex flex-col md:flex-row gap-4 items-center shadow-[-4px_-4px_20px_rgba(0,0,0,0.02)]">
                <button 
                    onClick={onCancel}
                    className="w-full md:flex-1 py-4 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 font-bold rounded-2xl transition-all active:scale-95"
                >
                    انصراف
                </button>
                <button 
                    onClick={onCreate}
                    disabled={!name.trim()}
                    className="w-full md:flex-[2] py-4 bg-peikan-700 hover:bg-peikan-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-peikan-700/20 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-base"
                >
                    <CheckCircle2 size={20} />
                    ساخت و راه‌اندازی کانال
                </button>
            </div>
        </motion.div>
    );
};

export default CreateChannelForm;
