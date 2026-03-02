/**
 * OpenFileDialog Component
 * 
 * Modal dialog for opening files and folders from the File menu.
 * Shows a list of all files in the workspace.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { WorkspaceManager } from '../../services/WorkspaceManager';
import './OpenFileDialog.css';

interface OpenFileDialogProps {
  isOpen: boolean;
  mode: 'file' | 'folder';
  onClose: () => void;
}

interface FileItem {
  path: string;
  name: string;
  type: 'file' | 'folder';
}

export function OpenFileDialog({ isOpen, mode, onClose }: OpenFileDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<FileItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, openFileFromWorkspace, setSidebarPanel, toggleFolder } = useEditor();

  useEffect(() => {
    if (isOpen && state.workspace) {
      // Collect all files/folders from workspace
      const workspaceManager = new WorkspaceManager();
      workspaceManager.setRoot(state.workspace.root);
      
      const collectItems = (node: any, parentPath: string = ''): FileItem[] => {
        const items: FileItem[] = [];
        const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
        
        if (node.type === 'folder') {
          if (mode === 'folder') {
            items.push({
              path: currentPath,
              name: node.name,
              type: 'folder',
            });
          }
          
          if (node.children) {
            node.children.forEach((child: any) => {
              items.push(...collectItems(child, currentPath));
            });
          }
        } else if (node.type === 'file' && mode === 'file') {
          items.push({
            path: currentPath,
            name: node.name,
            type: 'file',
          });
        }
        
        return items;
      };
      
      const allItems = state.workspace.root.children?.flatMap((child: any) => 
        collectItems(child, '')
      ) || [];
      
      setItems(allItems);
      setSearchQuery('');
      setSelectedIndex(0);
      
      // Focus input after a short delay
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, state.workspace, mode]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: FileItem) => {
    if (mode === 'file' && item.type === 'file') {
      openFileFromWorkspace(item.path);
      onClose();
    } else if (mode === 'folder' && item.type === 'folder') {
      // Expand folder in explorer
      toggleFolder(item.path);
      setSidebarPanel('explorer');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="open-file-dialog-overlay" onClick={onClose}>
      <div className="open-file-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>Open {mode === 'file' ? 'File' : 'Folder'}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        
        <div className="dialog-search">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 14L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${mode === 'file' ? 'files' : 'folders'}...`}
            autoComplete="off"
          />
        </div>
        
        <div className="dialog-list">
          {filteredItems.length === 0 ? (
            <div className="dialog-empty">
              {searchQuery ? 'No matches found' : `No ${mode}s in workspace`}
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={item.path}
                className={`dialog-list-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="item-icon">
                  {item.type === 'folder' ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4C2 3.44772 2.44772 3 3 3H6L7 5H13C13.5523 5 14 5.44772 14 6V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4Z" fill="#C96731" fillOpacity="0.3" stroke="#C96731" strokeWidth="1.5"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 2H9L12 5V13C12 13.5523 11.5523 14 11 14H4C3.44772 14 3 13.5523 3 13V3C3 2.44772 3.44772 2 4 2Z" fill="rgba(255, 255, 255, 0.1)" stroke="rgb(156, 163, 175)" strokeWidth="1.5"/>
                      <path d="M9 2V5H12" stroke="rgb(156, 163, 175)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="item-content">
                  <div className="item-name">{item.name}</div>
                  <div className="item-path">{item.path}</div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="dialog-footer-hint">
          <span>↑↓ Navigate</span>
          <span>Enter Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
