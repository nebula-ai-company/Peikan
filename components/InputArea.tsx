import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Mic, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputAreaProps {
  onSendMessage: (text: string, type: 'text' | 'voice' | 'image' | 'file') => void;
  isRecording?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-4 bg-white/80 dark:bg-dark-surface/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 sticky bottom-0 z-30">
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
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 text-gray-400 hover:text-peikan-700 dark:hover:text-peikan-400 transition-colors">
              <Smile size={26} strokeWidth={1.5} />
            </motion.button>
            
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 text-gray-400 hover:text-peikan-700 dark:hover:text-peikan-400 transition-colors">
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
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.05)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsRecording(true)}
                className="p-3.5 text-gray-500 dark:text-gray-400 rounded-2xl hover:text-peikan-700 dark:hover:text-white transition-all"
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