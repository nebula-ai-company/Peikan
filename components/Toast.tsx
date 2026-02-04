
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, Info, X, Ban } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    type?: ToastType;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, type = 'success', duration = 4000 }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (isVisible) {
            setProgress(100);
            const startTime = Date.now();
            const endTime = startTime + duration;

            const timer = setInterval(() => {
                const now = Date.now();
                const remaining = Math.max(0, endTime - now);
                const percentage = (remaining / duration) * 100;
                
                setProgress(percentage);

                if (remaining <= 0) {
                    clearInterval(timer);
                    onClose();
                }
            }, 10);

            return () => clearInterval(timer);
        }
    }, [isVisible, duration, onClose]);

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: <Check size={20} strokeWidth={3} />,
                    iconBg: 'bg-green-500',
                    progressColor: 'bg-green-500',
                    shadow: 'shadow-green-500/20'
                };
            case 'error':
                return {
                    icon: <Ban size={20} strokeWidth={3} />,
                    iconBg: 'bg-red-500',
                    progressColor: 'bg-red-500',
                    shadow: 'shadow-red-500/20'
                };
            case 'warning':
                return {
                    icon: <AlertTriangle size={20} strokeWidth={3} />,
                    iconBg: 'bg-amber-500',
                    progressColor: 'bg-amber-500',
                    shadow: 'shadow-amber-500/20'
                };
            case 'info':
            default:
                return {
                    icon: <Info size={20} strokeWidth={3} />,
                    iconBg: 'bg-blue-500',
                    progressColor: 'bg-blue-500',
                    shadow: 'shadow-blue-500/20'
                };
        }
    };

    const styles = getTypeStyles();

    // Render to body to ensure it appears above all modals
    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-6 left-6 z-[9999] pointer-events-none">
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`pointer-events-auto relative overflow-hidden bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl ${styles.shadow} min-w-[320px] max-w-sm`}
                        style={{ direction: 'rtl' }}
                    >
                        <div className="flex items-center gap-4 p-4 pr-3">
                            {/* Icon Box */}
                            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${styles.iconBg}`}>
                                {styles.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                                    {type === 'success' ? 'موفقیت‌آمیز' : type === 'error' ? 'خطا' : type === 'warning' ? 'هشدار' : 'اطلاع'}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium leading-relaxed truncate">
                                    {message}
                                </p>
                            </div>

                            {/* Close Button */}
                            <button 
                                onClick={onClose}
                                className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-600 dark:hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-white/5">
                            <motion.div 
                                className={`h-full ${styles.progressColor}`}
                                style={{ width: `${progress}%` }}
                                transition={{ ease: "linear", duration: 0 }}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Toast;
