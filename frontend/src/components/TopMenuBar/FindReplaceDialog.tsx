/**
 * FindReplaceDialog Component
 * 
 * Modal dialog for finding and replacing text in the editor.
 * Supports case-sensitive search and regex patterns.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import './FindReplaceDialog.css';

interface FindReplaceDialogProps {
  isOpen: boolean;
  mode: 'find' | 'replace';
  onClose: () => void;
}

export function FindReplaceDialog({ isOpen, mode, onClose }: FindReplaceDialogProps) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const findInputRef = useRef<HTMLInputElement>(null);
  const { state } = useEditor();

  useEffect(() => {
    if (isOpen) {
      setFindText('');
      setReplaceText('');
      setMatchCount(0);
      setCurrentMatch(0);
      setTimeout(() => {
        findInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const performFind = () => {
    if (!findText.trim() || !state.activeFileId) {
      return;
    }

    const activeFile = state.openFiles.find(f => f.id === state.activeFileId);
    if (!activeFile) return;

    const content = activeFile.content;
    let matches = 0;

    if (useRegex) {
      try {
        const regex = new RegExp(findText, caseSensitive ? 'g' : 'gi');
        const found = content.match(regex);
        matches = found ? found.length : 0;
      } catch (e) {
        // Invalid regex
        setMatchCount(0);
        return;
      }
    } else {
      const searchText = caseSensitive ? findText : findText.toLowerCase();
      const contentText = caseSensitive ? content : content.toLowerCase();
      let index = contentText.indexOf(searchText);
      while (index !== -1) {
        matches++;
        index = contentText.indexOf(searchText, index + 1);
      }
    }

    setMatchCount(matches);
    setCurrentMatch(matches > 0 ? 1 : 0);
  };

  const handleFindNext = () => {
    performFind();
    // TODO: Implement actual navigation to next match in CodeMirror
  };

  const handleFindPrevious = () => {
    if (currentMatch > 1) {
      setCurrentMatch(currentMatch - 1);
    }
    // TODO: Implement actual navigation to previous match in CodeMirror
  };

  const handleReplace = () => {
    if (!findText.trim() || !state.activeFileId) {
      return;
    }
    // TODO: Implement replace current match
    alert('Replace functionality coming soon!');
  };

  const handleReplaceAll = () => {
    if (!findText.trim() || !state.activeFileId) {
      return;
    }

    const activeFile = state.openFiles.find(f => f.id === state.activeFileId);
    if (!activeFile) return;

    let newContent = activeFile.content;

    if (useRegex) {
      try {
        const regex = new RegExp(findText, caseSensitive ? 'g' : 'gi');
        newContent = newContent.replace(regex, replaceText);
      } catch (e) {
        alert('Invalid regular expression');
        return;
      }
    } else {
      if (caseSensitive) {
        newContent = newContent.split(findText).join(replaceText);
      } else {
        const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        newContent = newContent.replace(regex, replaceText);
      }
    }

    // Update file content
    // TODO: Dispatch update action to EditorContext
    alert(`Replaced ${matchCount} occurrence(s)`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      if (e.shiftKey) {
        handleFindPrevious();
      } else {
        handleFindNext();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="find-replace-dialog-overlay" onClick={onClose}>
      <div className="find-replace-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{mode === 'find' ? 'Find' : 'Find and Replace'}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>

        <div className="dialog-body">
          <div className="find-input-group">
            <input
              ref={findInputRef}
              type="text"
              placeholder="Find"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            <div className="find-options">
              <button
                className={`option-button ${caseSensitive ? 'active' : ''}`}
                onClick={() => setCaseSensitive(!caseSensitive)}
                title="Match Case (Alt+C)"
              >
                Aa
              </button>
              <button
                className={`option-button ${useRegex ? 'active' : ''}`}
                onClick={() => setUseRegex(!useRegex)}
                title="Use Regular Expression (Alt+R)"
              >
                .*
              </button>
            </div>
          </div>

          {mode === 'replace' && (
            <div className="replace-input-group">
              <input
                type="text"
                placeholder="Replace"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
            </div>
          )}

          {matchCount > 0 && (
            <div className="match-info">
              {currentMatch} of {matchCount} matches
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <div className="find-buttons">
            <button className="dialog-button secondary" onClick={handleFindPrevious}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Previous
            </button>
            <button className="dialog-button secondary" onClick={handleFindNext}>
              Next
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {mode === 'replace' && (
            <div className="replace-buttons">
              <button className="dialog-button secondary" onClick={handleReplace}>
                Replace
              </button>
              <button className="dialog-button primary" onClick={handleReplaceAll}>
                Replace All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
