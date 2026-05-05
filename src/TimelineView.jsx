import { useState, useCallback, useMemo } from "react";
import Papa from "papaparse";

import { 
  FaList, 
  FaRegEye, 
  FaRegEyeSlash,
  FaSliders, 
  FaFlag, 
  FaRegFileLines, 
  FaPencil, 
  FaCode, 
  FaBug, 
  FaRocket, 
  FaXmark, 
  FaPlus, 
  FaMinus, 
  FaRotateRight,
  FaTableCells,
  FaArrowsUpDown,
  FaArrowsLeftRight,
  FaFilter,
  FaTimeline, 

} from "react-icons/fa6";

const PALETTE = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#a855f7"];
const ICON_KEYS = ["flag", "doc", "pencil", "code", "bug", "rocket"];

function DynamicIcon({ name, ...props }) {
  switch (name) {
    case "flag":   return <FaFlag {...props} />;
    case "doc":    return <FaRegFileLines {...props} />;
    case "pencil": return <FaPencil {...props} />;
    case "code":   return <FaCode {...props} />;
    case "bug":    return <FaBug {...props} />;
    case "rocket": return <FaRocket {...props} />;
    default:       return <FaFlag {...props} />;
  }
}

const getDynamicVal = (obj, keysArray) => {
  const foundKey = Object.keys(obj).find(k => 
    keysArray.some(key => k.toLowerCase().trim() === key.toLowerCase())
  );
  return foundKey ? obj[foundKey] : "";
};

function inferGenericIconAndColor(row, index) {
  const title = (getDynamicVal(row, ["title", "name", "event", "heading"]) || "").toLowerCase();
  
  if (title.includes("init") || title.includes("start")) return { iconKey: "flag",   color: "#6366f1" };
  if (title.includes("req") || title.includes("need"))   return { iconKey: "doc",    color: "#3b82f6" };
  if (title.includes("design") || title.includes("ui"))  return { iconKey: "pencil", color: "#10b981" };
  if (title.includes("dev") || title.includes("code"))   return { iconKey: "code",   color: "#f59e0b" };
  if (title.includes("test") || title.includes("bug"))   return { iconKey: "bug",    color: "#ef4444" };
  if (title.includes("deploy") || title.includes("prod")) return { iconKey: "rocket", color: "#a855f7" };

  return {
    iconKey: ICON_KEYS[index % ICON_KEYS.length],
    color: PALETTE[index % PALETTE.length]
  };
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <div className="flex items-center gap-2 rounded-full px-3.5 py-1.5 border border-gray-200 dark:border-white/10 bg-white/5 backdrop-blur shadow-sm">
      <span className="text-[10px] font-bold tracking-wider dark:text-slate-400 text-indigo-600">LIGHT</span>
      <button
        onClick={onToggle}
        className="relative flex items-center rounded-full p-0.5 transition-all duration-300 focus:outline-none"
        style={{ width: 36, height: 20, background: isDark ? "#4f46e5" : "#cbd5e1" }}
        aria-label="Toggle theme"
      >
        <div className="w-4 h-4 bg-white rounded-full shadow transition-transform duration-300" style={{ transform: isDark ? "translateX(16px)" : "translateX(0px)" }} />
      </button>
      <span className="text-[10px] font-bold tracking-wider dark:text-indigo-400 text-slate-400">DARK</span>
    </div>
  );
}

function UploadPanel({ isDark, fileName, errorMsg, onUpload, onPreviewClick, onGenerateClick, hasData, isPreviewActive, isTimelineActive }) {
  const card = isDark ? "bg-[#0f1626] border-[#1e293b]" : "bg-white border-[#e2e8f0]";

  return (
    <div className={`p-5 rounded-2xl border shadow-sm transition-colors duration-300 ${card}`}>
      <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
        Upload CSV File
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col flex-1 gap-1" style={{ minWidth: 300 }}>
          <div className="flex items-center gap-3 w-full">
            <label
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-xs font-bold shrink-0 transition-all"
              style={isDark ? { background: "#151f32", border: "1px solid #2d3a4f", color: "#94a3b8" } : { background: "#fafafa", border: "1px solid #e2e8f0", color: "#475569" }}
            >
              Choose File
              <input type="file" accept=".csv" className="hidden" onChange={onUpload} />
            </label>
            <div
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs flex-1"
              style={isDark ? { background: "#0b101b", border: "1px solid #1e293b", color: "#94a3b8" } : { background: "white", border: "1px solid #e2e8f0", color: "#475569" }}
            >
              <span className="truncate">{fileName || "No file selected"}</span>
              {hasData && !errorMsg && <span className="text-emerald-500 font-bold ml-2">Data Loaded ✓</span>}
            </div>
          </div>
          {errorMsg && <p className="text-[11px] text-rose-500 font-medium px-1 mt-1">{errorMsg}</p>}
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={onPreviewClick}
            disabled={!hasData}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border transition-all"
            style={
              !hasData
                ? { opacity: 0.5, cursor: "not-allowed", border: "1px solid #e2e8f0", color: "#94a3b8" }
                : isPreviewActive
                ? { border: "1px solid #10b981", color: "#10b981", background: "rgba(16,185,129,0.05)" }
                : isDark
                ? { border: "1px solid #4f46e5", color: "#818cf8", background: "rgba(21,31,50,0.5)" }
                : { border: "1px solid #e0ddff", color: "#4f46e5", background: "#f5f3ff" }
            }
          >
            {isPreviewActive ? <FaRegEyeSlash className="text-sm" /> : <FaRegEye className="text-sm" />}
            Preview Raw Table
          </button>
          
          <button
            onClick={onGenerateClick}
            disabled={!hasData}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white transition-all"
            style={
              !hasData 
                ? { background: "#cbd5e1", cursor: "not-allowed" }
                : isTimelineActive
                ? { background: "#059669", boxShadow: "0 2px 10px rgba(5,150,105,0.25)" }
                : { background: "#4f46e5", boxShadow: "0 2px 10px rgba(99,102,241,0.25)" }
            }
          >
            <FaSliders className="text-sm" />
            {isTimelineActive ? "Timeline Active ✓" : "Generate Timeline"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InlineDetailCard({ item, isDark, onClose }) {
  if (!item) return null;

  return (
    <div 
      className="p-6 rounded-2xl border shadow-md relative transition-all duration-150"
      style={{ 
        background: isDark ? "#0f1626" : "white",
        borderColor: item.color,
        borderWidth: "2px",
        boxShadow: `0 10px 30px ${item.color}15`,
      }}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-xl opacity-50 hover:opacity-100 transition-all text-xs"
        style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
      >
        <FaXmark />
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full text-base"
            style={{
              width: 44,
              height: 44,
              background: `${item.color}20`,
              border: `1px solid ${item.color}40`,
              color: item.color,
            }}
          >
            <DynamicIcon name={item.iconKey} />
          </div>
          <div>
            <h4 className="text-sm font-bold" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
              {item.title}
            </h4>
            <span className="text-[10px] font-mono font-bold mt-0.5 inline-block" style={{ color: item.color }}>
              ACTIVE MILESTONE ID: #{item.id}
            </span>
          </div>
        </div>
        
        <div className="text-xs font-mono font-bold px-3 py-1 rounded-xl" style={{ background: isDark ? "#141d30" : "#f1f5f9", color: isDark ? "#94a3b8" : "#475569" }}>
          Target Metric Date: {item.date || "N/A"}
        </div>
      </div>

      <hr style={{ borderColor: isDark ? "#1e293b" : "#e2e8f0" }} className="mb-3" />

      <div>
        <span className="text-[10px] font-bold tracking-wider opacity-40 block uppercase mb-1">Parsed Object Description</span>
        <p className="text-xs leading-relaxed opacity-80 whitespace-pre-wrap">
          {item.description || "No supplemental details found inside row structure."}
        </p>
      </div>
    </div>
  );
}

function DataTable({ isDark, data }) {
  const card    = isDark ? "bg-[#0f1626] border-[#1e293b]" : "bg-white border-[#e2e8f0]";
  const thBg    = isDark ? "bg-[#141d30] text-[#4b71af]"   : "bg-[#f1f5f9] text-slate-500";
  const thBdr   = isDark ? "border-b border-[#1e293b]"      : "border-b border-[#e2e8f0]";
  const rowDiv  = isDark ? "divide-[#1e293b]/60"            : "divide-slate-100";
  const rowHov  = isDark ? "hover:bg-[#16223b]/50"          : "hover:bg-slate-50/80";

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${card}`}>
      <div className="p-4 flex items-center gap-2" style={{ borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0" }}>
        <FaTableCells className="text-indigo-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider opacity-80" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
          Structured Data Preview Matrix
        </h3>
      </div>
      <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`${thBg} ${thBdr} font-bold`}>
              <th className="p-3.5 pl-5 w-16">ID</th>
              <th className="p-3.5 w-1/4">Title (Name)</th>
              <th className="p-3.5 w-1/2">Description</th>
              <th className="p-3.5">Date</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${rowDiv}`}>
            {data.map((row, i) => (
              <tr key={i} className={`${rowHov} transition-colors`}>
                <td className="p-3.5 pl-5 font-semibold opacity-60">{row.id}</td>
                <td className="p-3.5 font-bold" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>{row.title}</td>
                <td className="p-3.5 opacity-80">{row.description}</td>
                <td className="p-3.5 font-mono whitespace-nowrap opacity-70">{row.date || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AlternatingHorizontalNode({ item, index, isDark, isActive, onSelectNode }) {
  const isTop = index % 2 === 0;

  return (
    <div
      className="flex flex-col items-center relative select-none cursor-pointer"
      style={{ width: 180, transform: isActive ? "scale(1.02)" : "scale(1)" }}
      onClick={() => onSelectNode(item)}
    >
      <div 
        className="absolute flex flex-col items-center text-center w-[165px]"
        style={{ top: isTop ? -145 : "auto", bottom: !isTop ? -145 : "auto" }}
      >
        <span className="font-mono text-xs font-bold tracking-tight mb-2 transition-colors" style={{ color: isActive ? item.color : (isDark ? "#94a3b8" : "#475569") }}>
          {item.date || "—"}
        </span>

        <div
          className="flex items-center justify-center rounded-full mb-3 border transition-all duration-150"
          style={{
            width: 44,
            height: 44,
            background: isDark ? "rgba(30, 41, 59, 0.5)" : "#f8fafc",
            borderColor: isActive ? item.color : (isDark ? "#334155" : "#cbd5e1"),
            color: item.color,
            boxShadow: isActive ? `0 0 14px ${item.color}40` : "none"
          }}
        >
          <DynamicIcon name={item.iconKey} className="text-sm" />
        </div>

        <h4 className="font-bold text-xs mb-0.5 line-clamp-1" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
          {item.title}
        </h4>
        <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-tight line-clamp-2 px-1">
          {item.description}
        </p>
      </div>

      <div className="absolute w-[2px]" style={{ background: item.color, height: 60, top: isTop ? -60 : "auto", bottom: !isTop ? -60 : "auto", opacity: isActive ? 1 : 0.4 }} />

      <div className="relative flex items-center justify-center" style={{ height: 16 }}>
        <div
          className="rounded-full transition-all duration-150 z-20"
          style={{
            width: 12,
            height: 12,
            background: item.color,
            border: isDark ? "2px solid #0f1626" : "2px solid white",
            boxShadow: isActive ? `0 0 12px 3px ${item.color}` : "none",
            transform: isActive ? "scale(1.2)" : "scale(1)"
          }}
        />
      </div>
    </div>
  );
}

function StandardVerticalNode({ item, isDark, isActive, onSelectNode }) {
  return (
    <div 
      className="flex gap-6 relative items-start cursor-pointer select-none group" 
      onClick={() => onSelectNode(item)}
    >
      <div className="flex flex-col items-center h-full absolute left-4 top-0 bottom-0 z-10">
        <div 
          className="rounded-full border-2 transition-all duration-150"
          style={{
            width: 14,
            height: 14,
            background: isActive ? item.color : (isDark ? "#1e293b" : "#fff"),
            borderColor: item.color,
            boxShadow: isActive ? `0 0 10px ${item.color}` : "none",
            marginTop: "6px"
          }}
        />
      </div>

      <div 
        className="ml-12 p-4 rounded-xl border flex-1 transition-all duration-150"
        style={{
          background: isDark ? (isActive ? "rgba(30,41,59,0.3)" : "#0f1626") : (isActive ? "#f5f3ff" : "#fff"),
          borderColor: isActive ? item.color : (isDark ? "#1e293b" : "#e2e8f0"),
          boxShadow: isActive ? `0 4px 12px ${item.color}10` : "none"
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span style={{ color: item.color }} className="text-sm shrink-0">
              <DynamicIcon name={item.iconKey} />
            </span>
            <h4 className="font-bold text-sm" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
              {item.title}
            </h4>
          </div>
          <span className="font-mono text-xs font-bold bg-black/10 dark:bg-white/5 px-2.5 py-0.5 rounded-full opacity-70">
            {item.date || "N/A"}
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed line-clamp-3">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function TimelineDashboard() {
  const [isDark, setIsDark] = useState(true);
  const [data, setData] = useState([]); 
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);       
  const [showTimeline, setShowTimeline] = useState(false);     
  const [selectedNode, setSelectedNode] = useState(null); 
  const [zoomLevel, setZoomLevel] = useState("month");
  const [layoutMode, setLayoutMode] = useState("vertical"); 
  
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("ALL");

  const handleUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setErrorMsg("Invalid layout file format. System parsing requires a standard .csv spreadsheet vector.");
      return;
    }

    setFileName(file.name);
    setErrorMsg("");
    setShowPreview(false);
    setShowTimeline(false); 
    setSelectedNode(null); 
    setSelectedYear("ALL");
    setSelectedMonth("ALL");
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data: rows, errors }) => {
        if (errors.length > 0 || !rows || !rows.length) {
          setErrorMsg("Error structural conversion failure. Cannot parse rows schema accurately.");
          return;
        }
        
        const sampleRow = rows[0];
        const titleKey = Object.keys(sampleRow).find(k => ["title", "name", "event", "heading"].includes(k.toLowerCase().trim()));
        if (!titleKey) {
          setErrorMsg("Validation warning: CSV requires at least one title column context (e.g. 'Name' or 'Title').");
          return;
        }

        const mapped = rows.map((row, idx) => {
          const title = getDynamicVal(row, ["title", "name", "event", "heading"]) || `Milestone Event #${idx + 1}`;
          const description = getDynamicVal(row, ["description", "desc", "details", "info"]) || "";
          const date = getDynamicVal(row, ["date", "timestamp", "time", "year"]) || "";
          
          const { iconKey, color } = inferGenericIconAndColor(row, idx);
          
          let parsedYear = "Unknown";
          let parsedMonth = "Unknown";
          if (date) {
            const normalized = date.replace(/[/]/g, "-");
            const parts = normalized.split("-");
            if (parts[0] && parts[0].length === 4) {
              parsedYear = parts[0];
              if (parts[1]) parsedMonth = parts[1];
            }
          }
          
          return {
            id: idx + 1,
            title,
            description,
            date,
            color,
            iconKey,
            yearVal: parsedYear,
            monthVal: parsedMonth
          };
        });
        setData(mapped);
      },
    });
  }, []);

  const filteredTimelineData = useMemo(() => {
    return data.filter(item => {
      if (selectedYear !== "ALL" && item.yearVal !== selectedYear) return false;
      if (selectedMonth !== "ALL" && item.monthVal !== selectedMonth) return false;
      return true;
    });
  }, [data, selectedYear, selectedMonth]);

  const uniqueYearsList = useMemo(() => {
    const list = new Set(data.map(d => d.yearVal).filter(y => y !== "Unknown"));
    return ["ALL", ...Array.from(list).sort()];
  }, [data]);

  const uniqueMonthsList = useMemo(() => {
    const list = new Set(data.map(d => d.monthVal).filter(m => m !== "Unknown"));
    return ["ALL", ...Array.from(list).sort()];
  }, [data]);

  const togglePreview = () => { if (data.length > 0) setShowPreview(prev => !prev); };
  const generateTimelineView = () => { if (data.length > 0) setShowTimeline(true); };

  const zoomStyles = useMemo(() => {
    switch (zoomLevel) {
      case "year":  return { textScale: "text-[11px]", paddingScale: "py-2 px-3", iconSize: "scale-90" };
      case "day":   return { textScale: "text-[13px]", paddingScale: "py-5 px-6", iconSize: "scale-110" };
      default:      return { textScale: "text-xs", paddingScale: "py-3 px-4", iconSize: "scale-100" };
    }
  }, [zoomLevel]);

  const paletteGradientTrack = useMemo(() => {
    if (!filteredTimelineData.length) return "";
    const colors = filteredTimelineData.map(item => item.color);
    if (colors.length === 1) return colors[0];
    return `linear-gradient(to right, ${colors.join(", ")})`;
  }, [filteredTimelineData]);

  const bg = isDark ? "bg-[#090d16] text-slate-100" : "bg-[#f8faff] text-slate-900";

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 p-6 md:p-10 ${bg}`}>
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className="text-white text-base"
              style={{ padding: 10, borderRadius: 12, background: "#4f46e5", boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }}
            >
              <FaTimeline />

            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Timeline View Application</h1>
              <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Upload CSV mapping schemas and configure chronological visuals cleanly
              </p>
            </div>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
        </div>

        <UploadPanel 
          isDark={isDark} 
          fileName={fileName} 
          errorMsg={errorMsg}
          onUpload={handleUpload} 
          onPreviewClick={togglePreview}
          onGenerateClick={generateTimelineView}
          hasData={data.length > 0}
          isPreviewActive={showPreview}
          isTimelineActive={showTimeline}
        />

        {data.length > 0 && (showPreview || showTimeline) ? (
          <div className="space-y-6">
            
            {showPreview && <DataTable isDark={isDark} data={data} />}
            
            {showTimeline && (
              <div className="space-y-6">
                
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border bg-black/5 dark:bg-white/5 backdrop-blur" style={{ borderColor: isDark ? "#1e293b" : "#e2e8f0" }}>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLayoutMode("vertical")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all`}
                      style={layoutMode === "vertical" ? { background: "#4f46e5", color: "white" } : { opacity: 0.7 }}
                    >
                      <FaArrowsUpDown /> Vertical Layout
                    </button>
                    <button
                      onClick={() => setLayoutMode("horizontal")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all`}
                      style={layoutMode === "horizontal" ? { background: "#4f46e5", color: "white" } : { opacity: 0.7 }}
                    >
                      <FaArrowsLeftRight /> Alternating Horizontal Layout
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono font-bold">
                    <span className="opacity-50 text-[11px]">ZOOM GRANULARITY:</span>
                    {["year", "month", "day"].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setZoomLevel(lvl)}
                        className={`px-2.5 py-1 rounded uppercase tracking-wider text-[10px] transition-all border`}
                        style={zoomLevel === lvl ? { background: "rgba(99,102,241,0.15)", borderColor: "#4f46e5", color: "#818cf8" } : { borderColor: "transparent", opacity: 0.6 }}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <FaFilter className="text-indigo-500 text-[10px]" />
                      <span className="opacity-60 text-[11px]">Filter Year:</span>
                      <select
                        value={selectedYear}
                        onChange={(e) => { setSelectedYear(e.target.value); setSelectedNode(null); }}
                        className="p-1.5 rounded-lg border text-xs font-bold bg-transparent cursor-pointer outline-none"
                        style={{ borderColor: isDark ? "#334155" : "#cbd5e1" }}
                      >
                        {uniqueYearsList.map(y => <option key={y} value={y} className={isDark ? "bg-[#0f1626]" : "bg-white"}>{y}</option>)}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="opacity-60 text-[11px]">Month:</span>
                      <select
                        value={selectedMonth}
                        onChange={(e) => { setSelectedMonth(e.target.value); setSelectedNode(null); }}
                        className="p-1.5 rounded-lg border text-xs font-bold bg-transparent cursor-pointer outline-none"
                        style={{ borderColor: isDark ? "#334155" : "#cbd5e1" }}
                      >
                        {uniqueMonthsList.map(m => <option key={m} value={m} className={isDark ? "bg-[#0f1626]" : "bg-white"}>{m === "ALL" ? "ALL" : `MM: ${m}`}</option>)}
                      </select>
                    </div>
                  </div>

                </div>

                <div 
                  className={`rounded-2xl border p-8 transition-colors duration-300 shadow-sm overflow-hidden ${isDark ? "bg-[#0f1626] border-[#1e293b]" : "bg-white border-[#e2e8f0]"}`}
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-8 flex items-center justify-between">
                    <span>Timeline Canvas Display View ({layoutMode} Presentation)</span>
                    <span className="text-[10px] lowercase font-mono opacity-50">rendering {filteredTimelineData.length} records</span>
                  </h3>

                  {filteredTimelineData.length === 0 ? (
                    <div className="text-center py-12 opacity-50 text-xs font-medium">
                      No records match the active Year/Month dropdown combinations.
                    </div>
                  ) : layoutMode === "horizontal" ? (
                    
                    <div className="relative overflow-x-auto" style={{ scrollbarWidth: "none", paddingBottom: 16 }}>
                      <div 
                        className={`relative flex justify-between items-center py-40 transition-transform duration-150 origin-left`} 
                        style={{ minWidth: filteredTimelineData.length * 190, paddingLeft: 40, paddingRight: 40 }}
                      >
                        <div
                          className="absolute left-0 right-0 z-0"
                          style={{
                            height: 4,
                            background: paletteGradientTrack || (isDark ? "rgba(51, 65, 85, 0.5)" : "#cbd5e1"),
                            top: "50%",
                            transform: "translateY(-50%)",
                            opacity: 0.8
                          }}
                        />

                        {filteredTimelineData.map((item, idx) => (
                          <div key={item.id} className={`${zoomStyles.textScale} ${zoomStyles.iconSize}`}>
                            <AlternatingHorizontalNode 
                              item={item} 
                              index={idx}
                              isDark={isDark} 
                              isActive={selectedNode?.id === item.id} 
                              onSelectNode={setSelectedNode} 
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                  ) : (

                    <div className="relative pl-4 space-y-6">
                      <div 
                        className="absolute left-4 top-2 bottom-2 w-[2px] z-0" 
                        style={{ background: isDark ? "#1e293b" : "#e2e8f0" }} 
                      />
                      
                      {filteredTimelineData.map((item) => (
                        <div key={item.id} className={`${zoomStyles.textScale}`}>
                          <StandardVerticalNode 
                            item={item} 
                            isDark={isDark} 
                            isActive={selectedNode?.id === item.id} 
                            onSelectNode={setSelectedNode} 
                          />
                        </div>
                      ))}
                    </div>

                  )}
                </div>

                <InlineDetailCard 
                  item={selectedNode} 
                  isDark={isDark} 
                  onClose={() => setSelectedNode(null)} 
                />

              </div>
            )}

          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center p-16 rounded-2xl border-2 border-dashed transition-all duration-300"
            style={{ borderColor: isDark ? "#1e293b" : "#cbd5e1", background: isDark ? "rgba(15,22,38,0.3)" : "rgba(25,25,25,0.01)" }}
          >
            <span style={{ color: "#4f46e5", marginBottom: 12 }} className="text-xl">
              <FaList />
            </span>
            <p style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#64748b" : "#475569", textAlign: "center" }}>
              Awaiting CSV Input mapping layout fields. Please choose and load a configuration structure file to generate presentation canvases.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}