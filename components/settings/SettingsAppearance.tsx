import React, { useState } from 'react';
import { Moon, Sun, Type, Image as ImageIcon } from 'lucide-react';

interface SettingsAppearanceProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const SettingsAppearance: React.FC<SettingsAppearanceProps> = ({ isDarkMode, toggleTheme }) => {
  const [fontSize, setFontSize] = useState(14);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">ظاهر و قالب</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
            تم رنگی، اندازه فونت و تصویر زمینه گفتگوها را مطابق سلیقه خود تغییر دهید.
            </p>
        </div>

        {/* Theme Selection */}
        <div className="space-y-4">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Sun size={16} />
                حالت نمایش
            </span>
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => !isDarkMode && toggleTheme()}
                    className={`relative p-1 rounded-2xl border-2 transition-all duration-300 group overflow-hidden ${isDarkMode ? 'border-transparent bg-gray-50 dark:bg-white/5' : 'border-peikan-700 bg-white shadow-lg ring-4 ring-peikan-50'}`}
                >
                    <div className="flex flex-col items-center gap-3 py-6 relative z-10">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-gray-200 text-gray-500' : 'bg-peikan-100 text-peikan-700'}`}>
                             <Moon size={24} className={isDarkMode ? "" : "fill-current"} />
                         </div>
                         <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-500' : 'text-peikan-700'}`}>تاریک</span>
                    </div>
                </button>

                <button 
                    onClick={() => isDarkMode && toggleTheme()}
                    className={`relative p-1 rounded-2xl border-2 transition-all duration-300 group overflow-hidden ${!isDarkMode ? 'border-transparent bg-gray-50 dark:bg-white/5' : 'border-peikan-700 bg-[#1a1a1a] shadow-lg ring-4 ring-peikan-900/20'}`}
                >
                    <div className="flex flex-col items-center gap-3 py-6 relative z-10">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${!isDarkMode ? 'bg-gray-200 text-gray-500' : 'bg-peikan-900/40 text-peikan-400'}`}>
                             <Sun size={24} className={!isDarkMode ? "" : "fill-current"} />
                         </div>
                         <span className={`text-sm font-bold ${!isDarkMode ? 'text-gray-500' : 'text-peikan-400'}`}>روشن</span>
                    </div>
                </button>
            </div>
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-white/5 my-6"></div>

        {/* Font Size */}
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Type size={16} />
                    اندازه متن
                </span>
                <span className="text-xs font-mono text-peikan-700 dark:text-peikan-400 bg-peikan-50 dark:bg-peikan-900/20 px-2.5 py-1 rounded-md font-bold">{fontSize}px</span>
            </div>
            
            <div className="px-2">
                <input 
                    type="range" 
                    min="12" 
                    max="20" 
                    step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-peikan-700 hover:accent-peikan-600 transition-all"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium px-0.5">
                    <span>A (کوچک)</span>
                    <span>A (بزرگ)</span>
                </div>
            </div>

            {/* Preview Bubble */}
            <div className="bg-[#f0f2f5] dark:bg-[#0b0b0b] rounded-xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]" style={{backgroundImage: `radial-gradient(#cfd8dc 1px, transparent 1px)`, backgroundSize: '20px 20px'}}></div>
                <div className="relative max-w-[80%] bg-white dark:bg-[#202020] p-3 rounded-2xl rounded-tr-sm shadow-sm text-gray-900 dark:text-white self-start">
                    <p style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}>
                        این یک متن نمونه است تا ببینید پیام‌ها با این اندازه فونت چگونه نمایش داده می‌شوند.
                    </p>
                    <span className="text-[10px] text-gray-400 block text-left mt-1">10:45</span>
                </div>
            </div>
        </div>
        
        <div className="w-full h-px bg-gray-100 dark:bg-white/5 my-6"></div>

        {/* Wallpaper */}
        <div className="space-y-4">
             <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ImageIcon size={16} />
                تصویر زمینه
             </span>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                <button className="w-24 h-36 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center text-gray-400 hover:text-peikan-700 hover:border-peikan-700 dark:hover:text-white dark:hover:border-white transition-all flex-shrink-0 bg-gray-50 dark:bg-white/5 snap-start">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center mb-2 shadow-sm">
                        <ImageIcon size={16} />
                    </div>
                    <span className="text-xs font-bold">انتخاب</span>
                </button>
                {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} className="w-24 h-36 rounded-xl bg-gray-200 dark:bg-white/5 flex-shrink-0 hover:ring-4 ring-peikan-700/20 transition-all overflow-hidden relative group snap-start">
                        <img src={`https://picsum.photos/seed/${i+50}/200/400`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="bg" />
                        {i === 1 && (
                            <div className="absolute inset-0 bg-peikan-900/60 flex items-center justify-center backdrop-blur-[1px]">
                                <div className="bg-white text-peikan-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">فعال</div>
                            </div>
                        )}
                    </button>
                ))}
             </div>
        </div>
    </div>
  );
};

export default SettingsAppearance;