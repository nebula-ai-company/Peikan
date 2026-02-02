import React, { useState } from 'react';
import { Message, User } from '../types';
import { Check, CheckCheck, Download, Play, Pause, Reply, Smile, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  sender?: User;
  previousMessageSameSender: boolean;
  isLastInGroup: boolean;
  highlightText?: string;
  messageRef?: (el: HTMLDivElement | null) => void;
  onReply: (message: Message) => void;
  onReact: (chatId: string, messageId: string, emoji: string) => void;
  chatId: string; // Needed for reactions
  replyContext?: Message; // Passed from parent to show actual content
}

const QUICK_REACTIONS = ['❤️', '😂', '👍', '😢', '🙏', '🔥'];

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isMe, 
  sender, 
  previousMessageSameSender, 
  isLastInGroup,
  highlightText,
  messageRef,
  onReply,
  onReact,
  chatId,
  replyContext
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  // Layout Logic for RTL Direction
  const alignClass = isMe ? 'justify-start' : 'justify-end';
  const alignItemsClass = isMe ? 'items-start' : 'items-end';

  // Advanced Border Radius Logic
  const roundedClass = isMe
    ? `${previousMessageSameSender ? 'rounded-tr-md' : 'rounded-tr-2xl'} rounded-tl-2xl rounded-bl-2xl ${isLastInGroup ? 'rounded-br-none' : 'rounded-br-2xl'}`
    : `${previousMessageSameSender ? 'rounded-tl-md' : 'rounded-tl-2xl'} rounded-tr-2xl rounded-br-2xl ${isLastInGroup ? 'rounded-bl-none' : 'rounded-bl-2xl'}`;

  // Message Type Categories
  const isSticker = message.type === 'sticker';
  const isVisualMedia = message.type === 'image' || message.type === 'gif';
  const isAudioOrFile = message.type === 'voice' || message.type === 'file';
  const isText = message.type === 'text';

  // Check for Captions (Excluding default placeholders)
  const hasCaption = isVisualMedia && message.content && !['GIF', 'Image', 'Sticker'].includes(message.content) && message.content !== message.fileName;
  
  // Dynamic Styling based on content type
  // Text, Audio, File use standard bubble background and padding
  const useStandardBubble = isText || isAudioOrFile;

  const bubbleContainerClass = useStandardBubble
    ? `px-4 py-2 ${roundedClass} ${
        isMe
          ? 'bg-peikan-700 text-white shadow-[0_1px_2px_rgba(13,71,161,0.1)]'
          : 'bg-white dark:bg-[#202020] text-gray-900 dark:text-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-none border border-transparent dark:border-white/5'
      }`
    : ''; // Stickers and Visual Media handle their own containers

  // Helper to highlight text
  const renderContent = (content: string) => {
    if (!highlightText || !highlightText.trim()) return content;
    
    const safeHighlight = highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = content.split(new RegExp(`(${safeHighlight})`, 'gi'));
    
    return parts.map((part, i) => 
      part.toLowerCase() === highlightText.toLowerCase() 
        ? <span key={i} className="bg-yellow-300 text-black rounded-[2px] px-0.5 font-medium shadow-sm">{part}</span> 
        : part
    );
  };

  const renderReplyContext = () => {
      if (!replyContext) return (
          <div className="truncate opacity-70 mt-0.5 italic text-[11px]">پیام حذف شده</div>
      );

      let content = replyContext.content;
      if (replyContext.type === 'image') content = 'تصویر';
      if (replyContext.type === 'voice') content = 'پیام صوتی';
      if (replyContext.type === 'file') content = replyContext.fileName || 'فایل';
      if (replyContext.type === 'sticker') content = 'استیکر';

      return (
          <div className="flex items-center gap-1.5 mt-0.5 opacity-80">
               {replyContext.type === 'image' && <div className="w-3 h-3 bg-current opacity-50 rounded-sm"></div>}
               <span className="truncate text-[11px]">{content}</span>
          </div>
      );
  };

  return (
    <motion.div 
      ref={messageRef}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex w-full ${alignClass} group mb-1 relative px-1`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowReactionPicker(false); }}
    >
      <div className={`max-w-[85%] md:max-w-[70%] lg:max-w-[60%] flex flex-col ${alignItemsClass} relative`}>
        
        {/* Sender Name (Only first message of a group from them) */}
        {!isMe && !previousMessageSameSender && sender && (
          <span className="text-[11px] font-bold text-peikan-700 dark:text-peikan-400 mb-1 px-2.5 opacity-90">
            {sender.name}
          </span>
        )}

        {/* Bubble Wrapper with Relative Positioning for Actions */}
        <div className={`relative z-10 min-w-[100px] group/bubble ${bubbleContainerClass}`}>
          
          {/* Action Bar (Reply, React) - NOW INSIDE THE BUBBLE WRAPPER */}
          <div 
            className={`absolute top-1/2 -translate-y-1/2 ${
                isMe ? 'right-full mr-2' : 'left-full ml-2'
            } z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto`}
          >
             <motion.div 
                initial={{ scale: 0.8 }} 
                whileHover={{ scale: 1.1 }} 
                className="bg-white dark:bg-[#252525] shadow-md border border-gray-100 dark:border-white/10 rounded-full p-1.5 cursor-pointer text-gray-500 hover:text-peikan-700 dark:text-gray-400 dark:hover:text-white"
                onClick={(e) => { e.stopPropagation(); onReply(message); }}
                title="پاسخ"
             >
                <Reply size={16} />
             </motion.div>
             
             <div className="relative">
                <motion.div 
                    initial={{ scale: 0.8 }} 
                    whileHover={{ scale: 1.1 }} 
                    className="bg-white dark:bg-[#252525] shadow-md border border-gray-100 dark:border-white/10 rounded-full p-1.5 cursor-pointer text-gray-500 hover:text-peikan-700 dark:text-gray-400 dark:hover:text-white"
                    onClick={(e) => { e.stopPropagation(); setShowReactionPicker(!showReactionPicker); }}
                    title="واکنش"
                >
                    <Smile size={16} />
                </motion.div>
                
                {/* Quick Reaction Picker Popover */}
                <AnimatePresence>
                    {showReactionPicker && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            className={`absolute bottom-full mb-2 ${isMe ? 'right-0' : 'left-0'} bg-white dark:bg-[#252525] rounded-full shadow-xl border border-gray-100 dark:border-white/10 p-1.5 flex items-center gap-1 z-50`}
                        >
                            {QUICK_REACTIONS.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={(e) => { e.stopPropagation(); onReact(chatId, message.id, emoji); setShowReactionPicker(false); }}
                                    className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-transform hover:scale-125"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
          </div>

          {/* Reply Indicator (Standard Bubble) */}
          {message.replyToId && useStandardBubble && (
            <div className={`mb-2 text-xs border-r-[3px] ${isMe ? 'border-white/40' : 'border-peikan-700'} pr-2 py-1 ${isMe ? 'bg-black/10' : 'bg-gray-50 dark:bg-white/5'} rounded-r-sm rounded-l-md cursor-pointer hover:opacity-80 transition-opacity`} onClick={() => {/* Scroll to message could go here */}}>
               <div className={`font-bold ${isMe ? 'text-white/90' : 'text-peikan-700 dark:text-peikan-400'}`}>پاسخ به:</div>
               {renderReplyContext()}
            </div>
          )}

          {/* --- CONTENT TYPES --- */}

          {/* 1. TEXT */}
          {isText && (
            <p className="text-[15px] leading-[1.6] whitespace-pre-wrap font-normal pb-1">
              {renderContent(message.content)}
            </p>
          )}

          {/* 2. STICKER */}
          {isSticker && (
            <div className="py-1">
               <motion.img 
                 src={message.mediaUrl} 
                 alt="Sticker"
                 className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-xl hover:scale-105 transition-transform cursor-pointer"
                 initial={{ scale: 0.8 }}
                 animate={{ scale: 1 }}
               />
            </div>
          )}

          {/* 3. VISUAL MEDIA (GIF / IMAGE) */}
          {isVisualMedia && (
             <div className={`relative overflow-hidden ${roundedClass} ${hasCaption ? (isMe ? 'bg-peikan-700' : 'bg-white dark:bg-[#202020] border border-gray-100 dark:border-white/5') : ''} shadow-sm transition-all group/media`}>
                 
                 {/* Reply in Media (If full media card) */}
                 {message.replyToId && (
                    <div className={`mx-3 mt-3 mb-2 text-xs border-r-[3px] border-peikan-500 pr-2 py-1 bg-black/40 backdrop-blur-md rounded-r-sm rounded-l-md text-white z-10 relative cursor-pointer`}>
                       <div className="font-bold">پاسخ به پیام</div>
                       {renderReplyContext()}
                    </div>
                 )}

                 {/* Image Container */}
                 <div className="relative">
                    <img 
                      src={message.mediaUrl} 
                      alt="attachment"
                      className={`block w-full h-auto object-cover max-w-md max-h-[500px] min-w-[200px] min-h-[150px] cursor-pointer hover:brightness-95 transition-all bg-gray-100 dark:bg-white/5 ${hasCaption ? '' : roundedClass}`}
                    />
                    
                    {/* GIF Badge - Improved UI */}
                    {message.type === 'gif' && (
                        <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-md border border-white/20 text-white text-[10px] font-black px-2 py-1 rounded-lg tracking-widest shadow-lg flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            GIF
                        </div>
                    )}

                    {/* Gradient Overlay for timestamp readability when no caption */}
                    {!hasCaption && (
                       <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    )}
                 </div>

                 {/* Caption Area */}
                 {hasCaption && (
                    <div className={`px-3 pt-2 pb-3 ${isMe ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                        <p className="text-[15px] leading-relaxed dir-auto whitespace-pre-wrap">{renderContent(message.content)}</p>
                    </div>
                 )}

                 {/* Timestamp & Status Overlay/Inline */}
                 <div className={`flex items-center gap-1 select-none pointer-events-none ${
                    hasCaption 
                        ? `justify-end px-3 pb-2 opacity-80 ${isMe ? 'text-white/80' : 'text-gray-400'}` 
                        : 'absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-sm'
                 }`}>
                     <span className="text-[10px] font-bold tracking-wide">
                        {message.timestamp}
                     </span>
                     {isMe && (
                        <span>
                             {message.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                        </span>
                     )}
                 </div>
             </div>
          )}

          {/* 4. FILE */}
          {message.type === 'file' && (
            <div className="flex items-center gap-3 py-1">
              <div className={`p-2.5 rounded-full ${isMe ? 'bg-white/20 text-white' : 'bg-peikan-50 dark:bg-peikan-900/30 text-peikan-700 dark:text-peikan-300'}`}>
                <Download size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate dir-ltr text-right">{message.fileName}</div>
                <div className={`text-[10px] mt-0.5 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>{message.fileSize}</div>
              </div>
            </div>
          )}

          {/* 5. VOICE */}
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

          {/* Footer: Time & Status (Only for Standard Bubbles) */}
          {useStandardBubble && (
            <div className="flex items-center justify-end gap-1 mt-1 select-none opacity-80">
                <span className={`text-[10px] font-medium tracking-wide ${isMe ? 'text-white/90' : 'text-gray-400'}`}>
                {message.timestamp}
                </span>
                {isMe && (
                <span className="text-white/90">
                    {message.isRead ? <CheckCheck size={15} strokeWidth={2} /> : <Check size={15} strokeWidth={2} />}
                </span>
                )}
            </div>
          )}
        </div>
        
        {/* REACTION PILLS */}
        {message.reactions && message.reactions.length > 0 && (
            <div className={`flex flex-wrap gap-1 mt-1 -mb-1 ${isMe ? 'justify-start' : 'justify-end'}`}>
                {message.reactions.map((reaction, idx) => (
                    <button 
                        key={idx}
                        onClick={() => onReact(chatId, message.id, reaction.emoji)}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                            reaction.users.includes('me') // Assuming 'me' is current user ID based on constants
                                ? 'bg-peikan-50 dark:bg-peikan-900/30 border-peikan-200 dark:border-peikan-800 text-peikan-700 dark:text-peikan-300' 
                                : 'bg-gray-100 dark:bg-white/5 border-white dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        } shadow-sm`}
                    >
                        <span>{reaction.emoji}</span>
                        {reaction.count > 1 && <span className="text-[10px]">{reaction.count}</span>}
                    </button>
                ))}
            </div>
        )}

        {/* Message Tail Vector (Only for Standard Bubbles & Last in Group) */}
        {isLastInGroup && useStandardBubble && (
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