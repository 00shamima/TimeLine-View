import React from 'react';

export default function DataStructureTable({ darkMode, previewData }) {
  // If there is no active configuration stream data, gracefully render nothing
  if (!previewData || previewData.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-2xl transition-all duration-500">
      
      {/* Responsive Horizontal Scroll Wrapper */}
      <div className={`w-full overflow-x-auto select-none
        [&::-webkit-scrollbar]:h-1.5
        ${darkMode 
          ? '[&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:bg-zinc-800 hover:[&::-webkit-scrollbar-thumb]:bg-[#22C55E]/30' 
          : '[&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400'
        }
        [&::-webkit-scrollbar-thumb]:rounded-full
      `}>
        <table className="w-full border-collapse text-left">
          
          {/* <thead> Layout Structure */}
          <thead>
            <tr className={`border-b font-mono text-[10px] sm:text-xs tracking-widest uppercase font-black transition-colors duration-300 ${
              darkMode 
                ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400' 
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <th className="py-4 px-4 sm:px-6 font-bold w-20">Index</th>
              <th className="py-4 px-4 sm:px-6 font-bold">Timeline Event Axis</th>
              <th className="py-4 px-4 sm:px-6 font-bold text-center w-40">Chronology Stamp</th>
              <th className="py-4 px-4 sm:px-6 font-bold max-w-md">Description Parameter</th>
            </tr>
          </thead>

          {/* <tbody> Engine Rendering Framework */}
          <tbody className={`divide-y transition-colors duration-300 ${
            darkMode ? 'divide-zinc-900/60' : 'divide-slate-100'
          }`}>
            {previewData.map((row, index) => {
              // Normalize data keys safely whether keys are lowercase, uppercase, or spaced
              const eventIndex = row.Index || row.index || String(index + 1).padStart(2, '0');
              
              // FIXED: Added row.name check here to safely match the parent state object key
              const eventTitle = row['Timeline Event Axis'] || row.timeline_event_axis || row.Name || row.name || row.Title || row.title || 'Untitled Action';
              
              const chronologyStamp = row['Chronology Stamp'] || row.chronology_stamp || row.Date || row.date || '0000-00-00';
              const description = row['Description Parameter'] || row.description_parameter || row.Description || row.description || 'No parameter matrix configuration provided.';

              return (
                <tr 
                  key={index}
                  className={`group transition-all duration-300 ${
                    darkMode 
                      ? 'bg-[#0E0E0E]/20 hover:bg-zinc-900/30' 
                      : 'bg-white hover:bg-slate-50/80'
                  }`}
                >
                  {/* Column 1: Index Number */}
                  <td className="py-4.5 px-4 sm:px-6 font-mono text-xs font-semibold tracking-wider">
                    <span className={`transition-colors duration-300 ${
                      darkMode ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-slate-400'
                    }`}>
                      {eventIndex}
                    </span>
                  </td>

                  {/* Column 2: Timeline Event Axis */}
                  <td className="py-4.5 px-4 sm:px-6 font-sans text-xs sm:text-sm font-black tracking-wide">
                    <span className={`transition-colors duration-300 ${
                      darkMode ? 'text-zinc-100 group-hover:text-[#22C55E]' : 'text-slate-800'
                    }`}>
                      {eventTitle}
                    </span>
                  </td>

                  {/* Column 3: Chronology Stamp (Date Field) */}
                  <td className="py-4.5 px-4 sm:px-6 text-center font-mono text-xs font-bold tracking-tight">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-black tracking-normal transition-all duration-300 ${
                      darkMode 
                        ? 'bg-[#22C55E]/5 text-[#22C55E] border border-[#22C55E]/10 group-hover:bg-[#22C55E]/10' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200/40'
                    }`}>
                      {chronologyStamp}
                    </span>
                  </td>

                  {/* Column 4: Description Parameter */}
                  <td className="py-4.5 px-4 sm:px-6 font-sans text-xs sm:text-sm max-w-md leading-relaxed">
                    <p className={`line-clamp-2 transition-colors duration-300 ${
                      darkMode ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-slate-600'
                    }`}>
                      {description}
                    </p>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
}