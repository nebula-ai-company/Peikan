import React, { useState } from 'react';
import { User } from '../../types';
import { Camera, Smartphone, User as UserIcon, AtSign, FileText, Copy, CheckCircle2, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsAccountProps {
  currentUser: User;
}

const SettingsAccount: React.FC<SettingsAccountProps> = ({ currentUser }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUsername = () => {
    // In a real app, use the actual username from props
    navigator.clipboard.writeText('amir_rezaei'); 
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8 pb-10"
    >
      
      {/* Header Section */}
      <div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">حساب کاربری</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
          مدیریت اطلاعات شخصی و نحوه نمایش پروفایل شما به دیگران.
        </p>
      </div>

      {/* Premium Profile Picture Section */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative group cursor-pointer">
           {/* Avatar Container with Gradient Ring */}
           <div className="w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-peikan-300 to-peikan-600 shadow-xl shadow-peikan-500/20">
              <div className="w-full h-full rounded-full border-4 border-white dark:border-[#181818] overflow-hidden relative bg-white dark:bg-white/5">
                 <img 
                    src={currentUser.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                 />
                 {/* Hover Overlay */}
                 <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="text-white mb-1" size={24} />
                    <span className="text-[10px] text-white font-bold">تغییر تصویر</span>
                 </div>
              </div>
           </div>

           {/* Floating Edit Badge */}
           <button className="absolute bottom-2 right-2 w-10 h-10 bg-peikan-700 text-white rounded-full border-[3px] border-white dark:border-[#181818] flex items-center justify-center shadow-lg hover:bg-peikan-800 transition-colors z-10 active:scale-95 transform hover:-translate-y-0.5">
               <Edit3 size={16} />
           </button>
        </div>
        <p className="mt-4 text-xs font-medium text-gray-400">حداکثر حجم تصویر ۵ مگابایت</p>
      </div>

      <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-6">
          
          {/* Name & Username Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <UserIcon size={16} className="text-peikan-700" />
                      نام نمایشی
                  </label>
                  <div className="relative">
                      <input 
                        type="text" 
                        defaultValue={currentUser.name}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 focus:ring-4 focus:ring-peikan-700/10 outline-none transition-all text-gray-900 dark:text-white font-bold text-sm shadow-sm"
                      />
                  </div>
              </div>

              <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <AtSign size={16} className="text-peikan-700" />
                      نام کاربری
                  </label>
                  <div className="relative">
                      <input 
                        type="text" 
                        defaultValue="amir_rezaei"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 focus:ring-4 focus:ring-peikan-700/10 outline-none transition-all text-gray-900 dark:text-white font-bold text-sm dir-ltr text-left font-mono shadow-sm"
                      />
                      <button 
                        onClick={handleCopyUsername}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-peikan-700 hover:bg-peikan-50 dark:hover:bg-white/10 rounded-lg transition-colors"
                        title="کپی نام کاربری"
                      >
                         {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                      </button>
                  </div>
              </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText size={16} className="text-peikan-700" />
                  بیوگرافی
              </label>
              <div className="relative">
                  <textarea 
                    rows={3}
                    defaultValue={currentUser.bio}
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 focus:ring-4 focus:ring-peikan-700/10 outline-none transition-all text-gray-900 dark:text-white font-medium text-sm leading-relaxed resize-none shadow-sm"
                    placeholder="درباره خودتان بنویسید..."
                  />
                  <span className="absolute bottom-3 left-3 text-[10px] text-gray-400 font-mono">120/150</span>
              </div>
          </div>

          {/* Contact Info Card */}
          <div className="mt-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">شماره موبایل</label>
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm hover:border-peikan-200 dark:hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                          <Smartphone size={22} strokeWidth={1.5} />
                      </div>
                      <div>
                          <div className="font-mono font-bold text-lg text-gray-900 dark:text-white dir-ltr tracking-wider">0912 345 6789</div>
                          <div className="text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1 mt-0.5">
                              <CheckCircle2 size={12} />
                              تایید شده
                          </div>
                      </div>
                  </div>
                  <button className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors border border-gray-200 dark:border-white/10 shadow-sm">
                      تغییر شماره
                  </button>
              </div>
          </div>

      </div>
    </motion.div>
  );
};

export default SettingsAccount;