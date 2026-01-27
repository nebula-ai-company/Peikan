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
    <div className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border p-4 sticky bottom-0 z-20">
      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-xl p-3"
          >
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <span className="font-mono text-sm font-medium">{formatDuration(recordingDuration)}</span>
              <span className="text-sm">در حال ضبط...</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsRecording(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                لغو
              </button>
              <button 
                onClick={() => {
                  setIsRecording(false);
                  onSendMessage('پیام صوتی (0:15)', 'voice');
                }}
                className="p-2 bg-peikan-700 text-white rounded-full hover:bg-peikan-800 transition-colors shadow-lg"
              >
                <Send size={18} className="rtl:rotate-180" />
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
            <button className="p-3 text-gray-500 hover:text-peikan-600 dark:text-gray-400 dark:hover:text-peikan-400 transition-colors">
              <Smile size={24} strokeWidth={1.5} />
            </button>
            
            <button className="p-3 text-gray-500 hover:text-peikan-600 dark:text-gray-400 dark:hover:text-peikan-400 transition-colors">
              <Paperclip size={24} strokeWidth={1.5} />
            </button>

            <div className="flex-1 bg-gray-100 dark:bg-[#2A2A2A] rounded-2xl flex items-center px-4 py-3 min-h-[50px] focus-within:ring-2 focus-within:ring-peikan-300 dark:focus-within:ring-peikan-700 transition-all border border-transparent dark:border-gray-700">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="پیامی بنویسید..."
                className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 text-[15px] resize-none overflow-hidden"
                style={{ direction: 'rtl' }}
                autoComplete="off"
              />
            </div>

            {message.trim().length > 0 ? (
              <button 
                onClick={handleSend}
                className="p-3 bg-peikan-700 text-white rounded-full hover:bg-peikan-800 transition-colors shadow-lg shadow-peikan-200 dark:shadow-none"
              >
                <Send size={22} className="rtl:rotate-180 ml-1" />
              </button>
            ) : (
              <button 
                onClick={() => setIsRecording(true)}
                className="p-3 bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300 rounded-full hover:bg-peikan-100 dark:hover:bg-gray-700 hover:text-peikan-700 dark:hover:text-white transition-colors"
              >
                <Mic size={24} strokeWidth={1.5} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputArea;