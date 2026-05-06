import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TimeLineViewPage from './pages/TimelineView';

export default function App() {
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('timeline_engine_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 overflow-x-hidden antialiased selection:bg-[#22C55E]/20 selection:text-[#22C55E] ${
      darkMode ? 'bg-[#0A0A0A] text-[#E2E8F0]' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <TimeLineViewPage 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
              />
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}