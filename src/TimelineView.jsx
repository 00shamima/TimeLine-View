import React, { useState } from "react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiSun, FiMoon, FiMaximize, FiDatabase } from "react-icons/fi";

const TimeLineView = () => {
  const [rawData, setRawData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeView, setActiveView] = useState("timeline");

  const colors = ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#06b6d4"];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setRawData(results.data),
    });
  };

  const getVal = (obj, key) => {
    const foundKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
    return obj[foundKey] || "";
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-[#030712] text-white" : "bg-slate-50 text-slate-900"} selection:bg-indigo-500/30`}>
      
      <nav className={`fixed top-0 w-full z-[100] border-b backdrop-blur-xl ${isDarkMode ? 'border-white/5 bg-black/40' : 'border-slate-200 bg-white/60'} px-4 md:px-8 py-4`}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg">
              <FiMaximize className="text-white" />
            </div>
            <h1 className="text-lg font-black tracking-tighter uppercase italic">Timeline view</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex p-1 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
              <button onClick={() => setActiveView("timeline")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${activeView === 'timeline' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'opacity-40'}`}>Timeline</button>
              <button onClick={() => setActiveView("table")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${activeView === 'table' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'opacity-40'}`}>Table</button>
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl border border-current opacity-20 hover:opacity-100 transition-opacity">
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>
            <label className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95 shadow-xl shadow-indigo-600/30">
              Import <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 md:px-12">
        <AnimatePresence mode="wait">
          {rawData.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[60vh] flex flex-col items-center justify-center opacity-20">
              <FiDatabase size={48} className="mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Awaiting CSV Input</p>
            </motion.div>
          ) : activeView === "timeline" ? (
            <div className="relative py-12 md:py-48 flex flex-col md:flex-row items-start md:items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
              <div className={`absolute left-6 md:left-0 md:top-1/2 w-[2px] h-full md:w-full md:h-[1px] ${isDarkMode ? "bg-indigo-500/20" : "bg-slate-300"}`} />
              <div className="flex flex-col md:flex-row items-center gap-12 md:gap-0 pl-12 md:pl-[10vw]">
                {rawData.map((item, index) => {
                  const isTop = index % 2 === 0;
                  const accent = colors[index % colors.length];
                  return (
                    <div key={index} className="relative flex flex-col items-center w-full md:w-[420px]">
                      <div className="absolute left-[-31px] md:relative md:left-0 z-50 w-3.5 h-3.5 rounded-full border-4 border-current shadow-[0_0_20px_rgba(0,0,0,0.2)]" style={{ color: accent, backgroundColor: isDarkMode ? '#030712' : '#fff' }} />
                      <motion.div 
                        initial={{ opacity: 0, y: isTop ? -20 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: isTop ? -10 : 10, scale: 1.02 }}
                        className={`relative md:absolute w-[85vw] md:w-72 p-6 rounded-[2rem] border transition-all z-40 ${isDarkMode ? 'bg-[#0f172a]/90 border-white/5 shadow-2xl shadow-black' : 'bg-white border-slate-200 shadow-xl shadow-slate-200'} ${isTop ? 'md:bottom-16' : 'md:top-16'}`}
                      >
                        <div className={`hidden md:block absolute left-1/2 -translate-x-1/2 w-[1px] h-16 ${isTop ? 'top-full bg-gradient-to-b' : 'bottom-full bg-gradient-to-t'} from-indigo-500/30 to-transparent`} />
                        <div className="flex justify-between items-center mb-4">
                          <span className="px-3 py-1 rounded-full text-[9px] font-black text-white" style={{ backgroundColor: accent }}>{getVal(item, "date")}</span>
                          <span className="text-[10px] font-bold opacity-30 tracking-widest uppercase">#{index + 1}</span>
                        </div>
                        <h4 className="font-bold text-sm mb-2 tracking-tight line-clamp-1">{getVal(item, "name")}</h4>
                        <p className="text-[11px] opacity-60 leading-relaxed font-medium italic">"{getVal(item, "description")}"</p>
                      </motion.div>
                    </div>
                  );
                })}
                <div className="min-w-[10vw] hidden md:block" />
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`max-w-5xl mx-auto rounded-3xl border overflow-hidden shadow-2xl ${isDarkMode ? "bg-[#0f172a] border-white/5" : "bg-white border-slate-200"}`}>
              <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className={isDarkMode ? "bg-white/5" : "bg-slate-50"}>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest opacity-40">Event Profile</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest opacity-40 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rawData.map((row, i) => (
                      <tr key={i} className="hover:bg-indigo-600/5 transition-colors group">
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-[10px] text-white" style={{ backgroundColor: colors[i % colors.length] }}>{getVal(row, "name").charAt(0)}</div>
                              <div>
                                <div className="font-bold text-sm mb-1">{getVal(row, "name")}</div>
                                <div className="text-[10px] opacity-40 font-medium truncate max-w-[200px] md:max-w-md">{getVal(row, "description")}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6 font-black italic text-indigo-500 text-xs text-right whitespace-nowrap">{getVal(row, "date")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default TimeLineView;