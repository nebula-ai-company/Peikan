import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Smile, Paperclip, Mic, Send, Image as ImageIcon, FileText, Camera, MapPin, Search, Sticker as StickerIcon, X, Reply, Trash2, StopCircle, Zap, Wind, Volume2, Move, EyeOff, PartyPopper, Heart, Sparkles, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, MessageEffect } from '../types';

// Mock Data
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
    emojis: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '✌️', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁', '👅', '👄', '💋', '🩸']
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

// --- EFFECTS DATA ---
const BUBBLE_EFFECTS: { id: MessageEffect; label: string; description: string; icon: any; color: string }[] = [
    { id: 'invisible', label: 'جوهر نامرئی', description: 'برای مشاهده ضربه بزنید', icon: EyeOff, color: 'bg-gray-500' },
    { id: 'gentle', label: 'ملایم', description: 'ارسال با متانت', icon: Wind, color: 'bg-blue-400' },
    { id: 'loud', label: 'بلند', description: 'فریاد بزنید!', icon: Volume2, color: 'bg-red-500' },
    { id: 'slam', label: 'کوبنده', description: 'ضربه محکم', icon: Move, color: 'bg-orange-600' },
];

const SCREEN_EFFECTS: { id: MessageEffect; label: string; description: string; icon: any; color: string }[] = [
    { id: 'echo', label: 'پژواک', description: 'تکرار پیام در صفحه', icon: Zap, color: 'bg-yellow-500' },
    { id: 'spotlight', label: 'نورافکن', description: 'تمرکز روی پیام', icon: Sun, color: 'bg-white text-black border border-gray-200' },
    { id: 'balloons', label: 'بادکنک‌ها', description: 'جشن تولد', icon: StickerIcon, color: 'bg-pink-500' },
    { id: 'confetti', label: 'کاغذ رنگی', description: 'شادی و سرور', icon: PartyPopper, color: 'bg-green-500' },
    { id: 'love', label: 'عشق', description: 'قلب بزرگ', icon: Heart, color: 'bg-red-600' },
    { id: 'lasers', label: 'لیزر', description: 'رقص نور', icon: Sparkles, color: 'bg-purple-600' },
    { id: 'fireworks', label: 'آتش‌بازی', description: 'انفجار نور', icon: Zap, color: 'bg-indigo-600' },
];

const EmojiPicker = ({ onSelect }: { onSelect: (e: string) => void }) => (
    <div className="h-full overflow-y-auto custom-scrollbar p-2">
      {EMOJI_CATEGORIES.map((category) => (
        <div key={category.name} className="mb-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 sticky top-0 bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-sm py-2 z-10 shadow-sm border-b border-gray-100 dark:border-white/5">
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
        <div className="h-14 border-t border-gray-100 flex items-center gap-2 px-2 overflow-x-auto bg-gray-50/50 dark:bg-white/5">
            {STICKER_PACKS.map(pack => (
                <button key={pack.id} onClick={() => setActivePackId(pack.id)} className={`p-1.5 rounded-xl transition-all ${activePackId === pack.id ? 'bg-white dark:bg-white/20 shadow-sm' : 'opacity-60 hover:opacity-100'}`}>
                    <img src={`${pack.baseUrl}?seed=${pack.seeds[0]}`} className="w-8 h-8" />
                </button>
            ))}
        </div>
    </div>
  );
};

interface InputAreaProps {
  onSendMessage: (text: string, type: 'text' | 'voice' | 'image' | 'file' | 'sticker' | 'gif' | 'location', replyToId?: string, effect?: MessageEffect) => void;
  isRecording?: boolean;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, replyingTo, onCancelReply }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [activePickerTab, setActivePickerTab] = useState<'emoji' | 'gif' | 'sticker'>('emoji');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  
  // Effect Menu State
  const [showEffectMenu, setShowEffectMenu] = useState(false);
  const [activeEffectTab, setActiveEffectTab] = useState<'bubble' | 'screen'>('bubble');
  const [isPressed, setIsPressed] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hiddenDivRef = useRef<HTMLDivElement>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // Timer ref for long press detection
  const timerRef = useRef<any>(null);
  const isLongPressRef = useRef(false);

  const [inputHeight, setInputHeight] = useState(24);

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => setRecordingDuration(p => p + 1), 1000);
    } else { setRecordingDuration(0); }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (hiddenDivRef.current && textareaRef.current) {
        hiddenDivRef.current.style.width = `${textareaRef.current.clientWidth}px`;
        const scrollHeight = hiddenDivRef.current.scrollHeight;
        const maxHeight = window.innerHeight * 0.4;
        setInputHeight(Math.min(scrollHeight, maxHeight));
        textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [message]);

  // Focus textarea when replyingTo changes
  useEffect(() => {
      if (replyingTo && textareaRef.current) {
          textareaRef.current.focus();
      }
  }, [replyingTo]);

  const handleSend = (effect?: MessageEffect) => {
    if (message.trim()) {
      onSendMessage(message, 'text', replyingTo?.id, effect);
      setMessage('');
      if (onCancelReply) onCancelReply();
      if (textareaRef.current) textareaRef.current.focus();
    }
    setShowPicker(false);
    setShowAttachMenu(false);
    setShowEffectMenu(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      onSendMessage(objectUrl, 'image', replyingTo?.id);
      if (onCancelReply) onCancelReply();
      e.target.value = ''; // Reset input
    }
    setShowAttachMenu(false);
  };

  const handleCameraSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const objectUrl = URL.createObjectURL(file);
        onSendMessage(objectUrl, 'image', replyingTo?.id); // Treat camera capture as image
        if (onCancelReply) onCancelReply();
        e.target.value = '';
    }
    setShowAttachMenu(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        // Send filename as content, App.tsx handles file mock logic
        onSendMessage(file.name, 'file', replyingTo?.id);
        if (onCancelReply) onCancelReply();
        e.target.value = '';
    }
    setShowAttachMenu(false);
  };

  const handleAttach = (type: 'image' | 'file' | 'camera' | 'location') => {
      if (type === 'image') {
          imageInputRef.current?.click();
      } else if (type === 'file') {
          docInputRef.current?.click();
      } else if (type === 'camera') {
          cameraInputRef.current?.click();
      } else if (type === 'location') {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                onSendMessage(`${latitude},${longitude}`, 'location', replyingTo?.id);
                if (onCancelReply) onCancelReply();
                setShowAttachMenu(false);
            }, (error) => {
                console.error("Location error:", error);
                alert("امکان دریافت موقعیت مکانی وجود ندارد. لطفا دسترسی مرورگر را بررسی کنید.");
                setShowAttachMenu(false);
            });
          } else {
              alert("دستگاه شما از موقعیت مکانی پشتیبانی نمی‌کند.");
              setShowAttachMenu(false);
          }
      }
  };

  // --- Revised Pointer Event Logic ---
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation(); // Critical to stop bubbling
      
      const button = e.currentTarget;
      
      // Clear previous timer
      if (timerRef.current) clearTimeout(timerRef.current);
      
      setIsPressed(true);
      isLongPressRef.current = false;
      
      try {
        button.setPointerCapture(e.pointerId);
      } catch (e) {
        // Fallback or ignore
      }

      // Start Timer - 300ms threshold
      timerRef.current = setTimeout(() => {
          isLongPressRef.current = true;
          setShowEffectMenu(true);
          setIsPressed(false);
          // Haptic feedback
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate(50);
          }
      }, 300);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation(); // Critical
      
      setIsPressed(false);
      
      const button = e.currentTarget;
      try {
        if (button.hasPointerCapture(e.pointerId)) {
            button.releasePointerCapture(e.pointerId);
        }
      } catch (e) {}

      // Clear timer if it hasn't fired yet
      if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
      }

      // Only send if it wasn't a long press
      if (!isLongPressRef.current) {
          handleSend();
      }
      
      isLongPressRef.current = false;
  };
  
  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsPressed(false);
      isLongPressRef.current = false;
      if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
      }
      
      const button = e.currentTarget;
      try {
        if (button.hasPointerCapture(e.pointerId)) {
            button.releasePointerCapture(e.pointerId);
        }
      } catch (e) {}
  };

  const formatDuration = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  const renderReplyPreview = () => {
    if (!replyingTo) return null;
    
    let contentPreview = replyingTo.content;
    let icon = null;

    if (replyingTo.type === 'image') {
        contentPreview = 'تصویر';
        icon = <ImageIcon size={14} />;
    } else if (replyingTo.type === 'voice') {
        contentPreview = 'پیام صوتی';
        icon = <Mic size={14} />;
    } else if (replyingTo.type === 'file') {
        contentPreview = replyingTo.fileName || 'فایل';
        icon = <FileText size={14} />;
    } else if (replyingTo.type === 'sticker') {
        contentPreview = 'استیکر';
        icon = <StickerIcon size={14} />;
    } else if (replyingTo.type === 'location') {
        contentPreview = 'موقعیت مکانی';
        icon = <MapPin size={14} />;
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="px-4 pb-2"
        >
            <div className="flex items-center justify-between bg-gray-100 dark:bg-[#1e1e1e] p-2 rounded-xl border-l-4 border-peikan-700 relative">
                <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="text-xs font-bold text-peikan-700 dark:text-peikan-400">پاسخ به پیام</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1.5">
                        {icon}
                        <span className="truncate max-w-[200px]">{contentPreview}</span>
                    </div>
                </div>
                <button 
                    onClick={onCancelReply} 
                    className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500"
                >
                    <X size={16} />
                </button>
            </div>
        </motion.div>
    );
  };

  return (
    <div className="relative z-20">
      
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={imageInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleImageSelect}
      />
      <input 
        type="file" 
        ref={docInputRef} 
        className="hidden" 
        accept="*/*" // Accept any file
        onChange={handleFileSelect}
      />
      <input 
        type="file" 
        ref={cameraInputRef} 
        className="hidden" 
        accept="image/*"
        capture="environment" // Suggest rear camera
        onChange={handleCameraSelect}
      />

      {/* Ghost Div for Height Calculation */}
      <div 
        ref={hiddenDivRef}
        className="absolute top-0 left-0 -z-50 invisible whitespace-pre-wrap break-words text-[15px] font-medium pointer-events-none"
        style={{ lineHeight: '1.5', padding: '0px', height: 'auto', visibility: 'hidden', position: 'absolute' }}
      >
          {message + '\n'}
      </div>

      <div className="bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 pb-2">
        {/* Reply Preview */}
        <AnimatePresence>
            {replyingTo && renderReplyPreview()}
        </AnimatePresence>
        
        <div className="p-4 pt-2">
            {/* Popovers */}
            <AnimatePresence>
                {/* iMessage Style Effect Menu - Portal to Body for Full Screen Overlay */}
                {showEffectMenu && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:justify-end sm:items-end p-4 pointer-events-auto" dir="rtl">
                        {/* Backdrop with Blur */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-md" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEffectMenu(false);
                            }} 
                        />
                        
                        {/* Menu Container */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden z-50 flex flex-col h-[400px] w-full max-w-sm mb-20 sm:mb-24 sm:ml-4"
                        >
                            {/* Header / Tabs */}
                            <div className="px-1 pt-1 pb-2 bg-gray-50/50 dark:bg-black/20">
                                <div className="flex p-1 bg-gray-200/50 dark:bg-white/5 rounded-2xl mx-3 mt-3">
                                    <button 
                                        onClick={() => setActiveEffectTab('bubble')}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all relative z-10 ${activeEffectTab === 'bubble' ? 'text-peikan-700 dark:text-white shadow-sm bg-white dark:bg-[#333]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                    >
                                        جلوه حباب
                                    </button>
                                    <button 
                                        onClick={() => setActiveEffectTab('screen')}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all relative z-10 ${activeEffectTab === 'screen' ? 'text-peikan-700 dark:text-white shadow-sm bg-white dark:bg-[#333]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                    >
                                        جلوه صفحه
                                    </button>
                                </div>
                            </div>

                            {/* Content List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeEffectTab}
                                        initial={{ opacity: 0, x: activeEffectTab === 'bubble' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: activeEffectTab === 'bubble' ? -20 : 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-2"
                                    >
                                        {activeEffectTab === 'bubble' ? (
                                            BUBBLE_EFFECTS.map(effect => (
                                                <button 
                                                    key={effect.id}
                                                    onClick={() => handleSend(effect.id)}
                                                    className="w-full flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-gray-100 dark:hover:border-white/5"
                                                >
                                                    <div className={`w-10 h-10 rounded-full ${effect.color} text-white flex items-center justify-center shadow-md`}>
                                                        {React.createElement(effect.icon, { size: 20 })}
                                                    </div>
                                                    <div className="flex-1 text-right">
                                                        <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-peikan-700 transition-colors">{effect.label}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{effect.description}</p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-peikan-700 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-lg text-white">
                                                        <Send size={16} className="rtl:-rotate-90 ml-0.5" />
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            SCREEN_EFFECTS.map(effect => (
                                                <button 
                                                    key={effect.id}
                                                    onClick={() => handleSend(effect.id)}
                                                    className="w-full flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-gray-100 dark:hover:border-white/5"
                                                >
                                                    <div className={`w-10 h-10 rounded-full ${effect.color} text-white flex items-center justify-center shadow-md`}>
                                                        {React.createElement(effect.icon, { size: 20 })}
                                                    </div>
                                                    <div className="flex-1 text-right">
                                                        <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-peikan-700 transition-colors">{effect.label}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{effect.description}</p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-peikan-700 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-lg text-white">
                                                        <Send size={16} className="rtl:-rotate-90 ml-0.5" />
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            
                            {/* Cancel Footer */}
                            <div className="p-3 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5">
                                <button 
                                    onClick={() => setShowEffectMenu(false)}
                                    className="w-full py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-white dark:hover:bg-white/10 hover:text-gray-800 dark:hover:text-white transition-colors"
                                >
                                    انصراف
                                </button>
                            </div>
                        </motion.div>
                    </div>,
                    document.body
                )}

                {showPicker && (
                    <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowPicker(false)} />
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full right-4 mb-2 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-40 w-80 h-[400px] flex flex-col">
                            <div className="flex-1 overflow-hidden relative">
                                {activePickerTab === 'emoji' && <EmojiPicker onSelect={(e) => setMessage(p => p + e)} />}
                                {activePickerTab === 'gif' && <GifPicker onSelect={(url) => { onSendMessage(url, 'gif', replyingTo?.id); if(onCancelReply) onCancelReply(); setShowPicker(false); }} />}
                                {activePickerTab === 'sticker' && <StickerPicker onSelect={(url) => { onSendMessage(url, 'sticker', replyingTo?.id); if(onCancelReply) onCancelReply(); setShowPicker(false); }} />}
                            </div>
                            
                            {/* Improved Dark Mode Tabs */}
                            <div className="flex items-center justify-around border-t border-gray-100 dark:border-white/5 bg-gray-50/80 dark:bg-[#151515] p-1.5">
                                {['emoji', 'sticker', 'gif'].map((tab) => (
                                    <button 
                                        key={tab} 
                                        onClick={() => setActivePickerTab(tab as any)} 
                                        className={`flex-1 py-2.5 flex justify-center rounded-xl transition-all ${
                                            activePickerTab === tab 
                                                ? 'bg-white dark:bg-[#2A2A2A] text-peikan-700 dark:text-white shadow-sm' 
                                                : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        {tab === 'emoji' ? <Smile size={20} strokeWidth={2}/> : tab === 'sticker' ? <StickerIcon size={20} strokeWidth={2}/> : <span className="text-xs font-black">GIF</span>}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
                {showAttachMenu && (
                    <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowAttachMenu(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute bottom-full right-16 mb-2 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-2 z-40 min-w-[180px] flex flex-col gap-1">
                            <button onClick={() => handleAttach('image')} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-sm font-bold w-full text-right text-gray-700 dark:text-gray-200 transition-colors"><ImageIcon size={18} className="text-purple-500"/>ارسال تصویر</button>
                            <button onClick={() => handleAttach('file')} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-sm font-bold w-full text-right text-gray-700 dark:text-gray-200 transition-colors"><FileText size={18} className="text-blue-500"/>ارسال فایل</button>
                            <button onClick={() => handleAttach('camera')} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-sm font-bold w-full text-right text-gray-700 dark:text-gray-200 transition-colors"><Camera size={18} className="text-red-500"/>دوربین</button>
                            <button onClick={() => handleAttach('location')} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-sm font-bold w-full text-right text-gray-700 dark:text-gray-200 transition-colors"><MapPin size={18} className="text-green-500"/>موقعیت</button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Input Row */}
            {isRecording ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="flex items-center justify-between bg-white dark:bg-[#151515] rounded-[1.5rem] p-2 pl-3 border border-gray-100 dark:border-white/5 shadow-lg relative overflow-hidden"
                >
                    {/* Pulsing Background */}
                    <div className="absolute inset-0 bg-red-50 dark:bg-red-900/10 z-0 animate-pulse"></div>
                    
                    {/* Trash Button */}
                    <motion.button 
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsRecording(false)} 
                        className="relative z-10 p-3 bg-white dark:bg-[#202020] text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors shadow-sm"
                    >
                        <Trash2 size={20} />
                    </motion.button>
                    
                    {/* Visualizer & Timer */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-1 mx-4">
                        <div className="flex items-center gap-1 h-6">
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                                <div 
                                    key={i} 
                                    className="w-1 bg-red-500 rounded-full animate-bounce"
                                    style={{ 
                                        height: '60%', 
                                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                                        animationDelay: `${i * 0.05}s`
                                    }} 
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm tracking-widest">
                                {formatDuration(recordingDuration)}
                            </span>
                        </div>
                    </div>
                    
                    {/* Send Button */}
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { 
                            setIsRecording(false); 
                            const durationStr = formatDuration(recordingDuration);
                            // Ensure realistic duration string (e.g. 0:05 instead of 0:00 if clicked instantly)
                            const finalDuration = recordingDuration < 1 ? "0:01" : durationStr;
                            onSendMessage(`پیام صوتی (${finalDuration})`, 'voice', replyingTo?.id); 
                            if(onCancelReply) onCancelReply(); 
                        }} 
                        className="relative z-10 p-3 bg-peikan-700 text-white rounded-full shadow-lg shadow-peikan-700/30 flex items-center justify-center"
                    >
                         <Send size={20} className="rtl:-rotate-90 ml-0.5" fill="currentColor" />
                    </motion.button>
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
                    <button 
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerCancel}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`p-3.5 bg-peikan-700 text-white rounded-2xl transition-all shadow-lg shadow-peikan-700/20 flex items-center justify-center select-none touch-none ${
                            isPressed ? 'bg-peikan-800 opacity-90' : 'hover:bg-peikan-800 hover:scale-105'
                        }`}
                    >
                        <Send size={24} className="rtl:-rotate-90 ml-0.5 pointer-events-none" />
                    </button>
                    ) : (
                    <button onClick={() => { setIsRecording(true); setShowPicker(false); }} className="p-3 text-gray-400 hover:text-peikan-700 transition-colors transform hover:scale-110"><Mic size={26} strokeWidth={1.5} /></button>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default InputArea;