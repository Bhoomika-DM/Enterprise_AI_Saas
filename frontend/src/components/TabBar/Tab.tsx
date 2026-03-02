/**
 * Tab Component
 * 
 * Individual tab with filename, close button, and unsaved indicator.
 * Implements VS Code tab styling and behavior.
 * 
 * Validates Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import React from 'react';
import { FileDescriptor } from '../../types/editor';
import './Tab.css';

interface TabProps {
  file: FileDescriptor;
  isActive: boolean;
  onTabClick: (fileId: string) => void;
  onCloseClick: (fileId: string) => void;
}

export function Tab({ file, isActive, onTabClick, onCloseClick }: TabProps) {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCloseClick(file.id);
  };

  return (
    <div
      className={`tab ${isActive ? 'active' : ''}`}
      onClick={() => onTabClick(file.id)}
      role="tab"
      aria-selected={isActive}
    >
      {file.isDirty && <span className="unsaved-indicator">●</span>}
      <span className="tab-label">{file.name}</span>
      <button
        className="tab-close"
        onClick={handleClose}
        aria-label={`Close ${file.name}`}
      >
        ×
      </button>
    </div>
  );
}
