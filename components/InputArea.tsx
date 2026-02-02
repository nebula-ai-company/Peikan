import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Mic, Send, Image as ImageIcon, FileText, Camera, MapPin, Search, Sticker as StickerIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ... (Keep existing Mock Data and Helper Components like EmojiPicker, GifPicker, StickerPicker unchanged for brevity, but I must provide full file content. Since I cannot include "..." in the final output, I will copy the mock data and components.)

const EMOJI_CATEGORIES = [
  {
    name: 'شکلک‌ها و احساسات',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃']
  },
  {
      name: 'حیوانات و طبیعت',
      emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔', '🐾', '🐉', '🐲']
  },
   {
    name: 'دست‌ها و بدن',
    emojis: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁', '👅', '👄', '💋', '🩸']
  },
  {
    name: 'قلب‌ها',
    emojis: ['💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳', '💣', '💬', '👁️‍🗨️', '🗨', '🗯', '💭', '💤']
  },
];

const STICKER_PACKS = [
  {
    id: 'robots',
    name: 'روبات‌های پیکان',
    baseUrl: 'https://api.dicebear.com/7.x/bottts/svg',
    count: 20,
    seeds: ['Felix', 'Aneka', 'Zoe', 'Marc', 'Trouble', 'Sassy', 'Bandit', 'Mischief', 'Garfield', 'Boots', 'Whiskers', 'Shadow', 'Simba', 'Oreo', 'Luna', 'Bella', 'Charlie', 'Lucy', 'Max', 'Leo']
  },
  {
    id: 'emojis_3d',
    name: 'ایموجی‌های سه بعدی',
    baseUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg',
    count: 15,
    seeds: ['Happy', 'Sad', 'Angry', 'Surprised', 'Cool', 'Love', 'Laugh', 'Wink', 'Cry', 'Sleep', 'Sick', 'Confused', 'Dead', 'Ghost', 'Alien']
  },
  {
    id: 'monsters',
    name: 'هیولاها',
    baseUrl: 'https://api.dicebear.com/7.x/thumbs/svg',
    count: 12,
    seeds: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
  }
];

const MOCK_GIFS = [
  { id: 'm1', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXp1Z2JjamM4Z2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif', title: 'Excited' },
  { id: 'm2', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlHFRbmaZtBRhXG/giphy.gif', title: 'Happy' },
  { id: 'm3', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGpkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6Zt481isNVuQI1l6/giphy.gif', title: 'Funny' },
  { id: 'm4', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmpkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufdipQqU2lhNA4g/giphy.gif', title: 'Dance' },
  { id: 'm5', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif', title: 'Cool' },
  { id: 'm6', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGpLZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKr3nzbh5WgCFxe/giphy.gif', title: 'Laugh' },
  { id: 'm7', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWpkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlCqV35hdEg2GMw/giphy.gif', title: 'Wow' },
  { id: 'm8', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmprZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZ2pkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6ozvv0zsJskzOCbu/giphy.gif', title: 'Bye' },
];

const GIPHY_API_KEY = 'KFLgNH1aogmanG6UmiHLRWqcOz2ZZx5Q';

const EmojiPicker = ({ onSelect }: { onSelect: (e: string) => void }) => (
    <div className="h-full overflow-y-auto custom-scrollbar p-2">
      {EMOJI_CATEGORIES.map((category) => (
        <div key={category.name} className="mb-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 sticky top-0 bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-sm py-1 z-10 shadow-sm border-b border-gray-100 dark:border-white/5">
            {category.name}
          </h3>
          <div className="grid grid-cols-8 sm:grid-cols-9 gap-1">
            {category.emojis.map((emoji) => (
              <button key={emoji} onClick={() => onSelect(emoji)} className="text-xl hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 rounded-lg transition-colors flex items-center justify-center aspect-square" type="button">{emoji}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
);

interface GifItem { id: string; previewUrl: string; fullUrl: string; title: string; }
const GifPicker = ({ onSelect }: { onSelect: (url: string) => void }) => {
  const [search, setSearch] = useState('');
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(async () => {
        try {
            const endpoint = search.trim() 
                ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(search)}&limit=20&rating=g`
                : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`;
            const response = await fetch(endpoint);
            const data = await response.json();
            if (data.data?.length > 0) {
                setGifs(data.data.map((item: any) => ({
                    id: item.id,
                    previewUrl: item.images?.fixed_height?.url,
                    fullUrl: item.images?.original?.url,
                    title: item.title
                })));
            } else { setGifs([]); }
        } catch {
             const shuffled = [...MOCK_GIFS].sort(() => 0.5 - Math.random()).slice(0, 12);
             setGifs(shuffled.map(m => ({ id: m.id, previewUrl: m.url, fullUrl: m.url, title: m.title })));
        } finally { setLoading(false); }
    }, 600);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="flex flex-col h-full">
        <div className="p-3 border-b border-gray-100 dark:border-white/5">
            <div className="relative bg-gray-100 dark:bg-black/20 rounded-xl">
                <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
                <input type="text" placeholder="جستجو GIF..." className="w-full bg-transparent p-2 pr-10 text-sm outline-none text-gray-800 dark:text-white" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {loading ? <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-peikan-700 border-t-transparent rounded-full animate-spin"/></div> : (
                <div className="grid grid-cols-2 gap-2">
                    {gifs.map((gif) => (
                        <div key={gif.id} onClick={() => onSelect(gif.fullUrl)} className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group">
                            <img src={gif.previewUrl} alt={gif.title} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

const StickerPicker = ({ onSelect }: { onSelect: (url: string) => void }) => {
  const [activePackId, setActivePackId] = useState(STICKER_PACKS[0].id);
  const activePack = STICKER_PACKS.find(p => p.id === activePackId) || STICKER_PACKS[0];
  return (
    <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
             <div className="grid grid-cols-4 gap-4">
                 {activePack.seeds.map((seed, i) => (
                     <button key={i} onClick={() => onSelect(`${activePack.baseUrl}?seed=${seed}`)} className="aspect-square flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors p-1">
                         <img src={`${activePack.baseUrl}?seed=${seed}`} className="w-full h-full object-contain" />
                     </button>
                 ))}
             </div>
        </div>
        <div className="h-14 border-t border-gray-100 flex items-center gap-2 px-2 overflow-x-auto">
            {STICKER_PACKS.map(pack => (
                <button key={pack.id} onClick={() => setActivePackId(pack.id)} className={`p-1.5 rounded-xl ${activePackId === pack.id ? 'bg-white shadow-sm' : 'opacity-60'}`}>
                    <img src={`${pack.baseUrl}?seed=${pack.seeds[0]}`} className="w-8 h-8" />
                </button>
            ))}
        </div>
    </div>
  );
};

interface InputAreaProps {
  onSendMessage: (text: string, type: 'text' | 'voice' | 'image' | 'file' | 'sticker' | 'gif') => void;
  isRecording?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [activePickerTab, setActivePickerTab] = useState<'emoji' | 'gif' | 'sticker'>('emoji');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hiddenDivRef = useRef<HTMLDivElement>(null);
  const [inputHeight, setInputHeight] = useState(24);

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => setRecordingDuration(p => p + 1), 1000);
    } else { setRecordingDuration(0); }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (hiddenDivRef.current && textareaRef.current) {
        hiddenDivRef.current.style.width = `${textareaRef.current.clientWidth}px`;
        const scrollHeight = hiddenDivRef.current.scrollHeight;
        const maxHeight = window.innerHeight * 0.4;
        setInputHeight(Math.min(scrollHeight, maxHeight));
        textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage('');
      if (textareaRef.current) textareaRef.current.focus();
    }
    setShowPicker(false);
    setShowAttachMenu(false);
  };

  const handleAttach = (type: 'image' | 'file') => {
      onSendMessage(type === 'image' ? 'https://picsum.photos/seed/doc/600/400' : 'Document.pdf', type);
      setShowAttachMenu(false);
  };

  const formatDuration = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <div className="relative p-4 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 z-20">
      
      {/* Ghost Div for Height Calculation */}
      <div 
        ref={hiddenDivRef}
        className="absolute top-0 left-0 -z-50 invisible whitespace-pre-wrap break-words text-[15px] font-medium pointer-events-none"
        style={{ lineHeight: '1.5', padding: '0px', height: 'auto', visibility: 'hidden', position: 'absolute' }}
      >
          {message + '\n'}
      </div>

      {/* Popovers */}
      <AnimatePresence>
        {showPicker && (
            <>
                <div className="fixed inset-0 z-30" onClick={() => setShowPicker(false)} />
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full right-4 mb-2 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-40 w-80 h-[400px] flex flex-col">
                    <div className="flex-1 overflow-hidden relative">
                        {activePickerTab === 'emoji' && <EmojiPicker onSelect={(e) => setMessage(p => p + e)} />}
                        {activePickerTab === 'gif' && <GifPicker onSelect={(url) => { onSendMessage(url, 'gif'); setShowPicker(false); }} />}
                        {activePickerTab === 'sticker' && <StickerPicker onSelect={(url) => { onSendMessage(url, 'sticker'); setShowPicker(false); }} />}
                    </div>
                    <div className="flex items-center justify-around border-t border-gray-100 dark:border-white/5 bg-gray-50/80 p-1">
                        {['emoji', 'sticker', 'gif'].map((tab) => (
                             <button key={tab} onClick={() => setActivePickerTab(tab as any)} className={`flex-1 py-2.5 flex justify-center rounded-xl ${activePickerTab === tab ? 'bg-white shadow-sm' : 'text-gray-500'}`}>{tab === 'emoji' ? <Smile size={20}/> : tab === 'sticker' ? <StickerIcon size={20}/> : <span className="text-xs font-black">GIF</span>}</button>
                        ))}
                    </div>
                </motion.div>
            </>
        )}
        {showAttachMenu && (
             <>
                <div className="fixed inset-0 z-30" onClick={() => setShowAttachMenu(false)} />
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute bottom-full right-16 mb-2 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-100 p-2 z-40 min-w-[180px] flex flex-col gap-1">
                    <button onClick={() => handleAttach('image')} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl text-sm font-bold w-full text-right"><ImageIcon size={18} className="text-purple-500"/>ارسال تصویر</button>
                    <button onClick={() => handleAttach('file')} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl text-sm font-bold w-full text-right"><FileText size={18} className="text-blue-500"/>ارسال فایل</button>
                    <button className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl text-sm font-bold w-full text-right"><Camera size={18} className="text-red-500"/>دوربین</button>
                    <button className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl text-sm font-bold w-full text-right"><MapPin size={18} className="text-green-500"/>موقعیت</button>
                </motion.div>
             </>
        )}
      </AnimatePresence>

      {/* Main Input Row */}
      {isRecording ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between bg-red-50 dark:bg-red-900/10 rounded-2xl p-3 border border-red-100">
            <div className="flex items-center gap-4 text-red-600 px-2">
              <div className="animate-pulse w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="font-mono font-bold">{formatDuration(recordingDuration)}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsRecording(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-white/50 rounded-xl">لغو</button>
              <button onClick={() => { setIsRecording(false); onSendMessage('پیام صوتی (0:15)', 'voice'); }} className="px-5 py-2 bg-red-600 text-white rounded-xl font-bold flex gap-2 items-center shadow-lg hover:bg-red-700">ارسال <Send size={16} className="rtl:rotate-180"/></button>
            </div>
          </motion.div>
      ) : (
          <div className="flex items-end gap-3 relative z-10">
            <button onClick={() => { setShowPicker(!showPicker); setShowAttachMenu(false); }} className={`p-3 transition-colors ${showPicker ? 'text-peikan-700' : 'text-gray-400 hover:text-peikan-700'}`}><Smile size={26} strokeWidth={1.5} /></button>
            <button onClick={() => { setShowAttachMenu(!showAttachMenu); setShowPicker(false); }} className={`p-3 transition-colors ${showAttachMenu ? 'text-peikan-700' : 'text-gray-400 hover:text-peikan-700'}`}><Paperclip size={26} strokeWidth={1.5} /></button>

            {/* Input Container */}
            <div 
                className="flex-1 bg-gray-100 dark:bg-[#151515] rounded-[1.2rem] flex flex-col justify-center px-5 py-3.5 min-h-[56px] border border-transparent focus-within:bg-white dark:focus-within:bg-[#1a1a1a] focus-within:ring-2 focus-within:ring-peikan-700/20 focus-within:border-peikan-700/50 cursor-text shadow-inner dark:shadow-none transition-all relative"
                onClick={() => textareaRef.current?.focus()}
            >
               <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="پیامی بنویسید..."
                rows={1}
                className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 text-[15px] font-medium resize-none overflow-hidden relative z-20"
                style={{ direction: 'rtl', lineHeight: '1.5', height: inputHeight }}
              />
            </div>

            {message.trim().length > 0 ? (
              <button onClick={handleSend} className="p-3.5 bg-peikan-700 text-white rounded-2xl hover:bg-peikan-800 transition-colors shadow-lg shadow-peikan-700/20 transform hover:scale-105 active:scale-95"><Send size={24} className="rtl:rotate-180 ml-0.5" /></button>
            ) : (
              <button onClick={() => { setIsRecording(true); setShowPicker(false); }} className="p-3 text-gray-400 hover:text-peikan-700 transition-colors transform hover:scale-110"><Mic size={26} strokeWidth={1.5} /></button>
            )}
          </div>
      )}
    </div>
  );
};

export default InputArea;