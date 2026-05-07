import { useState, useEffect, useRef } from "react";
import { 
  HiMoon, HiSun, HiPencil, HiTrash, HiExternalLink, 
  HiCloudUpload, HiEye, HiSave, HiX, HiChevronRight, HiChevronDown 
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion"; 

const API = "http://localhost:5000/api/timeline";

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("CSV must contain header + rows");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i]?.trim() || ""; });
    return { 
      ...obj, 
      title: obj.name || obj.title, 
      date: new Date(obj.date), 
      description: obj.description || "No description provided." 
    };
  });
}

function formatDate(date, zoom) {
  const d = new Date(date);
  if (zoom === "year") return d.getFullYear();
  if (zoom === "month") return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function EventDetailsModal({ event, dark, onClose, zoom }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 2000, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(10px)" }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ background: dark ? "#1e293b" : "#fff", width: 500, borderRadius: 24, padding: 35, border: `1px solid ${dark ? "#334155" : "#ddd"}`, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "#ef444415", border: "none", cursor: "pointer", color: "#ef4444", borderRadius: "50%", padding: 8 }}><HiX size={20} /></button>
        <div style={{ color: "#2563eb", fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{formatDate(event.date, zoom)}</div>
        <h2 style={{ color: dark ? "#fff" : "#111827", marginTop: 0 }}>{event.title}</h2>
        <p style={{ color: dark ? "#94a3b8" : "#64748b", lineHeight: 1.6, fontSize: 16 }}>{event.description}</p>
      </motion.div>
    </div>
  );
}

function TimelineCard({ event, zoom, dark, onClick }) {
  const theme = dark 
    ? { bg: "#1e293b", text: "#fff", sub: "#94a3b8", border: "#334155" } 
    : { bg: "#fff", text: "#111827", sub: "#64748b", border: "#e2e8f0" };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
      style={{
        minWidth: 280, background: theme.bg, borderRadius: 20, padding: 20,
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)", cursor: "pointer",
        border: `1px solid ${theme.border}`, position: "relative"
      }}
    >
      <div style={{ color: "#2563eb", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{formatDate(event.date, zoom)}</div>
      <div style={{ color: theme.text, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{event.title}</div>
      <div style={{ color: theme.sub, fontSize: 14, lineHeight: 1.5 }}>{event.description.substring(0, 80)}...</div>
    </motion.div>
  );
}

function EditModal({ dark, timeline, onClose, onSaved }) {
  const [events, setEvents] = useState(timeline.events.map(e => ({ 
    ...e, 
    date: new Date(e.date).toISOString().split("T")[0] 
  })));

  const handleUpdate = async () => {
    try {
      const formatted = events.map(e => ({ title: e.title, name: e.title, date: e.date, description: e.description }));
      const res = await fetch(`${API}/update/${timeline.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: timeline.name, events: formatted }),
      });
      const data = await res.json();
      if (data.success) { 
        onSaved({ ...timeline, events: formatted.map(e => ({ ...e, date: new Date(e.date) })) }); 
        onClose(); 
      }
    } catch (err) { alert("Update failed"); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(8px)" }}>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: dark ? "#0f172a" : "#fff", width: 750, maxHeight: "85vh", overflowY: "auto", borderRadius: 24, padding: 35, border: `1px solid ${dark ? "#334155" : "#ddd"}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 25, position: "sticky", top: 0, background: dark ? "#0f172a" : "#fff", paddingBottom: 15, zIndex: 10 }}>
          <h2 style={{ color: dark ? "#fff" : "#111827", margin: 0 }}>Edit Timeline Events</h2>
          <button onClick={onClose} style={{ background: "#ef444415", border: "none", cursor: "pointer", color: "#ef4444", borderRadius: "50%", padding: 8, display: "flex" }}><HiX size={24} /></button>
        </div>
        {events.map((ev, i) => (
          <div key={i} style={{ marginBottom: 20, padding: 20, border: `1px solid ${dark ? "#1e293b" : "#f1f5f9"}`, borderRadius: 18, background: dark ? "#1e293b55" : "#f8fafc" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#2563eb", marginBottom: 5 }}>TITLE</label>
            <input value={ev.title} onChange={e => { const a = [...events]; a[i].title = e.target.value; setEvents(a); }} style={{ width: "100%", padding: 12, marginBottom: 15, borderRadius: 10, border: "1px solid #cbd5e1", background: dark ? "#0f172a" : "#fff", color: dark ? "#fff" : "#000" }} />
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#2563eb", marginBottom: 5 }}>DATE</label>
            <input type="date" value={ev.date} onChange={e => { const a = [...events]; a[i].date = e.target.value; setEvents(a); }} style={{ width: "100%", padding: 12, marginBottom: 15, borderRadius: 10, border: "1px solid #cbd5e1", background: dark ? "#0f172a" : "#fff", color: dark ? "#fff" : "#000" }} />
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#2563eb", marginBottom: 5 }}>DESCRIPTION</label>
            <textarea value={ev.description} onChange={e => { const a = [...events]; a[i].description = e.target.value; setEvents(a); }} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cbd5e1", minHeight: 80, background: dark ? "#0f172a" : "#fff", color: dark ? "#fff" : "#000" }} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 15, position: "sticky", bottom: 0, background: dark ? "#0f172a" : "#fff", paddingTop: 15 }}>
          <button onClick={handleUpdate} style={{ flex: 2, padding: 18, background: "#2563eb", color: "#fff", border: "none", borderRadius: 15, fontWeight: 700, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <HiSave size={20} /> Save All Changes
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: 18, background: dark ? "#334155" : "#e2e8f0", color: dark ? "#fff" : "#475569", border: "none", borderRadius: 15, fontWeight: 700, cursor: "pointer", fontSize: 16 }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function TimelineView() {
  const [dark, setDark] = useState(false);
  const [file, setFile] = useState(null);
  const [csvText, setCsvText] = useState("");
  const [parsed, setParsed] = useState([]);
  const [preview, setPreview] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [zoom, setZoom] = useState("month");
  const [view, setView] = useState("horizontal");
  const [savedList, setSavedList] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [editTimeline, setEditTimeline] = useState(null);
  const [viewEvent, setViewEvent] = useState(null); 
  const fileRef = useRef();

  const th = dark ? { bg: "#0a0f1e", surface: "#111827", text: "#fff", border: "#334155" } : { bg: "#f1f5f9", surface: "#fff", text: "#111827", border: "#e2e8f0" };

  useEffect(() => { fetchSaved(); }, []);

  const fetchSaved = async () => {
    const res = await fetch(`${API}/names`);
    const data = await res.json();
    if (data.success) setSavedList(data.datasets);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = (ev) => setCsvText(ev.target.result);
    r.readAsText(f);
  };

  const handleSaveToDB = async () => {
    if (!file || parsed.length === 0) return;
    try {
      const name = file.name.replace(".csv", "");
      const res = await fetch(`${API}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, events: parsed }),
      });
      if ((await res.json()).success) { alert("Timeline Saved!"); fetchSaved(); }
    } catch { alert("Save failed"); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this timeline?")) return;
    await fetch(`${API}/delete/${id}`, { method: "DELETE" });
    fetchSaved();
    if (selectedTimeline?.id === id) setGenerated(false);
  };

  const openTimeline = async (item) => {
    const res = await fetch(`${API}/data/${encodeURIComponent(item.name)}`);
    const data = await res.json();
    const formatted = data.data.map(e => ({ ...e, title: e.title || e.name, date: new Date(e.date) }));
    setSelectedTimeline({ ...item, events: formatted });
    setGenerated(true);
  };

  const events = selectedTimeline ? selectedTimeline.events : parsed;

  return (
    <div style={{ minHeight: "100vh", background: th.bg, color: th.text, transition: "0.4s", fontFamily: "'Inter', sans-serif" }}>
      <header style={{ height: 80, background: th.surface, padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${th.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div style={{ width: 45, height: 45, background: "linear-gradient(135deg, #2563eb, #7c3aed)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 8px 15px rgba(37,99,235,0.3)" }}>
            <HiExternalLink size={26} />
          </div>
          <h2 style={{ margin: 0, letterSpacing: "-0.5px" }}>Timeline <span style={{ color: "#2563eb" }}>View App</span></h2>
        </div>
        <div onClick={() => setDark(!dark)} style={{ width: 64, height: 32, background: dark ? "#2563eb" : "#cbd5e1", borderRadius: 20, cursor: "pointer", position: "relative", padding: 4, transition: "0.3s" }}>
          <div style={{ width: 24, height: 24, background: "#fff", borderRadius: "50%", position: "absolute", left: dark ? 36 : 4, transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
            {dark ? <HiMoon color="#2563eb" size={14} /> : <HiSun color="#f59e0b" size={14} />}
          </div>
        </div>
      </header>

      <div style={{ display: "flex", padding: 40, gap: 40, flexWrap: "wrap" }}>
        {/* SIDEBAR */}
        <div style={{ width: 340 }}>
          <div style={{ background: th.surface, padding: 28, borderRadius: 28, border: `1px solid ${th.border}`, boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
            <h3 style={{ marginTop: 0, marginBottom: 25, display: "flex", alignItems: "center", gap: 10 }}>Saved Datasets</h3>
            {savedList.length === 0 && <p style={{ opacity: 0.5, fontSize: 14 }}>No saved timelines yet.</p>}
            {savedList.map(item => (
              <div key={item.id} style={{ padding: 18, border: `1px solid ${th.border}`, borderRadius: 20, marginBottom: 15, background: dark ? "#1e293b55" : "#f8fafc" }}>
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>{item.name}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openTimeline(item)} style={{ flex: 1, padding: "10px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 13 }}><HiEye /> View</button>
                  <button onClick={() => { openTimeline(item); setTimeout(() => setEditTimeline({ ...item, events }), 500); }} style={{ padding: "10px", background: "#059669", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }}><HiPencil /></button>
                  <button onClick={() => deleteItem(item.id)} style={{ padding: "10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }}><HiTrash /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN AREA */}
        <div style={{ flex: 1, minWidth: 450 }}>
          <div style={{ background: th.surface, padding: 35, borderRadius: 28, border: `1px solid ${th.border}`, marginBottom: 35, boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>Upload & Process Data</h2>
            <div style={{ display: "flex", gap: 15, alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => fileRef.current.click()} style={{ padding: "14px 28px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 14, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}><HiCloudUpload size={20} /> Select CSV</button>
              <input type="file" accept=".csv" ref={fileRef} onChange={handleFile} hidden />
              {file && <span style={{ fontWeight: 600, fontSize: 14 }}>{file.name}</span>}
              {csvText && <button onClick={() => { setParsed(parseCSV(csvText)); setPreview(true); }} style={{ padding: "14px 28px", background: "#059669", color: "#fff", border: "none", borderRadius: 14, cursor: "pointer", fontWeight: 700 }}>Preview Table</button>}
              {preview && <button onClick={handleSaveToDB} style={{ padding: "14px 28px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 14, cursor: "pointer", fontWeight: 700 }}><HiSave /> Save</button>}
            </div>
          </div>

          {preview && (
            <div style={{ background: th.surface, padding: 30, borderRadius: 28, border: `1px solid ${th.border}`, marginBottom: 35 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 25 }}>
                <h3 style={{ margin: 0 }}>Data Table Preview</h3>
                <button onClick={() => setGenerated(true)} style={{ padding: "12px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Generate Timeline View</button>
              </div>
              <div style={{ overflowX: "auto", borderRadius: 15, border: `1px solid ${th.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: dark ? "#1e293b" : "#f1f5f9" }}>
                      <th style={{ padding: 15, textAlign: "left", fontSize: 14 }}>EVENT NAME</th>
                      <th style={{ padding: 15, textAlign: "left", fontSize: 14 }}>DATE</th>
                      <th style={{ padding: 15, textAlign: "left", fontSize: 14 }}>DESCRIPTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.map((r, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${th.border}` }}>
                        <td style={{ padding: 15, fontWeight: 600 }}>{r.title}</td>
                        <td style={{ padding: 15 }}>{new Date(r.date).toLocaleDateString()}</td>
                        <td style={{ padding: 15, fontSize: 14, opacity: 0.8 }}>{r.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {generated && (
            <div style={{ background: th.surface, padding: 35, borderRadius: 28, border: `1px solid ${th.border}`, minHeight: 600 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
                <h2 style={{ margin: 0 }}>{selectedTimeline?.name || "Timeline Visualization"}</h2>
                <div style={{ display: "flex", gap: 8, background: dark ? "#1e293b" : "#f1f5f9", padding: 6, borderRadius: 14 }}>
                  {["year", "month", "day"].map(z => (
                    <button key={z} onClick={() => setZoom(z)} style={{ padding: "8px 18px", border: "none", borderRadius: 10, cursor: "pointer", background: zoom === z ? "#2563eb" : "transparent", color: zoom === z ? "#fff" : th.text, fontWeight: 600, fontSize: 12 }}>{z.toUpperCase()}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setView("horizontal")} style={{ padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer", background: view === "horizontal" ? "#2563eb" : "#cbd5e1", color: "#fff", fontWeight: 600 }}>Horizontal</button>
                  <button onClick={() => setView("vertical")} style={{ padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer", background: view === "vertical" ? "#2563eb" : "#cbd5e1", color: "#fff", fontWeight: 600 }}>Vertical</button>
                </div>
              </div>

              <div style={{ overflowX: view === "horizontal" ? "auto" : "visible", scrollbarWidth: "none" }}>
                <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                
                {view === "horizontal" ? (
                  <div style={{ display: "flex", gap: 40, minWidth: "max-content", padding: "20px 10px" }}>
                    {events.map((ev, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 40 }}>
                        <TimelineCard event={ev} zoom={zoom} dark={dark} onClick={() => setViewEvent(ev)} />
                        {i !== events.length - 1 && <div style={{ minWidth: 60, height: 4, background: "linear-gradient(90deg, #2563eb, #7c3aed)", borderRadius: 10, opacity: 0.3 }} />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingLeft: 20 }}>
                    {events.map((ev, i) => (
                      <div key={i} style={{ display: "flex", gap: 35 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#2563eb", border: "4px solid #fff", boxShadow: "0 0 0 4px #2563eb22" }} />
                          {i !== events.length - 1 && <div style={{ width: 4, flex: 1, background: "linear-gradient(#2563eb22, transparent)" }} />}
                        </div>
                        <div style={{ paddingBottom: 50, flex: 1 }}>
                          <TimelineCard event={ev} zoom={zoom} dark={dark} onClick={() => setViewEvent(ev)} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* POPUP MODALS */}
      <AnimatePresence>
        {viewEvent && (
          <EventDetailsModal 
            event={viewEvent} 
            dark={dark} 
            zoom={zoom}
            onClose={() => setViewEvent(null)} 
          />
        )}
        
        {editTimeline && (
          <EditModal 
            dark={dark} 
            timeline={editTimeline} 
            onClose={() => setEditTimeline(null)} 
            onSaved={(updated) => { setSelectedTimeline(updated); fetchSaved(); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}