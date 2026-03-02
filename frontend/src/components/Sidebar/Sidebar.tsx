/**
 * Sidebar Component
 * 
 * Container for the sidebar with expand/collapse behavior.
 * Renders IconBar and expandable panel content with resizable width.
 * 
 * Validates Requirements: 3.3, 3.4, 3.5, 3.6, 7.1
 */

import React, { useState, useRef, useEffect } from 'react';
import { IconBar, SidebarPanel } from './IconBar';
import { useEditor } from '../../contexts/EditorContext';
import { FileExplorer } from '../FileExplorer/FileExplorer';
import { SearchPanel } from './SearchPanel';
import { SourceControlPanel } from './SourceControlPanel';
import { ExtensionsPanel } from './ExtensionsPanel';
import { SettingsPanel } from './SettingsPanel';
import './Sidebar.css';

const MIN_WIDTH = 200;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 250;

export function Sidebar() {
  const { state, setSidebarPanel } = useEditor();
  const { sidebarExpanded, activeSidebarPanel } = state;
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handlePanelClick = (panel: SidebarPanel) => {
    setSidebarPanel(panel);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX - 48; // Subtract icon bar width
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <div className="sidebar">
      <IconBar activePanel={activeSidebarPanel} onPanelClick={handlePanelClick} />
      
      {sidebarExpanded && (
        <div 
          ref={sidebarRef}
          className="sidebar-panel" 
          style={{ width: `${sidebarWidth}px` }}
        >
          {activeSidebarPanel === 'explorer' && <FileExplorer />}
          {activeSidebarPanel === 'search' && <SearchPanel />}
          {activeSidebarPanel === 'source-control' && <SourceControlPanel />}
          {activeSidebarPanel === 'extensions' && <ExtensionsPanel />}
          {activeSidebarPanel === 'settings' && <SettingsPanel />}
          
          <div 
            className={`sidebar-resize-handle ${isResizing ? 'resizing' : ''}`}
            onMouseDown={handleMouseDown}
          />
        </div>
      )}
    </div>
  );
}
