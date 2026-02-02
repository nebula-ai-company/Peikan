import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Message, User } from '../types';
import { Check, CheckCheck, Download, Play, Pause, Reply, Smile, MoreHorizontal, MapPin, Heart } from 'lucide-react';
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
  chatId: string;
  replyContext?: Message;
  participants?: User[];
  currentUserId?: string;
}

const QUICK_REACTIONS = ['❤️', '😂', '👍', '😢', '🙏', '🔥'];

// --- EFFECT RENDERER ---
const EffectRenderer = ({ effect }: { effect: string }) => {
    if (effect === 'confetti') {
        return (
            <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1, rotate: 0 }}
                        animate={{ y: window.innerHeight + 20, rotate: 360, opacity: 0 }}
                        transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, ease: 'linear' }}
                        className="absolute w-2 h-4"
                        style={{ backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)] }}
                    />
                ))}
            </div>
        );
    }
    if (effect === 'balloons') {
        return (
            <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: window.innerHeight + 100, x: Math.random() * window.innerWidth, opacity: 1 }}
                        animate={{ y: -200 }}
                        transition={{ duration: 4 + Math.random() * 3, delay: Math.random(), ease: 'easeOut' }}
                        className="absolute w-16 h-20 rounded-full bg-red-500 opacity-80"
                        style={{ backgroundColor: ['#ff5252', '#448aff', '#69f0ae', '#ffd740'][Math.floor(Math.random() * 4)] }}
                    >
                        <div className="absolute bottom-[-20px] left-1/2 w-0.5 h-10 bg-white/50 -translate-x-1/2" />
                    </motion.div>
                ))}
            </div>
        );
    }
    if (effect === 'lasers') {
        return (
            <div className="fixed inset-0 z-50 pointer-events-none bg-black/80 flex items-center justify-center overflow-hidden">
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"
                 />
                 <div className="absolute inset-0">
                     {[...Array(5)].map((_,i) => (
                         <motion.div 
                            key={i}
                            initial={{ y: '100%', rotate: -45 }}
                            animate={{ y: '-100%' }}
                            transition={{ duration: 0.5, repeat: 3, delay: i * 0.2 }}
                            className="absolute left-0 w-full h-2 bg-blue-500 shadow-[0_0_20px_#3b82f6]"
                            style={{ top: `${i * 20}%` }}
                         />
                     ))}
                 </div>
            </div>
        );
    }
    if (effect === 'fireworks') {
        return (
            <div className="fixed inset-0 z-50 pointer-events-none bg-black/60">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 1, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
                        animate={{ scale: [0, 2], opacity: 0 }}
                        transition={{ duration: 1, delay: i * 0.4 }}
                        className="absolute w-20 h-20 rounded-full bg-radial-gradient from-yellow-500 to-transparent"
                        style={{ boxShadow: `0 0 50px ${['red', 'gold', 'blue'][i % 3]}` }}
                    />
                ))}
            </div>
        );
    }
    if (effect === 'spotlight') {
        return (
            <div className="fixed inset-0 z-[15] pointer-events-none bg-black/70 animate-in fade-in duration-500">
                {/* Spotlight effect is simulated by darkening the whole screen, the message bubble z-index will pop it out */}
                <div className="absolute top-0 left-0 w-full h-full bg-transparent" />
            </div>
        );
    }
    if (effect === 'love') {
        return (
            <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1.5 }}
                >
                    <Heart size={200} fill="#ef4444" className="text-red-500 drop-shadow-2xl" />
                </motion.div>
            </div>
        );
    }
    return null;
};

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
  replyContext,
  participants,
  currentUserId
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  
  // Effect State
  const [showScreenEffect, setShowScreenEffect] = useState(false);
  const [isInvisibleInkRevealed, setIsInvisibleInkRevealed] = useState(false);

  useEffect(() => {
      // Trigger screen effect on mount if exists
      if (message.effect && ['echo', 'spotlight', 'balloons', 'confetti', 'love', 'lasers', 'fireworks'].includes(message.effect)) {
          setShowScreenEffect(true);
          const timer = setTimeout(() => setShowScreenEffect(false), 3000); // Play for 3s
          return () => clearTimeout(timer);
      }
  }, [message.effect]);

  // Audio Playback Simulation Logic
  useEffect(() => {
    let interval: number;
    if (isPlaying && message.type === 'voice') {
        // Parse duration (e.g., "0:15" -> 15 seconds)
        const durationStr = message.duration || "0:05";
        const [mins, secs] = durationStr.split(':').map(Number);
        const totalSeconds = (mins * 60) + secs;
        
        // Update progress every 100ms
        const step = 100 / (totalSeconds * 10); 
        
        interval = window.setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setIsPlaying(false);
                    return 0; // Reset
                }
                return prev + step;
            });
        }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, message.duration, message.type]);

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
  const isLocation = message.type === 'location';

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
    : ''; // Stickers, Visual Media, and Location handle their own containers

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
      if (replyContext.type === 'location') content = 'موقعیت مکانی';

      return (
          <div className="flex items-center gap-1.5 mt-0.5 opacity-80">
               {replyContext.type === 'image' && <div className="w-3 h-3 bg-current opacity-50 rounded-sm"></div>}
               <span className="truncate text-[11px]">{content}</span>
          </div>
      );
  };

  // Generate deterministic waveform based on message ID
  const waveformBars = useMemo(() => {
      const bars = [];
      const seed = message.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      for (let i = 0; i < 35; i++) {
          // Simple pseudo-random generator based on seed and index
          const val = Math.sin(seed * (i + 1)) * 10000;
          const height = Math.floor((val - Math.floor(val)) * 70) + 30; // 30% to 100% height
          bars.push(height);
      }
      return bars;
  }, [message.id]);

  // --- BUBBLE EFFECT ANIMATIONS ---
  const bubbleAnimation = useMemo(() => {
      if (!message.effect) return { opacity: 1, scale: 1, y: 0 };
      switch (message.effect) {
          case 'slam': return { scale: [3, 0.8, 1], rotate: [0, -5, 5, 0] };
          case 'loud': return { scale: [1, 1.2, 1], rotate: [0, -2, 2, 0] };
          case 'gentle': return { scale: [0.5, 1], opacity: [0, 1] };
          default: return { opacity: 1, scale: 1, y: 0 };
      }
  }, [message.effect]);

  // Invisible Ink Logic
  const contentFilter = message.effect === 'invisible' && !isInvisibleInkRevealed 
      ? 'blur(8px)' 
      : 'none';

  return (
    <>
        <AnimatePresence>
            {showScreenEffect && message.effect && <EffectRenderer effect={message.effect} />}
        </AnimatePresence>

        <motion.div 
        ref={messageRef}
        // Base animation + Bubble Effect Animation
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={bubbleAnimation}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        className={`flex w-full ${alignClass} group mb-2.5 relative px-1 ${showScreenEffect && message.effect === 'spotlight' ? 'z-20' : ''}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => { setShowActions(false); setShowReactionPicker(false); }}
        onClick={() => {
            if (message.effect === 'invisible') setIsInvisibleInkRevealed(!isInvisibleInkRevealed);
            // Replay screen effect on click
            if (['echo', 'spotlight', 'balloons', 'confetti', 'love', 'lasers', 'fireworks'].includes(message.effect || '')) {
                setShowScreenEffect(true);
                setTimeout(() => setShowScreenEffect(false), 3000);
            }
        }}
        >
        
        {/* Echo clones (behind main message) */}
        {showScreenEffect && message.effect === 'echo' && (
            <>
                <motion.div initial={{ opacity: 0.6, x: 20, y: 0 }} animate={{ opacity: 0, x: 60, y: 0 }} transition={{ duration: 2 }} className={`absolute ${alignClass} w-full opacity-50`}>
                    <div className={`p-4 bg-peikan-700/50 rounded-2xl`}>{message.content}</div>
                </motion.div>
                <motion.div initial={{ opacity: 0.4, x: 40, y: 0 }} animate={{ opacity: 0, x: 100, y: 0 }} transition={{ duration: 2, delay: 0.1 }} className={`absolute ${alignClass} w-full opacity-30`}>
                    <div className={`p-4 bg-peikan-700/30 rounded-2xl`}>{message.content}</div>
                </motion.div>
            </>
        )}

        <div className={`max-w-[85%] md:max-w-[70%] lg:max-w-[60%] flex flex-col ${alignItemsClass} relative`}>
            
            {/* Sender Name (Only first message of a group from them) */}
            {!isMe && !previousMessageSameSender && sender && (
            <span className="text-[11px] font-bold text-peikan-700 dark:text-peikan-400 mb-1 px-2.5 opacity-90">
                {sender.name}
            </span>
            )}

            {/* Bubble Wrapper with Relative Positioning for Actions */}
            <div className={`relative z-10 min-w-[100px] group/bubble ${bubbleContainerClass}`} style={{ filter: contentFilter, transition: 'filter 0.3s ease' }}>
            
            {/* Action Bar (Reply, React) */}
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

            {/* Reply Indicator */}
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

            {/* 3. LOCATION */}
            {isLocation && (
                <div className={`relative overflow-hidden ${roundedClass} bg-white dark:bg-[#202020] shadow-sm group/media cursor-pointer border border-gray-100 dark:border-white/5`}
                    onClick={() => {
                        const [lat, lng] = message.content.split(',');
                        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
                    }}
                >
                    <div className="relative w-full h-40 bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                        <div className="relative z-10 w-10 h-10 bg-red-500 rounded-full rounded-br-none -rotate-45 shadow-lg flex items-center justify-center transform hover:-translate-y-1 transition-transform">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    
                    <div className="p-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                                <MapPin size={18} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">موقعیت مکانی</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">برای مشاهده کلیک کنید</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full text-white text-[10px] font-bold">
                        {message.timestamp}
                    </div>
                </div>
            )}

            {/* 4. VISUAL MEDIA (GIF / IMAGE) */}
            {isVisualMedia && (
                <div className={`relative overflow-hidden ${roundedClass} ${hasCaption ? (isMe ? 'bg-peikan-700' : 'bg-white dark:bg-[#202020] border border-gray-100 dark:border-white/5') : ''} shadow-sm transition-all group/media`}>
                    
                    {message.replyToId && (
                        <div className={`mx-3 mt-3 mb-2 text-xs border-r-[3px] border-peikan-500 pr-2 py-1 bg-black/40 backdrop-blur-md rounded-r-sm rounded-l-md text-white z-10 relative cursor-pointer`}>
                        <div className="font-bold">پاسخ به پیام</div>
                        {renderReplyContext()}
                        </div>
                    )}

                    <div className="relative">
                        <img 
                        src={message.mediaUrl} 
                        alt="attachment"
                        className={`block w-full h-auto object-cover max-w-md max-h-[500px] min-w-[200px] min-h-[150px] cursor-pointer hover:brightness-95 transition-all bg-gray-100 dark:bg-white/5 ${hasCaption ? '' : roundedClass}`}
                        />
                        
                        {message.type === 'gif' && (
                            <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-md border border-white/20 text-white text-[10px] font-black px-2 py-1 rounded-lg tracking-widest shadow-lg flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                GIF
                            </div>
                        )}

                        {!hasCaption && (
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        )}
                    </div>

                    {hasCaption && (
                        <div className={`px-3 pt-2 pb-3 ${isMe ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                            <p className="text-[15px] leading-relaxed dir-auto whitespace-pre-wrap">{renderContent(message.content)}</p>
                        </div>
                    )}

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

            {/* 5. FILE */}
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

            {/* 6. VOICE */}
            {message.type === 'voice' && (
                <div className="flex items-center gap-3 min-w-[260px] py-1.5">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 ${isMe ? 'bg-white text-peikan-700' : 'bg-peikan-700 text-white'}`}
                >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
                
                <div className="flex-1 flex flex-col gap-1.5 justify-center">
                    <div className="flex items-center gap-[2px] h-6 items-center">
                        {waveformBars.map((heightPerc, i) => {
                        const barProgress = (i / waveformBars.length) * 100;
                        const isPlayed = barProgress < progress;
                        return (
                            <div 
                            key={i} 
                            className={`w-[4px] rounded-full transition-colors duration-100 ${
                                isPlayed 
                                    ? (isMe ? 'bg-white' : 'bg-peikan-700 dark:bg-peikan-400') 
                                    : (isMe ? 'bg-white/40' : 'bg-gray-300 dark:bg-gray-600')
                            }`}
                            style={{ height: `${heightPerc}%` }}
                            />
                        );
                        })}
                    </div>
                    
                    <div className={`flex justify-between text-[10px] font-mono ${isMe ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                        <span>
                            {isPlaying 
                                ? `${Math.floor((progress / 100) * (parseInt(message.duration?.split(':')[1] || "5"))) || 0}s` 
                                : message.duration
                            }
                        </span>
                    </div>
                </div>
                </div>
            )}

            {/* Footer: Time & Status (Standard Bubbles) */}
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
            
            {/* REACTION PILLS - OVERLAPPING STYLE */}
            {message.reactions && message.reactions.length > 0 && (
                <div className={`absolute -bottom-4 ${isMe ? 'left-2' : 'right-2'} flex items-center gap-1.5 z-20`}> 
                    {/* Changed bottom-3 to -bottom-4 to account for larger size */}
                    {message.reactions.map((reaction, idx) => {
                        const reactorNames = reaction.users.map(uid => {
                            if (uid === currentUserId || uid === 'me') return 'شما';
                            const u = participants?.find(p => p.id === uid);
                            return u ? u.name : 'کاربر ناشناس';
                        }).join('، ');

                        return (
                            <motion.button 
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.2 }}
                                onClick={(e) => { e.stopPropagation(); onReact(chatId, message.id, reaction.emoji); }}
                                // Removed bg-white, border, shadow classes. 
                                // Added cursor-pointer (though button has it by default).
                                className="group/reaction relative flex items-center justify-center"
                            >
                                {/* Made text larger (text-3xl) and added drop shadow for visibility */}
                                <span className="text-3xl leading-none drop-shadow-md hover:drop-shadow-xl transition-all filter">
                                    {reaction.emoji}
                                </span>
                                
                                {reaction.count > 1 && (
                                    <span className={`text-[10px] font-bold ml-1 px-1.5 py-0.5 rounded-full shadow-sm ${
                                        reaction.users.includes(currentUserId || 'me') 
                                            ? 'bg-peikan-100 text-peikan-700 dark:bg-peikan-900 dark:text-peikan-300' 
                                            : 'bg-white dark:bg-[#333] text-gray-600 dark:text-gray-300'
                                    }`}>
                                        {reaction.count}
                                    </span>
                                )}
                                
                                {/* Custom Tooltip */}
                                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-[10px] font-medium px-2 py-1 rounded-md opacity-0 group-hover/reaction:opacity-100 transition-opacity pointer-events-none z-30 shadow-lg backdrop-blur-sm">
                                    {reactorNames}
                                    {/* Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            )}

            </div>

            {/* Message Tail Vector */}
            {isLastInGroup && useStandardBubble && (
            <div className={`absolute bottom-0 w-3 h-3 z-0 ${isMe ? '-right-[5px]' : '-left-[5px]'}`}>
                {isMe ? (
                    <svg viewBox="0 0 10 10" className="w-full h-full text-peikan-700 fill-current">
                    <path d="M0 0 L10 10 L0 10 Z" />
                    <path d="M0,0 Q6,0 10,10 L0,10 Z" fill="currentColor" /> 
                    </svg>
                ) : (
                    <svg viewBox="0 0 10 10" className="w-full h-full text-white dark:text-[#202020] fill-current">
                    <path d="M10,0 Q4,0 0,10 L10,10 Z" fill="currentColor" />
                    </svg>
                )}
            </div>
            )}
        </div>
        </motion.div>
    </>
  );
};

export default MessageBubble;