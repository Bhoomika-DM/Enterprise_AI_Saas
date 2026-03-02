/**
 * MainEditorArea Component
 * 
 * Composes TabBar, CodeMirrorEditor, and DatasetContextPanel.
 * Handles file switching and editor focus management.
 * 
 * Validates Requirements: 8.1, 9.1
 */

import React, { useEffect, useRef } from 'react';
import { TabBar } from '../TabBar/TabBar';
import { CodeMirrorEditor } from '../CodeMirrorEditor/CodeMirrorEditor';
import { RunControls } from '../RunControls/RunControls';
import { useEditor } from '../../contexts/EditorContext';
import './MainEditorArea.css';

export function MainEditorArea() {
  const { state, switchTab, closeFile, updateFileContent, markFileDirty, saveFile, formatCode } = useEditor();
  const { openFiles, activeFileId, editorSettings } = state;
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const activeFile = openFiles.find(f => f.id === activeFileId);

  const handleEditorChange = (value: string) => {
    if (activeFileId) {
      updateFileContent(activeFileId, value);
      markFileDirty(activeFileId, true);

      // Auto-save functionality
      if (editorSettings.autoSave) {
        // Clear existing timer
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
        }

        // Set new timer
        autoSaveTimerRef.current = setTimeout(() => {
          console.log('🔄 Auto-saving file:', activeFileId);
          
          // Format on save if enabled
          if (editorSettings.formatOnSave) {
            formatCode(activeFileId);
          }
          
          saveFile(activeFileId);
        }, editorSettings.autoSaveDelay || 1000);
      }
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="main-editor-area">
      <div className="editor-header">
        <TabBar
          openFiles={openFiles}
          activeFileId={activeFileId}
          onTabClick={switchTab}
          onTabClose={closeFile}
        />
      </div>
      
      <div className="editor-content">
        {activeFile ? (
          <>
            <RunControls />
            <CodeMirrorEditor
              value={activeFile.content}
              language={activeFile.language}
              onChange={handleEditorChange}
              filePath={activeFile.path}
              enableLSP={true}
              settings={{
                lineNumbers: editorSettings.lineNumbers,
                wordWrap: editorSettings.wordWrap,
                fontSize: editorSettings.fontSize,
                tabSize: editorSettings.tabSize,
                bracketPairs: editorSettings.bracketPairs,
                theme: editorSettings.theme,
                minimap: editorSettings.minimap,
                fontFamily: editorSettings.fontFamily,
              }}
            />
          </>
        ) : (
          <div className="no-file-open">
            <p>No file open</p>
            <p className="hint">Open a file from the Explorer to start editing</p>
          </div>
        )}
      </div>
    </div>
  );
}
