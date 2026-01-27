import React from 'react';
import { Message, User } from '../types';
import { Check, CheckCheck, Download, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  sender?: User;
  previousMessageSameSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, sender, previousMessageSameSender }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  // Layout Logic for RTL Direction
  // isMe -> Right side (justify-start in RTL flex-row)
  // !isMe -> Left side (justify-end in RTL flex-row)
  const alignClass = isMe ? 'justify-start' : 'justify-end';
  const alignItemsClass = isMe ? 'items-start' : 'items-end'; // Align text/content inside the wrapper

  // Border Radius Logic
  // Me (Right): Tail on Top-Right
  // Them (Left): Tail on Top-Left
  const roundedClass = isMe
    ? `${previousMessageSameSender ? 'rounded-tr-[1.2rem]' : 'rounded-tr-sm'} rounded-tl-[1.2rem] rounded-bl-[1.2rem] rounded-br-[1.2rem]`
    : `${previousMessageSameSender ? 'rounded-tl-[1.2rem]' : 'rounded-tl-sm'} rounded-tr-[1.2rem] rounded-br-[1.2rem] rounded-bl-[1.2rem]`;

  // Colors
  // Me: Solid Corporate Blue
  // Them: White (Light Mode) / Dark Gray (Dark Mode)
  const bubbleStyle = isMe
    ? 'bg-peikan-700 text-white shadow-md shadow-peikan-700/10'
    : 'bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-white/5';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex w-full ${alignClass} group mb-1`}
    >
      <div className={`max-w-[85%] md:max-w-[70%] lg:max-w-[60%] flex flex-col ${alignItemsClass}`}>
        
        {/* Sender Name in Group Chats (Only for 'Them') */}
        {!isMe && !previousMessageSameSender && sender && (
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1 px-1 opacity-90">
            {sender.name}
          </span>
        )}

        <div className={`relative px-4 py-2.5 ${roundedClass} ${bubbleStyle} overflow-hidden`}>
          {/* Reply Indicator */}
          {message.replyToId && (
            <div className={`mb-2 text-xs border-r-2 ${isMe ? 'border-white/40' : 'border-peikan-700'} pr-2 py-1 ${isMe ? 'bg-white/10' : 'bg-gray-50 dark:bg-white/5'} rounded-sm`}>
               <div className={`font-bold ${isMe ? 'text-white/90' : 'text-peikan-700 dark:text-peikan-400'}`}>پاسخ به:</div>
               <div className="truncate opacity-70">پیام قبلی...</div>
            </div>
          )}

          {/* Content Rendering */}
          {message.type === 'text' && (
            <p className="text-[15px] leading-7 whitespace-pre-wrap font-normal">
              {message.content}
            </p>
          )}

          {message.type === 'image' && (
            <div className="-mx-2 -mt-2 mb-1">
              <img 
                src={message.mediaUrl} 
                alt="attachment" 
                className="rounded-lg min-w-[200px] max-h-72 object-cover w-full cursor-pointer hover:opacity-95 transition-opacity" 
              />
              {message.content && message.content !== message.fileName && (
                <p className="mt-2 px-2 text-[15px]">{message.content}</p>
              )}
            </div>
          )}

          {message.type === 'file' && (
            <div className={`flex items-center gap-3 p-3 rounded-xl ${isMe ? 'bg-white/10 border border-white/20' : 'bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5'}`}>
              <div className={`p-2.5 rounded-full ${isMe ? 'bg-white/20 text-white' : 'bg-peikan-50 dark:bg-peikan-900/30 text-peikan-700 dark:text-peikan-300'}`}>
                <Download size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate dir-ltr text-right">{message.fileName}</div>
                <div className={`text-[10px] mt-0.5 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>{message.fileSize}</div>
              </div>
            </div>
          )}

          {message.type === 'voice' && (
            <div className="flex items-center gap-3 min-w-[240px] py-1">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2.5 rounded-full transition-transform active:scale-90 ${isMe ? 'bg-white text-peikan-700 shadow-sm' : 'bg-peikan-700 text-white shadow-md'}`}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>
              <div className="flex-1 flex flex-col gap-1.5 justify-center">
                 {/* Waveform */}
                 <div className="flex items-center gap-[3px] h-8 items-center">
                    {[...Array(24)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 rounded-full transition-all duration-300 ${isMe ? 'bg-white/50' : 'bg-gray-400/50'}`}
                        style={{ 
                            height: isPlaying ? `${Math.random() * 80 + 20}%` : `${Math.sin(i) * 50 + 50}%`,
                            opacity: isPlaying ? 1 : 0.7 
                        }}
                      />
                    ))}
                 </div>
                 <span className={`text-[10px] font-mono ${isMe ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>{message.duration}</span>
              </div>
            </div>
          )}

          {/* Footer: Time & Status */}
          <div className={`flex items-center justify-end gap-1 mt-1.5 select-none opacity-80 ${message.type === 'image' ? 'absolute bottom-2 right-2 bg-black/40 px-2 py-0.5 rounded-full text-white backdrop-blur-md border border-white/10' : ''}`}>
            <span className={`text-[10px] font-medium tracking-wide ${isMe || message.type === 'image' ? 'text-white' : 'text-gray-400'}`}>
              {message.timestamp}
            </span>
            {isMe && (
              <span className={message.type === 'image' ? 'text-white' : 'text-white/90'}>
                {message.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;