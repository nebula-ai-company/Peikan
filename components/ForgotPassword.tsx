import React, { useState } from 'react';
import { ArrowLeft, Mail, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    // Container handles centering and scrolling, removed outer layout wrapper
    <div className="w-full h-full flex items-center justify-center p-6 lg:p-24 overflow-y-auto custom-scrollbar">
      <div className="max-w-[440px] w-full">
            <button 
                onClick={onBackToLogin}
                className="mb-8 flex items-center gap-2 text-gray-500 hover:text-peikan-700 transition-colors text-sm font-bold"
            >
                <ArrowRight size={18} />
                بازگشت به ورود
            </button>

            {!isSubmitted ? (
                <>
                    <div className="text-center lg:text-right mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">فراموشی رمز عبور</h2>
                        <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            ایمیل خود را وارد کنید. همکاران ما برای احراز هویت و تنظیم مجدد رمز با شما تماس خواهند گرفت.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-800 dark:text-gray-200 block">
                                ایمیل سازمانی
                            </label>
                            <div className="relative group transition-all">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 text-gray-400 group-focus-within:text-peikan-700 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input 
                                    type="email" 
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-dark-border focus:border-peikan-700 focus:bg-white dark:focus:bg-dark-surface focus:ring-4 focus:ring-peikan-700/10 outline-none transition-all text-left dir-ltr font-sans text-lg text-gray-900 dark:text-white placeholder-gray-300 font-medium"
                                    placeholder="name@company.com"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="group w-full bg-peikan-700 hover:brightness-90 text-white font-bold py-4 rounded-xl shadow-xl shadow-peikan-700/20 hover:shadow-peikan-700/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 text-lg"
                        >
                            <span>ثبت درخواست بازیابی</span>
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                    </form>
                </>
            ) : (
                <div className="text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">درخواست ثبت شد</h2>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                        درخواست شما با موفقیت در سیستم ثبت گردید. کارشناسان پشتیبانی ما جهت تایید هویت و ارائه رمز عبور جدید، به زودی با شما تماس خواهند گرفت.
                    </p>
                    <div className="flex items-center gap-2 text-peikan-700 dark:text-peikan-400 text-sm font-bold bg-peikan-50 dark:bg-peikan-900/20 px-4 py-2 rounded-lg">
                        <PhoneCall size={16} />
                        <span>منتظر تماس ما باشید</span>
                    </div>
                    
                    <button 
                        onClick={onBackToLogin}
                        className="mt-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-sm"
                    >
                        بازگشت به صفحه اصلی
                    </button>
                </div>
            )}
      </div>
    </div>
  );
};

export default ForgotPassword;