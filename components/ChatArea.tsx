import React, { useEffect, useRef, useState } from 'react';
import { Chat, Message, User } from '../types';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { Search, MoreVertical, ArrowRight, MessageSquareDashed, X, ChevronUp, ChevronDown, Pin, PinOff, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatAreaProps {
  chat: Chat | undefined;
  currentUser: User;
  onSendMessage: (text: string, type: 'text' | 'voice' | 'image' | 'file' | 'sticker' | 'gif', replyToId?: string) => void;
  onReact: (chatId: string, messageId: string, emoji: string) => void;
  onBack: () => void; // For mobile
  onToggleInfo: () => void;
  onTogglePin: (chatId: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ chat, currentUser, onSendMessage, onReact, onBack, onToggleInfo, onTogglePin }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  
  // Header Menu State
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  // Reply State
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isSearchOpen && chat?.messages) {
       scrollToBottom();
    }
  }, [chat?.messages, isSearchOpen]);

  // Search Logic
  useEffect(() => {
    if (!searchQuery.trim() || !chat) {
        setMatchIds([]);
        setCurrentMatchIndex(-1);
        return;
    }
    // Find all matches
    const ids = chat.messages
        .filter(m => m.content && m.content.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(m => m.id);
    
    setMatchIds(ids);
    if (ids.length > 0) {
        // Select the last one (newest) by default
        setCurrentMatchIndex(ids.length - 1);
        scrollToMessage(ids[ids.length - 1]);
    } else {
        setCurrentMatchIndex(-1);
    }
  }, [searchQuery, chat?.id]);

  const scrollToMessage = (id: string) => {
    const el = messageRefs.current.get(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNextMatch = () => {
      if (matchIds.length === 0) return;
      const nextIndex = (currentMatchIndex + 1) % matchIds.length;
      setCurrentMatchIndex(nextIndex);
      scrollToMessage(matchIds[nextIndex]);
  };

  const handlePrevMatch = () => {
      if (matchIds.length === 0) return;
      const prevIndex = (currentMatchIndex - 1 + matchIds.length) % matchIds.length;
      setCurrentMatchIndex(prevIndex);
      scrollToMessage(matchIds[prevIndex]);
  };

  const closeSearch = () => {
      setIsSearchOpen(false);
      setSearchQuery('');
      setMatchIds([]);
  };

  const handleReply = (message: Message) => {
      setReplyingTo(message);
  };

  // Find other participant for direct chat info
  const otherParticipant = chat?.type === 'direct' ? chat.participants.find(p => p.id !== currentUser.id) : null;
  const statusText = chat?.type === 'group' 
    ? `${chat.participants.length} عضو` 
    : (otherParticipant?.status === 'online' ? 'آنلاین' : `آخرین بازدید ${otherParticipant?.lastSeen || 'نامشخص'}`);

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-[#0b0b0b] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-peikan-700/5 rounded-full blur-3xl animate-pulse"></div>
        
        <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: "spring", duration: 0.8 }}
           className="relative z-10 flex flex-col items-center"
        >
            <div className="w-40 h-40 bg-white dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-peikan-900/5 dark:shadow-none rotate-3 hover:rotate-6 transition-transform duration-500 border border-white/50">
                <MessageSquareDashed strokeWidth={1.5} className="w-20 h-20 text-peikan-700 dark:text-peikan-400" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">خوش آمدید</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs leading-relaxed font-medium">
                جهت شروع گفتگو، یک مخاطب را از لیست انتخاب کنید یا پیام جدیدی ارسال نمایید.
            </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] dark:bg-[#0b0b0b] relative overflow-hidden">
      {/* Refined Pattern Background */}
      <div className="absolute inset-0 opacity-[0.6] dark:opacity-[0.05] pointer-events-none" style={{
        backgroundImage: `radial-gradient(#cfd8dc 1.5px, transparent 1.5px)`,
        backgroundSize: '28px 28px'
      }}></div>

      {/* Glass Header - Animated Transition between Info and Search */}
      <div className="absolute top-0 left-0 right-0 h-[72px] bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5 z-20 shadow-sm overflow-visible">
        <AnimatePresence mode="wait">
            {!isSearchOpen ? (
                <motion.div 
                    key="info-header"
                    initial={{ y: -72, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -72, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex items-center justify-between px-4 sm:px-6 h-full w-full"
                >
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-800 transition-colors">
                            <ArrowRight size={24} />
                        </button>
                        
                        <div onClick={onToggleInfo} className="flex items-center gap-3 cursor-pointer group p-1 rounded-lg hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors overflow-hidden">
                            <div className="relative">
                                <img 
                                    src={chat.avatar} 
                                    alt={chat.name} 
                                    className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-transparent group-hover:ring-peikan-200 dark:group-hover:ring-white/10 transition-all" 
                                />
                            </div>
                            <div className="flex flex-col justify-center h-full">
                                <h2 className="font-bold text-gray-900 dark:text-white text-[15px] group-hover:text-peikan-700 transition-colors">{chat.name}</h2>
                                <p className="text-[11px] text-peikan-600 dark:text-peikan-400 font-medium mt-0.5 flex items-center gap-1.5 opacity-80">
                                    {otherParticipant?.status === 'online' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
                                    {statusText}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <motion.button 
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.95 }} 
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                        >
                            <Search size={20} strokeWidth={1.5} />
                        </motion.button>
                        
                        {/* More Menu Dropdown */}
                        <div className="relative">
                            <motion.button 
                                whileHover={{ scale: 1.1 }} 
                                whileTap={{ scale: 0.95 }} 
                                onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)} 
                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isHeaderMenuOpen ? 'bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-white/10'}`}
                            >
                                <MoreVertical size={20} strokeWidth={1.5} />
                            </motion.button>

                            <AnimatePresence>
                                {isHeaderMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsHeaderMenuOpen(false)}></div>
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden"
                                        >
                                            <div className="p-1">
                                                <button 
                                                    onClick={() => {
                                                        onToggleInfo();
                                                        setIsHeaderMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-2 p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm text-gray-700 dark:text-gray-200 transition-colors"
                                                >
                                                    <Info size={16} />
                                                    <span>اطلاعات گفتگو</span>
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        onTogglePin(chat.id);
                                                        setIsHeaderMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-2 p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm text-gray-700 dark:text-gray-200 transition-colors"
                                                >
                                                    {chat.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                                                    <span>{chat.isPinned ? 'برداشتن سنجاق' : 'سنجاق کردن گفتگو'}</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="search-header"
                    initial={{ y: 72, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 72, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex items-center justify-between px-4 sm:px-6 h-full w-full bg-white dark:bg-[#121212]"
                >
                    <div className="flex items-center flex-1 gap-2 bg-gray-100 dark:bg-white/5 rounded-xl px-4 py-2 mr-2">
                        <Search size={18} className="text-gray-400" />
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="جستجو در این گفتگو..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-sm text-gray-900 dark:text-white font-medium"
                        />
                        {matchIds.length > 0 && (
                            <span className="text-xs text-gray-400 font-mono whitespace-nowrap dir-ltr">
                                {currentMatchIndex + 1} / {matchIds.length}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-lg p-0.5 mx-2">
                            <button 
                                onClick={handleNextMatch}
                                disabled={matchIds.length === 0}
                                className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md disabled:opacity-30 transition-all text-gray-600 dark:text-gray-300"
                            >
                                <ChevronDown size={18} />
                            </button>
                            <button 
                                onClick={handlePrevMatch}
                                disabled={matchIds.length === 0}
                                className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md disabled:opacity-30 transition-all text-gray-600 dark:text-gray-300"
                            >
                                <ChevronUp size={18} />
                            </button>
                        </div>

                        <button 
                            onClick={closeSearch}
                            className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Messages Scroll Area - No Scrollbar Class Applied Here */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-24 pb-6 px-2 sm:px-4 no-scrollbar z-10 scroll-smooth">
         {/* Date Pill */}
         <div className="flex justify-center mb-6 sticky top-2 z-10 opacity-80 hover:opacity-100 transition-opacity pointer-events-none">
            <span className="bg-gray-100/90 dark:bg-[#1E1E1E]/90 backdrop-blur-md text-gray-500 dark:text-gray-400 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm border border-gray-200/50 dark:border-white/10">
              امروز
            </span>
         </div>
        
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} // EaseOutQuint-ish
                className="flex flex-col gap-2 pb-2"
            >
                {chat.messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser.id;
                    const sender = chat.participants.find(p => p.id === msg.senderId);
                    const prevMsg = chat.messages[index - 1];
                    const nextMsg = chat.messages[index + 1];
                    
                    const isSameSenderAsPrev = prevMsg ? prevMsg.senderId === msg.senderId : false;
                    const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;

                    // Find parent message for reply context
                    const replyContext = msg.replyToId 
                        ? chat.messages.find(m => m.id === msg.replyToId) 
                        : undefined;

                    return (
                        <MessageBubble 
                            key={msg.id} 
                            message={msg} 
                            isMe={isMe} 
                            sender={sender}
                            previousMessageSameSender={isSameSenderAsPrev}
                            isLastInGroup={isLastInGroup}
                            highlightText={searchQuery}
                            onReply={handleReply}
                            onReact={onReact}
                            chatId={chat.id}
                            replyContext={replyContext}
                            messageRef={(el) => {
                                if (el) messageRefs.current.set(msg.id, el);
                                else messageRefs.current.delete(msg.id);
                            }}
                        />
                    );
                })}
            </motion.div>
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isSearchOpen && (
          <InputArea 
            onSendMessage={onSendMessage} 
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
          />
      )}
    </div>
  );
};

export default ChatArea;