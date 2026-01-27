import React from 'react';
import { User } from '../../types';
import { Camera, Smartphone, User as UserIcon, AtSign, FileText } from 'lucide-react';

interface SettingsAccountProps {
  currentUser: User;
}

const SettingsAccount: React.FC<SettingsAccountProps> = ({ currentUser }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-right mb-8">
          <div className="relative inline-block md:hidden mb-6">
              <div className="w-28 h-28 rounded-full p-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-lg">
                <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              </div>
              <button className="absolute bottom-1 right-1 p-2.5 bg-peikan-700 text-white rounded-full shadow-lg border-2 border-white dark:border-[#181818]">
                  <Camera size={16} />
              </button>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">اطلاعات حساب</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
            مشخصات عمومی، تصویر پروفایل و اطلاعات تماس خود را در این بخش مدیریت کنید.
          </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
           {/* Desktop Avatar */}
           <div className="hidden md:block relative group cursor-pointer shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-50 dark:ring-white/5 shadow-xl transition-all duration-300 group-hover:ring-peikan-100 dark:group-hover:ring-peikan-900/20">
                  <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                  <Camera size={28} className="text-white drop-shadow-md" />
                  <span className="absolute bottom-6 text-[10px] text-white font-bold opacity-80">تغییر عکس</span>
              </div>
           </div>

           <div className="flex-1 w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1">نام نمایشی</label>
                      <div className="relative group">
                        <UserIcon className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-peikan-700 transition-colors" size={18} />
                        <input 
                            type="text" 
                            defaultValue={currentUser.name} 
                            className="w-full pr-11 pl-4 py-3 bg-gray-50 dark:bg-black/20 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-[#0a0a0a] focus:border-peikan-700 rounded-xl outline-none text-gray-900 dark:text-white font-bold transition-all placeholder-gray-400 text-sm" 
                        />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1">نام کاربری</label>
                      <div className="relative group">
                          <AtSign className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-peikan-700 transition-colors" size={18} />
                          <input 
                            type="text" 
                            defaultValue="amir_rezaei" 
                            className="w-full pr-11 pl-4 py-3 bg-gray-50 dark:bg-black/20 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-[#0a0a0a] focus:border-peikan-700 rounded-xl outline-none text-gray-900 dark:text-white font-bold transition-all placeholder-gray-400 text-sm dir-ltr text-right" 
                           />
                      </div>
                  </div>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1">بیوگرافی</label>
                  <div className="relative group">
                     <FileText className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-peikan-700 transition-colors" size={18} />
                     <textarea 
                        rows={3} 
                        defaultValue={currentUser.bio} 
                        className="w-full pr-11 pl-4 py-3 bg-gray-50 dark:bg-black/20 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-[#0a0a0a] focus:border-peikan-700 rounded-xl outline-none text-gray-900 dark:text-white font-medium transition-all resize-none text-sm leading-relaxed" 
                     />
                  </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">اطلاعات تماس</h4>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors group">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white dark:bg-white/5 rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                             <Smartphone size={20} />
                          </div>
                          <div>
                             <span className="block text-xs text-gray-400 mb-0.5">شماره موبایل متصل</span>
                             <span className="font-mono text-gray-700 dark:text-gray-200 text-lg font-bold dir-ltr tracking-wide">0912 345 6789</span>
                          </div>
                      </div>
                      <button className="px-4 py-2 bg-white dark:bg-white/5 hover:bg-peikan-50 dark:hover:bg-white/10 text-peikan-700 dark:text-white text-xs font-bold rounded-lg transition-colors border border-gray-100 dark:border-white/5 shadow-sm">
                        ویرایش
                      </button>
                  </div>
              </div>
           </div>
      </div>
    </div>
  );
};

export default SettingsAccount;