
import React from 'react';
import { motion } from 'framer-motion';
import { Chat } from '../../../types';
import { Radio, Trash2 } from 'lucide-react';

interface ChannelsProps {
    chats: Chat[];
    newChannelName: string;
    newChannelDesc: string;
    onNameChange: (val: string) => void;
    onDescChange: (val: string) => void;
    onCreate: () => void;
}

const Channels: React.FC<ChannelsProps> = ({ 
    chats, newChannelName, newChannelDesc, onNameChange, onDescChange, onCreate 
}) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 sticky top-24">
                    <div className="w-12 h-12 bg-peikan-100 rounded-xl flex items-center justify-center text-peikan-700 mb-4">
                        <Radio size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                        ایجاد کانال جدید
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">کانال‌های عمومی برای تمامی کاربران سازمان قابل مشاهده هستند.</p>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">نام کانال</label>
                            <input 
                                type="text" 
                                placeholder="مثلاً: اخبار شرکت" 
                                value={newChannelName}
                                onChange={(e) => onNameChange(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">توضیحات کوتاه</label>
                            <textarea 
                                rows={3}
                                placeholder="توضیحاتی در مورد محتوای کانال..." 
                                value={newChannelDesc}
                                onChange={(e) => onDescChange(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-peikan-700 outline-none text-sm resize-none"
                            />
                        </div>
                        <button 
                            onClick={onCreate}
                            disabled={!newChannelName.trim()}
                            className="w-full py-3 bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-lg shadow-gray-900/10"
                        >
                            ایجاد کانال
                        </button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
                <h4 className="font-bold text-gray-500 px-2">لیست کانال‌های فعال</h4>
                {chats.filter(c => c.type === 'channel').map(channel => (
                    <div key={channel.id} className="bg-white dark:bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <img src={channel.avatar} className="w-14 h-14 rounded-xl object-cover shadow-sm" alt={channel.name} />
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-base">{channel.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{channel.description || 'بدون توضیحات'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                                <span className="block font-black text-gray-900 dark:text-white">{channel.participants.length}</span>
                                <span className="text-[10px] text-gray-500">عضو</span>
                            </div>
                            <button className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Channels;
