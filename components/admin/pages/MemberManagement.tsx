
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegistrationRequest, User, Company } from '../../../types';
import { 
    CheckCircle2, XCircle, Search, Plus, 
    UserPlus, Clock, Users, UserCheck, ChevronRight, ChevronLeft, Activity, ChevronsLeft, ChevronsRight,
    Building2, Settings, Shield, Calendar, Trash2, AlertTriangle
} from 'lucide-react';
import UserDetailsModal from './member/UserDetailsModal';
import AddUserModal from './member/AddUserModal';
import RequestDetailsModal from './member/RequestDetailsModal';

interface MemberManagementProps {
    requests: RegistrationRequest[];
    users: User[];
    companies?: Company[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onClearRequests?: () => void;
}

const ITEMS_PER_PAGE = 7;

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { duration: 0.4 } }
};

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <motion.div 
        variants={cardVariants}
        className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300"
    >
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon size={22} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
        
        {subtext && (
             <div className="relative z-10">
                <span className="text-xs text-gray-400 font-medium">{subtext}</span>
            </div>
        )}
    </motion.div>
);

const MemberManagement: React.FC<MemberManagementProps> = ({ requests, users: initialUsers, companies = [], onApprove, onReject, onClearRequests }) => {
    const [activeTab, setActiveTab] = useState<'members' | 'requests'>('members');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [usersList, setUsersList] = useState(initialUsers);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);

    // Initial load: assign random company if missing for demo purposes
    useEffect(() => {
        if (companies.length > 0) {
            setUsersList(prev => prev.map(u => 
                u.companyId ? u : { ...u, companyId: companies[Math.floor(Math.random() * companies.length)].id }
            ));
        }
    }, [companies.length]); // Run once when companies available

    useEffect(() => {
        setCurrentPage(1); // Reset page on tab/search change
    }, [activeTab, searchTerm]);

    const handleAddUser = (userData: Partial<User> & { password?: string }) => {
        const newUser: User = {
            id: `new_${Date.now()}`,
            name: userData.name || 'کاربر جدید',
            email: userData.email,
            avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=random`,
            status: 'offline',
            bio: userData.bio || 'عضو جدید',
            role: userData.role || 'user',
            companyId: userData.companyId || (companies.length > 0 ? companies[0].id : undefined),
            lastSeen: 'ثبت نام شده'
        };
        // In a real app, we would send the password to the backend here
        console.log("Creating user with password:", userData.password);
        
        setUsersList([newUser, ...usersList]);
    };

    const handleUpdateUser = (updatedUser: User) => {
        setUsersList(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setSelectedUser(updatedUser); // Update modal view as well
    };

    const handleDeleteUser = (userId: string) => {
        setUsersList(prev => prev.filter(u => u.id !== userId));
        setSelectedUser(null);
    };

    const handleBlockUser = (userId: string) => {
        setUsersList(prev => prev.map(u => 
            u.id === userId ? { ...u, status: 'busy' } : u // Using 'busy' as blocked/suspended status for now
        ));
        setSelectedUser(null);
        alert('کاربر با موفقیت مسدود شد.');
    };

    const handleConfirmClear = () => {
        if (onClearRequests) {
            onClearRequests();
        }
        setIsClearModalOpen(false);
    };

    const filteredUsers = usersList.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredRequests = requests; 

    // Pagination Logic
    const currentData = activeTab === 'members' ? filteredUsers : filteredRequests;
    const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
    const paginatedItems = currentData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE, 
        currentPage * ITEMS_PER_PAGE
    );
    
    // Stats calculation
    const totalMembers = usersList.length;
    const onlineMembers = usersList.filter(u => u.status === 'online').length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="space-y-8 pb-10"
        >
            <AnimatePresence>
                {selectedUser && (
                    <UserDetailsModal 
                        user={selectedUser} 
                        companies={companies}
                        onClose={() => setSelectedUser(null)} 
                        onUpdate={handleUpdateUser}
                        onDelete={handleDeleteUser}
                        onBlock={handleBlockUser}
                    />
                )}
                {selectedRequest && (
                    <RequestDetailsModal 
                        request={selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                        onApprove={onApprove}
                        onReject={onReject}
                    />
                )}
                {isAddModalOpen && (
                    <AddUserModal 
                        companies={companies}
                        onClose={() => setIsAddModalOpen(false)} 
                        onAdd={handleAddUser} 
                    />
                )}
                {isClearModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setIsClearModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="relative w-full max-w-sm bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-white/10 text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">پاکسازی لیست</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                                آیا مطمئن هستید که می‌خواهید تمام درخواست‌های ثبت‌نام را حذف کنید؟ این عملیات غیرقابل بازگشت است.
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsClearModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    انصراف
                                </button>
                                <button 
                                    onClick={handleConfirmClear}
                                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg shadow-red-600/20"
                                >
                                    بله، حذف کن
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="کل کاربران" 
                    value={totalMembers} 
                    icon={Users} 
                    color="bg-peikan-700" 
                    subtext="از ۳ سازمان مختلف"
                />
                <StatCard 
                    title="کاربران آنلاین" 
                    value={onlineMembers} 
                    icon={Activity} 
                    color="bg-green-500" 
                    subtext="همین لحظه در پلتفرم"
                />
                <StatCard 
                    title="درخواست‌های جدید" 
                    value={pendingRequests} 
                    icon={UserPlus} 
                    color="bg-amber-500" 
                    subtext="منتظر تایید مدیریت"
                />
            </div>

            {/* Main Content Area */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col">
                
                {/* Modern Toolbar */}
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white dark:bg-[#1e1e1e]">
                    <div className="flex bg-gray-100 dark:bg-black/20 p-1.5 rounded-xl self-start lg:self-auto">
                        <button 
                            type="button"
                            onClick={() => setActiveTab('members')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                                activeTab === 'members' 
                                ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                        >
                            <UserCheck size={16} />
                            اعضای فعال
                        </button>
                        <button 
                            type="button"
                            onClick={() => setActiveTab('requests')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                                activeTab === 'requests' 
                                ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                        >
                            <UserPlus size={16} />
                            درخواست‌ها
                            {pendingRequests > 0 && (
                                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{pendingRequests}</span>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-none lg:w-72 group">
                            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-peikan-700 transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="جستجو نام، ایمیل..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 pr-10 pl-4 text-sm outline-none focus:border-peikan-700 focus:ring-4 focus:ring-peikan-700/10 transition-all font-medium"
                            />
                        </div>
                        {activeTab === 'members' && (
                            <button 
                                type="button"
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center justify-center gap-2 bg-peikan-700 hover:bg-peikan-800 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-peikan-700/20 transition-all active:scale-95 whitespace-nowrap"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">افزودن عضو</span>
                            </button>
                        )}
                        {activeTab === 'requests' && requests.length > 0 && onClearRequests && (
                            <button 
                                type="button"
                                onClick={() => setIsClearModalOpen(true)}
                                className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-5 py-3 rounded-xl font-bold transition-all active:scale-95 whitespace-nowrap border border-red-200 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                                <Trash2 size={18} />
                                <span className="hidden sm:inline">پاکسازی لیست</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* List Container */}
                <div className="flex-1 bg-white dark:bg-[#1e1e1e]">
                    
                    {/* Header Row (Grid) */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <div className="col-span-3 flex items-center gap-2">
                            <Users size={14} />
                            کاربر
                        </div>
                        <div className="col-span-2 flex items-center justify-center gap-2">
                            <Activity size={14} />
                            وضعیت
                        </div>
                        {/* New Organization Column */}
                        <div className="col-span-2 flex items-center justify-center gap-2">
                            <Building2 size={14} />
                            سازمان
                        </div>
                        <div className="col-span-2 hidden sm:flex items-center justify-center gap-2">
                            <Shield size={14} />
                            {activeTab === 'members' ? 'نقش' : 'درخواست'}
                        </div>
                        <div className="col-span-2 hidden sm:flex items-center justify-center gap-2">
                            {activeTab === 'members' ? <Clock size={14} /> : <Calendar size={14} />}
                            <span>{activeTab === 'members' ? 'آخرین فعالیت' : 'تاریخ'}</span>
                        </div>
                        <div className="col-span-1 flex items-center justify-end gap-2">
                            <Settings size={14} />
                            عملیات
                        </div>
                    </div>

                    <div className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {paginatedItems.map((item: any) => {
                                const companyName = activeTab === 'members' 
                                    ? (companies.find(c => c.id === item.companyId)?.name || 'سازمان نامشخص') 
                                    : item.companyName;

                                return (
                                    <motion.div 
                                        key={item.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="show"
                                        exit={{ opacity: 0 }}
                                        onClick={() => {
                                            if (activeTab === 'members') setSelectedUser(item as User);
                                            if (activeTab === 'requests') setSelectedRequest(item as RegistrationRequest);
                                        }}
                                        className={`grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group`}
                                    >
                                        {/* User Info */}
                                        <div className="col-span-3 flex items-center gap-4">
                                            {activeTab === 'members' ? (
                                                <>
                                                    <div className="relative shrink-0">
                                                        <img src={item.avatar} className="w-10 h-10 rounded-full object-cover" alt={item.name} />
                                                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#1e1e1e] ${item.status === 'online' ? 'bg-green-500' : item.status === 'away' ? 'bg-amber-500' : 'bg-gray-400'}`}></span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-peikan-700 transition-colors">{item.name}</h4>
                                                        <p className="text-xs text-gray-400 truncate mt-0.5">{item.bio || 'کاربر'}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-xl bg-peikan-50 dark:bg-peikan-900/30 text-peikan-700 dark:text-peikan-400 flex items-center justify-center font-black text-base shrink-0">
                                                        {item.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.name}</h4>
                                                        <p className="text-xs text-gray-400 dir-ltr text-right truncate">{item.email}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Status Badge */}
                                        <div className="col-span-2 flex justify-center">
                                            {activeTab === 'members' ? (
                                                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                                                    item.status === 'online' ? 'bg-green-50 text-green-700' : 
                                                    item.status === 'away' ? 'bg-amber-50 text-amber-700' : 
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                                        item.status === 'online' ? 'bg-green-500' : 
                                                        item.status === 'away' ? 'bg-amber-500' : 
                                                        'bg-gray-400'
                                                    }`}></div>
                                                    <span className="hidden sm:inline">
                                                        {item.status === 'online' ? 'آنلاین' : item.status === 'away' ? 'عدم حضور' : 'آفلاین'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                    item.status === 'approved' ? 'bg-green-50 text-green-600' :
                                                    item.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                    'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {item.status === 'pending' ? 'در انتظار' : item.status === 'approved' ? 'تایید شده' : 'رد شده'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Organization */}
                                        <div className="col-span-2 flex justify-center text-center">
                                            <span className="text-xs text-gray-600 dark:text-gray-400 font-bold truncate max-w-full">
                                                {companyName}
                                            </span>
                                        </div>

                                        {/* Role / Request Type */}
                                        <div className="col-span-2 hidden sm:flex justify-center text-center">
                                            {activeTab === 'members' ? (
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                                                    item.role === 'admin' 
                                                    ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                                                    : 'text-gray-500 bg-gray-100 dark:bg-white/10'
                                                }`}>
                                                    {item.role === 'admin' ? 'مدیر ارشد' : 'کاربر'}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500 truncate">{item.reason?.substring(0, 20)}...</span>
                                            )}
                                        </div>

                                        {/* Last Seen / Date */}
                                        <div className="col-span-2 hidden sm:flex items-center justify-center">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                {activeTab === 'members' ? (item.lastSeen || 'همین الان') : item.date}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 flex justify-end">
                                            {activeTab === 'members' ? (
                                                <button className="p-2 text-gray-400 hover:text-peikan-700 hover:bg-peikan-50 dark:hover:bg-white/10 rounded-xl transition-all">
                                                    <ChevronRight size={18} className="rotate-180" />
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    {item.status === 'pending' ? (
                                                        <>
                                                            <button onClick={(e) => { e.stopPropagation(); onApprove(item.id); }} className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="تایید">
                                                                <CheckCircle2 size={16} />
                                                            </button>
                                                            <button onClick={(e) => { e.stopPropagation(); onReject(item.id); }} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="رد">
                                                                <XCircle size={16} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button className="p-2 text-gray-400 hover:text-peikan-700 hover:bg-peikan-50 dark:hover:bg-white/10 rounded-xl transition-all">
                                                            <ChevronRight size={18} className="rotate-180" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        نمایش {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, currentData.length)} تا {Math.min(currentPage * ITEMS_PER_PAGE, currentData.length)} از {currentData.length} نتیجه
                    </span>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <ChevronsRight size={16} className="rotate-180" />
                        </button>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <ChevronRight size={16} className="rotate-180" />
                        </button>
                        
                        <div className="flex items-center gap-1 px-2">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                // Simple logic to show first few pages, in real app needs complex range logic
                                const pageNum = i + 1;
                                return (
                                    <button 
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                            currentPage === pageNum 
                                            ? 'bg-peikan-700 text-white shadow-md' 
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft size={16} className="rotate-180" />
                        </button>
                        <button 
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <ChevronsLeft size={16} className="rotate-180" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MemberManagement;
