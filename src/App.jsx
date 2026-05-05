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
    const [aiReasoning, setAiReasoning] = useState("");
    const [error, setError] = useState(null);

    const [sidebarOpen, setSidebarOpen] = useState(false);



    const handleReArchitect = useCallback(async () => {
        setIsArchitecting(true);
        setError(null);

        try {
            // ALWAYS TRY AI FIRST
            const aiLayout = await generateAILayout("Create a fresh, professional, and high-performance wellness layout with varied component sizes.");
            setLayoutState({
                ...aiLayout,
                sessionId: crypto.randomUUID(),
                timestamp: new Date().toISOString()
            });
            setAiReasoning(aiLayout.aiReasoning);
        } catch (err) {
            console.warn("AI failed or limit reached, using logic-based fallback:", err);
            const fallback = generateUniqueLayout();
            setLayoutState(fallback);
            setAiReasoning("Layout generated using deterministic shuffler logic.");
        } finally {
            setIsArchitecting(false);
        }
    }, []);

    // AUTO-ARCHITECT ON MOUNT
    useEffect(() => {
        handleReArchitect();
    }, []);



    return (
        <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            <main className="main-area">
                <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                <div className="content-area">
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
                            <h2>AI is architecting...</h2>
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
