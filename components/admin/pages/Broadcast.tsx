
import React from 'react';
import { motion } from 'framer-motion';
import { Chat } from '../../../types';
import { Megaphone, MoreVertical, Send } from 'lucide-react';

interface BroadcastProps {
    chats: Chat[];
    message: string;
    target: string;
    onMessageChange: (val: string) => void;
    onTargetChange: (val: string) => void;
    onSend: () => void;
}

const Broadcast: React.FC<BroadcastProps> = ({ 
    chats, message, target, onMessageChange, onTargetChange, onSend 
}) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto pt-10">
            <div className="bg-white dark:bg-[#1e1e1e] p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-inner">
                    <Megaphone size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">ارسال پیام سراسری</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
                    ارسال اطلاعیه‌های مهم، هشدارهای امنیتی یا اخبار سازمانی به تمامی کاربران یا کانال‌های خاص.
                </p>
                
                <div className="space-y-6 text-right max-w-lg mx-auto">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">گیرندگان پیام</label>
                        <div className="relative">
                            <select 
                            value={target}
                            onChange={(e) => onTargetChange(e.target.value)}
                            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-gray-900 dark:text-white appearance-none font-bold text-sm"
                            >
                                <option value="all">📢 همه کانال‌های عمومی (پیش‌فرض)</option>
                                {chats.filter(c => c.type === 'channel').map(c => (
                                    <option key={c.id} value={c.id}># {c.name}</option>
                                ))}
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <MoreVertical size={16} className="text-gray-400 rotate-90" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">متن پیام</label>
                        <textarea 
                            rows={6}
                            value={message}
                            onChange={(e) => onMessageChange(e.target.value)}
                            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-gray-900 dark:text-white resize-none text-sm leading-relaxed"
                            placeholder="متن پیام خود را اینجا بنویسید..."
                        />
                    </div>

                    <button 
                        onClick={onSend}
                        disabled={!message.trim()}
                        className="w-full py-4 bg-gradient-to-r from-peikan-700 to-peikan-600 hover:from-peikan-800 hover:to-peikan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-peikan-700/20 flex items-center justify-center gap-3 transition-all transform active:scale-95"
                    >
                        <Send size={20} className="rtl:-rotate-90" />
                        <span className="text-lg">ارسال نهایی پیام</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Broadcast;
