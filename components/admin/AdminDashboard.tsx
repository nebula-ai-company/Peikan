
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chat, Company, RegistrationRequest } from '../../types';
import { MOCK_COMPANIES, MOCK_REQUESTS } from '../../constants';
import { 
    LayoutDashboard, Users, Building2, Radio, Megaphone, Settings, LogOut, 
    Search, Plus, ShieldCheck, Activity
} from 'lucide-react';

// Import Pages
import Overview from './pages/Overview';
import MemberManagement from './pages/MemberManagement';
import Companies from './pages/Companies';
import Channels from './pages/Channels';
import Broadcast from './pages/Broadcast';
import Activities from './pages/Activities';

interface AdminDashboardProps {
    chats: Chat[];
    onUpdateChats: (chats: Chat[]) => void;
    onLogout: () => void;
}

type AdminTab = 'overview' | 'members' | 'companies' | 'channels' | 'broadcast' | 'activities';

// --- SUB-COMPONENTS ---

const SidebarItem = ({ id, active, icon: Icon, label, badge, onClick }: any) => (
    <button
        onClick={() => onClick(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
            active 
                ? 'bg-peikan-50 dark:bg-peikan-900/20 text-peikan-700 dark:text-peikan-400 font-bold' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
        }`}
    >
        {active && (
            <motion.div layoutId="activeNav" className="absolute right-0 w-1 h-6 bg-peikan-700 rounded-l-full" />
        )}
        <Icon size={20} className={`${active ? 'text-peikan-700 dark:text-peikan-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}`} />
        <span className="flex-1 text-right">{label}</span>
        {badge ? (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{badge}</span>
        ) : null}
    </button>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ chats, onUpdateChats, onLogout }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [requests, setRequests] = useState<RegistrationRequest[]>(MOCK_REQUESTS);
    const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
    
    // Broadcast State
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [broadcastTarget, setBroadcastTarget] = useState<string>('all'); 

    // Channel Creation State
    const [newChannelName, setNewChannelName] = useState('');
    const [newChannelDesc, setNewChannelDesc] = useState('');

    const handleApproveRequest = (id: string) => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'approved' } : req));
    };

    const handleRejectRequest = (id: string) => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req));
    };

    const handleSendBroadcast = () => {
        if (!broadcastMessage.trim()) return;

        let targetChats = chats;
        const createMsg = () => ({
            id: `sys_${Date.now()}_${Math.random()}`,
            senderId: 'admin',
            content: broadcastMessage,
            type: 'text' as const,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            isRead: true
        });

        if (broadcastTarget === 'all') {
            targetChats = chats.map(chat => 
                chat.type === 'channel' 
                ? { ...chat, messages: [...chat.messages, createMsg()], unreadCount: chat.unreadCount + 1 } 
                : chat
            );
        } else {
            targetChats = chats.map(chat => 
                chat.id === broadcastTarget 
                ? { ...chat, messages: [...chat.messages, createMsg()], unreadCount: chat.unreadCount + 1 } 
                : chat
            );
        }

        onUpdateChats(targetChats);
        setBroadcastMessage('');
        alert('پیام با موفقیت ارسال شد');
    };

    const handleCreateChannel = () => {
        if (!newChannelName.trim()) return;

        const newChannel: Chat = {
            id: `ch_${Date.now()}`,
            type: 'channel',
            name: newChannelName,
            description: newChannelDesc,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newChannelName)}&background=random`,
            participants: [],
            messages: [],
            unreadCount: 0,
            isPinned: false,
            isMuted: false,
            adminIds: ['admin']
        };

        onUpdateChats([newChannel, ...chats]);
        setNewChannelName('');
        setNewChannelDesc('');
        alert('کانال با موفقیت ایجاد شد');
    };

    const pendingCount = requests.filter(r => r.status === 'pending').length;

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0b0b0b] flex overflow-hidden font-sans text-right" dir="rtl">
            
            {/* --- SIDEBAR --- */}
            <aside className="w-72 bg-white dark:bg-[#151515] border-l border-gray-200 dark:border-white/5 flex flex-col z-20 shadow-sm relative">
                {/* Logo Area */}
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-peikan-700 rounded-xl flex items-center justify-center shadow-lg shadow-peikan-700/20">
                            <ShieldCheck size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-black text-lg text-gray-900 dark:text-white tracking-tight">پنل مدیریت پیکان</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-[11px] font-bold text-gray-400">سیستم آنلاین</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-px w-full bg-gray-100 dark:bg-white/5"></div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-xs font-bold text-gray-400 mb-2 mt-2">اصلی</p>
                    <SidebarItem id="overview" active={activeTab === 'overview'} icon={LayoutDashboard} label="پیشخوان" onClick={setActiveTab} />
                    <SidebarItem id="members" active={activeTab === 'members'} icon={Users} label="مدیریت اعضا" badge={pendingCount} onClick={setActiveTab} />
                    <SidebarItem id="activities" active={activeTab === 'activities'} icon={Activity} label="فعالیت‌ها" onClick={setActiveTab} />
                    
                    <p className="px-4 text-xs font-bold text-gray-400 mb-2 mt-6">مدیریت</p>
                    <SidebarItem id="companies" active={activeTab === 'companies'} icon={Building2} label="شرکت‌ها و سازمان‌ها" onClick={setActiveTab} />
                    <SidebarItem id="channels" active={activeTab === 'channels'} icon={Radio} label="مدیریت کانال‌ها" onClick={setActiveTab} />
                    
                    <p className="px-4 text-xs font-bold text-gray-400 mb-2 mt-6">ارتباطات</p>
                    <SidebarItem id="broadcast" active={activeTab === 'broadcast'} icon={Megaphone} label="اعلان سراسری" onClick={setActiveTab} />
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=0D47A1&color=fff" className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-[#222]" alt="Admin" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">مدیر ارشد سیستم</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@peikan.ir</p>
                        </div>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 transition-all text-xs font-bold"
                    >
                        <LogOut size={16} />
                        <span>خروج امن</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                
                {/* Top Header */}
                <header className="h-16 bg-white/80 dark:bg-[#151515]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white">
                            {activeTab === 'overview' && 'داشبورد مدیریتی'}
                            {activeTab === 'members' && 'لیست اعضا و درخواست‌ها'}
                            {activeTab === 'activities' && 'گزارش فعالیت کاربران'}
                            {activeTab === 'companies' && 'سازمان‌های عضو'}
                            {activeTab === 'channels' && 'کانال‌های عمومی'}
                            {activeTab === 'broadcast' && 'مرکز پیام'}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Search and Action Buttons Removed */}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && <Overview />}
                        
                        {activeTab === 'members' && (
                            <MemberManagement 
                                requests={requests} 
                                onApprove={handleApproveRequest} 
                                onReject={handleRejectRequest} 
                            />
                        )}

                        {activeTab === 'activities' && <Activities />}

                        {activeTab === 'companies' && <Companies companies={companies} />}

                        {activeTab === 'channels' && (
                            <Channels 
                                chats={chats}
                                newChannelName={newChannelName}
                                newChannelDesc={newChannelDesc}
                                onNameChange={setNewChannelName}
                                onDescChange={setNewChannelDesc}
                                onCreate={handleCreateChannel}
                            />
                        )}

                        {activeTab === 'broadcast' && (
                            <Broadcast 
                                chats={chats}
                                message={broadcastMessage}
                                target={broadcastTarget}
                                onMessageChange={setBroadcastMessage}
                                onTargetChange={setBroadcastTarget}
                                onSend={handleSendBroadcast}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
