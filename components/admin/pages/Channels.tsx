
import React, { useState } from 'react';
import { Chat } from '../../../types';
import ChannelSidebar from './channels/ChannelSidebar';
import CreateChannelForm from './channels/CreateChannelForm';
import ChannelDetailView from './channels/ChannelDetailView';
import Toast from '../../Toast';
import { Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChannelsProps {
    chats: Chat[];
    newChannelName: string;
    newChannelDesc: string;
    onNameChange: (val: string) => void;
    onDescChange: (val: string) => void;
    onCreate: () => void;
    onUpdateChannel: (channel: Chat) => void;
    onDeleteChannel: (id: string) => void;
}

const Channels: React.FC<ChannelsProps> = ({ 
    chats, newChannelName, newChannelDesc, onNameChange, onDescChange, onCreate, 
    onUpdateChannel, onDeleteChannel
}) => {
    // UI State
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Derived Data
    const channels = chats.filter(c => c.type === 'channel');
    const selectedChannel = channels.find(c => c.id === selectedChannelId);

    // Handlers
    const handleCreate = () => {
        onCreate();
        setToastMessage('کانال جدید با موفقیت ایجاد شد');
        setShowToast(true);
        setViewMode('list');
    };

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;
        setToastMessage('پیام با موفقیت در کانال منتشر شد');
        setShowToast(true);
    };

    const handleSaveSettings = (id: string, name: string, description: string) => {
        const channelToUpdate = chats.find(c => c.id === id);
        if (channelToUpdate) {
            onUpdateChannel({ ...channelToUpdate, name, description });
            setToastMessage('تنظیمات کانال به‌روزرسانی شد');
            setShowToast(true);
        }
    };

    const handleDelete = (id: string) => {
        onDeleteChannel(id);
        setSelectedChannelId(null);
        setToastMessage('کانال با موفقیت حذف شد');
        setShowToast(true);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
            <Toast 
                message={toastMessage} 
                isVisible={showToast} 
                onClose={() => setShowToast(false)} 
            />

            {/* Sidebar */}
            <ChannelSidebar 
                channels={channels}
                selectedChannelId={selectedChannelId}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSelect={(id) => { setSelectedChannelId(id); setViewMode('list'); }}
                onCreateClick={() => { setViewMode('create'); setSelectedChannelId(null); }}
            />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 h-full">
                <AnimatePresence mode="wait">
                    {viewMode === 'create' ? (
                        <CreateChannelForm 
                            name={newChannelName}
                            desc={newChannelDesc}
                            onNameChange={onNameChange}
                            onDescChange={onDescChange}
                            onCreate={handleCreate}
                            onCancel={() => setViewMode('list')}
                        />
                    ) : selectedChannel ? (
                        <ChannelDetailView 
                            channel={selectedChannel}
                            onSaveSettings={handleSaveSettings}
                            onDelete={handleDelete}
                            onSendMessage={handleSendMessage}
                        />
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-white dark:bg-[#1e1e1e] rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5"
                        >
                            <div className="w-32 h-32 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner border border-gray-100 dark:border-white/5">
                                <Radio size={64} className="opacity-30 text-gray-500" strokeWidth={1} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">مدیریت کانال‌ها</h3>
                            <p className="text-sm max-w-xs mx-auto leading-relaxed text-gray-500">
                                برای مشاهده جزئیات، ویرایش تنظیمات یا ارسال پیام، یکی از کانال‌ها را از لیست سمت راست انتخاب کنید.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Channels;
