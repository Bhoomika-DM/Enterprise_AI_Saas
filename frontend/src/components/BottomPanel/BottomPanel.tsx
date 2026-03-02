/**
 * BottomPanel Component
 * 
 * Collapsible and resizable bottom panel with tabs.
 * Implements VS Code bottom panel behavior.
 * 
 * Validates Requirements: 5.2, 5.3, 5.5, 5.6, 5.7, 7.1, 8.3
 */

import React, { useState, useRef } from 'react';
import { PanelTabBar } from './PanelTabBar';
import { Terminal } from '../Terminal/Terminal';
import { SystemTerminal } from '../Terminal/SystemTerminal';
import { useEditor } from '../../contexts/EditorContext';
import './BottomPanel.css';

export function BottomPanel() {
  const { state, toggleBottomPanel, setBottomPanelHeight, setBottomTab } = useEditor();
  const { bottomPanelExpanded, bottomPanelHeight, activeBottomTab } = state;
  
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  React.useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = window.innerHeight - e.clientY;
      setBottomPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setBottomPanelHeight]);

  if (!bottomPanelExpanded) {
    return (
      <div className="bottom-panel collapsed">
        <button className="panel-toggle" onClick={toggleBottomPanel}>
          ▲ Show Panel
        </button>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="bottom-panel expanded"
      style={{ height: `${bottomPanelHeight}px` }}
    >
      <div className="resize-handle" onMouseDown={handleMouseDown} />
      
      <PanelTabBar activeTab={activeBottomTab} onTabChange={setBottomTab} />
      
      <div className="panel-content-area">
        {activeBottomTab === 'terminal' && <Terminal />}
        {activeBottomTab === 'system-terminal' && <SystemTerminal />}
        {activeBottomTab === 'output' && <PlaceholderView title="Output" />}
        {activeBottomTab === 'problems' && <PlaceholderView title="Problems" />}
        {activeBottomTab === 'logs' && <PlaceholderView title="Logs" />}
      </div>
      
      <button className="panel-toggle-close" onClick={toggleBottomPanel}>
        ×
      </button>
    </div>
  );
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="placeholder-view">
      <p>{title} view placeholder</p>
    </div>
  );
}
