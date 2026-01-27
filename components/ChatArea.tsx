import React, { useEffect, useRef } from 'react';
import { Chat, Message, User } from '../types';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { Phone, Video, Search, MoreVertical, ArrowRight } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center h-full bg-[#f0f2f5] dark:bg-[#0b0b0b] text-gray-400">
        <div className="w-32 h-32 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">👋</span>
        </div>
        <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">به پیکان خوش آمدید</h2>
        <p className="text-sm">برای شروع گفتگو، یک مخاطب را انتخاب کنید</p>
      </div>
    );
  }

  // Find other participant for direct chat info
  const otherParticipant = chat.type === 'direct' ? chat.participants.find(p => p.id !== currentUser.id) : null;
  const statusText = chat.type === 'group' 
    ? `${chat.participants.length} عضو` 
    : (otherParticipant?.status === 'online' ? 'آنلاین' : `آخرین بازدید ${otherParticipant?.lastSeen || 'نامشخص'}`);

  return (
    <div className="flex flex-col h-full bg-[#efe7dd] dark:bg-[#0b0b0b] relative">
      {/* Chat Background Pattern (Optional subtle texture can be added here) */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Header */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border p-3 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 -mr-2 text-gray-500">
            <ArrowRight size={24} />
          </button>
          
          <div onClick={onToggleInfo} className="flex items-center gap-3 cursor-pointer">
            <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white text-sm">{chat.name}</h2>
              <p className="text-xs text-peikan-600 dark:text-peikan-400 font-medium">
                {statusText}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-peikan-700 dark:text-peikan-300">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors hidden sm:block">
             <Search size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors hidden sm:block">
             <Phone size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors hidden sm:block">
             <Video size={20} />
          </button>
          <button onClick={onToggleInfo} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
             <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar z-0 flex flex-col gap-1">
         {/* Date Separator Example */}
         <div className="flex justify-center my-4 sticky top-2 z-10">
            <span className="bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full shadow-sm">
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