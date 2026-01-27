import React, { useState } from 'react';
import { Database, Layers, Trash2, Zap, Image, PlayCircle } from 'lucide-react';
import SettingsToggleItem from './SettingsToggleItem';

const SettingsStorage: React.FC = () => {
  const [dataSaver, setDataSaver] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [lowQualityImages, setLowQualityImages] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">داده‌ها و حافظه</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
               مدیریت فضای ذخیره‌سازی مرورگر و بهینه‌سازی مصرف اینترنت.
            </p>
        </div>

        {/* Browser Storage Stats */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-peikan-50 to-white dark:from-[#1a1a1a] dark:to-[#121212] p-5 rounded-2xl border border-peikan-100 dark:border-white/5 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-peikan-200/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-peikan-200/30 transition-colors"></div>
                <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-peikan-700 dark:text-peikan-400 mb-1 shadow-sm relative z-10">
                    <Database size={24} strokeWidth={1.5} />
                </div>
                <span className="text-2xl font-black text-gray-900 dark:text-white dir-ltr z-10">45 MB</span>
                <span className="text-xs font-bold text-peikan-700 dark:text-peikan-300 z-10">پایگاه داده داخلی</span>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#1a1a1a] dark:to-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-gray-200/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-gray-200/30 transition-colors"></div>
                <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-gray-500 mb-1 shadow-sm relative z-10">
                    <Layers size={24} strokeWidth={1.5} />
                </div>
                <span className="text-2xl font-black text-gray-900 dark:text-white dir-ltr z-10">128 MB</span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 z-10">حافظه کش مرورگر</span>
            </div>
        </div>

        {/* Clear Data Action */}
        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
             <div className="flex items-start gap-4 mb-4">
                 <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                     <Layers size={20} />
                 </div>
                 <div>
                     <h4 className="font-bold text-gray-900 dark:text-white text-sm">فضای اشغال شده توسط مرورگر</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                         با پاکسازی، فایل‌های موقت مثل تصاویر و پیش‌نمایش‌ها حذف می‌شوند اما پیام‌های متنی باقی می‌مانند.
                     </p>
                 </div>
             </div>
             <button className="w-full py-3 text-red-500 bg-white dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 shadow-sm">
                <Trash2 size={18} />
                پاکسازی حافظه کش
            </button>
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-white/5 my-6"></div>

        {/* Data Usage Section - Optimized for Browser/PWA */}
        <div className="space-y-4">
             <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap size={18} className="text-peikan-700 dark:text-peikan-400" />
                بهینه‌سازی مصرف اینترنت
            </h4>
            <div className="space-y-2">
                <SettingsToggleItem 
                    title="حالت صرفه‌جویی (Data Saver)" 
                    description="جلوگیری از دانلود خودکار تصاویر و ویدیوها" 
                    checked={dataSaver} 
                    onChange={() => setDataSaver(!dataSaver)} 
                />
                <SettingsToggleItem 
                    icon={Image}
                    title="کیفیت پایین تصاویر" 
                    description="بارگذاری تصاویر با حجم کمتر برای افزایش سرعت" 
                    checked={lowQualityImages} 
                    onChange={() => setLowQualityImages(!lowQualityImages)} 
                />
                <SettingsToggleItem 
                    icon={PlayCircle}
                    title="پخش خودکار مدیا" 
                    description="پخش خودکار ویدیوها و تصاویر متحرک (GIF)" 
                    checked={autoPlay} 
                    onChange={() => setAutoPlay(!autoPlay)} 
                />
            </div>
        </div>
    </div>
  );
};

export default SettingsStorage;