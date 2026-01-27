import React, { useEffect, useRef } from 'react';
import { Chat, Message, User } from '../types';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { Phone, Video, Search, MoreVertical, ArrowRight, MessageSquareDashed } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatAreaProps {
  chat: Chat | undefined;
  currentUser: User;
  onSendMessage: (text: string, type: 'text' | 'voice' | 'image' | 'file') => void;
  onBack: () => void; // For mobile
  onToggleInfo: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ chat, currentUser, onSendMessage, onBack, onToggleInfo }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-[#0b0b0b] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-peikan-500/5 rounded-full blur-3xl animate-pulse"></div>
        
        <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: "spring", duration: 0.8 }}
           className="relative z-10 flex flex-col items-center"
        >
            <div className="w-40 h-40 bg-white dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-gray-200/50 dark:shadow-none rotate-3 hover:rotate-6 transition-transform duration-500">
                <MessageSquareDashed strokeWidth={1} className="w-20 h-20 text-peikan-600 dark:text-peikan-400" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 dark:text-gray-100 mb-4 tracking-tight">خوش آمدید</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs leading-relaxed">
                جهت شروع گفتگو، یک مخاطب را از لیست انتخاب کنید یا پیام جدیدی ارسال نمایید.
            </p>
        </motion.div>
      </div>
    );
  }

  // Find other participant for direct chat info
  const otherParticipant = chat.type === 'direct' ? chat.participants.find(p => p.id !== currentUser.id) : null;
  const statusText = chat.type === 'group' 
    ? `${chat.participants.length} عضو` 
    : (otherParticipant?.status === 'online' ? 'آنلاین' : `آخرین بازدید ${otherParticipant?.lastSeen || 'نامشخص'}`);

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6] dark:bg-[#0b0b0b] relative">
      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.05] pointer-events-none" style={{
        backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }}></div>

      {/* Glass Header */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-white/5 z-20 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowRight size={24} />
          </button>
          
          <div onClick={onToggleInfo} className="flex items-center gap-4 cursor-pointer group">
            <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-white/10" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-[15px] group-hover:text-peikan-700 transition-colors">{chat.name}</h2>
              <p className="text-xs text-peikan-600 dark:text-peikan-400 font-medium mt-0.5 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${otherParticipant?.status === 'online' || chat.type === 'group' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                {statusText}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors hidden sm:block">
             <Search size={20} strokeWidth={2} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors hidden sm:block">
             <Phone size={20} strokeWidth={2} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={onToggleInfo} className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
             <MoreVertical size={20} strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pt-24 pb-4 px-2 sm:px-4 custom-scrollbar z-10 flex flex-col gap-2">
         {/* Date Pill */}
         <div className="flex justify-center mb-4 sticky top-2 z-10 opacity-90 hover:opacity-100 transition-opacity">
            <span className="bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-600 dark:text-gray-300 text-[11px] font-bold px-4 py-1.5 rounded-full shadow-sm border border-white/20">
              امروز
            </span>
         </div>

        {chat.messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser.id;
          const sender = chat.participants.find(p => p.id === msg.senderId);
          const prevMsg = chat.messages[index - 1];
          const isSameSender = prevMsg ? prevMsg.senderId === msg.senderId : false;

          return (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isMe={isMe} 
              sender={sender}
              previousMessageSameSender={isSameSender}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputArea onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatArea;