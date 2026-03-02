/**
 * ContextMenu Component
 * 
 * Right-click context menu for file and folder operations.
 * Provides options: New File, New Folder, Delete, Rename
 * 
 * Validates Requirements: 1.4
 */

import React, { useState, useEffect, useRef } from 'react';
import { FileNode } from '../../services/WorkspaceManager';
import './ContextMenu.css';

interface ContextMenuProps {
  x: number;
  y: number;
  node: FileNode;
  onClose: () => void;
  onNewFile: (parentPath: string) => void;
  onNewFolder: (parentPath: string) => void;
  onDelete: (path: string) => void;
  onRename: (path: string) => void;
}

export function ContextMenu({
  x,
  y,
  node,
  onClose,
  onNewFile,
  onNewFolder,
  onDelete,
  onRename,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleNewFile = () => {
    const parentPath = node.type === 'folder' ? node.path : node.path.split('/').slice(0, -1).join('/');
    onNewFile(parentPath);
    onClose();
  };

  const handleNewFolder = () => {
    const parentPath = node.type === 'folder' ? node.path : node.path.split('/').slice(0, -1).join('/');
    onNewFolder(parentPath);
    onClose();
  };

  const handleDelete = () => {
    onDelete(node.path);
    onClose();
  };

  const handleRename = () => {
    onRename(node.path);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
    >
      {node.type === 'folder' && (
        <>
          <div className="context-menu-item" onClick={handleNewFile}>
            <span className="menu-icon">📄</span>
            <span className="menu-label">New File</span>
          </div>
          <div className="context-menu-item" onClick={handleNewFolder}>
            <span className="menu-icon">📁</span>
            <span className="menu-label">New Folder</span>
          </div>
          <div className="context-menu-separator" />
        </>
      )}
      <div className="context-menu-item" onClick={handleRename}>
        <span className="menu-icon">✏️</span>
        <span className="menu-label">Rename</span>
      </div>
      <div className="context-menu-item danger" onClick={handleDelete}>
        <span className="menu-icon">🗑️</span>
        <span className="menu-label">Delete</span>
      </div>
    </div>
  );
}

interface InputModalProps {
  title: string;
  placeholder: string;
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function InputModal({
  title,
  placeholder,
  defaultValue = '',
  onConfirm,
  onCancel,
}: InputModalProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="modal-input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="modal-buttons">
            <button type="button" className="modal-button cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="modal-button confirm" disabled={!value.trim()}>
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button className="modal-button cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-button confirm danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
