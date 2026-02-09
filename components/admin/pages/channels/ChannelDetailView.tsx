
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chat } from '../../../../types';
import { 
    Settings, Send, Users, MessageCircle, Megaphone, BellRing, Image as ImageIcon, 
    Trash2, CheckCircle2, Hash, AlignLeft, ShieldCheck, Edit3, AlertTriangle,
    Bold, Italic, List, Link as LinkIcon, BellOff, Calendar, Save, Smile, 
    FileText, BarChart2, X, Paperclip
} from 'lucide-react';

interface ChannelDetailViewProps {
    channel: Chat;
    onSaveSettings: (id: string, name: string, description: string) => void;
    onDelete: (id: string) => void;
    onSendMessage: (text: string) => void;
}

const IconButton = ({ icon: Icon, active, onClick }: { icon: any, active?: boolean, onClick?: () => void }) => (
    <button 
        onClick={onClick}
        className={`p-2 rounded-lg transition-colors ${active ? 'bg-peikan-100 text-peikan-700 dark:bg-peikan-900/30 dark:text-peikan-300' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-gray-500'}`}
    >
        <Icon size={18} strokeWidth={2.5} />
    </button>
);

const AttachButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 transition-all"
    >
        <Icon size={16} />
        {label}
    </button>
);

const EMOJIS = ['😀', '😂', '😍', '🤔', '😎', '😭', '😡', '👍', '👎', '❤️', '🔥', '🎉', '👀', '✅', '🚀', '💯', '👋', '🙏', '💪', '✨'];

const ChannelDetailView: React.FC<ChannelDetailViewProps> = ({ 
    channel, onSaveSettings, onDelete, onSendMessage 
}) => {
    const [activeTab, setActiveTab] = useState<'settings' | 'compose'>('settings');
    const [messageText, setMessageText] = useState('');
    
    // Local state for editing
    const [name, setName] = useState(channel.name);
    const [description, setDescription] = useState(channel.description || '');
    
    // Delete confirmation state
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
    
    // Compose options
    const [isSilent, setIsSilent] = useState(false);
    
    // Functional State
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [attachments, setAttachments] = useState<{name: string, type: 'image' | 'file', url?: string}[]>([]);
    
    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync local state when selected channel changes
    useEffect(() => {
        setName(channel.name);
        setDescription(channel.description || '');
        setIsDeleteConfirm(false); // Reset confirmation state when channel changes
        setMessageText('');
        setIsSilent(false);
        setAttachments([]);
    }, [channel]);

    const handleSend = () => {
        let finalMessage = messageText;
        if (attachments.length > 0) {
            const attachmentText = attachments.map(a => `[${a.type === 'image' ? 'تصویر' : 'فایل'}: ${a.name}]`).join('\n');
            finalMessage += `\n\n${attachmentText}`;
        }
        onSendMessage(finalMessage);
        setMessageText('');
        setAttachments([]);
    };

    const handleSave = () => {
        onSaveSettings(channel.id, name, description);
    };

    const handleDeleteClick = () => {
        if (isDeleteConfirm) {
            onDelete(channel.id);
        } else {
            setIsDeleteConfirm(true);
            // Auto-revert after 3 seconds if not clicked
            setTimeout(() => setIsDeleteConfirm(false), 3000);
        }
    };

    // --- Formatting Logic ---
    const insertTextAtCursor = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) {
            setMessageText(prev => prev + text);
            return;
        }
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = messageText.substring(0, start) + text + messageText.substring(end);
        setMessageText(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };

    const wrapSelection = (prefix: string, suffix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selection = messageText.substring(start, end);
        const newText = messageText.substring(0, start) + prefix + selection + suffix + messageText.substring(end);
        setMessageText(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    const handleFormat = (type: 'bold' | 'italic' | 'list' | 'link' | 'poll') => {
        switch (type) {
            case 'bold': wrapSelection('**', '**'); break;
            case 'italic': wrapSelection('*', '*'); break;
            case 'list': insertTextAtCursor('\n- '); break;
            case 'link': insertTextAtCursor('[عنوان](https://)'); break;
            case 'poll': insertTextAtCursor('📊 نظرسنجی:\nگزینه ۱:\nگزینه ۲:'); break;
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setAttachments([...attachments, { name: file.name, type, url }]);
            e.target.value = ''; // Reset input
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    return (
        <motion.div 
            key="details"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 overflow-hidden relative"
        >
            {/* Hidden Inputs */}
            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'image')} />
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileSelect(e, 'file')} />

            {/* --- Hero Background --- */}
            <div className="absolute top-0 left-0 right-0 h-96 z-0 overflow-hidden pointer-events-none">
                {/* Gradient using Peikan Colors */}
                <div className="absolute inset-0 bg-gradient-to-b from-peikan-50/50 via-white/80 to-white dark:from-peikan-900/10 dark:via-[#1e1e1e]/80 dark:to-[#1e1e1e]"></div>
                
                {/* Abstract Blobs */}
                <motion.div 
                    animate={{ x: [0, 20, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-peikan-100/30 dark:bg-peikan-700/5 rounded-full blur-[100px]"
                />
                <motion.div 
                    animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-[-100px] w-[400px] h-[400px] bg-accent-100/20 dark:bg-accent-900/5 rounded-full blur-[80px]"
                />
            </div>

            {/* --- Content Scroll Area --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <div className="px-4 pt-12 min-h-full flex flex-col max-w-7xl mx-auto w-full">
                    
                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center mb-10 shrink-0">
                        <div className="relative group cursor-pointer mb-6">
                            <motion.div 
                                layoutId={`avatar-${channel.id}`}
                                className="w-36 h-36 rounded-[2.5rem] p-1.5 bg-white dark:bg-[#222] shadow-2xl shadow-peikan-900/10 dark:shadow-black/50 rotate-3 group-hover:rotate-0 transition-transform duration-300 ease-out relative z-10"
                            >
                                <img 
                                    src={channel.avatar} 
                                    className="w-full h-full rounded-[2.2rem] object-cover bg-gray-100 dark:bg-white/5" 
                                    alt={channel.name}
                                />
                            </motion.div>
                            
                            {/* Decorative Rings */}
                            <div className="absolute inset-0 rounded-[2.5rem] border-2 border-peikan-500/30 scale-110 -z-0 group-hover:scale-105 transition-transform duration-500"></div>
                            
                            <div className="absolute -bottom-2 -right-2 z-20 bg-peikan-700 text-white p-3 rounded-2xl border-[4px] border-white dark:border-[#1e1e1e] shadow-lg">
                                <Megaphone size={22} fill="currentColor" />
                            </div>
                        </div>

                        {/* Use local 'name' state for immediate feedback */}
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4 drop-shadow-sm">
                            {name}
                        </h1>
                        
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="p-1.5 bg-peikan-100 dark:bg-peikan-900/30 text-peikan-700 dark:text-peikan-300 rounded-lg">
                                    <Users size={16} /> 
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-xs font-bold text-gray-900 dark:text-white">{channel.participants.length.toLocaleString()}</span>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">مشترک</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="p-1.5 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-300 rounded-lg">
                                    <MessageCircle size={16} /> 
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-xs font-bold text-gray-900 dark:text-white">{channel.messages.length.toLocaleString()}</span>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">پست</span>
                                </div>
                            </div>

                            {channel.isPinned && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 text-xs font-bold border border-amber-100 dark:border-amber-900/30">
                                    <ShieldCheck size={14} /> 
                                    سنجاق شده
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex justify-center mb-12 sticky top-0 z-20 py-2 shrink-0">
                        <div className="flex p-1.5 bg-white/80 dark:bg-[#252525]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none">
                            <button 
                                onClick={() => setActiveTab('settings')}
                                className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2.5 ${
                                    activeTab === 'settings' ? 'text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                }`}
                            >
                                {activeTab === 'settings' && (
                                    <motion.div 
                                        layoutId="activeTabBg"
                                        className="absolute inset-0 bg-peikan-700 rounded-xl shadow-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Settings size={18} />
                                    تنظیمات
                                </span>
                            </button>
                            <button 
                                onClick={() => setActiveTab('compose')}
                                className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2.5 ${
                                    activeTab === 'compose' ? 'text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                }`}
                            >
                                {activeTab === 'compose' && (
                                    <motion.div 
                                        layoutId="activeTabBg"
                                        className="absolute inset-0 bg-peikan-700 rounded-xl shadow-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Send size={18} />
                                    انتشار پیام
                                </span>
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'settings' ? (
                            <motion.div 
                                key="settings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-2xl mx-auto w-full flex flex-col flex-1 pb-4"
                            >
                                <div className="space-y-8 bg-white dark:bg-[#252525] p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 mb-4">
                                    <div className="space-y-3 group">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block pr-1">
                                            نام نمایشی
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-4 pr-12 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl outline-none text-xl font-bold text-gray-900 dark:text-white focus:border-peikan-700 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all shadow-sm"
                                            />
                                            <Hash className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-peikan-700 transition-colors" size={20} />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 dark:bg-white/10 rounded-lg text-gray-400 group-hover:text-peikan-700 transition-colors cursor-pointer">
                                                <Edit3 size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 group">
                                        <div className="flex justify-between items-center pr-1">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">
                                                توضیحات و بیوگرافی
                                            </label>
                                            <span className="text-[10px] text-gray-400">نمایش در پروفایل</span>
                                        </div>
                                        <div className="relative">
                                            <textarea 
                                                rows={5}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full pl-4 pr-12 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl outline-none text-base text-gray-900 dark:text-white focus:border-peikan-700 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all shadow-sm resize-none leading-relaxed"
                                            />
                                            <AlignLeft className="absolute right-4 top-5 text-gray-400 group-focus-within:text-peikan-700 transition-colors" size={20} />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Sticky Floating Action Bar - Clean Design */}
                                <div className="mt-auto sticky bottom-0 z-10 pt-4 pb-6 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#1e1e1e] dark:via-[#1e1e1e]/95">
                                    <div className="flex items-center justify-between gap-4">
                                        <button 
                                            onClick={handleDeleteClick}
                                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                                                isDeleteConfirm 
                                                ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20' 
                                                : 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10'
                                            }`}
                                        >
                                            {isDeleteConfirm ? (
                                                <>
                                                    <AlertTriangle size={18} />
                                                    <span>مطمئن هستید؟</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 size={18} />
                                                    <span>حذف کانال</span>
                                                </>
                                            )}
                                        </button>
                                        
                                        <button 
                                            onClick={handleSave}
                                            className="px-8 py-3 bg-peikan-700 hover:bg-peikan-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-peikan-700/20 hover:shadow-peikan-700/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={18} />
                                            <span>ذخیره تغییرات</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="compose"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex-1 flex flex-col gap-6 pb-8 h-full"
                            >
                                {/* Editor Card */}
                                <div className="bg-white dark:bg-[#252525] rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col flex-1 min-h-[400px] relative">
                                    
                                    {/* Toolbar */}
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5 sticky top-0 z-20 backdrop-blur-md">
                                        <div className="flex items-center gap-1 relative">
                                            <IconButton icon={Bold} onClick={() => handleFormat('bold')} />
                                            <IconButton icon={Italic} onClick={() => handleFormat('italic')} />
                                            <IconButton icon={List} onClick={() => handleFormat('list')} />
                                            <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-2" />
                                            <IconButton icon={LinkIcon} onClick={() => handleFormat('link')} />
                                            <div className="relative">
                                                <IconButton icon={Smile} onClick={() => setShowEmojiPicker(!showEmojiPicker)} active={showEmojiPicker} />
                                                <AnimatePresence>
                                                    {showEmojiPicker && (
                                                        <>
                                                            <div className="fixed inset-0 z-30" onClick={() => setShowEmojiPicker(false)} />
                                                            <motion.div 
                                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                                className="absolute top-full right-0 mt-2 bg-white dark:bg-[#1e1e1e] p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-40 w-64 grid grid-cols-5 gap-1 max-h-48 overflow-y-auto custom-scrollbar"
                                                            >
                                                                {EMOJIS.map(emoji => (
                                                                    <button 
                                                                        key={emoji} 
                                                                        onClick={() => { insertTextAtCursor(emoji); setShowEmojiPicker(false); }}
                                                                        className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                                                                    >
                                                                        {emoji}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold bg-peikan-50 dark:bg-peikan-900/20 text-peikan-700 dark:text-peikan-300 px-2 py-1 rounded-md">
                                                متن ساده
                                            </span>
                                            <span className="text-[10px] font-mono text-gray-400">
                                                {messageText.length} کاراکتر
                                            </span>
                                        </div>
                                    </div>

                                    {/* Main Textarea */}
                                    <div className="flex-1 relative flex flex-col">
                                        <textarea 
                                            ref={textareaRef}
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            placeholder="متن پیام خود را بنویسید..."
                                            className="flex-1 w-full p-8 bg-transparent border-none outline-none text-lg resize-none text-gray-900 dark:text-white leading-loose placeholder-gray-400 custom-scrollbar z-10"
                                        />
                                        
                                        {/* Attachment Chips Overlay - Above text area if desired, or flexible in container */}
                                        {attachments.length > 0 && (
                                            <div className="px-8 pb-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2">
                                                {attachments.map((file, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-gray-100 dark:bg-white/10 rounded-lg border border-gray-200 dark:border-white/5">
                                                        {file.type === 'image' ? <ImageIcon size={14} className="text-purple-500" /> : <Paperclip size={14} className="text-blue-500" />}
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate max-w-[150px] dir-ltr">{file.name}</span>
                                                        <button onClick={() => removeAttachment(idx)} className="p-0.5 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-colors">
                                                            <X size={12} className="text-gray-500" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Attachments Bar */}
                                    <div className="p-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/30 dark:bg-white/5">
                                        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                                            <AttachButton icon={ImageIcon} label="تصویر" onClick={() => imageInputRef.current?.click()} />
                                            <AttachButton icon={FileText} label="فایل" onClick={() => fileInputRef.current?.click()} />
                                            <AttachButton icon={BarChart2} label="نظرسنجی" onClick={() => handleFormat('poll')} />
                                        </div>
                                    </div>
                                </div>

                                {/* Controls Row */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                                     {/* Notification Toggle */}
                                     <div className="flex bg-white dark:bg-[#252525] p-1.5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                                         <button 
                                            onClick={() => setIsSilent(false)}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${!isSilent ? 'bg-peikan-50 text-peikan-700 dark:bg-peikan-900/20 dark:text-peikan-300 shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                         >
                                            <BellRing size={16} />
                                            <span className="hidden sm:inline">ارسال با زنگ</span>
                                         </button>
                                         <button 
                                            onClick={() => setIsSilent(true)}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isSilent ? 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                         >
                                            <BellOff size={16} />
                                            <span className="hidden sm:inline">ارسال بیصدا</span>
                                         </button>
                                     </div>

                                     {/* Action Buttons */}
                                     <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button className="p-3 bg-white dark:bg-[#252525] text-gray-500 hover:text-peikan-700 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm transition-colors" title="زمان‌بندی">
                                            <Calendar size={20} />
                                        </button>
                                        <button className="p-3 bg-white dark:bg-[#252525] text-gray-500 hover:text-peikan-700 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm transition-colors" title="ذخیره پیش‌نویس">
                                            <Save size={20} />
                                        </button>

                                        <button 
                                            onClick={handleSend}
                                            disabled={!messageText.trim() && attachments.length === 0}
                                            className="flex-1 sm:flex-none px-8 py-3 bg-peikan-700 hover:bg-peikan-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-peikan-700/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span>انتشار پیام</span>
                                            <Send size={18} className="rtl:-rotate-90" />
                                        </button>
                                     </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default ChannelDetailView;
