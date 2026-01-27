import React, { useState } from 'react';
import { Bell, Volume2, MessageSquare, Zap } from 'lucide-react';
import SettingsToggleItem from './SettingsToggleItem';

const SettingsNotifications: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [previewEnabled, setPreviewEnabled] = useState(true);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">اعلان‌ها و صدا</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
               نحوه اطلاع‌رسانی پیام‌های جدید را شخصی‌سازی کنید تا تمرکز خود را حفظ نمایید.
            </p>
        </div>

        <div className="space-y-2">
            <SettingsToggleItem 
                icon={Bell} 
                title="نمایش اعلان‌ها" 
                description="نمایش بنر پیام‌های جدید در سیستم عامل" 
                checked={notificationsEnabled} 
                onChange={() => setNotificationsEnabled(!notificationsEnabled)} 
            />
            <SettingsToggleItem 
                icon={Volume2} 
                title="صداهای برنامه" 
                description="پخش جلوه صوتی هنگام ارسال و دریافت پیام" 
                checked={soundEnabled} 
                onChange={() => setSoundEnabled(!soundEnabled)} 
            />
             <SettingsToggleItem 
                icon={Zap} 
                title="لرزش (Vibration)" 
                description="لرزش دستگاه هنگام دریافت پیام در حالت سکوت" 
                checked={false} 
                onChange={() => {}} 
            />
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-white/5 my-6"></div>

        <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare size={18} className="text-peikan-700 dark:text-peikan-400" />
                پیش‌نمایش پیام
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
                <div 
                    onClick={() => setPreviewEnabled(true)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${previewEnabled ? 'border-peikan-700 bg-peikan-50/30 dark:bg-peikan-900/10' : 'border-gray-100 dark:border-white/5 hover:border-gray-200'}`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-bold ${previewEnabled ? 'text-peikan-700 dark:text-white' : 'text-gray-500'}`}>نام و متن پیام</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${previewEnabled ? 'border-peikan-700' : 'border-gray-300 dark:border-white/20'}`}>
                            {previewEnabled && <div className="w-2.5 h-2.5 bg-peikan-700 rounded-full"></div>}
                        </div>
                    </div>
                    {/* Fake Notification Banner */}
                    <div className="bg-white dark:bg-[#252525] rounded-lg p-3 shadow-md border border-gray-100 dark:border-white/5 flex items-start gap-3 opacity-90">
                        <div className="w-8 h-8 rounded-full bg-peikan-100 flex items-center justify-center text-peikan-700">
                            <span className="font-bold text-xs">A</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-bold text-gray-900 dark:text-white">امیر رضایی</span>
                                <span className="text-[10px] text-gray-400">الان</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">سلام، فایل‌های پروژه رو بررسی کردی؟</p>
                        </div>
                    </div>
                </div>

                <div 
                    onClick={() => setPreviewEnabled(false)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${!previewEnabled ? 'border-peikan-700 bg-peikan-50/30 dark:bg-peikan-900/10' : 'border-gray-100 dark:border-white/5 hover:border-gray-200'}`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-bold ${!previewEnabled ? 'text-peikan-700 dark:text-white' : 'text-gray-500'}`}>فقط نام فرستنده</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!previewEnabled ? 'border-peikan-700' : 'border-gray-300 dark:border-white/20'}`}>
                            {!previewEnabled && <div className="w-2.5 h-2.5 bg-peikan-700 rounded-full"></div>}
                        </div>
                    </div>
                    {/* Fake Notification Banner - Hidden Content */}
                    <div className="bg-white dark:bg-[#252525] rounded-lg p-3 shadow-md border border-gray-100 dark:border-white/5 flex items-start gap-3 opacity-90">
                        <div className="w-8 h-8 rounded-full bg-peikan-100 flex items-center justify-center text-peikan-700">
                             <MessageSquare size={14} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-bold text-gray-900 dark:text-white">پیکان</span>
                                <span className="text-[10px] text-gray-400">الان</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">یک پیام جدید دارید</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SettingsNotifications;