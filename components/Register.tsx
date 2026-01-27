import React, { useState } from 'react';
import { ArrowLeft, User, Mail, FileText, HelpCircle, ArrowRight, Smartphone, CheckCircle2, Server, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RegisterProps {
  onBackToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onBackToLogin }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate server processing time
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 lg:p-12 overflow-y-auto custom-scrollbar">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-[500px] w-full flex flex-col items-center"
        >
          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shadow-xl shadow-green-200/50 dark:shadow-none animate-bounce-slow">
              <CheckCircle2 size={48} strokeWidth={2} />
            </div>
            {/* Decorative particles */}
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              درخواست شما با موفقیت ثبت شد
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              شماره پیگیری: <span className="font-mono font-bold text-gray-700 dark:text-gray-300">TRX-{Math.floor(Math.random() * 10000)}</span>
            </p>
          </div>

          {/* Process Breakdown Card */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 w-full mb-8 space-y-6">
             
             {/* Step 1 */}
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-1">
                   <Server size={20} />
                </div>
                <div className="flex-1 text-right">
                   <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">ارسال به سرور</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      اطلاعات هویتی و درخواست شما به صورت رمزنگاری شده به سرورهای امن پیکان منتقل شد.
                   </p>
                </div>
             </div>

             {/* Divider */}
             <div className="w-0.5 h-4 bg-gray-200 dark:bg-gray-700 mr-[1.2rem] -my-2"></div>

             {/* Step 2 */}
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-1">
                   <Clock size={20} />
                </div>
                <div className="flex-1 text-right">
                   <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">بررسی توسط کارشناسان</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      تیم پشتیبانی ما درخواست شما را بررسی کرده و جهت احراز هویت با شماره تماس وارد شده تماس خواهند گرفت.
                   </p>
                </div>
             </div>

          </div>

          <button 
             onClick={onBackToLogin}
             className="w-full bg-peikan-700 hover:bg-peikan-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-peikan-700/20 transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
             متوجه شدم، بازگشت به ورود
          </button>

        </motion.div>
      </div>
    );
  }

  return (
    // Container handles centering and scrolling
    <div className="w-full h-full flex items-center justify-center p-6 lg:p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-[500px] w-full py-8">
            <button 
                onClick={onBackToLogin}
                className="mb-8 flex items-center gap-2 text-gray-500 hover:text-peikan-700 transition-colors text-sm font-bold"
            >
                <ArrowRight size={18} />
                بازگشت به ورود
            </button>

            <div className="text-center lg:text-right mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">درخواست عضویت</h2>
                <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    اطلاعات زیر را تکمیل کنید. تیم پشتیبانی پس از بررسی با شما تماس خواهد گرفت.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name Row */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-bold text-gray-800 dark:text-gray-200 block">نام</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-peikan-700">
                                <User size={20} />
                            </div>
                            <input type="text" className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-dark-border focus:border-peikan-700 outline-none transition-all text-gray-900 dark:text-white" required />
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-bold text-gray-800 dark:text-gray-200 block">نام خانوادگی</label>
                        <div className="relative group">
                            <input type="text" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-dark-border focus:border-peikan-700 outline-none transition-all text-gray-900 dark:text-white" required />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800 dark:text-gray-200 block">ایمیل سازمانی</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-peikan-700">
                             <Mail size={20} />
                        </div>
                        <input type="email" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-dark-border focus:border-peikan-700 outline-none transition-all text-left dir-ltr text-gray-900 dark:text-white" placeholder="name@company.com" required />
                    </div>
                </div>

                {/* Phone Number - NEW FIELD */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800 dark:text-gray-200 block">شماره موبایل</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-peikan-700">
                             <Smartphone size={20} />
                        </div>
                        <input 
                            type="tel" 
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-dark-border focus:border-peikan-700 outline-none transition-all text-left dir-ltr text-gray-900 dark:text-white" 
                            placeholder="09123456789" 
                            pattern="[0-9]*"
                            required 
                        />
                    </div>
                </div>

                {/* Source */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800 dark:text-gray-200 block">نحوه آشنایی با ما</label>
                    <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-peikan-700">
                             <HelpCircle size={20} />
                        </div>
                        <select className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-dark-border focus:border-peikan-700 outline-none transition-all appearance-none text-gray-900 dark:text-white">
                            <option value="" disabled selected className="text-gray-500">انتخاب کنید...</option>
                            <option value="linkedin">لینکدین</option>
                            <option value="google">جستجوی گوگل</option>
                            <option value="friend">معرفی دوستان</option>
                            <option value="event">رویدادهای حضوری</option>
                            <option value="other">سایر</option>
                        </select>
                    </div>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-800 dark:text-gray-200 block">علت درخواست عضویت</label>
                    <div className="relative group">
                        <div className="absolute top-4 left-0 pl-4 flex pointer-events-none text-gray-400 group-focus-within:text-peikan-700">
                             <FileText size={20} />
                        </div>
                        <textarea rows={3} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-dark-border focus:border-peikan-700 outline-none transition-all resize-none text-gray-900 dark:text-white" placeholder="توضیح دهید که برای چه منظوری قصد استفاده از پیکان را دارید..." required></textarea>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="group w-full bg-peikan-700 hover:brightness-90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-xl shadow-peikan-700/20 hover:shadow-peikan-700/30 transition-all duration-300 flex items-center justify-center gap-3 text-lg mt-4"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>در حال ارسال...</span>
                        </>
                    ) : (
                        <>
                            <span>ثبت درخواست</span>
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
      </div>
    </div>
  );
};

export default Register;