
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User as UserIcon, MessageCircle, Clock, FileText, BarChart3, TrendingUp, 
    ArrowUpRight, ArrowDownRight, MoreHorizontal, Filter, Download,
    Image as ImageIcon, Video, Music, ArrowUp, ArrowDown
} from 'lucide-react';
import UserDetailsModal from './member/UserDetailsModal';
import Toast from '../../Toast';
import { Company, User } from '../../../types';

interface ActivitiesProps {
    companies?: Company[];
}

// --- MOCK DATA ---
const MOCK_ACTIVITIES = [
    { id: 1, name: 'امیر رضایی', role: 'مدیر محصول', avatar: 'https://picsum.photos/id/1005/200/200', messages: 1240, online: '45h 20m', files: 156, status: 'online', trend: '+12%' },
    { id: 2, name: 'سارا محمدی', role: 'طراح رابط کاربری', avatar: 'https://picsum.photos/id/1011/200/200', messages: 850, online: '38h 15m', files: 240, status: 'online', trend: '+5%' },
    { id: 3, name: 'رضا کمالی', role: 'مدیر پروژه', avatar: 'https://picsum.photos/id/1025/200/200', messages: 2100, online: '60h 05m', files: 85, status: 'away', trend: '-2%' },
    { id: 4, name: 'زهرا احمدی', role: 'کارشناس مارکتینگ', avatar: 'https://picsum.photos/id/1027/200/200', messages: 620, online: '25h 40m', files: 12, status: 'offline', trend: '+8%' },
    { id: 5, name: 'علی کریمی', role: 'توسعه‌دهنده', avatar: 'https://picsum.photos/id/433/200/200', messages: 180, online: '12h 10m', files: 4, status: 'online', trend: '-15%' },
    { id: 6, name: 'مریم حسینی', role: 'پشتیبانی', avatar: 'https://picsum.photos/id/338/200/200', messages: 3400, online: '80h 10m', files: 320, status: 'busy', trend: '+25%' },
];

const WEEKLY_DATA = [40, 65, 45, 90, 55, 80, 70];
const PEAK_HOURS_DATA = [10, 30, 45, 80, 100, 60, 40, 20];

// --- HELPERS ---
const parseTime = (str: string) => {
    if (!str) return 0;
    const parts = str.match(/(\d+)h\s*(\d+)m/);
    if (!parts) return 0;
    return parseInt(parts[1]) * 60 + parseInt(parts[2]);
};

const parseTrend = (str: string) => {
    if (!str) return 0;
    return parseInt(str.replace('%', '').replace('+', ''));
};

// --- COMPONENTS ---

const ActivityCard = ({ title, value, subtext, icon: Icon, color, trend }: any) => {
    const isPositive = trend.startsWith('+');
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-3">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
                    <Icon size={20} className={color.replace('bg-', 'text-')} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend}
                </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{value}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        </motion.div>
    );
};

const CustomAreaChart = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const generateSmoothPath = (data: number[]) => {
        if (data.length === 0) return "";
        const stepX = 100 / (data.length - 1);
        let d = `M0,${100 - data[0]}`;
        for (let i = 0; i < data.length - 1; i++) {
            const x0 = i * stepX;
            const y0 = 100 - data[i];
            const x1 = (i + 1) * stepX;
            const y1 = 100 - data[i + 1];
            const cp1x = x0 + (x1 - x0) * 0.5;
            const cp1y = y0;
            const cp2x = x0 + (x1 - x0) * 0.5;
            const cp2y = y1;
            d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x1},${y1}`;
        }
        return d;
    };

    const smoothPath = generateSmoothPath(WEEKLY_DATA);

    return (
        <div className="w-full h-64 relative group" onMouseLeave={() => setHoveredIndex(null)}>
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 25, 50, 75, 100].map((_, i) => (
                    <div key={i} className="w-full h-px bg-gray-100 dark:bg-white/5 border-t border-dashed border-gray-200 dark:border-white/10" />
                ))}
            </div>
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible preserve-3d absolute inset-0 pointer-events-none" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0D47A1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0D47A1" stopOpacity="0" />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0D47A1" floodOpacity="0.2" />
                    </filter>
                </defs>
                <motion.path 
                    initial={{ opacity: 0, d: `M0,100 L100,100 Z` }}
                    animate={{ opacity: 1, d: `${smoothPath} L100,100 L0,100 Z` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    fill="url(#chartGradient)" 
                />
                <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    d={smoothPath}
                    fill="none" 
                    stroke="#0D47A1" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ filter: 'url(#shadow)' }}
                />
            </svg>
            <div className="absolute inset-0">
                 {WEEKLY_DATA.map((val, i) => {
                     const leftPos = i * (100 / (WEEKLY_DATA.length - 1));
                     const isHovered = hoveredIndex === i;
                     return (
                         <div 
                            key={i} 
                            className="absolute top-0 bottom-0 w-10 -ml-5 cursor-pointer z-10 flex flex-col items-center justify-end group/col"
                            style={{ left: `${leftPos}%` }}
                            onMouseEnter={() => setHoveredIndex(i)}
                         >
                             <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? '100%' : '0%' }}
                                transition={{ duration: 0.2 }}
                                className="w-px bg-peikan-700/50 border-l border-dashed border-peikan-700 dark:border-white absolute bottom-0"
                             />
                             <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: isHovered ? 1.2 : 0, opacity: isHovered ? 1 : 0 }}
                                className="w-3.5 h-3.5 bg-white dark:bg-[#1e1e1e] border-[3px] border-peikan-700 rounded-full absolute z-20 shadow-lg"
                                style={{ bottom: `${val}%`, marginBottom: '-7px' }}
                             />
                             <AnimatePresence>
                                 {isHovered && (
                                     <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap z-30 mb-3"
                                        style={{ bottom: `${val}%`, marginBottom: '12px' }}
                                     >
                                         {val}k پیام
                                         <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-white"></div>
                                     </motion.div>
                                 )}
                             </AnimatePresence>
                         </div>
                     );
                 })}
            </div>
        </div>
    );
};

const DonutChart = () => {
    const data = [
        { label: 'تصویر', value: 45, color: '#3b82f6', icon: ImageIcon },
        { label: 'سند', value: 30, color: '#8b5cf6', icon: FileText },
        { label: 'ویدیو', value: 15, color: '#ef4444', icon: Video },
        { label: 'صوت', value: 10, color: '#10b981', icon: Music },
    ];
    
    let cumulativePercent = 0;
    
    return (
        <div className="flex items-center gap-8">
            <div className="relative w-36 h-36 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {data.map((item, i) => {
                        const percent = item.value;
                        const radius = 42;
                        const circumference = 2 * Math.PI * radius;
                        const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
                        const rotation = (cumulativePercent / 100) * 360;
                        cumulativePercent += percent;
                        return (
                            <motion.circle
                                key={i}
                                initial={{ strokeDasharray: `0 ${circumference}` }}
                                animate={{ strokeDasharray }}
                                transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                                cx="50" cy="50" r={radius}
                                fill="none"
                                stroke={item.color}
                                strokeWidth="10"
                                strokeLinecap="round" 
                                transform={`rotate(${rotation} 50 50)`}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                        );
                    })}
                </svg>
                <div className="absolute text-center">
                    <span className="block text-2xl font-black text-gray-900 dark:text-white">12k</span>
                    <span className="text-xs text-gray-400 font-bold">فایل</span>
                </div>
            </div>
            <div className="flex flex-col gap-3 flex-1 justify-center">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-2.5">
                            <span className="w-3 h-3 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: item.color }}></span>
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                                <item.icon size={14} className="opacity-70" />
                                {item.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                            </div>
                            <span className="text-xs font-mono text-gray-400 w-8 text-left">{item.value}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Activities: React.FC<ActivitiesProps> = ({ companies = [] }) => {
    const [filter, setFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showExportSuccess, setShowExportSuccess] = useState(false);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'desc'; // Default to desc for stats
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedActivities = useMemo(() => {
        let sortableItems = [...MOCK_ACTIVITIES];
        
        // Filter Logic
        if (filter === 'active') {
            sortableItems = sortableItems.filter(u => u.status === 'online' || u.status === 'busy');
        } else if (filter === 'inactive') {
            sortableItems = sortableItems.filter(u => u.status === 'offline' || u.status === 'away');
        }

        // Sort Logic
        if (sortConfig !== null) {
            sortableItems.sort((a: any, b: any) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'online') {
                    aValue = parseTime(a.online);
                    bValue = parseTime(b.online);
                } else if (sortConfig.key === 'trend') {
                    aValue = parseTrend(a.trend);
                    bValue = parseTrend(b.trend);
                } else if (sortConfig.key === 'activityScore') {
                    aValue = Math.min(100, Math.floor((a.messages / 3500) * 100));
                    bValue = Math.min(100, Math.floor((b.messages / 3500) * 100));
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [sortConfig, filter]);

    const handleExportExcel = () => {
        const headers = ['نام', 'نقش', 'پیام‌ها', 'مدت آنلاین', 'فایل‌ها', 'وضعیت', 'روند'];
        const csvContent = [
            headers.join(','),
            ...sortedActivities.map(row => [
                `"${row.name}"`, 
                `"${row.role}"`, 
                row.messages, 
                `"${row.online}"`, 
                row.files, 
                `"${row.status === 'online' ? 'آنلاین' : row.status === 'busy' ? 'مشغول' : row.status === 'away' ? 'عدم حضور' : 'آفلاین'}"`, 
                `"${row.trend}"`
            ].join(','))
        ].join('\n');

        // Add Byte Order Mark (BOM) for correct Persian encoding in Excel
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `activities_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setShowExportSuccess(true);
    };

    const handleUserClick = (activityUser: typeof MOCK_ACTIVITIES[0]) => {
        const fullUser: User = {
            id: activityUser.id.toString(),
            name: activityUser.name,
            avatar: activityUser.avatar,
            role: activityUser.role === 'مدیر محصول' || activityUser.role === 'مدیر پروژه' ? 'admin' : 'user',
            status: activityUser.status as 'online' | 'offline' | 'away' | 'busy',
            bio: `${activityUser.role} - Active Contributor`,
            email: `user${activityUser.id}@peikan.ir`,
            companyId: companies && companies.length > 0 ? companies[0].id : 'comp1' 
        };
        setSelectedUser(fullUser);
    };

    const SortIcon = ({ colKey }: { colKey: string }) => {
        if (sortConfig?.key !== colKey) return <span className="opacity-0 group-hover:opacity-30 transition-opacity"><ArrowDown size={12} /></span>;
        return sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-peikan-700" /> : <ArrowDown size={12} className="text-peikan-700" />;
    };

    const ThSortable = ({ label, colKey, className = "" }: any) => (
        <th 
            className={`p-5 text-xs font-extrabold text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 dark:hover:bg-white/5 transition-colors select-none ${className}`}
            onClick={() => handleSort(colKey)}
        >
            <div className="flex items-center gap-1.5">
                {label}
                <motion.div
                    initial={false}
                    animate={{ 
                        opacity: sortConfig?.key === colKey ? 1 : 0.3,
                        y: sortConfig?.key === colKey ? 0 : 2
                    }}
                >
                    <SortIcon colKey={colKey} />
                </motion.div>
            </div>
            {sortConfig?.key === colKey && (
                <motion.div 
                    layoutId="activeSortBorder"
                    className="h-[2px] bg-peikan-700 w-full mt-2 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}
        </th>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 pb-10">
            
            <Toast 
                message="خروجی اکسل با موفقیت دانلود شد" 
                isVisible={showExportSuccess} 
                onClose={() => setShowExportSuccess(false)} 
                type="success"
            />

            <AnimatePresence>
                {selectedUser && (
                    <UserDetailsModal 
                        user={selectedUser} 
                        companies={companies || []}
                        onClose={() => setSelectedUser(null)} 
                        onUpdate={(u) => { console.log('Updated', u); setSelectedUser(null); }}
                        onDelete={(id) => { console.log('Deleted', id); setSelectedUser(null); }}
                        onBlock={(id) => { console.log('Blocked', id); setSelectedUser(null); }}
                    />
                )}
            </AnimatePresence>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ActivityCard title="مجموع پیام‌ها" value="1.2M" subtext="در ۳۰ روز گذشته" icon={MessageCircle} color="bg-blue-500" trend="+12.5%" />
                <ActivityCard title="فایل‌های تبادل شده" value="85K" subtext="۱۵٪ افزایش" icon={FileText} color="bg-purple-500" trend="+8.2%" />
                <ActivityCard title="مجموع ساعات آنلاین" value="42k" subtext="ساعت" icon={Clock} color="bg-amber-500" trend="-2.1%" />
                <ActivityCard title="نرخ تعامل کاربران" value="89%" subtext="بسیار عالی" icon={BarChart3} color="bg-green-500" trend="+5.4%" />
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Weekly Traffic Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                <TrendingUp size={20} className="text-peikan-700" />
                                ترافیک پیام‌رسانی هفتگی
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">مقایسه حجم پیام‌های ارسالی در روزهای هفته</p>
                        </div>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors text-gray-400">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    <CustomAreaChart />
                    <div className="flex justify-between mt-4 px-2 text-xs font-bold text-gray-400 dark:text-gray-500">
                        <span>شنبه</span><span>۱شنبه</span><span>۲شنبه</span><span>۳شنبه</span><span>۴شنبه</span><span>۵شنبه</span><span>جمعه</span>
                    </div>
                </div>

                {/* File Types & Peak Hours Stack */}
                <div className="space-y-6">
                    {/* File Types */}
                    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">توزیع نوع فایل‌ها</h3>
                            <button className="text-gray-400 hover:text-peikan-700"><MoreHorizontal size={16} /></button>
                        </div>
                        <DonutChart />
                    </div>

                    {/* Peak Hours (Simple Bar) */}
                    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">ساعات اوج مصرف</h3>
                            <span className="text-[10px] bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-lg font-bold border border-green-100 dark:border-green-900/30" dir="ltr">10:00 - 14:00</span>
                        </div>
                        <div className="flex items-end justify-between h-28 gap-2">
                            {PEAK_HOURS_DATA.map((h, i) => (
                                <div key={i} className="w-full h-full flex flex-col justify-end group relative">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                        className={`w-full rounded-t-md relative ${
                                            h > 80 ? 'bg-gradient-to-t from-peikan-800 to-peikan-600' : 'bg-gray-100 dark:bg-white/10 group-hover:bg-gray-200 dark:group-hover:bg-white/20'
                                        }`}
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] text-gray-400 font-mono font-bold">
                            <span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activities Table */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30 dark:bg-white/5">
                    <div>
                        <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <UserIcon size={20} className="text-peikan-700" />
                            جزئیات عملکرد کاربران
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">لیست کامل فعالیت کاربران بر اساس بیشترین تعامل</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <div className="relative group">
                            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-peikan-700 transition-colors" />
                            <select 
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="pl-3 pr-9 py-2.5 bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 focus:border-peikan-700 outline-none appearance-none shadow-sm cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-colors"
                            >
                                <option value="all">همه کاربران</option>
                                <option value="active">فعال‌ترین‌ها</option>
                                <option value="inactive">کم‌کارها</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-2.5 bg-peikan-50 dark:bg-peikan-900/20 text-peikan-700 dark:text-peikan-400 rounded-xl text-xs font-bold hover:bg-peikan-100 dark:hover:bg-peikan-900/30 transition-colors border border-peikan-100 dark:border-peikan-900/30"
                        >
                            <Download size={16} />
                            خروجی اکسل
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-black/20 border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <ThSortable label="کاربر" colKey="name" />
                                <ThSortable label="پیام‌ها" colKey="messages" />
                                <ThSortable label="مدت آنلاین" colKey="online" />
                                <ThSortable label="فایل‌ها" colKey="files" />
                                <ThSortable label="امتیاز فعالیت" colKey="activityScore" />
                                <ThSortable label="روند" colKey="trend" />
                            </tr>
                        </thead>
                        <tbody className="relative">
                            <AnimatePresence>
                                {sortedActivities.map((user) => {
                                    const activityScore = Math.min(100, Math.floor((user.messages / 3500) * 100));
                                    const scoreColor = activityScore > 75 ? 'bg-green-500' : activityScore > 40 ? 'bg-blue-500' : 'bg-orange-500';
                                    
                                    return (
                                        <motion.tr 
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            key={user.id} 
                                            onClick={() => handleUserClick(user)}
                                            className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer relative"
                                        >
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={user.name} />
                                                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#1e1e1e] ${
                                                            user.status === 'online' ? 'bg-green-500' : 
                                                            user.status === 'busy' ? 'bg-red-500' : 
                                                            user.status === 'away' ? 'bg-amber-500' : 'bg-gray-400'
                                                        }`}></div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white text-sm">{user.name}</div>
                                                        <div className="text-[11px] text-gray-400 font-medium">{user.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                                        <MessageCircle size={14} />
                                                    </div>
                                                    <span className="font-bold text-gray-700 dark:text-gray-300 font-mono text-sm">{user.messages.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                                        <Clock size={14} />
                                                    </div>
                                                    <span className="font-bold text-gray-700 dark:text-gray-300 font-mono text-sm dir-ltr">{user.online}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                                                        <FileText size={14} />
                                                    </div>
                                                    <span className="font-bold text-gray-700 dark:text-gray-300 font-mono text-sm">{user.files}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 w-48 align-middle">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                                                        <span>Activity</span>
                                                        <span className="font-mono">{activityScore}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${activityScore}%` }}
                                                            transition={{ duration: 1, delay: 0.2 }}
                                                            className={`h-full rounded-full ${scoreColor}`}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-lg inline-flex items-center gap-1 ${
                                                    user.trend.startsWith('+') 
                                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                                                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                    {user.trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                                                    {user.trend}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-xs text-gray-500 font-medium bg-white dark:bg-[#1e1e1e]">
                    <span>نمایش ۱ تا ۶ از ۲۴ کاربر</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">قبلی</button>
                        <button className="px-3 py-1.5 bg-peikan-700 text-white rounded-lg shadow-sm">۱</button>
                        <button className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">۲</button>
                        <button className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">۳</button>
                        <button className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">بعدی</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Activities;
