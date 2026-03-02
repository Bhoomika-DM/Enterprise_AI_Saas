/**
 * DataScientistEditor - Root component for the Data Scientist Editor
 * 
 * This component orchestrates the three-zone layout:
 * - Left Zone: Sidebar (collapsible, fixed width when expanded)
 * - Center Zone: Main editor area (flexible, takes remaining space)
 * - Bottom Zone: Bottom panel (collapsible, resizable height)
 * 
 * Validates Requirements: 8.1, 8.4, 8.5
 */

import React, { useEffect } from 'react';
import { EditorProvider } from '../contexts/EditorContext';
import { Sidebar } from './Sidebar/Sidebar';
import { MainEditorArea } from './MainEditorArea/MainEditorArea';
import { BottomPanel } from './BottomPanel/BottomPanel';
import './DataScientistEditor.css';

/**
 * DataScientistEditor component
 * 
 * Root component that provides the editor layout and state management.
 * Wraps the entire editor in the EditorProvider context.
 */
export function DataScientistEditor() {
  // Handle window resize events for responsive layout
  useEffect(() => {
    const handleResize = () => {
      // Trigger a custom event that child components can listen to
      window.dispatchEvent(new CustomEvent('editor-resize'));
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <EditorProvider>
      <DataScientistEditorLayout />
    </EditorProvider>
  );
}

/**
 * DataScientistEditorLayout - Internal layout component
 * 
 * Separated from the provider to allow access to the editor context.
 * Implements responsive layout that adjusts when panels are collapsed/expanded.
 */
function DataScientistEditorLayout() {
  const [viewportHeight, setViewportHeight] = React.useState(window.innerHeight);

  // Handle window resize events
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    // Listen to the custom editor-resize event
    window.addEventListener('editor-resize', handleResize);
    
    return () => {
      window.removeEventListener('editor-resize', handleResize);
    };
  }, []);

  return (
    <div className="data-scientist-editor" style={{ height: `${viewportHeight}px` }}>
      {/* Left Zone: Sidebar */}
      <div className="editor-sidebar-zone">
        <Sidebar />
      </div>

      {/* Center Zone: Main Editor Area */}
      <div className="editor-main-zone">
        <MainEditorArea />
      </div>

      {/* Bottom Zone: Bottom Panel */}
      <div className="editor-bottom-zone">
        <BottomPanel />
      </div>
    </div>
  );
}

export default DataScientistEditor;
