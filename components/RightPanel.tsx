import React, { useState, useEffect, useRef } from 'react';
import { Chat, User } from '../types';
import { X, Bell, Image as ImageIcon, FileText, Ban, Trash2, Link as LinkIcon, ChevronLeft, ChevronRight, File, Download, ExternalLink, Edit3, Camera, Check, LogOut, Users, UserPlus, Crown, UserMinus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RightPanelProps {
  chat: Chat | undefined;
  isOpen: boolean;
  onClose: () => void;
  onToggleMute: (chatId: string) => void;
  onClearHistory: (chatId: string) => void;
  onBlockUser: (userId: string) => void;
  currentUser: User;
  onUpdateGroup: (chatId: string, name: string, description: string, avatar: string | undefined) => void;
  onLeaveGroup: (chatId: string) => void;
  onDeleteGroup: (chatId: string) => void;
  onRemoveMember: (chatId: string, userId: string) => void;
  onOpenAddMember: () => void;
}

type PanelView = 'main' | 'media' | 'files' | 'links' | 'members';

const MOCK_MEDIA = [
  'https://picsum.photos/seed/m1/300/300',
  'https://picsum.photos/seed/m2/300/300',
  'https://picsum.photos/seed/m3/300/300',
  'https://picsum.photos/seed/m4/300/300',
  'https://picsum.photos/seed/m5/300/300',
  'https://picsum.photos/seed/m6/300/300',
  'https://picsum.photos/seed/m7/300/300',
  'https://picsum.photos/seed/m8/300/300',
  'https://picsum.photos/seed/m9/300/300',
];

const MOCK_FILES = [
  { name: 'پروپوزال_نهایی.pdf', size: '2.4 MB', date: '۱۴۰۲/۰۷/۱۰' },
  { name: 'گزارش_مالی_پاییز.xlsx', size: '1.1 MB', date: '۱۴۰۲/۰۷/۰۸' },
  { name: 'Design_System_v2.fig', size: '45 MB', date: '۱۴۰۲/۰۶/۲۵' },
  { name: 'Contract_Draft.docx', size: '500 KB', date: '۱۴۰۲/۰۶/۲۰' },
  { name: 'Invoice_102.pdf', size: '150 KB', date: '۱۴۰۲/۰۶/۱۵' },
];

const MOCK_LINKS = [
  { title: 'Figma Design File', url: 'https://figma.com/file/xyz...', domain: 'figma.com' },
  { title: 'Jira Ticket #PRO-123', url: 'https://jira.company.com/browse/PRO-123', domain: 'jira.company.com' },
  { title: 'React Documentation', url: 'https://react.dev', domain: 'react.dev' },
  { title: 'Google Drive Folder', url: 'https://drive.google.com/drive/u/0/...', domain: 'drive.google.com' },
];

const RightPanel: React.FC<RightPanelProps> = ({ 
    chat, isOpen, onClose, onToggleMute, onClearHistory, onBlockUser, currentUser, 
    onUpdateGroup, onLeaveGroup, onDeleteGroup, onRemoveMember, onOpenAddMember
}) => {
  const [activeView, setActiveView] = useState<PanelView>('main');
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset view and edit state when chat changes or panel closes
  useEffect(() => {
    if (!isOpen) {
        setTimeout(() => {
            setActiveView('main');
            setIsEditing(false);
        }, 300);
    } else if (chat) {
        setEditName(chat.name);
        setEditDesc(chat.description || '');
        setEditAvatar(null);
        setIsEditing(false);
    }
  }, [isOpen, chat?.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setEditAvatar(url);
    }
  };

  const handleSave = () => {
    if (chat && editName.trim()) {
        onUpdateGroup(chat.id, editName, editDesc, editAvatar || undefined);
        setIsEditing(false);
    }
  };

  if (!chat) return null;

  const isAdmin = chat.type === 'group' && chat.adminIds?.includes(currentUser.id);
  const isDirect = chat.type === 'direct';

  const getHeaderTitle = () => {
      switch (activeView) {
          case 'media': return 'تصاویر و ویدیوها';
          case 'files': return 'فایل‌های اشتراکی';
          case 'links': return 'لینک‌های اشتراکی';
          case 'members': return 'اعضای گروه';
          default: return chat.type === 'group' ? 'اطلاعات گروه' : 'پروفایل کاربری';
      }
  };

  return (
    <motion.div 
      initial={{ x: '-100%' }} // RTL: Start from left
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className={`fixed inset-y-0 right-auto left-0 w-80 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 z-30 shadow-2xl flex flex-col overflow-hidden md:relative md:w-80 md:shadow-none md:translate-x-0 ${isOpen ? 'block' : 'hidden md:hidden'}`}
    >
      {/* Header */}
      <div className="h-16 min-h-[64px] px-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-white/5 z-10">
        <div className="flex items-center gap-3">
             {activeView === 'main' ? (
                <button onClick={onClose} className="md:hidden p-2 -mr-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
            ) : (
                <button onClick={() => setActiveView('main')} className="p-2 -mr-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors group">
                    <ChevronRight size={22} className="text-gray-500 dark:text-gray-400 group-hover:text-peikan-700" />
                </button>
            )}
            <span className="font-extrabold text-base text-gray-800 dark:text-gray-100 truncate">{getHeaderTitle()}</span>
        </div>
        
        {/* Edit Actions for Admin */}
        {activeView === 'main' && isAdmin && (
            <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-peikan-700 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'}`}
                title={isEditing ? 'ذخیره' : 'ویرایش'}
            >
                {isEditing ? <Check size={18} /> : <Edit3 size={18} />}
            </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <AnimatePresence initial={false} mode="wait">
            
            {/* MAIN VIEW */}
            {activeView === 'main' && (
                <motion.div 
                    key="main"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className="p-0 pb-10"
                >
                    {/* Profile Info Card */}
                    <div className="relative mb-6">
                        <div className="h-28 bg-peikan-50 dark:bg-peikan-900/10"></div>
                        <div className="px-6 -mt-14 flex flex-col items-center">
                            <div className="relative group">
                                <motion.img 
                                    whileHover={!isEditing ? { scale: 1.05 } : {}}
                                    src={isEditing && editAvatar ? editAvatar : chat.avatar} 
                                    alt={chat.name} 
                                    className={`w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white dark:border-[#1a1a1a] ${isEditing ? 'cursor-pointer hover:brightness-75 transition-all' : ''}`} 
                                    onClick={() => isEditing && fileInputRef.current?.click()}
                                />
                                {isEditing && (
                                    <div 
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    >
                                        <Camera className="text-white drop-shadow-md" size={32} />
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            
                            {/* Name & Desc */}
                            <div className="w-full mt-4 text-center space-y-3">
                                {isEditing ? (
                                    <div className="space-y-3 w-full">
                                        <input 
                                            type="text" 
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-3 py-2 text-center font-black text-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-gray-900 dark:text-white"
                                            placeholder="نام گروه"
                                        />
                                        <textarea 
                                            rows={2}
                                            value={editDesc}
                                            onChange={(e) => setEditDesc(e.target.value)}
                                            className="w-full px-3 py-2 text-center text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-gray-700 dark:text-gray-300 resize-none"
                                            placeholder="توضیحات گروه..."
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-black text-gray-900 dark:text-white">{chat.name}</h2>
                                        {isDirect && (
                                            <p className={`text-sm font-medium mt-1 ${chat.participants.find(p => p.id !== 'me')?.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                                                {chat.participants.find(p => p.id !== 'me')?.status === 'online' ? 'آنلاین' : 'آخرین بازدید به تازگی'}
                                            </p>
                                        )}
                                        {/* Description / Bio */}
                                        {(chat.description || (isDirect && chat.participants[0].bio)) && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 w-full mx-auto">
                                                {chat.type === 'group' ? chat.description : chat.participants[0].bio}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 space-y-6">
                        <div className="space-y-1">
                            <h3 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">تنظیمات گفتگو</h3>
                            
                            <div 
                                onClick={() => onToggleMute(chat.id)}
                                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-3.5 text-gray-700 dark:text-gray-200">
                                    <Bell size={20} className="text-gray-400 group-hover:text-peikan-700 transition-colors" />
                                    <span className="text-sm font-bold">اعلان‌ها</span>
                                </div>
                                <div className={`w-10 h-6 rounded-full relative cursor-pointer border transition-colors ${chat.isMuted ? 'bg-gray-200 border-gray-300 dark:bg-white/10 dark:border-white/10' : 'bg-peikan-100 border-peikan-200 dark:bg-peikan-900/50 dark:border-peikan-800'}`}>
                                    <div className={`w-4 h-4 rounded-full absolute top-1 shadow-sm transition-all ${chat.isMuted ? 'left-1 bg-gray-400' : 'right-1 bg-peikan-700'}`}></div>
                                </div>
                            </div>

                            {/* Group Members Button */}
                            {!isDirect && (
                                <button 
                                    onClick={() => setActiveView('members')}
                                    className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors group"
                                >
                                    <Users size={20} className="text-gray-400 group-hover:text-peikan-700 transition-colors" />
                                    <span className="text-sm font-bold flex-1 text-right">اعضای گروه</span>
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <span className="text-xs font-mono">{chat.participants.length}</span>
                                        <ChevronLeft size={16} />
                                    </div>
                                </button>
                            )}
                        </div>

                        <div className="space-y-1">
                            <h3 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">رسانه اشتراکی</h3>
                            
                            <button 
                                onClick={() => setActiveView('media')}
                                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors group"
                            >
                                <ImageIcon size={20} className="text-gray-400 group-hover:text-peikan-700 transition-colors" />
                                <span className="text-sm font-bold flex-1 text-right">تصاویر و ویدیوها</span>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <span className="text-xs font-mono">{MOCK_MEDIA.length}</span>
                                    <ChevronLeft size={16} />
                                </div>
                            </button>

                            <button 
                                onClick={() => setActiveView('files')}
                                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors group"
                            >
                                <FileText size={20} className="text-gray-400 group-hover:text-peikan-700 transition-colors" />
                                <span className="text-sm font-bold flex-1 text-right">فایل‌ها</span>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <span className="text-xs font-mono">{MOCK_FILES.length}</span>
                                    <ChevronLeft size={16} />
                                </div>
                            </button>

                            <button 
                                onClick={() => setActiveView('links')}
                                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 transition-colors group"
                            >
                                <LinkIcon size={20} className="text-gray-400 group-hover:text-peikan-700 transition-colors" />
                                <span className="text-sm font-bold flex-1 text-right">لینک‌ها</span>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <span className="text-xs font-mono">{MOCK_LINKS.length}</span>
                                    <ChevronLeft size={16} />
                                </div>
                            </button>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-white/5">
                            {isDirect ? (
                                <button 
                                    onClick={() => onBlockUser(chat.participants[0].id)}
                                    className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors font-bold text-sm"
                                >
                                    <Ban size={20} />
                                    <span>مسدود کردن کاربر</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={() => onLeaveGroup(chat.id)}
                                    className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors font-bold text-sm"
                                >
                                    <LogOut size={20} />
                                    <span>خروج از گروه</span>
                                </button>
                            )}

                            {isAdmin && !isDirect && (
                                <button 
                                    onClick={() => onDeleteGroup(chat.id)}
                                    className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors font-bold text-sm"
                                >
                                    <Trash2 size={20} />
                                    <span>حذف کامل گروه</span>
                                </button>
                            )}

                            <button 
                                onClick={() => onClearHistory(chat.id)}
                                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400 transition-colors font-bold text-sm"
                            >
                                <Trash2 size={20} />
                                <span>حذف تاریخچه گفتگو</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* MEMBERS VIEW */}
            {activeView === 'members' && (
                <motion.div
                    key="members"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 flex flex-col h-full"
                >
                    {isAdmin && (
                        <button 
                            onClick={onOpenAddMember}
                            className="w-full mb-4 flex items-center justify-center gap-2 bg-peikan-700 text-white p-3 rounded-xl font-bold shadow-md hover:bg-peikan-800 transition-colors"
                        >
                            <UserPlus size={18} />
                            <span>افزودن عضو جدید</span>
                        </button>
                    )}

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        {chat.participants.map(member => {
                            const isMemberAdmin = chat.adminIds?.includes(member.id);
                            const isMe = member.id === currentUser.id;

                            return (
                                <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <div className="relative">
                                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                        {isMemberAdmin && (
                                            <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-0.5 rounded-full border-2 border-white dark:border-[#1a1a1a]">
                                                <Crown size={10} fill="currentColor" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                            {member.name}
                                            {isMe && <span className="text-gray-400 text-xs font-normal mr-1">(شما)</span>}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.bio || 'بدون بیوگرافی'}</p>
                                    </div>
                                    
                                    {isAdmin && !isMe && (
                                        <button 
                                            onClick={() => onRemoveMember(chat.id, member.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="حذف از گروه"
                                        >
                                            <UserMinus size={18} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* MEDIA VIEW */}
            {activeView === 'media' && (
                 <motion.div 
                    key="media"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.2 }}
                    className="p-4"
                >
                    <div className="grid grid-cols-3 gap-2">
                        {MOCK_MEDIA.map((src, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-gray-100 dark:bg-white/5">
                                <img src={src} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* FILES VIEW */}
            {activeView === 'files' && (
                 <motion.div 
                    key="files"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 space-y-1"
                >
                    {MOCK_FILES.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group">
                             <div className="w-10 h-10 rounded-lg bg-peikan-50 dark:bg-peikan-900/20 flex items-center justify-center text-peikan-700 dark:text-peikan-400 shrink-0">
                                 <File size={20} />
                             </div>
                             <div className="flex-1 min-w-0">
                                 <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate dir-ltr text-right">{file.name}</h4>
                                 <p className="text-[11px] text-gray-400 mt-0.5 dir-ltr text-right">{file.size} • {file.date}</p>
                             </div>
                             <button className="text-gray-400 hover:text-peikan-700 transition-colors">
                                 <Download size={18} />
                             </button>
                        </div>
                    ))}
                </motion.div>
            )}

             {/* LINKS VIEW */}
             {activeView === 'links' && (
                 <motion.div 
                    key="links"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 space-y-1"
                >
                    {MOCK_LINKS.map((link, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer group">
                             <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 shrink-0">
                                 <LinkIcon size={20} />
                             </div>
                             <div className="flex-1 min-w-0">
                                 <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate dir-ltr text-right">{link.title}</h4>
                                 <p className="text-[11px] text-peikan-600 dark:text-peikan-400 mt-0.5 dir-ltr text-right truncate">{link.domain}</p>
                             </div>
                             <button className="text-gray-400 hover:text-peikan-700 transition-colors">
                                 <ExternalLink size={16} />
                             </button>
                        </div>
                    ))}
                </motion.div>
            )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RightPanel;