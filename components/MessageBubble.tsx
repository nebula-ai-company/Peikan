import React from 'react';
import { Message, User } from '../types';
import { Check, CheckCheck, Download, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  sender?: User;
  previousMessageSameSender: boolean;
  isLastInGroup: boolean;
  highlightText?: string;
  messageRef?: (el: HTMLDivElement | null) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isMe, 
  sender, 
  previousMessageSameSender, 
  isLastInGroup,
  highlightText,
  messageRef
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  // Layout Logic for RTL Direction
  const alignClass = isMe ? 'justify-start' : 'justify-end';
  const alignItemsClass = isMe ? 'items-start' : 'items-end';

  // Advanced Border Radius Logic
  const roundedClass = isMe
    ? `${previousMessageSameSender ? 'rounded-tr-lg' : 'rounded-tr-2xl'} rounded-tl-2xl rounded-bl-2xl ${isLastInGroup ? 'rounded-br-none' : 'rounded-br-lg'}`
    : `${previousMessageSameSender ? 'rounded-tl-lg' : 'rounded-tl-2xl'} rounded-tr-2xl rounded-br-2xl ${isLastInGroup ? 'rounded-bl-none' : 'rounded-bl-lg'}`;

  // Colors
  const bubbleStyle = isMe
    ? 'bg-peikan-700 text-white shadow-[0_1px_2px_rgba(13,71,161,0.1)]'
    : 'bg-white dark:bg-[#202020] text-gray-900 dark:text-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-none border border-transparent dark:border-white/5';

  // Helper to highlight text
  const renderContent = (content: string) => {
    if (!highlightText || !highlightText.trim()) return content;
    
    // Escape regex special characters
    const safeHighlight = highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = content.split(new RegExp(`(${safeHighlight})`, 'gi'));
    
    return parts.map((part, i) => 
      part.toLowerCase() === highlightText.toLowerCase() 
        ? <span key={i} className="bg-yellow-300 text-black rounded-[2px] px-0.5 font-medium shadow-sm">{part}</span> 
        : part
    );
  };

  return (
    <motion.div 
      ref={messageRef}
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex w-full ${alignClass} group mb-[2px] relative`}
    >
      <div className={`max-w-[85%] md:max-w-[70%] lg:max-w-[60%] flex flex-col ${alignItemsClass} relative`}>
        
        {/* Sender Name (Only first message of a group from them) */}
        {!isMe && !previousMessageSameSender && sender && (
          <span className="text-[11px] font-bold text-peikan-700 dark:text-peikan-400 mb-1 px-2.5 opacity-90">
            {sender.name}
          </span>
        )}

        <div className={`relative px-4 py-2 ${roundedClass} ${bubbleStyle} z-10 min-w-[100px]`}>
          {/* Reply Indicator */}
          {message.replyToId && (
            <div className={`mb-2 text-xs border-r-[3px] ${isMe ? 'border-white/40' : 'border-peikan-700'} pr-2 py-1 ${isMe ? 'bg-black/10' : 'bg-gray-50 dark:bg-white/5'} rounded-r-sm rounded-l-md`}>
               <div className={`font-bold ${isMe ? 'text-white/90' : 'text-peikan-700 dark:text-peikan-400'}`}>پاسخ به:</div>
               <div className="truncate opacity-70 mt-0.5">پیام قبلی...</div>
            </div>
          )}

          {/* Content Rendering */}
          {message.type === 'text' && (
            <p className="text-[15px] leading-[1.6] whitespace-pre-wrap font-normal pb-1">
              {renderContent(message.content)}
            </p>
          )}

          {message.type === 'image' && (
            <div className="-mx-2 -mt-2 mb-1">
              <img 
                src={message.mediaUrl} 
                alt="attachment" 
                className="rounded-lg min-w-[240px] max-h-80 object-cover w-full cursor-pointer hover:brightness-95 transition-all" 
              />
              {message.content && message.content !== message.fileName && (
                <p className="mt-2 px-2 text-[15px] pb-1">{renderContent(message.content)}</p>
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
            <div className="flex items-center gap-3 min-w-[260px] py-1.5">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 ${isMe ? 'bg-white text-peikan-700' : 'bg-peikan-700 text-white'}`}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>
              <div className="flex-1 flex flex-col gap-1.5 justify-center">
                 {/* Waveform */}
                 <div className="flex items-center gap-[3px] h-6 items-center">
                    {[...Array(30)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-[3px] rounded-full transition-all duration-300 ${isMe ? 'bg-white/50' : 'bg-gray-400/50'}`}
                        style={{ 
                            height: isPlaying ? `${Math.random() * 80 + 20}%` : `${Math.sin(i * 0.5) * 40 + 40}%`,
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
          <div className={`flex items-center justify-end gap-1 mt-0.5 select-none ${message.type === 'image' ? 'absolute bottom-2 right-2 bg-black/40 px-2 py-0.5 rounded-full text-white backdrop-blur-md border border-white/10' : ''}`}>
            <span className={`text-[10px] font-medium tracking-wide ${isMe || message.type === 'image' ? 'text-white/80' : 'text-gray-400'}`}>
              {message.timestamp}
            </span>
            {isMe && (
              <span className={message.type === 'image' ? 'text-white' : 'text-white/90'}>
                {message.isRead ? <CheckCheck size={15} strokeWidth={2} /> : <Check size={15} strokeWidth={2} />}
              </span>
            )}
          </div>
        </div>

        {/* Message Tail Vector */}
        {isLastInGroup && (
           <div className={`absolute bottom-0 w-3 h-3 z-0 ${isMe ? '-right-[5px]' : '-left-[5px]'}`}>
              {isMe ? (
                // Right Tail (Me)
                <svg viewBox="0 0 10 10" className="w-full h-full text-peikan-700 fill-current">
                   <path d="M0 0 L10 10 L0 10 Z" />
                   <path d="M0,0 Q6,0 10,10 L0,10 Z" fill="currentColor" /> 
                </svg>
              ) : (
                // Left Tail (Them)
                <svg viewBox="0 0 10 10" className="w-full h-full text-white dark:text-[#202020] fill-current">
                   <path d="M10,0 Q4,0 0,10 L10,10 Z" fill="currentColor" />
                </svg>
              )}
           </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;