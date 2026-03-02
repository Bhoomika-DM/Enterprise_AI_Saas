/**
 * FileTreeNode Component
 * 
 * Recursively renders a file or folder node in the file tree.
 * Handles expand/collapse for folders and click events for files.
 * 
 * Validates Requirements: 1.1, 1.2, 1.3, 1.5
 */

import React from 'react';
import { FileNode } from '../../services/WorkspaceManager';
import './FileTreeNode.css';

interface FileTreeNodeProps {
  node: FileNode;
  depth: number;
  onFileClick: (path: string) => void;
  onFolderToggle: (path: string) => void;
  onContextMenu: (event: React.MouseEvent, node: FileNode) => void;
}

export function FileTreeNode({
  node,
  depth,
  onFileClick,
  onFolderToggle,
  onContextMenu,
}: FileTreeNodeProps) {
  const handleClick = () => {
    if (node.type === 'folder') {
      onFolderToggle(node.path);
    } else {
      onFileClick(node.path);
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onContextMenu(event, node);
  };

  const icon = getFileIcon(node);
  const indentStyle = { paddingLeft: `${depth * 16 + 8}px` };

  return (
    <>
      <div
        className={`file-tree-node ${node.type}`}
        style={indentStyle}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {node.type === 'folder' && (
          <span className={`folder-arrow ${node.expanded ? 'expanded' : 'collapsed'}`}>
            ▶
          </span>
        )}
        <span className="file-icon">{icon}</span>
        <span className="file-name">{node.name}</span>
      </div>
      
      {node.type === 'folder' && node.expanded && node.children && (
        <div className="folder-children">
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              onFolderToggle={onFolderToggle}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </>
  );
}

/**
 * Get appropriate icon for file type
 */
function getFileIcon(node: FileNode): JSX.Element {
  if (node.type === 'folder') {
    return node.expanded ? (
      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    );
  }

  const extension = node.name.split('.').pop()?.toLowerCase() || '';
  
  // Python files
  if (extension === 'py') {
    return (
      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  }
  
  // SQL files
  if (extension === 'sql') {
    return (
      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  }
  
  // JSON files
  if (extension === 'json') {
    return (
      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  }
  
  // Markdown files
  if (extension === 'md') {
    return (
      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  }
  
  // CSV files
  if (extension === 'csv') {
    return (
      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    );
  }
  
  // Default file icon
  return (
    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
    </svg>
  );
}
