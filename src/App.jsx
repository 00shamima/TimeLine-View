import React from 'react';
import TimelineView from './pages/TimelineView';

import { RiTimelineView } from 'react-icons/ri';

function App() {
  return (
    // 'w-full' matrum 'overflow-x-hidden' serthu iruken layout break aagama iruka
    <div className="min-h-screen w-full bg-[#050505] font-sans selection:bg-green-500/30 overflow-x-hidden">
      
   
      {/* CORE VIEW - 'w-full' container kulla timeline view varum */}
      <main className="w-full">
        <TimelineView />
      </main>

    </div>
  );
}

export default App;