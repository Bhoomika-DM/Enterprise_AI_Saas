/**
 * TabBar Component
 * 
 * Container for file tabs with horizontal scrolling support.
 * Implements VS Code tab bar styling and behavior.
 * 
 * Validates Requirements: 2.1, 2.6, 6.1
 */

import React from 'react';
import { Tab } from './Tab';
import { FileDescriptor } from '../../types/editor';
import './TabBar.css';

interface TabBarProps {
  openFiles: FileDescriptor[];
  activeFileId: string | null;
  onTabClick: (fileId: string) => void;
  onTabClose: (fileId: string) => void;
}

export function TabBar({ openFiles, activeFileId, onTabClick, onTabClose }: TabBarProps) {
  return (
    <div className="tab-bar" role="tablist">
      {openFiles.map((file) => (
        <Tab
          key={file.id}
          file={file}
          isActive={file.id === activeFileId}
          onTabClick={onTabClick}
          onCloseClick={onTabClose}
        />
      ))}
    </div>
  );
}
