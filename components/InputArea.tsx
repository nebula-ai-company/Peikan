import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Mic, Send, X, Image as ImageIcon, FileText, Camera, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJI_CATEGORIES = [
  {
    name: 'شکلک‌ها و احساسات',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃']
  },
  {
    name: 'دست‌ها و بدن',
    emojis: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁', '👅', '👄', '💋', '🩸']
  },
  {
    name: 'قلب‌ها و نمادها',
    emojis: ['💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳', '💣', '💬', '👁️‍🗨️', '🗨', '🗯', '💭', '💤']
  },
  {
      name: 'طبیعت و حیوانات',
      emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔', '🐾', '🐉', '🐲']
  },
  {
      name: 'غذا و نوشیدنی',
      emojis: ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽', '🍴', '🥄']
  },
  {
      name: 'فعالیت‌ها',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸', '🥌', '🎿', '⛷', '🏂', '🪂', '🏋️‍♀️', '🏋', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖', '🏵', '🎗', '🎫', '🎟', '🎪', '🤹', '🤹‍♂️', '🤹‍♀️', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟', '🎯', '🎳', '🎮', '🎰', '🧩']
  },
  {
      name: 'اشیاء',
      emojis: ['👓', '🕶', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🛍', '🎒', '🩴', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '🪖', '⛑', '📿', '💄', '💍', '💎', '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕', '🎼', '🎵', '🎶', '🎙', '🎚', '🎛', '🎤', '🎧', '📻', '🎷', '🪗', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🪘', '📱', '📲', '☎️', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥', '🖨', '⌨️', '🖱', '🖲', '💽', '💾', '💿', '📀', '🧮', '🎥', '🎞', '📽', '🎬', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯', '💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞', '📑', '🔖', '🏷', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳', '✏️', '✒️', '🖋', '🖊', '🖌', '🖍', '📝', '💼', '📁', '📂', '🗂', '📅', '📆', '🗒', '🗓', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇', '📏', '📐', '✂️', '🗃', '🗄', '🗑', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝', '🔨', '🪓', '⛏', '⚒', '🛠', '🗡', '⚔️', '🔫', '🪃', '🏹', '🛡', '🪚', '🔧', '🪛', '🔩', '⚙️', '🗜', '⚖️', '🦯', '🔗', '⛓', '🪝', '🧰', '🧲', '🪜', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🚪', '🛗', '🪞', '🪟', '🛏', '🛋', '🪑', '🚽', '🪠', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣', '🧼', '🫧', '🪥', '🧽', '🧯', '🛒', '🚬', '⚰️', '🪦', '⚱️', '🗿', '🪧']
  }
];

// Optimized Category Component to lazy load emojis
const EmojiCategory = React.memo(({ category, onSelect, initialVisible = false }: { category: typeof EMOJI_CATEGORIES[0], onSelect: (e: string) => void, initialVisible?: boolean }) => {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
        }
      },
      { 
          rootMargin: '100px', // Load content 100px before it comes into view
          threshold: 0
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [initialVisible]);

  return (
    <div ref={containerRef} className="mb-4">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 sticky top-0 bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-sm py-1 z-10 shadow-sm border-b border-gray-100 dark:border-white/5">
            {category.name}
        </h3>
        <div className="min-h-[60px]">
            {isVisible ? (
                <div className="grid grid-cols-8 sm:grid-cols-9 gap-1 animate-in fade-in duration-300">
                    {category.emojis.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() => onSelect(emoji)}
                            className="text-xl hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 rounded-lg transition-colors flex items-center justify-center aspect-square"
                            type="button"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="h-20 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-peikan-200 border-t-peikan-700 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    </div>
  );
});

interface InputAreaProps {
  onSendMessage: (text: string, type: 'text' | 'voice' | 'image' | 'file') => void;
  isRecording?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage('');
      if (inputRef.current) inputRef.current.focus();
    }
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    // Optional: Focus input to keep typing
    // if (inputRef.current) inputRef.current.focus(); 
  };

  const handleAttach = (type: 'image' | 'file') => {
      // Mock Data
      if (type === 'image') {
           // Use a random image with current timestamp to avoid caching issues in mock
           onSendMessage('https://picsum.photos/seed/' + Date.now() + '/600/400', 'image');
      } else if (type === 'file') {
           onSendMessage('Project_Proposal_v2.pdf', 'file');
      }
      setShowAttachMenu(false);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-4 bg-white/80 dark:bg-dark-surface/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 sticky bottom-0 z-30">
      
      {/* Popovers Layer */}
      <AnimatePresence>
        {/* Emoji Picker */}
        {showEmojiPicker && (
            <>
                <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full right-4 mb-2 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 w-80 sm:w-96 max-w-[calc(100vw-32px)] h-80 flex flex-col"
                >
                    <div className="h-full overflow-y-auto custom-scrollbar p-2">
                        {EMOJI_CATEGORIES.map((category, index) => (
                            <EmojiCategory 
                                key={category.name} 
                                category={category} 
                                onSelect={handleEmojiClick}
                                initialVisible={index === 0} // Render first category immediately
                            />
                        ))}
                    </div>
                </motion.div>
            </>
        )}

        {/* Attach Menu */}
        {showAttachMenu && (
             <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAttachMenu(false)} />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full right-16 mb-2 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-2 z-50 min-w-[180px] flex flex-col gap-1"
                >
                    <button onClick={() => handleAttach('image')} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors text-gray-700 dark:text-gray-200 w-full text-right">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400"><ImageIcon size={18} /></div>
                        <span className="text-sm font-bold">ارسال تصویر</span>
                    </button>
                    <button onClick={() => handleAttach('file')} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors text-gray-700 dark:text-gray-200 w-full text-right">
                         <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"><FileText size={18} /></div>
                        <span className="text-sm font-bold">ارسال فایل</span>
                    </button>
                    <button onClick={() => setShowAttachMenu(false)} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors text-gray-700 dark:text-gray-200 w-full text-right">
                         <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400"><Camera size={18} /></div>
                        <span className="text-sm font-bold">دوربین</span>
                    </button>
                     <button onClick={() => setShowAttachMenu(false)} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors text-gray-700 dark:text-gray-200 w-full text-right">
                         <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"><MapPin size={18} /></div>
                        <span className="text-sm font-bold">موقعیت مکانی</span>
                    </button>
                </motion.div>
             </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-red-50/80 dark:bg-red-900/10 rounded-2xl p-3 border border-red-100 dark:border-red-900/20"
          >
            <div className="flex items-center gap-4 text-red-600 dark:text-red-400 px-2">
              <div className="relative flex items-center justify-center w-8 h-8">
                 <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
                 <div className="w-3 h-3 bg-red-600 rounded-full relative z-10"></div>
              </div>
              <div className="flex flex-col">
                  <span className="font-mono text-base font-bold tracking-widest">{formatDuration(recordingDuration)}</span>
                  <span className="text-[10px] uppercase tracking-wide opacity-80">در حال ضبط</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsRecording(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-bold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                لغو
              </button>
              <button 
                onClick={() => {
                  setIsRecording(false);
                  onSendMessage('پیام صوتی (0:15)', 'voice');
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
              >
                <span className="text-sm font-bold">ارسال</span>
                <Send size={16} className="rtl:rotate-180" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-end gap-3"
          >
            <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachMenu(false); }}
                className={`p-3 transition-colors ${showEmojiPicker ? 'text-peikan-700 dark:text-peikan-400' : 'text-gray-400 hover:text-peikan-700 dark:hover:text-peikan-400'}`}
            >
              <Smile size={26} strokeWidth={1.5} />
            </motion.button>
            
            <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={() => { setShowAttachMenu(!showAttachMenu); setShowEmojiPicker(false); }}
                className={`p-3 transition-colors ${showAttachMenu ? 'text-peikan-700 dark:text-peikan-400' : 'text-gray-400 hover:text-peikan-700 dark:hover:text-peikan-400'}`}
            >
              <Paperclip size={26} strokeWidth={1.5} />
            </motion.button>

            <div className="flex-1 bg-gray-100 dark:bg-[#151515] rounded-[1.2rem] flex items-center px-5 py-3.5 min-h-[56px] focus-within:ring-2 focus-within:ring-peikan-700/20 dark:focus-within:ring-peikan-900/30 transition-all border border-transparent focus-within:bg-white dark:focus-within:bg-[#1a1a1a] shadow-inner dark:shadow-none focus-within:border-peikan-700/50">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="پیامی بنویسید..."
                className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-[15px] font-medium"
                style={{ direction: 'rtl' }}
                autoComplete="off"
              />
            </div>

            {message.trim().length > 0 ? (
              <motion.button 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className="p-3.5 bg-peikan-700 text-white rounded-2xl hover:bg-peikan-800 transition-colors shadow-lg shadow-peikan-700/20"
              >
                <Send size={24} className="rtl:rotate-180 ml-0.5" />
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setIsRecording(true);
                    setShowEmojiPicker(false);
                    setShowAttachMenu(false);
                }}
                className="p-3 text-gray-400 hover:text-peikan-700 dark:hover:text-peikan-400 transition-colors"
              >
                <Mic size={26} strokeWidth={1.5} />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputArea;