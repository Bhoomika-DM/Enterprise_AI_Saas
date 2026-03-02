/**
 * NewFileDialog Component
 * 
 * Modal dialog for creating new files and folders from the File menu.
 * Supports both file and folder creation with validation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import './NewFileDialog.css';

interface NewFileDialogProps {
  isOpen: boolean;
  mode: 'file' | 'folder';
  onClose: () => void;
}

export function NewFileDialog({ isOpen, mode, onClose }: NewFileDialogProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { createFile, createFolder, state } = useEditor();

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
      // Focus input after a short delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError(`${mode === 'file' ? 'File' : 'Folder'} name cannot be empty`);
      return;
    }

    // Validate name (no special characters except . - _)
    const validNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!validNameRegex.test(name)) {
      setError('Name can only contain letters, numbers, dots, hyphens, and underscores');
      return;
    }

    try {
      if (mode === 'file') {
        // Determine file extension and content
        let content = '';
        let fileName = name;
        
        // Add default extension if none provided
        if (!fileName.includes('.')) {
          fileName = `${fileName}.py`;
        }
        
        // Set default content based on extension
        if (fileName.endsWith('.py')) {
          content = '# New Python file\n\n';
        } else if (fileName.endsWith('.sql')) {
          content = '-- New SQL file\n\n';
        } else if (fileName.endsWith('.md')) {
          content = '# New Markdown file\n\n';
        } else if (fileName.endsWith('.txt')) {
          content = '';
        }
        
        createFile('/', fileName, content);
      } else {
        createFolder('/', name);
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ' + mode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="new-file-dialog-overlay" onClick={onClose}>
      <div className="new-file-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>New {mode === 'file' ? 'File' : 'Folder'}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <label htmlFor="name-input">
              {mode === 'file' ? 'File name' : 'Folder name'}
            </label>
            <input
              ref={inputRef}
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder={mode === 'file' ? 'example.py' : 'my-folder'}
              autoComplete="off"
            />
            {error && <div className="dialog-error">{error}</div>}
            {mode === 'file' && !name.includes('.') && name.trim() && (
              <div className="dialog-hint">
                Will be created as: {name}.py
              </div>
            )}
          </div>
          
          <div className="dialog-footer">
            <button type="button" className="dialog-button secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="dialog-button primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
