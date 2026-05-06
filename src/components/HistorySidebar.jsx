import React from 'react';
import { FaFolderOpen, FaRegClock, FaChevronRight } from 'react-icons/fa';

export default function HistorySidebar({ darkMode, savedTimelines, handleLoadTimeline, activeTimelineName }) {
  
  const uniqueTimelines = [];
  const seenNames = new Set();

  savedTimelines.forEach((timeline) => {
    if (timeline && timeline.name && !seenNames.has(timeline.name)) {
      seenNames.add(timeline.name);
      uniqueTimelines.push(timeline);
    }
  });

  return (
    <div className="w-full space-y-4">
      
      <div className={`flex items-center justify-between border-b pb-2 ${darkMode ? 'border-[#1E293B]' : 'border-slate-200'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
          Recent Timelines
        </h3>
        <span className="text-[10px] font-mono font-bold text-green-500 uppercase tracking-wider">
          {uniqueTimelines.length} Saved
        </span>
      </div>

      {uniqueTimelines.length === 0 ? (
        <div className={`p-4 text-center rounded-xl border border-dashed ${darkMode ? 'border-[#1E293B] bg-black/10' : 'border-slate-200 bg-slate-50'}`}>
          <p className="text-xs text-gray-400 font-mono">No timeline records found.</p>
        </div>
      ) : (
        
        <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
          {uniqueTimelines.map((dataset) => {
            const isActive = activeTimelineName === dataset.name;
            return (
              <div
                key={dataset.id}
                onClick={() => handleLoadTimeline(dataset.name)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer group ${
                  isActive 
                    ? (darkMode ? 'bg-[#1E293B]/60 border-green-500' : 'bg-green-50 border-green-500 shadow-sm')
                    : (darkMode ? 'bg-[#0F1322] border-[#1E293B] hover:bg-[#151B2E] hover:border-green-500/30' : 'bg-white border-slate-200 hover:border-green-400 hover:shadow-sm')
                }`}
              >
                
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`p-2 rounded-lg border flex-shrink-0 transition-colors ${
                    isActive 
                      ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                      : (darkMode ? 'bg-black/20 border-[#1E293B] text-gray-500 group-hover:text-green-400' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-green-600')
                  }`}>
                    <FaFolderOpen className="text-sm" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-sm font-bold truncate transition-colors ${
                      isActive 
                        ? (darkMode ? 'text-green-400' : 'text-green-700') 
                        : (darkMode ? 'text-white group-hover:text-green-400' : 'text-slate-800 group-hover:text-green-600')
                    }`}>
                      {dataset.name}
                    </h4>
                    
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono mt-0.5">
                      <FaRegClock className="text-[9px] text-gray-500" />
                      <span>ID: {dataset.id ? dataset.id.slice(-6).toUpperCase() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  {isActive && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20">
                      ACTIVE
                    </span>
                  )}
                  <FaChevronRight className={`text-[10px] transition-all transform group-hover:translate-x-0.5 ${
                    isActive 
                      ? 'text-green-500' 
                      : (darkMode ? 'text-gray-600 group-hover:text-green-400' : 'text-slate-300 group-hover:text-green-600')
                  }`} />
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}