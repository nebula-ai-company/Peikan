import React, { useState, useEffect } from 'react';
import { MessageSquare, ShieldCheck, Zap, Lock, Globe, Smartphone, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginVisuals from './LoginVisuals';

const slides = [
  {
    id: 1,
    title: "ارتباطات سازمانی",
    highlight: "فراتر از انتظار",
    description: "پیکان، بستری امن و یکپارچه برای تعاملات حرفه‌ای تیم شما. همین حالا شروع کنید.",
    features: [
      { icon: Globe, label: "دسترسی جهانی" },
      { icon: Smartphone, label: "نسخه موبایل" }
    ]
  },
  {
    id: 2,
    title: "امنیت اطلاعات",
    highlight: "غیرقابل نفوذ",
    description: "با رمزنگاری پیشرفته دوطرفه، خیالتان از بابت محرمانگی داده‌های سازمانی راحت باشد.",
    features: [
      { icon: Lock, label: "رمزنگاری End-to-End" },
      { icon: ShieldCheck, label: "احراز هویت دو مرحله‌ای" }
    ]
  },
  {
    id: 3,
    title: "سرعت و عملکرد",
    highlight: "بدون توقف",
    description: "زیرساخت ابری قدرتمند ما تضمین می‌کند که پیام‌های شما در کسری از ثانیه منتقل شوند.",
    features: [
      { icon: Cloud, label: "همگام‌سازی ابری" },
      { icon: Zap, label: "کمترین تاخیر" }
    ]
  }
];

const LoginCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex lg:w-5/12 bg-peikan-700 relative overflow-hidden flex-col items-center justify-center text-white p-8 xl:p-12 z-0">
        
        {/* --- Dynamic Background Animation --- */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             {/* Gradient Mesh Blob 1 */}
             <motion.div 
               animate={{ 
                 x: [-20, 20, -20], 
                 y: [-20, 20, -20], 
                 scale: [1, 1.1, 1] 
               }}
               transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 opacity-20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"
             />
             
             {/* Gradient Mesh Blob 2 */}
             <motion.div 
               animate={{ 
                 x: [20, -20, 20], 
                 y: [20, -20, 20], 
                 scale: [1.1, 1, 1.1] 
               }}
               transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-peikan-900 opacity-30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"
             />
        </div>

        {/* --- Main Content --- */}
        {/* Added flex-1 to distribute space evenly */}
        <div className="relative z-10 w-full max-w-sm h-full max-h-[800px] flex flex-col justify-between py-12">
            
            {/* Visual Section - Centered in Top Half */}
            <div className="flex-1 flex items-center justify-center mb-8">
                <LoginVisuals step={currentSlide} />
            </div>

            {/* Text Section - Bottom Half */}
            <div className="flex flex-col items-center text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-full"
                    >
                        {/* Text Content */}
                        <h1 className="text-4xl font-black mb-4 tracking-tight leading-tight">
                            {slides[currentSlide].title}<br/>
                            <span className="text-white/80">{slides[currentSlide].highlight}</span>
                        </h1>
                        <p className="text-white/70 text-lg leading-relaxed mb-8 font-light min-h-[60px] px-4">
                            {slides[currentSlide].description}
                        </p>

                        {/* Feature Chips */}
                        <div className="grid grid-cols-1 gap-3 w-full px-2">
                            {slides[currentSlide].features.map((feature, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                                >
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        {React.createElement(feature.icon, { size: 18, className: "text-white" })}
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-bold text-sm text-white">{feature.label}</h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                 {/* Slide Indicators */}
                <div className="flex justify-center gap-3 mt-10">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`transition-all duration-300 rounded-full ${
                                currentSlide === idx 
                                    ? 'w-8 h-2 bg-white' 
                                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
      </div>
  );
};

export default LoginCarousel;