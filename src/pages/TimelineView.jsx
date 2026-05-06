import React, { useState, useEffect } from 'react';
import { FaThList, FaSearchPlus, FaSearchMinus, FaFolderOpen, FaRegClock, FaTimes, FaChevronRight, FaArrowsAltH, FaArrowsAltV } from 'react-icons/fa';
import { RiTimelineView } from 'react-icons/ri';

import Navbar from '../components/Navbar';
import ControlPanel from '../components/ControlPanel';
import DataStructureTable from '../components/DataStructureTable';
import BottomDockNav from '../components/BottomDockNav';

export default function TimeLineViewPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); 
  
  const [previewData, setPreviewData] = useState([]); 
  const [timelineData, setTimelineData] = useState([]); 
  const [isSaved, setIsSaved] = useState(false);
  
  const [timelineName, setTimelineName] = useState('');
  const [savedTimelines, setSavedTimelines] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [viewType, setViewType] = useState('table'); 
  const [viewLayout, setViewLayout] = useState('vertical'); 
  const [zoomLevel, setZoomLevel] = useState(1); 

  const [showTablePreview, setShowTablePreview] = useState(false);

  useEffect(() => {
    fetchSavedTimelines();
  }, []);

  const fetchSavedTimelines = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/timeline/names');
      const result = await response.json();
      if (result.success) setSavedTimelines(result.datasets || []);
    } catch (err) {
      console.error("Sub-vault system tracking exception:", err);
    }
  };

  const uniqueSavedTimelines = [];
  const seenNames = new Set();
  savedTimelines.forEach((timeline) => {
    if (timeline && timeline.name && !seenNames.has(timeline.name)) {
      seenNames.add(timeline.name);
      uniqueSavedTimelines.push(timeline);
    }
  });

  const safeChronologicalSort = (dataArray) => {
    return dataArray.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return dateA - dateB;
    });
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      alert("Attach structural CSV file schemas only.");
      e.target.value = null; 
      return;
    }

    setFile(uploadedFile);
    setTimelineName(uploadedFile.name.replace('.csv', ''));
    setShowTablePreview(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawText = event.target.result;
      const lines = rawText.split('\n');
      if (lines.length === 0 || !lines[0]) return;
      
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      let parsedRows = lines.slice(1).map(line => {
        if (!line.trim()) return null;
        const values = line.split(',');
        if (values.length >= headers.length) {
          const nameIndex = headers.indexOf('name') !== -1 ? headers.indexOf('name') : headers.indexOf('title');
          const dateIndex = headers.indexOf('date');
          const descIndex = headers.indexOf('description');

          let rawDate = dateIndex !== -1 && values[dateIndex] ? values[dateIndex].trim() : "";
          let formattedDate = "";

          if (rawDate) {
            const dateParts = rawDate.split(/[-/]/); 
            if (dateParts.length === 3) {
              if (dateParts[0].length === 4) {
                const year = dateParts[0];
                const month = dateParts[1].padStart(2, '0');
                const day = dateParts[2].padStart(2, '0');
                formattedDate = `${year}-${month}-${day}`;
              } else if (dateParts[2].length === 4) {
                const day = dateParts[0].padStart(2, '0');
                const month = dateParts[1].padStart(2, '0');
                const year = dateParts[2];
                formattedDate = `${year}-${month}-${day}`;
              }
            }
          }

          return {
            name: nameIndex !== -1 && values[nameIndex] ? values[nameIndex].trim() : "Untitled Action",
            date: formattedDate || rawDate, 
            description: descIndex !== -1 && values[descIndex] ? values[descIndex].trim() : ""
          };
        }
        return null;
      }).filter(Boolean);

      parsedRows = safeChronologicalSort(parsedRows);

      setPreviewData(parsedRows);
      setTimelineData([]); 
      setViewType('table');
      setIsSaved(false);
      setSelectedEvent(null);
      setActiveTab('upload'); 
    };
    reader.readAsText(uploadedFile);
  };

  const handlePreviewClick = () => {
    if (previewData.length === 0) {
      return alert("Operation rejected. Matrix pipeline arrays are empty. Please upload a file.");
    }
    setViewType('table'); 
    setShowTablePreview((prev) => !prev); 
  };

  const handleGenerateClick = () => {
    if (previewData.length === 0) return alert("Operation rejected. Matrix pipeline arrays are empty.");
    setTimelineData(previewData); 
    setViewType('timeline'); 
    setActiveTab('canvas'); 
    setShowTablePreview(false);
    if (previewData.length > 0) setSelectedEvent(previewData[0]);
  };

  const handleSaveClick = async () => {
    if (previewData.length === 0) return alert("Commit payload empty.");

    try {
      const response = await fetch('http://localhost:5000/api/timeline/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: timelineName, events: previewData })
      });
      const result = await response.json();
      if (result.success) {
        alert("saved successfully.");
        setIsSaved(true);
        fetchSavedTimelines(); 
      }
    } catch (err) {
      alert("persistence routing handshake exception on sever runtime.");
    }
  };

  const handleLoadTimeline = async (name) => {
    try {
      const response = await fetch(`http://localhost:5000/api/timeline/data/${encodeURIComponent(name)}`);
      const result = await response.json();
      if (result.success) {
        let mappedDataset = result.data.map(e => ({
          name: e.name || e.title || "Untitled Action",
          date: e.date ? e.date.split('T')[0] : "",
          description: e.description || ""
        }));

        mappedDataset = safeChronologicalSort(mappedDataset);

        setPreviewData(mappedDataset); 
        setTimelineData(mappedDataset); 
        setTimelineName(result.timelineName);
        setIsSaved(true);
        setViewType('timeline');
        setActiveTab('canvas'); 
        setShowTablePreview(false); 
        if (mappedDataset.length > 0) setSelectedEvent(mappedDataset[0]);
      }
    } catch (err) {
      console.error("Critical sub-vault pull sync error:", err);
    }
  };

  const handleEventCardClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const years = ['All', ...new Set(previewData.map(d => d.date ? d.date.split('-')[0] : null).filter(Boolean))];
  const months = ['All', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  const displayedDataset = viewType === 'timeline' ? timelineData : previewData;

  const filteredData = displayedDataset.filter(item => {
    if (!item || !item.date) return false;
    const parts = item.date.split('-');
    if (parts.length < 2) return false;
    const year = parts[0];
    const month = parts[1];
    return (selectedYear === 'All' || year === selectedYear) && (selectedMonth === 'All' || month === selectedMonth);
  });

  return (
    <div className={`min-h-screen pb-28 transition-all duration-500 ease-in-out ${darkMode ? 'bg-[#0B0C10] text-[#E2E8F0]' : 'bg-slate-50 text-slate-800'}`}>
      
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="p-4 sm:p-8 max-w-[1600px] mx-auto space-y-8">
        
        {(activeTab === 'upload' || activeTab === 'canvas') && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="transition-all duration-300 [&_select]:hover:scale-105 [&_select]:transition-all [&_select]:duration-300 [&_select]:cursor-pointer">
              <ControlPanel 
                darkMode={darkMode} file={file} handleFileChange={handleFileChange}
                selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                years={years} months={months} handleGenerateClick={handleGenerateClick} 
                handleSaveClick={handleSaveClick} previewData={previewData} isSaved={isSaved}
                handlePreviewClick={handlePreviewClick} showTablePreview={showTablePreview}
              />
            </div>

            <div className="w-full transition-all duration-300">
              <div className={`p-4 sm:p-6 md:p-8 rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-[#12141C] border-[#1f222f]' : 'bg-white border-slate-200 shadow-md'}`}>
                
                <div className={`flex flex-wrap justify-between items-center mb-8 gap-4 border-b pb-5 border-dashed ${darkMode ? 'border-[#2A2E3D]' : 'border-slate-200'}`}>
                  <h3 className={`text-sm font-mono font-bold uppercase tracking-wider flex items-center gap-2 text-base ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    {viewType === 'timeline' ? <RiTimelineView className="text-[#22C55E] text-xl" /> : <FaThList className="text-[#22C55E] text-xl" />} 
                    table data: <span className="text-[#22C55E] font-sans text-lg font-bold ml-1">{timelineName || "Timeline"}</span>
                  </h3>
                  
                  {viewType === 'timeline' && filteredData.length > 0 && (
                    <div className="flex flex-wrap items-center gap-4">
                      <div className={`flex items-center gap-1 p-1 rounded-xl border ${darkMode ? 'bg-[#0B0C10] border-[#2A2E3D]' : 'bg-slate-100 border-slate-250'}`}>
                        <button 
                          onClick={() => setViewLayout('vertical')} 
                          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${viewLayout === 'vertical' ? 'bg-[#22C55E] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                          <FaArrowsAltV /> Vertical
                        </button>
                        <button 
                          onClick={() => setViewLayout('horizontal')} 
                          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${viewLayout === 'horizontal' ? 'bg-[#22C55E] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                          <FaArrowsAltH /> Horizontal
                        </button>
                      </div>

                      <div className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${darkMode ? 'bg-[#0B0C10] border-[#2A2E3D]' : 'bg-slate-100 border-slate-250'}`}>
                        <button onClick={() => setZoomLevel(prev => Math.max(0.65, prev - 0.05))} className="p-2 text-sm hover:text-[#22C55E] hover:scale-110 transition-all"><FaSearchMinus /></button>
                        <span className="text-xs font-mono font-bold px-2 min-w-[45px] text-center">{Math.round(zoomLevel * 100)}%</span>
                        <button onClick={() => setZoomLevel(prev => Math.min(1.2, prev + 0.05))} className="p-2 text-sm hover:text-[#22C55E] hover:scale-110 transition-all"><FaSearchPlus /></button>
                      </div>
                    </div>
                  )}
                </div>

                {viewType === 'timeline' ? (
                  filteredData.length === 0 ? (
                    <div className="text-center py-24 italic text-gray-500 text-sm font-mono"> Graphics mapping target blank. Execute Generate array block.</div>
                  ) : (
                    viewLayout === 'vertical' ? (
                      <div className="relative py-4 md:py-6 overflow-hidden select-none">
                        <div className={`absolute lg:left-1/2 left-4 transform lg:-translate-x-1/2 top-0 bottom-0 w-[3px] z-0 ${darkMode ? 'bg-gradient-to-b from-[#22C55E] via-[#22C55E]/20 to-transparent' : 'bg-green-200'}`} />
                        
                        <div 
                          className="space-y-6 md:space-y-8 relative z-10 mx-auto max-w-5xl" 
                          style={{ 
                            paddingTop: `${zoomLevel * 1.5}rem`, 
                            paddingBottom: `${zoomLevel * 1.5}rem`, 
                            gap: `${zoomLevel * 2}rem` 
                          }}
                        >
                          {filteredData.map((event, idx) => {
                            const isEven = idx % 2 === 0;
                            const isSelected = selectedEvent === event;
                            return (
                              <div key={idx} onClick={() => handleEventCardClick(event)} className={`flex w-full items-center justify-between cursor-pointer group transition-all duration-300 lg:flex-row ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-row`}>
                                <div className="w-full lg:w-[45%] pl-10 pr-2 lg:p-0 flex justify-start">
                                  <div className={`w-full rounded-2xl border text-left scale-100 transition-all duration-500 transform hover:-translate-y-1.5 ${isSelected ? (darkMode ? 'bg-[#1C1F2E] border-[#22C55E] shadow-[0_0_35px_rgba(34,197,94,0.35)]' : 'bg-green-50 border-green-500 shadow-md') : (darkMode ? 'bg-[#161925] border-[#232736] hover:border-[#22C55E]' : 'bg-slate-50 border-slate-200 hover:border-green-400')}`} style={{ padding: `${zoomLevel * 1.25}rem` }}>
                                    <span className="font-mono font-bold text-[#22C55E] rounded-md bg-[#22C55E]/10 border border-[#22C55E]/20 inline-block" style={{ fontSize: `${zoomLevel * 0.75}rem`, padding: `${zoomLevel * 0.25}rem ${zoomLevel * 0.6}rem` }}>{event.date}</span>
                                    <h4 className={`font-extrabold mt-3 truncate ${darkMode ? 'text-white' : 'text-slate-800'} group-hover:text-[#22C55E]`} style={{ fontSize: `${zoomLevel * 1}rem` }}>{event.name}</h4>
                                    <p className={`mt-2 line-clamp-2 leading-relaxed ${darkMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-slate-600 group-hover:text-slate-900'}`} style={{ fontSize: `${zoomLevel * 0.85}rem` }}>{event.description}</p>
                                  </div>
                                </div>
                                <div className="absolute lg:left-1/2 left-4 transform lg:-translate-x-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                                  <div className={`rounded-full transition-all duration-500 relative flex items-center justify-center ${isSelected ? 'w-5 h-5 bg-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'w-4 h-4 bg-[#1A1D26] border-2 border-[#2A2E3D] group-hover:border-[#22C55E]'}`}>
                                    {isSelected && <span className="absolute w-full h-full rounded-full bg-[#22C55E] opacity-75 animate-ping" />}
                                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-transparent group-hover:bg-[#22C55E]'}`} />
                                  </div>
                                </div>
                                <div className="hidden lg:block w-[45%]" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="relative py-24 my-6 overflow-x-auto select-none scrollbar-thin scrollbar-thumb-[#22C55E]/20 scrollbar-track-transparent transition-all duration-500">
                        
                        <div className={`absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-[2px] z-0 ${darkMode ? 'bg-zinc-800' : 'bg-slate-300'}`} />
                        
                        <div 
                          className="flex items-center relative z-10 mx-auto"
                          style={{ gap: `${zoomLevel * 4.5}rem`, paddingLeft: '14rem', paddingRight: '14rem' }}
                        >
                          {filteredData.map((event, idx) => {
                            const isTop = idx % 2 === 0;
                            const isSelected = selectedEvent === event;
                            const displayYear = event.date ? event.date.split('-')[0] : 'N/A';

                            return (
                              <div 
                                key={idx} 
                                onClick={() => handleEventCardClick(event)} 
                                className="flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 min-w-[240px] max-w-[270px] text-center relative"
                              >
                                
                                <div className="h-[140px] flex flex-col justify-end items-center w-full pb-4">
                                  {isTop && (
                                    <div className="space-y-1 animate-fadeIn">
                                      <div className={`font-mono font-black text-sm tracking-widest transition-colors duration-300 ${isSelected ? 'text-[#22C55E]' : (darkMode ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-slate-400 group-hover:text-slate-800')}`}>{displayYear}</div>
                                      <h4 className={`font-black tracking-wide leading-tight transition-all truncate px-2 ${isSelected ? 'text-[#22C55E]' : (darkMode ? 'text-zinc-100 group-hover:text-[#22C55E]' : 'text-slate-900 group-hover:text-green-600')}`} style={{ fontSize: `${zoomLevel * 0.95}rem` }}>{event.name}</h4>
                                      <p className={`line-clamp-2 text-xs leading-relaxed transition-all px-2 ${darkMode ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-slate-600 group-hover:text-slate-900'}`} style={{ fontSize: `${zoomLevel * 0.78}rem` }}>{event.description}</p>
                                    </div>
                                  )}
                                </div>

                                <div className="h-[35px] flex items-center justify-center w-full">
                                  {isTop && (
                                    <div className={`w-[1.5px] h-[35px] transition-all duration-300 ${isSelected ? 'bg-[#22C55E]' : (darkMode ? 'bg-zinc-700 group-hover:bg-[#22C55E]/50' : 'bg-slate-300 group-hover:bg-green-400')}`} />
                                  )}
                                </div>

                                <div className="h-[24px] flex items-center justify-center relative w-full my-0.5">
                                  <div className={`w-4 h-4 rounded-full transition-all duration-500 flex items-center justify-center border-4 ${
                                    isSelected 
                                      ? 'bg-black border-[#22C55E] scale-125 shadow-[0_0_15px_rgba(34,197,94,0.6)]' 
                                      : (darkMode ? 'bg-black border-zinc-500 group-hover:border-[#22C55E]' : 'bg-white border-slate-400 group-hover:border-green-500')
                                  }`}>
                                    {isSelected && <span className="absolute w-6 h-6 rounded-full bg-[#22C55E]/30 animate-ping" />}
                                  </div>
                                </div>

                                <div className="h-[35px] flex items-center justify-center w-full">
                                  {!isTop && (
                                    <div className={`w-[1.5px] h-[35px] transition-all duration-300 ${isSelected ? 'bg-[#22C55E]' : (darkMode ? 'bg-zinc-700 group-hover:bg-[#22C55E]/50' : 'bg-slate-300 group-hover:bg-green-400')}`} />
                                  )}
                                </div>

                                <div className="h-[140px] flex flex-col justify-start items-center w-full pt-4">
                                  {!isTop && (
                                    <div className="space-y-1 animate-fadeIn">
                                      <h4 className={`font-black tracking-wide leading-tight transition-all truncate px-2 ${isSelected ? 'text-[#22C55E]' : (darkMode ? 'text-zinc-100 group-hover:text-[#22C55E]' : 'text-slate-900 group-hover:text-green-600')}`} style={{ fontSize: `${zoomLevel * 0.95}rem` }}>{event.name}</h4>
                                      <p className={`line-clamp-2 text-xs leading-relaxed transition-all px-2 ${darkMode ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-slate-600 group-hover:text-slate-900'}`} style={{ fontSize: `${zoomLevel * 0.78}rem` }}>{event.description}</p>
                                      <div className={`font-mono font-black text-sm tracking-widest pt-1 transition-colors duration-300 ${isSelected ? 'text-[#22C55E]' : (darkMode ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-slate-400 group-hover:text-slate-800')}`}>{displayYear}</div>
                                    </div>
                                  )}
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  showTablePreview ? (
                    <DataStructureTable darkMode={darkMode} previewData={filteredData} />
                  ) : (
                    <div className={`text-center py-24 italic text-sm font-mono ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>upload  csv 
                    file</div>
                  )
                )}

              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={`p-4 sm:p-6 md:p-8 rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-[#12141C] border-[#1f222f]' : 'bg-white border-slate-200 shadow-md'}`}>
            <div className={`border-b pb-5 mb-6 flex flex-wrap justify-between items-center gap-4 ${darkMode ? 'border-[#2A2E3D]' : 'border-slate-200'}`}>
              <div>
                <h2 className={`text-xl sm:text-2xl font-black tracking-tight uppercase ${darkMode ? 'text-white' : 'text-slate-800'}`}>History</h2>
                <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>saved Items</p>
              </div>
              <span className={`text-xs font-mono font-bold border px-4 py-2 rounded-xl ${darkMode ? 'bg-[#0B0C10] border-[#2A2E3D] text-[#22C55E]' : 'bg-green-50 border-green-200 text-green-600'}`}>
                {uniqueSavedTimelines.length} Items Found
              </span>
            </div>

            {uniqueSavedTimelines.length === 0 ? (
              <p className="text-sm font-mono text-gray-500 italic py-12 text-center">// Vault storage records currently offline/empty.</p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {uniqueSavedTimelines.map((dataset) => {
                  const isCurrent = timelineName === dataset.name;
                  return (
                    <div
                      key={dataset.id}
                      onClick={() => handleLoadTimeline(dataset.name)}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 group gap-4 ${
                        isCurrent 
                          ? (darkMode ? 'bg-[#1C1F2E] border-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-green-50 border-green-500') 
                          : (darkMode ? 'bg-[#161925] border-[#232736] hover:bg-[#1E2235] hover:border-[#22C55E]/50' : 'bg-white border-slate-200 hover:border-green-400 hover:shadow-sm')
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={`p-2.5 rounded-lg border flex-shrink-0 text-gray-400 group-hover:text-[#22C55E] ${darkMode ? 'bg-[#1A1D26] border-gray-800' : 'bg-slate-50 border-slate-100'}`}>
                          <FaFolderOpen className="text-sm" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className={`text-base font-bold truncate ${isCurrent ? (darkMode ? 'text-[#22C55E]' : 'text-green-600') : (darkMode ? 'text-white group-hover:text-[#22C55E]' : 'text-slate-800 group-hover:text-green-600')}`}>
                            {dataset.name}
                          </h4>
                          <div className={`flex items-center gap-1.5 text-xs font-mono mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                            <FaRegClock className="text-[10px]" />
                            <span>ID: {dataset.id ? dataset.id.slice(-6).toUpperCase() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-0 pt-3 sm:pt-0 ${darkMode ? 'border-gray-800/40' : 'border-slate-100'}`}>
                        <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded border ${isCurrent ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]' : (darkMode ? 'bg-[#1A1D26] border-transparent text-gray-400' : 'bg-slate-100 border-slate-200 text-slate-600')}`}>
                          {isCurrent ? "ACTIVE MATRIX" : "ARCHIVED"}
                        </span>
                        <div className={`flex items-center gap-1 text-xs font-mono font-bold ${isCurrent ? 'text-[#22C55E]' : (darkMode ? 'text-gray-400 group-hover:text-white' : 'text-slate-400 group-hover:text-green-600')}`}>
                          <span className={`hidden md:inline transition-opacity duration-200 mr-1 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            {isCurrent ? "ACTIVE" : "DEPLOY"}
                          </span>
                          <FaChevronRight className="text-[10px] transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      <BottomDockNav activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className={`w-full max-w-2xl overflow-hidden rounded-3xl border shadow-2xl ${darkMode ? 'bg-[#12141C] border-[#22C55E]/30 shadow-[0_0_50px_rgba(34,197,94,0.15)]' : 'bg-white border-slate-200'}`}>
            <div className={`flex justify-between items-center px-6 py-5 border-b ${darkMode ? 'border-[#1f222f] bg-[#161925]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#22C55E] px-3 py-1 rounded-md bg-[#22C55E]/10 border border-[#22C55E]/20">{selectedEvent.date}</span>
                <span className="text-xs font-mono text-gray-500">// Event Matrix Active</span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className={`p-2 rounded-full ${darkMode ? 'hover:bg-zinc-800 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500'}`}><FaTimes /></button>
            </div>
            <div className="p-6 space-y-6">
              <h3 className={`text-xl font-black tracking-wide leading-snug ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedEvent.name}</h3>
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider block">Telemetry Full Summary</span>
                <div className={`text-sm sm:text-base leading-relaxed p-5 border rounded-2xl max-h-[350px] overflow-y-auto ${darkMode ? 'bg-[#0B0C10] border-[#1f222f] text-gray-300' : 'bg-slate-50 border-slate-200/60 text-slate-700'}`}>{selectedEvent.description || 'Null matrix descriptions data.'}</div>
              </div>
            </div>
            <div className={`px-6 py-4 flex justify-end border-t ${darkMode ? 'border-[#1f222f] bg-[#161925]' : 'bg-slate-50 border-slate-200'}`}>
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl bg-[#22C55E] text-black hover:bg-[#1eb052] shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:scale-105">Close Telemetry</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}