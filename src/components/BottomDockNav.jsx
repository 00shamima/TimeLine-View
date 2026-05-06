import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RiTimelineView } from 'react-icons/ri';
import { FaHistory, FaCloudUploadAlt } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';

export default function BottomDockNav({ activeTab, setActiveTab, darkMode }) {
  const [isHovered, setIsHovered] = useState(false);
  const isTimelinePage = activeTab === 'canvas';

  const navItems = [
    { id: 'upload', label: 'Upload', icon: <FaCloudUploadAlt /> },
    { id: 'canvas', label: 'Timelines', icon: <RiTimelineView /> },
    { id: 'history', label: 'History', icon: <FaHistory /> }
  ];

  const getDockWidth = () => {
    if (isTimelinePage && !isHovered) return '52px';
    return '100%'; 
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
      <motion.div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          width: getDockWidth(),
          maxWidth: (isTimelinePage && !isHovered) ? '52px' : '340px',
          height: (isTimelinePage && !isHovered) ? '52px' : '68px',
          borderRadius: (isTimelinePage && !isHovered) ? '9999px' : '24px'
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`pointer-events-auto border backdrop-blur-xl shadow-2xl overflow-hidden flex items-center justify-center transition-colors duration-300 ${
          darkMode 
            ? 'bg-[#0A0A0A]/90 border-zinc-800 shadow-black/60' 
            : 'bg-white/95 border-slate-200/90 shadow-slate-400/20'
        }`}
      >
        {isTimelinePage && !isHovered ? (
          <div className={`text-xl p-1 flex items-center justify-center ${darkMode ? 'text-[#22C55E]' : 'text-[#16A34A]'}`}>
            <FiMenu className="animate-pulse cursor-pointer" />
          </div>
        ) : (
          <div className="flex justify-around items-center w-full px-2 h-full">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="flex-1 max-w-[85px] h-full flex flex-col items-center justify-center relative isolate group"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-x-1 inset-y-1.5 bg-[#22C55E]/10 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    />
                  )}

                  <motion.div
                    animate={{ scale: isSelected ? 1.05 : 1, y: isSelected ? -1 : 0 }}
                    className={`text-lg p-2 rounded-lg transition-all ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-black font-bold shadow-md shadow-[#22C55E]/15' 
                        : (darkMode ? 'text-zinc-500 group-hover:text-zinc-200' : 'text-slate-400 group-hover:text-slate-900')
                    }`}
                  >
                    {item.icon}
                  </motion.div>

                  <span className={`text-[9px] font-sans font-black tracking-wider uppercase mt-0.5 transition-colors duration-200 ${
                    isSelected 
                      ? (darkMode ? 'text-[#22C55E]' : 'text-[#16A34A]') 
                      : (darkMode ? 'text-zinc-600 group-hover:text-zinc-300' : 'text-slate-400 group-hover:text-slate-800')
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}