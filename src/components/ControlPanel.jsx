import React, { useState, useRef, useEffect } from 'react';
import { FaCloudUploadAlt, FaCheckCircle, FaPlay, FaEye, FaSave } from 'react-icons/fa';

export default function ControlPanel({
  darkMode, file, handleFileChange, selectedYear, setSelectedYear, 
  selectedMonth, setSelectedMonth, years, months, handleGenerateClick, 
  handleSaveClick, previewData, isSaved, handlePreviewClick, showTablePreview
}) {
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const yearRef = useRef(null);
  const monthRef = useRef(null);

  const monthNames = {
    'All': 'MONTH: ALL',
    '01': 'JANUARY', '02': 'FEBRUARY', '03': 'MARCH', '04': 'APRIL',
    '05': 'MAY', '06': 'JUNE', '07': 'JULY', '08': 'AUGUST',
    '09': 'SEPTEMBER', '10': 'OCTOBER', '11': 'NOVEMBER', '12': 'DECEMBER'
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (yearRef.current && !yearRef.current.contains(event.target)) setIsYearOpen(false);
      if (monthRef.current && !monthRef.current.contains(event.target)) setIsMonthOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollbarClasses = `
    overflow-y-auto max-h-60 
    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-track]:rounded-r-2xl
    ${darkMode 
      ? '[&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:bg-zinc-800 hover:[&::-webkit-scrollbar-thumb]:bg-[#22C55E]/50' 
      : '[&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400'
    }
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:transition-colors
  `;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <div className={`w-full p-4 sm:p-6 lg:p-8 rounded-[24px] sm:rounded-[32px] border transition-all duration-500 relative ${
        darkMode 
          ? 'bg-[#0A0A0A] border-zinc-800/80 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]' 
          : 'bg-white border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.03)]'
      }`}>
        
        <div className="absolute inset-0 rounded-[24px] sm:rounded-[32px] overflow-hidden pointer-events-none z-0">
          <div className={`absolute -right-24 -top-24 w-48 h-48 rounded-full blur-[100px] opacity-25 transition-all duration-700 ${
            darkMode ? 'bg-[#22C55E]' : 'bg-[#16A34A]'
          }`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6 sm:gap-8 items-end relative z-10">
          
          <div className="xl:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className={`w-1.5 h-3.5 rounded-full ${darkMode ? 'bg-[#22C55E]' : 'bg-[#16A34A]'}`} />
              <label className={`text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase font-black ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
csv upload
              </label>
            </div>
            
            <div className="relative group">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className={`p-3.5 sm:p-4.5 rounded-2xl border-2 border-dashed transition-all duration-500 flex items-center justify-between group-hover:scale-[1.01] ${
                file 
                  ? 'border-[#22C55E] bg-[#22C55E]/5 shadow-[0_0_20px_rgba(34,197,94,0.05)]' 
                  : (darkMode ? 'border-zinc-900 bg-zinc-900/30 hover:border-zinc-700' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300')
              }`}>
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <FaCloudUploadAlt className={`text-xl sm:text-2xl shrink-0 transition-colors duration-300 ${file ? 'text-[#22C55E]' : 'text-slate-400'}`} />
                  <span className={`text-xs sm:text-sm font-sans font-extrabold truncate pr-2 ${darkMode ? 'text-zinc-100' : 'text-slate-800'}`}>
                    {file ? file.name : "Attach  .csv"}
                  </span>
                </div>
                <span className={`text-[9px] sm:text-[10px] font-mono font-black px-2.5 sm:px-3 py-1.5 rounded-xl tracking-widest shrink-0 uppercase transition-all duration-300 ${
                  file 
                    ? 'bg-[#22C55E] text-black shadow-md shadow-[#22C55E]/20' 
                    : (darkMode ? 'bg-zinc-800 border border-zinc-700 text-zinc-400' : 'bg-slate-200 text-slate-700')
                }`}>
                  {file ? "READY" : "BROWSE"}
                </span>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className={`w-1.5 h-3.5 rounded-full ${darkMode ? 'bg-[#22C55E]' : 'bg-[#16A34A]'}`} />
              <label className={`text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase font-black ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                TIME-SPACE COORDINATES
              </label>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
              <div className="relative" ref={yearRef}>
                <div 
                  onClick={() => { setIsYearOpen(!isYearOpen); setIsMonthOpen(false); }}
                  className={`w-full p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-mono font-black border text-center cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${
                    darkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-[#22C55E] hover:border-[#22C55E]/50' 
                      : 'bg-slate-50 border-slate-200 text-black hover:border-slate-400'
                  } ${isYearOpen ? (darkMode ? 'border-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 'border-black') : ''}`}
                >
                  <span className="truncate">{selectedYear === 'All' ? 'YEAR: ALL' : `YEAR: ${selectedYear}`}</span>
                  <span className="text-[9px] opacity-70 shrink-0">▼</span>
                </div>

                {isYearOpen && (
                  <div className={`${scrollbarClasses} absolute left-0 right-0 mt-2 rounded-2xl border p-1.5 z-50 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                    darkMode ? 'bg-[#0E0E0E]/95 border-zinc-800 text-zinc-300' : 'bg-white/95 border-slate-200 text-slate-800'
                  }`}>
                    {years.map((y, i) => (
                      <div
                        key={i}
                        onClick={() => { setSelectedYear(y); setIsYearOpen(false); }}
                        className={`p-2.5 sm:p-3 text-center text-xs font-mono font-bold rounded-xl cursor-pointer transition-all ${
                          selectedYear === y
                            ? (darkMode ? 'bg-[#22C55E] text-black font-black' : 'bg-black text-white')
                            : (darkMode ? 'hover:bg-zinc-900 hover:text-white' : 'hover:bg-slate-100 hover:text-black')
                        }`}
                      >
                        {y === 'All' ? 'YEAR: ALL' : `YEAR: ${y}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative" ref={monthRef}>
                <div 
                  onClick={() => { setIsMonthOpen(!isMonthOpen); setIsYearOpen(false); }}
                  className={`w-full p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-mono font-black border text-center cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${
                    darkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-[#22C55E] hover:border-[#22C55E]/50' 
                      : 'bg-slate-50 border-slate-200 text-black hover:border-slate-400'
                  } ${isMonthOpen ? (darkMode ? 'border-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 'border-black') : ''}`}
                >
                  <span className="truncate">{monthNames[selectedMonth] || `MONTH: ${selectedMonth}`}</span>
                  <span className="text-[9px] opacity-70 shrink-0">▼</span>
                </div>

                {isMonthOpen && (
                  <div className={`${scrollbarClasses} absolute left-0 right-0 mt-2 rounded-2xl border p-1.5 z-50 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                    darkMode ? 'bg-[#0E0E0E]/95 border-zinc-800 text-zinc-300' : 'bg-white/95 border-slate-200 text-slate-800'
                  }`}>
                    {months.map((m, i) => (
                      <div
                        key={i}
                        onClick={() => { setSelectedMonth(m); setIsMonthOpen(false); }}
                        className={`p-2.5 sm:p-3 text-center text-xs font-mono font-bold rounded-xl cursor-pointer transition-all ${
                          selectedMonth === m
                            ? (darkMode ? 'bg-[#22C55E] text-black font-black' : 'bg-black text-white')
                            : (darkMode ? 'hover:bg-zinc-900 hover:text-[#22C55E]' : 'hover:bg-slate-100 hover:text-black')
                        }`}
                      >
                        {monthNames[m] || `MONTH: ${m}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 lg:col-span-2 space-y-3 w-full">
            <div className="flex items-center gap-2.5">
              <span className={`w-1.5 h-3.5 rounded-full ${darkMode ? 'bg-[#22C55E]' : 'bg-[#16A34A]'}`} />
              <label className={`text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase font-black ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                ENGINE EXECUTION CHANNELS
              </label>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <button 
                type="button"
                onClick={handlePreviewClick}
                className={`p-3.5 sm:p-4 rounded-2xl text-[11px] sm:text-xs font-sans font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-500 transform hover:scale-[1.02] active:scale-95 ${
                  darkMode 
                    ? 'bg-zinc-900 border border-zinc-800 text-white hover:text-[#22C55E] hover:border-[#22C55E]/40 hover:shadow-[0_10px_20px_rgba(34,197,94,0.05)]' 
                    : 'bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 hover:border-slate-300'
                } ${showTablePreview && previewData?.length > 0 ? (darkMode ? 'border-[#22C55E] text-[#22C55E] bg-[#22C55E]/5' : 'bg-slate-200 border-slate-400') : ''}`}
              >
                <FaEye className="text-sm shrink-0" /> {showTablePreview && previewData?.length > 0 ? "Hide" : "Preview"}
              </button>

              <button 
                type="button"
                onClick={handleGenerateClick}
                className={`p-3.5 sm:p-4 rounded-2xl text-[11px] sm:text-xs font-sans font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-500 transform hover:scale-[1.02] active:scale-95 ${
                  darkMode 
                    ? 'bg-zinc-900 border border-[#22C55E]/40 text-[#22C55E] hover:bg-[#22C55E] hover:text-black hover:shadow-[0_10px_25px_rgba(34,197,94,0.2)]' 
                    : 'bg-black text-white hover:bg-zinc-800 shadow-md'
                }`}
              >
                <FaPlay className="text-[10px] sm:text-xs shrink-0" /> Generate
              </button>
              
              <button 
                type="button"
                onClick={handleSaveClick}
                disabled={previewData?.length === 0 || isSaved}
                className={`p-3.5 sm:p-4 rounded-2xl text-[11px] sm:text-xs font-sans font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-500 transform active:scale-95 ${
                  isSaved 
                    ? 'bg-zinc-950/40 border border-zinc-900 text-zinc-600 cursor-not-allowed shadow-none hover:scale-100'
                    : (darkMode 
                        ? 'bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-black shadow-lg shadow-[#22C55E]/15 hover:scale-[1.02] hover:shadow-[#22C55E]/25' 
                        : 'bg-[#16A34A] text-white hover:bg-[#14863e] shadow-md hover:scale-[1.02]')
                }`}
              >
                {isSaved ? (
                  <>
                    <FaCheckCircle className="text-sm shrink-0 text-zinc-500" /> Saved
                  </>
                ) : (
                  <>
                    <FaSave className="text-sm shrink-0" /> Save
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}