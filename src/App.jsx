import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicCanvas from './engine/DynamicCanvas';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PrivacyFooter from './components/PrivacyFooter';
import { generateUniqueLayout } from './engine/layoutGenerator';
import { generateAILayout } from './engine/aiService';
import './App.css';

export default function App() {
  const [layoutState, setLayoutState] = useState(null);
  const [isArchitecting, setIsArchitecting] = useState(true);
  const [userVibe, setUserVibe] = useState(() => localStorage.getItem("jaydii_vibe") || "");
  const [useRealAI, setUseRealAI] = useState(() => {
    const saved = localStorage.getItem("jaydii_use_real_ai");
    return saved === null ? true : saved === "true";
  });
  const [aiReasoning, setAiReasoning] = useState("");
  const [error, setError] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("jaydii_vibe", userVibe);
    localStorage.setItem("jaydii_use_real_ai", useRealAI);
  }, [userVibe, useRealAI]);

  const handleReArchitect = useCallback(async () => {
    setIsArchitecting(true);
    setError(null);
    
    try {
        if (useRealAI) {
            const aiLayout = await generateAILayout(userVibe || "Surprise me with a balanced wellness view");
            setLayoutState({
                ...aiLayout,
                sessionId: crypto.randomUUID(),
                timestamp: new Date().toISOString()
            });
            setAiReasoning(aiLayout.aiReasoning);
        } else {
            const mockLayout = generateUniqueLayout();
            setLayoutState(mockLayout);
            setAiReasoning("Layout generated using deterministic shuffler logic.");
        }
    } catch (err) {
        console.warn("AI failed, using logic-based fallback:", err);
        const fallback = generateUniqueLayout();
        setLayoutState(fallback);
        setAiReasoning("Fallback logic-based layout used due to API limits.");
    } finally {
        setIsArchitecting(false);
    }
  }, [useRealAI, userVibe]);

  // AUTO-ARCHITECT ON MOUNT
  useEffect(() => {
    handleReArchitect();
  }, []);

  const triggerRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="main-area">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="content-area">
          {/* Subtle AI Context Bar */}
          <div className="ai-context-bar">
            <div className="ai-context-left">
                <div className="ai-status">
                    <span className={`status-dot ${useRealAI ? 'real' : 'mock'}`} />
                    {useRealAI ? "Gemini 2.0" : "Logic Engine"}
                </div>
                <div className="ai-input-wrapper">
                    <input 
                        type="text" 
                        className="ai-vibe-minimal"
                        placeholder="Set your vibe (e.g. 'Highly focused morning', 'Relaxed recovery')..."
                        value={userVibe}
                        onChange={(e) => setUserVibe(e.target.value)}
                    />
                    <button className="ai-refresh-btn" onClick={triggerRefresh} title="Refresh Dashboard">
                        ↻
                    </button>
                </div>
            </div>

            <div className="ai-context-right">
                <div className="ai-toggle-compact">
                    <label className="switch mini">
                        <input 
                            type="checkbox" 
                            checked={useRealAI} 
                            onChange={(e) => setUseRealAI(e.target.checked)} 
                        />
                        <span className="slider round"></span>
                    </label>
                    <span>AI Mode</span>
                </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {aiReasoning && !isArchitecting && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ai-note-minimal"
                >
                    ✨ {aiReasoning}
                </motion.div>
            )}
          </AnimatePresence>

          {layoutState && <DynamicCanvas layoutConfig={layoutState.layout} />}
          
          <PrivacyFooter />
        </div>
      </main>

      {/* Full Page Architecting Overlay */}
      <AnimatePresence>
        {isArchitecting && !layoutState && (
            <motion.div 
                className="ai-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="ai-loader">
                    <div className="loader-dot" />
                    <h2>Jaydii AI is architecting...</h2>
                    <p>Crafting a unique layout for your vibe.</p>
                    <div className="loader-progress-track">
                        <motion.div 
                            className="loader-progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
