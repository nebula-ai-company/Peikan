
import React from 'react';
import { motion } from 'framer-motion';
import { RegistrationRequest } from '../../../../types';
import { X, Mail, Phone, Building2, Calendar, FileText, CheckCircle2, XCircle, User as UserIcon } from 'lucide-react';

interface RequestDetailsModalProps {
    request: RegistrationRequest;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ request, onClose, onApprove, onReject }) => {
    
    const handleApprove = () => {
        onApprove(request.id);
        onClose();
    };

    const handleReject = () => {
        if (window.confirm('آیا از رد کردن این درخواست اطمینان دارید؟')) {
            onReject(request.id);
            onClose();
        }
    };

    const getStatusBadge = () => {
        switch (request.status) {
            case 'approved':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 size={14} /> تایید شده</span>;
            case 'rejected':
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={14} /> رد شده</span>;
            default:
                return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">در انتظار بررسی</span>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="relative w-full max-w-lg bg-white dark:bg-[#1e1e1e] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e1e1e]">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">جزئیات درخواست</h3>
                        {getStatusBadge()}
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    
                    {/* User Summary */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-peikan-50 dark:bg-peikan-900/30 text-peikan-700 dark:text-peikan-400 flex items-center justify-center text-2xl font-black shadow-sm">
                            {request.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">{request.name}</h2>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                <Building2 size={14} />
                                <span>{request.companyName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Contact Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <Mail size={16} />
                                    <span className="text-xs font-bold">ایمیل</span>
                                </div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white dir-ltr text-right truncate" title={request.email}>
                                    {request.email}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <Phone size={16} />
                                    <span className="text-xs font-bold">شماره تماس</span>
                                </div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white dir-ltr text-right">
                                    {request.phone}
                                </div>
                            </div>
                        </div>

                        {/* Reason Section */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block flex items-center gap-1.5">
                                <FileText size={16} />
                                علت درخواست
                            </label>
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed min-h-[80px]">
                                {request.reason}
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium px-2">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                <span>تاریخ ثبت: {request.date}</span>
                            </div>
                            <div>شناسه: #{request.id.substring(0,6)}</div>
                        </div>
                    </div>
                </div>

                {/* Actions Footer - Only show if pending */}
                {request.status === 'pending' && (
                    <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex gap-4">
                        <button 
                            onClick={handleReject}
                            className="flex-1 py-3.5 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <XCircle size={18} />
                            رد درخواست
                        </button>
                        <button 
                            onClick={handleApprove}
                            className="flex-[2] py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={18} />
                            تایید و ایجاد حساب
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default RequestDetailsModal;
