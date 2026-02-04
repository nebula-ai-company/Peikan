
import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Lock, Mail, Key, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (isAdmin?: boolean) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgot: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister, onNavigateToForgot }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = () => {
      // Updated Admin Password
      if (email === 'admin@peikan.ir' && password === 'PeikanFaghatPeikanJavananModel1370') {
          onLogin(true); // Is Admin
      } else {
          onLogin(false); // Regular User
      }
  };

  return (
    // Container handles centering and scrolling, removed outer layout wrapper
    <div className="w-full h-full flex items-center justify-center p-6 lg:p-24 overflow-y-auto custom-scrollbar">
      <div className="max-w-[440px] w-full">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 flex justify-center">
                <div className="w-14 h-14 bg-peikan-700 rounded-xl flex items-center justify-center shadow-lg shadow-peikan-700/20">
                    <MessageSquare size={28} className="text-white" />
                </div>
            </div>

            <div className="text-center lg:text-right mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">ورود به حساب کاربری</h2>
                <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    برای دسترسی به پنل کاربری، ایمیل و رمز عبور خود را وارد کنید.
                </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit(); }} className="space-y-6">
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-dark-border focus:border-peikan-700 focus:bg-white dark:focus:bg-dark-surface focus:ring-4 focus:ring-peikan-700/10 outline-none transition-all text-left dir-ltr font-sans text-lg text-gray-900 dark:text-white placeholder-gray-300 font-medium"
                            placeholder="name@company.com"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="space-y-2">
                     <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-800 dark:text-gray-200 block">
                            رمز عبور
                        </label>
                         <button 
                            type="button" 
                            onClick={onNavigateToForgot}
                            className="text-xs font-bold text-peikan-700 hover:underline"
                         >
                            رمز عبور را فراموش کردید؟
                         </button>
                     </div>
                    <div className="relative group transition-all">
                        {/* Key Icon (Left) */}
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 text-gray-400 group-focus-within:text-peikan-700 transition-colors">
                             <Key size={20} />
                        </div>
                        
                        {/* Toggle Password Visibility (Right) */}
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-peikan-700 cursor-pointer outline-none transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>

                        <input 
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-dark-border focus:border-peikan-700 focus:bg-white dark:focus:bg-dark-surface focus:ring-4 focus:ring-peikan-700/10 outline-none transition-all text-left dir-ltr font-sans text-lg text-gray-900 dark:text-white placeholder-gray-300 font-medium tracking-widest"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    className="group w-full bg-peikan-700 hover:brightness-90 text-white font-bold py-4 rounded-xl shadow-xl shadow-peikan-700/20 hover:shadow-peikan-700/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 text-lg"
                >
                    <span>ورود به سیستم</span>
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </form>

            <div className="mt-8 flex justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    حساب کاربری ندارید؟ 
                    <button 
                        onClick={onNavigateToRegister} 
                        className="text-peikan-700 font-bold hover:underline mr-1"
                    >
                        درخواست عضویت
                    </button>
                </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-border">
                <div className="flex flex-col gap-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                        <Lock size={12} />
                        <span>اطلاعات شما با استاندارد SSL محافظت می‌شود</span>
                    </div>
                </div>
            </div>
      </div>
    </div>
  );
};

export default Login;
