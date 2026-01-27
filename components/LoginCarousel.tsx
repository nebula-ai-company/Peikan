import React, { useState, useEffect } from 'react';
import { MessageSquare, ShieldCheck, Zap, Lock, Globe, Smartphone, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    icon: MessageSquare,
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
    icon: ShieldCheck,
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
    icon: Zap,
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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex lg:w-5/12 bg-peikan-700 relative overflow-hidden flex-col items-center justify-center text-white p-12 z-0">
        {/* Subtle abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.02] rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white opacity-[0.02] rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        {/* 
            Container Logic Update:
            1. Removed fixed h-[600px] to allow content to dictate height naturally.
            2. Added min-h-[600px] to maintain vertical rhythm and prevent layout shifts.
            3. Uses flex-col to stack content and dots vertically.
        */}
        <div className="relative z-10 w-full max-w-sm min-h-[600px] flex flex-col justify-center">
            
            {/* Content Area - Takes available space but allows dots to sit below */}
            <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="flex flex-col items-center text-center"
                    >
                        {/* Icon Bubble */}
                        <div className="mb-10">
                            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                                {React.createElement(slides[currentSlide].icon, { 
                                    size: 48, 
                                    className: "text-white", 
                                    strokeWidth: 1.5 
                                })}
                            </div>
                        </div>

                        {/* Text Content */}
                        <h1 className="text-4xl font-black mb-6 tracking-tight leading-tight">
                            {slides[currentSlide].title}<br/>
                            <span className="text-white/80">{slides[currentSlide].highlight}</span>
                        </h1>
                        <p className="text-white/70 text-lg leading-relaxed mb-10 font-light min-h-[80px]">
                            {slides[currentSlide].description}
                        </p>

                        {/* Feature Chips */}
                        <div className="grid grid-cols-1 gap-4 w-full">
                            {slides[currentSlide].features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        {React.createElement(feature.icon, { size: 20, className: "text-white" })}
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-bold text-sm text-white">{feature.label}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            
            {/* Slide Indicators - Moved to normal flow, with top margin to separate from content */}
            <div className="flex justify-center gap-3 mt-12 z-20">
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
  );
};

export default LoginCarousel;