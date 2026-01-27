import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Shield, Zap, Globe, Lock, Share2 } from 'lucide-react';

interface LoginVisualsProps {
  step: number;
}

const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

// --- Scene 1: Connectivity (The Neural Chat Network) ---
const SceneConnectivity = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={transition}
      className="relative w-72 h-72 flex items-center justify-center"
    >
      {/* Central Hub */}
      <motion.div 
        className="relative z-20 w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl border border-white/40 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <MessageSquare size={40} className="text-white drop-shadow-md" strokeWidth={1.5} />
        
        {/* Inner Pulse */}
        <motion.div 
            className="absolute inset-0 bg-white/20 rounded-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Orbiting Nodes & Connections */}
      {[0, 120, 240].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ rotate: deg }}
          animate={{ rotate: deg + 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
           <motion.div 
             className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center shadow-lg"
             style={{ transformOrigin: '50% 120px' }} // Pivot around center
           >
              <Globe size={20} className="text-white/80" strokeWidth={1.5} />
              
              {/* Signal Packet traveling to center */}
              <motion.div
                className="absolute top-full left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 80, opacity: [0, 1, 0] }} // Distance to center roughly
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
              />
           </motion.div>
        </motion.div>
      ))}

      {/* Static Connection Rings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 animate-spin-slow">
         <circle cx="50%" cy="50%" r="80" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
         <circle cx="50%" cy="50%" r="120" fill="none" stroke="white" strokeWidth="0.5" />
      </svg>
    </motion.div>
  );
};

// --- Scene 2: Security (The Cyber Vault) ---
const SceneSecurity = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={transition}
      className="relative w-72 h-72 flex items-center justify-center"
    >
      {/* Rotating Cyber Rings */}
      <motion.div 
        className="absolute w-56 h-56 border border-white/20 rounded-full border-t-white/60 border-l-white/60"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute w-44 h-44 border border-white/20 rounded-full border-b-white/60 border-r-white/60"
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      {/* Central Shield */}
      <motion.div 
        className="relative z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
         <Shield size={80} className="text-white/10 fill-white/5" strokeWidth={1} />
         
         {/* Inner Lock that animates */}
         <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
            >
                <Lock size={32} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            </motion.div>
         </div>

         {/* Scanning Effect on Shield */}
         <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent w-full h-full"
            style={{ maskImage: "url('data:image/svg+xml;base64,...')" }} // Simplified mask concept
            initial={{ top: '-100%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
         >
            {/* Simple CSS alternative for scan line since SVG masks are complex in inline */}
            <div className="w-full h-[2px] bg-white/50 shadow-[0_0_15px_white] absolute top-1/2" />
         </motion.div>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: (Math.random() - 0.5) * 150,
                y: (Math.random() - 0.5) * 150
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </motion.div>
  );
};

// --- Scene 3: Speed (The Warp Drive) ---
const SceneSpeed = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={transition}
      className="relative w-72 h-72 flex items-center justify-center"
    >
       {/* Central Energy Core */}
       <motion.div 
         className="relative z-10 w-20 h-20 bg-gradient-to-br from-white to-white/50 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)]"
         animate={{ scale: [1, 1.1, 1] }}
         transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
       >
          <Zap size={40} className="text-peikan-700 fill-peikan-700" />
       </motion.div>

       {/* Horizontal Speed Lines */}
       <div className="absolute inset-0 overflow-hidden rounded-full mask-radial">
           {[...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full"
               style={{ 
                 top: `${Math.random() * 100}%`,
                 left: -100,
                 width: Math.random() * 150 + 50 
               }}
               animate={{ x: [0, 400] }}
               transition={{ 
                 duration: Math.random() * 0.5 + 0.3, 
                 repeat: Infinity, 
                 ease: "linear",
                 delay: Math.random() * 0.5
               }}
             />
           ))}
       </div>

       {/* Shockwaves */}
       {[0, 1, 2].map(i => (
           <motion.div
              key={i}
              className="absolute border border-white/30 rounded-full"
              initial={{ width: 80, height: 80, opacity: 0.8 }}
              animate={{ width: 200, height: 200, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
           />
       ))}
    </motion.div>
  );
};

const LoginVisuals: React.FC<LoginVisualsProps> = ({ step }) => {
  return (
    // Increased size slightly for better presence, ensured centered content
    <div className="w-80 h-80 relative flex items-center justify-center">
        {/* Ambient Backlight */}
        <div className="absolute inset-0 bg-white/5 blur-[60px] rounded-full scale-90 animate-pulse-slow" />
        
        <AnimatePresence mode="wait">
            {step === 0 && <SceneConnectivity key="connectivity" />}
            {step === 1 && <SceneSecurity key="security" />}
            {step === 2 && <SceneSpeed key="speed" />}
        </AnimatePresence>
    </div>
  );
};

export default LoginVisuals;