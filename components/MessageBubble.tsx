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

  // Determine bubble shape based on sender sequence
  const roundedClass = isMe
    ? `${previousMessageSameSender ? 'rounded-tr-lg' : 'rounded-tr-2xl'} rounded-tl-2xl rounded-bl-2xl rounded-br-lg`
    : `${previousMessageSameSender ? 'rounded-tl-lg' : 'rounded-tl-2xl'} rounded-tr-2xl rounded-br-2xl rounded-bl-lg`;

  // Colors
  const bubbleColor = isMe
    ? 'bg-peikan-50 dark:bg-peikan-900/30 border border-peikan-100 dark:border-peikan-800/50'
    : 'bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border';

  const textColor = isMe
    ? 'text-gray-900 dark:text-gray-100'
    : 'text-gray-900 dark:text-gray-100';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-1 ${isMe ? 'justify-end' : 'justify-start'} group`}
    >
      <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Sender Name in Group Chats */}
        {!isMe && !previousMessageSameSender && sender && (
          <span className="text-xs font-bold text-peikan-700 dark:text-peikan-400 mb-1 px-2">
            {sender.name}
          </span>
        )}

        <div className={`relative px-4 py-2 ${roundedClass} ${bubbleColor} shadow-sm transition-shadow hover:shadow-md`}>
          {/* Reply Indicator (Mock) */}
          {message.replyToId && (
            <div className={`mb-2 text-xs border-r-2 ${isMe ? 'border-peikan-400' : 'border-accent-500'} pr-2 py-1 opacity-70`}>
              <div className="font-semibold">پاسخ به:</div>
              <div className="truncate">پیام قبلی...</div>
            </div>
          )}

          {/* Content Rendering */}
          {message.type === 'text' && (
            <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${textColor}`}>
              {message.content}
            </p>
          )}

          {message.type === 'image' && (
            <div className="mb-1">
              <img 
                src={message.mediaUrl} 
                alt="attachment" 
                className="rounded-lg max-h-64 object-cover w-full cursor-pointer hover:opacity-95 transition-opacity" 
              />
              {message.content && message.content !== message.fileName && (
                <p className={`mt-2 text-[15px] ${textColor}`}>{message.content}</p>
              )}
            </div>
          )}

          {message.type === 'file' && (
            <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-black/20 rounded-lg">
              <div className="bg-peikan-100 dark:bg-peikan-900 text-peikan-700 dark:text-peikan-300 p-3 rounded-full">
                <Download size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${textColor}`}>{message.fileName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{message.fileSize}</div>
              </div>
            </div>
          )}

          {message.type === 'voice' && (
            <div className="flex items-center gap-3 min-w-[200px] py-1">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-full transition-colors ${isMe ? 'bg-peikan-200 text-peikan-800 dark:bg-peikan-700 dark:text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white'}`}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>
              <div className="flex-1 flex flex-col gap-1">
                 {/* Fake Waveform */}
                 <div className="flex items-center gap-[2px] h-6 items-end">
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 rounded-full ${isMe ? 'bg-peikan-400 dark:bg-peikan-500' : 'bg-gray-400 dark:bg-gray-500'}`}
                        style={{ height: `${Math.max(20, Math.random() * 100)}%`, opacity: isPlaying ? 1 : 0.6 }}
                      />
                    ))}
                 </div>
                 <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{message.duration}</span>
              </div>
            </div>
          )}

          {/* Footer: Time & Status */}
          <div className={`flex items-center justify-end gap-1 mt-1 select-none ${message.type === 'image' ? 'absolute bottom-2 right-2 bg-black/40 px-2 py-0.5 rounded-full text-white backdrop-blur-sm' : ''}`}>
            <span className={`text-[10px] ${message.type === 'image' ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}>
              {message.timestamp}
            </span>
            {isMe && (
              <span className={message.type === 'image' ? 'text-white' : (message.isRead ? 'text-peikan-600 dark:text-peikan-400' : 'text-gray-400')}>
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