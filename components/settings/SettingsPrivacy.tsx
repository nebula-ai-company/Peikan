import React, { useState } from 'react';
import { Lock, Fingerprint, Shield, Smartphone, HardDrive, Eye } from 'lucide-react';
import SettingsToggleItem from './SettingsToggleItem';

const SettingsPrivacy: React.FC = () => {
  const [lastSeen, setLastSeen] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">حریم خصوصی و امنیت</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
               دسترسی به اطلاعات خود را مدیریت کنید و امنیت حساب کاربری خود را افزایش دهید.
            </p>
        </div>

        <div className="space-y-2">
            <SettingsToggleItem 
                icon={Eye} 
                title="نمایش آخرین بازدید" 
                description="کاربران می‌توانند زمان آنلاین بودن شما را مشاهده کنند" 
                checked={lastSeen} 
                onChange={() => setLastSeen(!lastSeen)} 
            />
            <SettingsToggleItem 
                icon={Fingerprint} 
                title="تایید دو مرحله‌ای" 
                description="نیاز به کد تایید پیامکی هنگام ورود در دستگاه جدید" 
                checked={twoFactor} 
                onChange={() => setTwoFactor(!twoFactor)} 
            />
            <SettingsToggleItem 
                icon={Shield} 
                title="رسید خواندن پیام" 
                description="نمایش دو تیک آبی برای مخاطبین هنگام خواندن پیام" 
                checked={readReceipts} 
                onChange={() => setReadReceipts(!readReceipts)} 
            />
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-white/5 my-6"></div>

        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Smartphone size={18} className="text-peikan-700 dark:text-peikan-400" />
                    نشست‌های فعال
                </h4>
                <button className="text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">
                    خاتمه همه نشست‌ها
                </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                {/* Current Device */}
                <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white dark:bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                            <Smartphone size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-900 dark:text-white text-sm">iPhone 13 Pro</h5>
                            <p className="text-xs text-gray-500 dir-ltr text-right font-mono mt-0.5">Tehran, IR • 192.168.1.105</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-900/30">همین دستگاه</span>
                </div>

                {/* Other Device */}
                <div className="p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4 opacity-70">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center text-gray-500">
                            <HardDrive size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-900 dark:text-white text-sm">Windows Desktop</h5>
                            <p className="text-xs text-gray-500 dir-ltr text-right font-mono mt-0.5">Tehran, IR • 14:30 Yesterday</p>
                        </div>
                    </div>
                    <button className="text-red-500 text-xs font-bold hover:underline bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-lg">خاتمه دادن</button>
                </div>
            </div>
        </div>
     </div>
  );
};

export default SettingsPrivacy;