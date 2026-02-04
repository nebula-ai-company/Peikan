
import React from 'react';
import { motion } from 'framer-motion';
import { 
    Users, Building2, Send, AlertTriangle, Activity, Server, 
    Zap, CheckCircle2, Database, TrendingUp, PieChart 
} from 'lucide-react';

const StatCard = ({ title, value, trend, trendUp, icon: Icon, colorClass }: any) => (
    <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 dark:bg-opacity-20 text-opacity-100`}>
                <Icon size={22} className={colorClass.replace('bg-', 'text-')} />
            </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${trendUp ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                {trendUp ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                {trend}
            </span>
            <span className="text-xs text-gray-400">نسبت به ماه گذشته</span>
        </div>
        {/* Background Decor */}
        <div className={`absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-110 transition-transform duration-500 ${colorClass}`} />
    </div>
);

const TrafficChart = () => {
    const data = [40, 65, 45, 80, 55, 90, 70];
    const labels = ['شنبه', '۱شنبه', '۲شنبه', '۳شنبه', '۴شنبه', '۵شنبه', 'جمعه'];
    
    return (
        <div className="w-full mt-4" dir="ltr">
            <div className="relative h-64">
                <div className="absolute inset-0 flex flex-col justify-between h-full w-full pointer-events-none">
                    {[100, 75, 50, 25, 0].map((val) => (
                        <div key={val} className="flex items-center w-full gap-3">
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono w-8 text-right shrink-0">{val}k</span>
                            <div className="w-full border-t border-dashed border-gray-200 dark:border-white/10 h-px"></div>
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 flex items-end justify-between pl-12 pr-4 pb-[1px] h-full">
                    {data.map((h, i) => (
                        <div key={i} className="flex flex-col items-center justify-end w-full h-full group relative px-2">
                            <div className="relative w-full max-w-[48px] h-full flex items-end justify-center">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1, type: 'spring', damping: 15 }}
                                    className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-lg relative group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors shadow-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between pl-12 pr-4 mt-4">
                {labels.map((label, i) => (
                    <div key={i} className="w-full text-center">
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:text-gray-800 transition-colors block">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StorageWidget = () => {
    const size = 200; 
    const center = size / 2;
    const radius = 70;
    const strokeWidth = 18; 
    const circumference = 2 * Math.PI * radius;
    const percent = 75;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <PieChart size={18} className="text-purple-500" />
                    فضای ذخیره‌سازی
                </h3>
                <span className="text-xs font-bold text-gray-400 font-mono">2TB / 1.2TB</span>
            </div>
            
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-6">
                 <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox={`0 0 ${size} ${size}`}>
                     <circle cx={center} cy={center} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} className="dark:stroke-white/5" />
                     <motion.circle 
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx={center} cy={center} r={radius} fill="none" stroke="#8b5cf6" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeLinecap="round" className="drop-shadow-lg"
                     />
                 </svg>
                 <div className="absolute text-center">
                     <span className="block text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{percent}%</span>
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">اشغال شده</span>
                 </div>
            </div>
            
            <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-200"></span>
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-bold">مدیا</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700"></span>
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-bold">آزاد</span>
                </div>
            </div>
        </div>
    );
};

const Overview: React.FC = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="کاربران فعال" value="1,240" trend="12%" trendUp={true} icon={Users} colorClass="bg-blue-500" />
                <StatCard title="سازمان‌های جدید" value="3" trend="2%" trendUp={true} icon={Building2} colorClass="bg-purple-500" />
                <StatCard title="پیام‌های امروز" value="85.4K" trend="5%" trendUp={true} icon={Send} colorClass="bg-green-500" />
                <StatCard title="گزارش خطا" value="12" trend="3%" trendUp={false} icon={AlertTriangle} colorClass="bg-orange-500" />
            </div>

            {/* Main Chart Row (Full Width) */}
            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                            <Activity size={20} className="text-peikan-700" />
                            روند ترافیک شبکه
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">آمار بازدید و تعامل کاربران در ۳۰ روز گذشته</p>
                    </div>
                    <div className="flex bg-gray-50 dark:bg-white/5 rounded-lg p-1">
                        <button className="px-3 py-1 text-xs font-bold rounded-md bg-white dark:bg-[#333] shadow-sm text-peikan-700">هفتگی</button>
                        <button className="px-3 py-1 text-xs font-bold rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">ماهانه</button>
                    </div>
                </div>
                <TrafficChart />
            </div>

            {/* Bottom Grid: Events & Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: System Events (2/3 width) */}
                <div className="lg:col-span-2">
                     <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm h-full">
                          <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Zap size={18} className="text-amber-500" />
                                    رخدادهای سیستم
                                </h3>
                                <button className="text-xs font-bold text-peikan-700 hover:underline">مشاهده همه</button>
                          </div>
                          <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:right-[19px] before:w-[2px] before:bg-gray-100 dark:before:bg-white/5">
                              {[
                                  { title: 'ثبت نام شرکت جدید', desc: 'شرکت "نوآوران داده" به پلتفرم پیوست.', time: '۱۰ دقیقه پیش', type: 'success' },
                                  { title: 'هشدار امنیتی', desc: 'تلاش ناموفق ورود با IP ناشناس شناسایی شد.', time: '۴۵ دقیقه پیش', type: 'warning' },
                                  { title: 'پشتیبان‌گیری', desc: 'پشتیبان‌گیری خودکار دیتابیس با موفقیت انجام شد.', time: '۲ ساعت پیش', type: 'info' },
                                  { title: 'بروزرسانی سیستم', desc: 'نسخه جدید سرور با موفقیت مستقر شد.', time: '۵ ساعت پیش', type: 'success' },
                                  { title: 'حذف حساب کاربری', desc: 'کاربر "رضا کمالی" حساب خود را غیرفعال کرد.', time: 'دیروز', type: 'warning' },
                              ].map((log, i) => (
                                  <div key={i} className="flex gap-4 relative">
                                      <div className={`w-10 h-10 rounded-full shrink-0 border-4 border-white dark:border-[#1e1e1e] flex items-center justify-center z-10 shadow-sm ${
                                          log.type === 'success' ? 'bg-green-100 text-green-600' : 
                                          log.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                      }`}>
                                          {log.type === 'success' ? <CheckCircle2 size={16} /> : log.type === 'warning' ? <AlertTriangle size={16} /> : <Database size={16} />}
                                      </div>
                                      <div className="flex-1 flex justify-between items-start">
                                          <div>
                                              <h4 className="text-sm font-bold text-gray-900 dark:text-white">{log.title}</h4>
                                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{log.desc}</p>
                                          </div>
                                          <span className="text-[10px] text-gray-400 font-mono mt-1">{log.time}</span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                     </div>
                </div>

                {/* Right Column: Storage & Server Status (1/3 width) */}
                <div className="space-y-6">
                    <StorageWidget />
                    
                    {/* Server Status Tiny */}
                    <div className="bg-gradient-to-br from-peikan-800 to-peikan-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden group">
                        <div className="relative z-10" dir="ltr">
                            <div className="flex justify-between items-start mb-4">
                                <Server size={24} className="opacity-80" />
                                <span className="bg-green-500/20 text-green-300 text-[10px] font-bold px-2 py-1 rounded-full border border-green-500/30">Stable</span>
                            </div>
                            <h3 className="text-3xl font-black mb-1 text-left">24<span className="text-sm font-bold text-peikan-200 ml-1">ms</span></h3>
                            <p className="text-xs text-peikan-200 opacity-80 text-left">Server Latency</p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Activity size={100} />
                        </div>
                        <div className="absolute inset-0 bg-peikan-700/20 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Overview;
