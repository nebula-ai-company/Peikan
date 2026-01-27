import React from 'react';
import { HardDrive, Shield, FileText, Image as ImageIcon, Video, Trash2, DownloadCloud } from 'lucide-react';
import SettingsToggleItem from './SettingsToggleItem';

const SettingsStorage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">داده‌ها و حافظه</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
               مدیریت مصرف اینترنت و فضای ذخیره‌سازی دستگاه.
            </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-peikan-50 to-white dark:from-[#1a1a1a] dark:to-[#121212] p-5 rounded-2xl border border-peikan-100 dark:border-white/5 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-peikan-200/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-peikan-200/30 transition-colors"></div>
                <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-peikan-700 dark:text-peikan-400 mb-1 shadow-sm relative z-10">
                    <HardDrive size={24} strokeWidth={1.5} />
                </div>
                <span className="text-2xl font-black text-gray-900 dark:text-white dir-ltr z-10">1.2 GB</span>
                <span className="text-xs font-bold text-peikan-700 dark:text-peikan-300 z-10">کل فضای اشغال شده</span>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#1a1a1a] dark:to-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-gray-200/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-gray-200/30 transition-colors"></div>
                <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-gray-500 mb-1 shadow-sm relative z-10">
                    <Shield size={24} strokeWidth={1.5} />
                </div>
                <span className="text-2xl font-black text-gray-900 dark:text-white dir-ltr z-10">15 MB</span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 z-10">حافظه پنهان (Cache)</span>
            </div>
        </div>

        {/* Visual Storage Breakdown */}
        <div className="space-y-3">
             <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 px-1">
                 <span>مدیا (تصویر و ویدیو)</span>
                 <span>850 MB</span>
             </div>
             <div className="w-full h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden flex">
                 <div className="h-full bg-blue-500 w-[60%]"></div>
                 <div className="h-full bg-purple-500 w-[20%]"></div>
                 <div className="h-full bg-amber-500 w-[10%]"></div>
             </div>
             <div className="flex gap-4 text-[10px] font-medium text-gray-400 justify-center pt-1">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>تصاویر</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div>ویدیوها</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div>فایل‌ها</div>
             </div>
        </div>

        <button className="w-full py-4 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group">
            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
            پاکسازی حافظه پنهان و فایل‌های موقت
        </button>

        <div className="w-full h-px bg-gray-100 dark:bg-white/5 my-6"></div>

        <div className="space-y-4">
             <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <DownloadCloud size={18} className="text-peikan-700 dark:text-peikan-400" />
                دانلود خودکار رسانه‌ها
            </h4>
            <div className="space-y-2">
                <SettingsToggleItem title="اینترنت موبایل" description="دانلود تصاویر" checked={false} onChange={() => {}} />
                <SettingsToggleItem title="شبکه Wi-Fi" description="دانلود تصاویر، ویدیوها و فایل‌ها" checked={true} onChange={() => {}} />
                <SettingsToggleItem title="هنگام رومینگ" description="غیرفعال" checked={false} onChange={() => {}} />
            </div>
        </div>
    </div>
  );
};

export default SettingsStorage;