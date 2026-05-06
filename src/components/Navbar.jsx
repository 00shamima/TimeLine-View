import React, { useEffect } from 'react';
import { FaSun, FaMoon, FaServer } from 'react-icons/fa';

export default function Navbar({ darkMode, setDarkMode }) {
  
  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem('timeline_engine_theme', nextMode ? 'dark' : 'light');
  };

  return (
    <nav className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300 ${
      darkMode 
        ? 'bg-[#0A0A0A]/85 border-[#22C55E]/20 shadow-[0_10px_40px_rgba(34,197,94,0.08)]' 
        : 'bg-white/85 border-green-100 shadow-[0_8px_30px_rgba(34,197,94,0.05)]'
    }`}>
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between py-3">
        
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-tr from-[#22C55E] to-[#16A34A] text-black shadow-lg shadow-[#22C55E]/20 transition-all duration-300">
            <FaServer className="text-base sm:text-lg" />
          </div>
          <div>
            <h1 className={`text-sm sm:text-base font-black tracking-tight leading-none uppercase transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-black'
            }`}>
              Timeline View App
            </h1>
            <span className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest block mt-1 sm:mt-1.5 transition-colors duration-300 ${
              darkMode ? 'text-[#22C55E]' : 'text-[#16A34A]'
            }`}>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={toggleTheme}
            className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-300 group ${
              darkMode 
                ? 'bg-zinc-900 border-[#22C55E]/30 text-[#22C55E] hover:bg-zinc-800 hover:border-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                : 'bg-slate-50 border-green-200/60 text-slate-500 hover:text-green-600 hover:bg-green-50/50 hover:border-green-300 shadow-[0_2px_10px_rgba(34,197,94,0.03)]'
            }`}
          >
            {darkMode ? (
              <FaSun className="text-sm sm:text-base scale-100 group-hover:rotate-45 transition-transform" />
            ) : (
              <FaMoon className="text-sm sm:text-base scale-100 group-hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>

      </div>
    </nav>
  );
}