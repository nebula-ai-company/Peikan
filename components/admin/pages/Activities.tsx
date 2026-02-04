
import React from 'react';
import { motion } from 'framer-motion';
import { User, MessageCircle, Clock, FileText, BarChart3 } from 'lucide-react';

const MOCK_ACTIVITIES = [
    { id: 1, name: 'امیر رضایی', role: 'مدیر محصول', avatar: 'https://picsum.photos/id/1005/200/200', messages: 1240, online: '45h 20m', files: 156, status: 'online' },
    { id: 2, name: 'سارا محمدی', role: 'طراح رابط کاربری', avatar: 'https://picsum.photos/id/1011/200/200', messages: 850, online: '38h 15m', files: 240, status: 'online' },
    { id: 3, name: 'رضا کمالی', role: 'مدیر پروژه', avatar: 'https://picsum.photos/id/1025/200/200', messages: 2100, online: '60h 05m', files: 85, status: 'away' },
    { id: 4, name: 'زهرا احمدی', role: 'کارشناس مارکتینگ', avatar: 'https://picsum.photos/id/1027/200/200', messages: 620, online: '25h 40m', files: 12, status: 'offline' },
    { id: 5, name: 'علی کریمی', role: 'توسعه‌دهنده', avatar: 'https://picsum.photos/id/433/200/200', messages: 180, online: '12h 10m', files: 4, status: 'online' },
];

const Activities: React.FC = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-white/5">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart3 size={20} className="text-peikan-700" />
                        گزارش فعالیت کاربران
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">آمار ارسال پیام، زمان آنلاین بودن و تبادل فایل در ۳۰ روز گذشته</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">کاربر</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">پیام‌های ارسالی</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">مدت آنلاین</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">فایل‌های ارسالی</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">امتیاز فعالیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_ACTIVITIES.map((user) => {
                                const activityScore = Math.min(100, Math.floor((user.messages / 2500) * 100));
                                return (
                                    <tr key={user.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt={user.name} />
                                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#1e1e1e] ${user.status === 'online' ? 'bg-green-500' : user.status === 'away' ? 'bg-amber-500' : 'bg-gray-400'}`}></div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white text-sm">{user.name}</div>
                                                    <div className="text-xs text-gray-400">{user.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                    <MessageCircle size={16} />
                                                </div>
                                                <span className="font-bold text-gray-700 dark:text-gray-300 font-mono text-sm">{user.messages.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                                    <Clock size={16} />
                                                </div>
                                                <span className="font-bold text-gray-700 dark:text-gray-300 font-mono text-sm dir-ltr">{user.online}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                                                    <FileText size={16} />
                                                </div>
                                                <span className="font-bold text-gray-700 dark:text-gray-300 font-mono text-sm">{user.files}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 w-48">
                                            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2 mb-1 overflow-hidden">
                                                <div className="bg-peikan-600 h-2 rounded-full" style={{ width: `${activityScore}%` }}></div>
                                            </div>
                                            <div className="text-[10px] text-gray-400 text-left dir-ltr font-mono">{activityScore}% Engagement</div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default Activities;
