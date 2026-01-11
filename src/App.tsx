import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Layout/Sidebar';

// Import placeholder pages with more details
import ServerInfoPage from './pages/ServerInfoPage';
import GlobalConfigPage from './pages/GlobalConfigPage';
import PathConfigPage from './pages/PathConfigPage';
import RTSPSessionsPage from './pages/RTSPSessionsPage';
import RTMPConnectionsPage from './pages/RTMPConnectionsPage';
import WebRTCSessionsPage from './pages/WebRTCSessionsPage';
import SRTConnectionsPage from './pages/SRTConnectionsPage';
import HLSMuxersPage from './pages/HLSMuxersPage';
import PanelSettingsPage from './pages/PanelSettingsPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar />
          
           {/* Main content area with left padding to account for sidebar */}
             <main className="flex-1 md:ml-64 p-4 md:p-6 overflow-y-auto">
               <div className="md:hidden">
                 <Sidebar />
               </div>
               <div className="md:hidden h-[60px]"></div>
               <div className="flex-1 max-w-6xl mx-auto">
                 <Routes>
                   <Route path="/" element={<ServerInfoPage />} />
                   <Route path="/global-config" element={<GlobalConfigPage />} />
                   <Route path="/path-config" element={<PathConfigPage />} />
                   <Route path="/rtsp-sessions" element={<RTSPSessionsPage />} />
                   <Route path="/rtmp-connections" element={<RTMPConnectionsPage />} />
                   <Route path="/webrtc-sessions" element={<WebRTCSessionsPage />} />
                   <Route path="/srt-connections" element={<SRTConnectionsPage />} />
                   <Route path="/hls-muxers" element={<HLSMuxersPage />} />
                   <Route path="/settings" element={<PanelSettingsPage />} />
                 </Routes>
               </div>
             </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;