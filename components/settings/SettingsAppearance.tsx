import React, { useState } from 'react';
import { Moon, Sun, Type, Image as ImageIcon, Upload, Check, CheckCircle2 } from 'lucide-react';

interface SettingsAppearanceProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const SettingsAppearance: React.FC<SettingsAppearanceProps> = ({ isDarkMode, toggleTheme }) => {
  const [fontSize, setFontSize] = useState(14);
  const [activeWallpaper, setActiveWallpaper] = useState(1);

  // Mock chat bubble style based on theme for preview
  const bubbleStyle = isDarkMode
    ? 'bg-[#202020] text-gray-100 border-white/5'
    : 'bg-white text-gray-900 border-gray-100';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        {/* Header */}
        <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">ظاهر و قالب</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
               شخصی‌سازی تجربه بصری؛ از حالت تاریک تا اندازه متن و پس‌زمینه گفتگوها.
            </p>
        </div>

        {/* Theme Selection - Visual Cards */}
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sun size={18} className="text-peikan-700 dark:text-peikan-400" />
                حالت نمایش
            </h4>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {/* Light Mode Card */}
                <div 
                    onClick={() => isDarkMode && toggleTheme()}
                    className={`cursor-pointer group relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${!isDarkMode ? 'border-peikan-700 ring-4 ring-peikan-700/10' : 'border-gray-200 dark:border-white/10 hover:border-peikan-300'}`}
                >
                    <div className="aspect-[16/10] bg-gray-100 relative p-3 flex gap-2">
                        {/* Sidebar Mockup */}
                        <div className="w-1/4 h-full bg-white rounded-lg shadow-sm"></div>
                        {/* Chat Area Mockup */}
                        <div className="flex-1 h-full bg-white rounded-lg shadow-sm p-2 flex flex-col gap-2">
                            <div className="w-2/3 h-2 bg-gray-100 rounded-full"></div>
                            <div className="w-1/2 h-2 bg-gray-100 rounded-full"></div>
                            <div className="mt-auto w-full h-8 bg-peikan-50 rounded-md"></div>
                        </div>
                        {/* Sun Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="bg-white p-2 rounded-full shadow-lg">
                                <Sun size={20} className="text-orange-500" />
                             </div>
                        </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#202020] flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">روشن</span>
                        {!isDarkMode && <CheckCircle2 size={18} className="text-peikan-700" />}
                    </div>
                </div>

                {/* Dark Mode Card */}
                <div 
                    onClick={() => !isDarkMode && toggleTheme()}
                    className={`cursor-pointer group relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isDarkMode ? 'border-peikan-700 ring-4 ring-peikan-700/10' : 'border-gray-200 dark:border-white/10 hover:border-peikan-300'}`}
                >
                    <div className="aspect-[16/10] bg-[#0f0f0f] relative p-3 flex gap-2">
                        {/* Sidebar Mockup */}
                        <div className="w-1/4 h-full bg-[#1e1e1e] rounded-lg border border-white/5"></div>
                        {/* Chat Area Mockup */}
                        <div className="flex-1 h-full bg-[#1e1e1e] rounded-lg border border-white/5 p-2 flex flex-col gap-2">
                             <div className="w-2/3 h-2 bg-white/10 rounded-full"></div>
                             <div className="w-1/2 h-2 bg-white/10 rounded-full"></div>
                             <div className="mt-auto w-full h-8 bg-white/5 rounded-md"></div>
                        </div>
                        {/* Moon Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="bg-[#333] p-2 rounded-full shadow-lg">
                                <Moon size={20} className="text-peikan-400" />
                             </div>
                        </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#202020] flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">تاریک</span>
                        {isDarkMode && <CheckCircle2 size={18} className="text-peikan-700" />}
                    </div>
                </div>
            </div>
        </div>

        {/* Font Size Section */}
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Type size={18} className="text-peikan-700 dark:text-peikan-400" />
                    اندازه نوشتار
                </h4>
                <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">
                    {fontSize}px
                </span>
            </div>

            <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5 space-y-6">
                {/* Preview Bubble */}
                <div className="flex flex-col gap-3">
                     <div className="self-start max-w-[90%] md:max-w-[70%]">
                        <div className={`p-4 rounded-2xl rounded-tr-sm shadow-sm border ${bubbleStyle} relative transition-all duration-300`}>
                            <p 
                                style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                                className="transition-all duration-200"
                            >
                                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
                            </p>
                            <span className="text-[10px] opacity-60 mt-2 block text-left dir-ltr">10:42 AM</span>
                        </div>
                     </div>
                     <div className="self-end max-w-[90%] md:max-w-[70%]">
                        <div className="bg-peikan-700 text-white p-4 rounded-2xl rounded-tl-sm shadow-md transition-all duration-300">
                             <p 
                                style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                                className="transition-all duration-200"
                            >
                                این یک نمونه متن برای نمایش تغییر اندازه فونت است.
                            </p>
                             <div className="flex items-center justify-end gap-1 mt-2">
                                <span className="text-[10px] text-white/70">10:43 AM</span>
                                <Check size={12} className="text-white/70" />
                            </div>
                        </div>
                     </div>
                </div>

                {/* Slider */}
                <div className="px-2 pt-2">
                    <input 
                        type="range" 
                        min="12" 
                        max="24" 
                        step="1"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-peikan-700 hover:accent-peikan-600 transition-all focus:outline-none focus:ring-2 focus:ring-peikan-700/20"
                    />
                    <div className="flex justify-between mt-3 text-xs font-bold text-gray-400">
                        <span>A کوچک</span>
                        <span>A بزرگ</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Wallpaper Section */}
        <div className="space-y-4">
             <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-peikan-700 dark:text-peikan-400" />
                تصویر زمینه گفتگو
             </h4>
             
             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {/* Upload Button */}
                <button className="aspect-[2/3] rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-peikan-700 hover:border-peikan-700 dark:hover:text-white dark:hover:border-white transition-all bg-gray-50 dark:bg-white/5 group">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Upload size={18} />
                    </div>
                    <span className="text-[10px] font-bold">آپلود</span>
                </button>

                {/* Wallpapers */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div 
                        key={i} 
                        onClick={() => setActiveWallpaper(i)}
                        className={`aspect-[2/3] rounded-xl relative cursor-pointer overflow-hidden group transition-all duration-300 ${activeWallpaper === i ? 'ring-4 ring-peikan-700 shadow-lg scale-95' : 'hover:scale-105'}`}
                    >
                        <img 
                            src={`https://picsum.photos/seed/${i+100}/300/500`} 
                            className="w-full h-full object-cover" 
                            alt={`Wallpaper ${i}`} 
                        />
                        {/* Selection Indicator */}
                        {activeWallpaper === i && (
                            <div className="absolute inset-0 bg-peikan-900/40 flex items-center justify-center animate-in fade-in duration-200">
                                <div className="bg-white text-peikan-700 rounded-full p-1.5 shadow-xl">
                                    <Check size={16} strokeWidth={3} />
                                </div>
                            </div>
                        )}
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
             </div>
        </div>
    </div>
  );
};

export default SettingsAppearance;