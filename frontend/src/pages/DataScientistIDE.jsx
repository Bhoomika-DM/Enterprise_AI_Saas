/**
 * DataScientistIDE Page
 * 
 * Full IDE experience for data scientists with the editor integrated into the dashboard.
 * Now with VS Code-like features: file explorer, run controls, status bar, menu bar, and command palette.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EditorProvider, useEditor } from '../contexts/EditorContext';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { MainEditorArea } from '../components/MainEditorArea/MainEditorArea';
import { BottomPanel } from '../components/BottomPanel/BottomPanel';
import { StatusBar } from '../components/StatusBar/StatusBar';
import { RunControls } from '../components/RunControls/RunControls';
import { TopMenuBar } from '../components/TopMenuBar/TopMenuBar';
import { CommandPalette } from '../components/CommandPalette/CommandPalette';
import '../components/DataScientistEditor.css';

function IDEContent() {
  const {
    toggleSidebar,
    toggleBottomPanel,
    toggleCommandPalette,
    saveFile,
    saveAllFiles,
    closeFile,
    state,
  } = useEditor();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S - Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (state.activeFileId) {
          saveFile(state.activeFileId);
        }
      }
      // Ctrl+Shift+P - Command Palette
      else if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        toggleCommandPalette();
      }
      // Ctrl+B - Toggle Sidebar
      else if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      // Ctrl+J - Toggle Bottom Panel
      else if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        toggleBottomPanel();
      }
      // Ctrl+W - Close File
      else if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        if (state.activeFileId) {
          closeFile(state.activeFileId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.activeFileId, toggleSidebar, toggleBottomPanel, toggleCommandPalette, saveFile, closeFile]);

  // Listen for command execution from Command Palette
  useEffect(() => {
    const handleCommand = (e) => {
      const { commandId } = e.detail;
      
      // Handle commands that need EditorContext
      switch (commandId) {
        case 'file.save':
          if (state.activeFileId) saveFile(state.activeFileId);
          break;
        case 'file.saveAll':
          saveAllFiles();
          break;
        case 'file.close':
          if (state.activeFileId) closeFile(state.activeFileId);
          break;
        case 'view.toggleSidebar':
          toggleSidebar();
          break;
        case 'view.toggleBottomPanel':
          toggleBottomPanel();
          break;
        // Add more command handlers as needed
      }
    };

    window.addEventListener('ide-command', handleCommand);
    return () => window.removeEventListener('ide-command', handleCommand);
  }, [state.activeFileId, saveFile, saveAllFiles, closeFile, toggleSidebar, toggleBottomPanel]);

  return (
    <>
      <div className="data-scientist-editor" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Menu Bar */}
        <TopMenuBar />

        {/* Main IDE Area */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          {/* Left Zone: Sidebar */}
          <div className="editor-sidebar-zone" style={{ flexShrink: 0 }}>
            <Sidebar />
          </div>

          {/* Center Zone: Main Editor Area with Run Controls */}
          <div className="editor-main-zone" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <RunControls />
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <MainEditorArea />
            </div>
          </div>
        </div>

        {/* Bottom Zone: Bottom Panel */}
        <div className="editor-bottom-zone" style={{ flexShrink: 0 }}>
          <BottomPanel />
        </div>

        {/* Status Bar */}
        <div style={{ flexShrink: 0 }}>
          <StatusBar />
        </div>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette />
    </>
  );
}

export default function DataScientistIDE() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app-bg relative overflow-hidden">
      {/* Animated gradient background - same as Dashboard */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 aurora-flow"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 103, 49, 0.08) 0%, rgba(2, 6, 23, 0) 40%, rgba(34, 211, 238, 0.06) 100%)',
            backgroundSize: '200% 200%',
          }}
        />
        
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(201,103,49,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(34,211,238,0.12) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(201,103,49,0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(201,103,49,0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating ambient shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute inset-0 noise-overlay opacity-[0.015] pointer-events-none" />

      {/* IDE with workspace loaded from localStorage */}
      <div className="relative z-10" style={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <EditorProvider>
          <ThemeProvider>
            <IDEContent />
          </ThemeProvider>
        </EditorProvider>
      </div>
    </div>
  );
}
