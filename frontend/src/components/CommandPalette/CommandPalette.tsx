/**
 * CommandPalette Component
 * 
 * Quick command search and execution modal (Ctrl+Shift+P).
 * Fuzzy search across all commands with keyboard navigation.
 * 
 * Validates Requirements: 5.1, 5.2
 */

import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { COMMAND_REGISTRY, Command } from '../TopMenuBar/commands';
import './CommandPalette.css';

export function CommandPalette() {
  const { state, toggleCommandPalette, addRecentCommand } = useEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.commandPaletteOpen) {
      inputRef.current?.focus();
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [state.commandPaletteOpen]);

  if (!state.commandPaletteOpen) {
    return null;
  }

  const filteredCommands = filterCommands(searchQuery, state.recentCommands);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      toggleCommandPalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex].id);
      }
    }
  };

  const executeCommand = (commandId: string) => {
    addRecentCommand(commandId);
    toggleCommandPalette();
    
    // Trigger command execution via custom event
    window.dispatchEvent(new CustomEvent('ide-command', { detail: { commandId } }));
  };

  return (
    <div className="command-palette-overlay" onClick={toggleCommandPalette}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          className="command-palette-input"
          placeholder="Type a command or search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
        />

        <div className="command-palette-results">
          {filteredCommands.length === 0 ? (
            <div className="command-palette-empty">No commands found</div>
          ) : (
            filteredCommands.map((command, index) => (
              <div
                key={command.id}
                className={`command-palette-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => executeCommand(command.id)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="command-item-main">
                  <span className="command-item-label">{command.label}</span>
                  {command.shortcut && (
                    <span className="command-item-shortcut">{command.shortcut}</span>
                  )}
                </div>
                <div className="command-item-category">{command.category}</div>
              </div>
            ))
          )}
        </div>

        <div className="command-palette-footer">
          <span className="footer-hint">↑↓ Navigate</span>
          <span className="footer-hint">↵ Execute</span>
          <span className="footer-hint">Esc Close</span>
        </div>
      </div>
    </div>
  );
}

function filterCommands(query: string, recentCommands: string[]): Command[] {
  if (!query.trim()) {
    // Show recent commands first when no query
    const recent = recentCommands
      .map(id => COMMAND_REGISTRY.find(cmd => cmd.id === id))
      .filter((cmd): cmd is Command => cmd !== undefined)
      .slice(0, 5);
    
    const remaining = COMMAND_REGISTRY.filter(
      cmd => !recentCommands.includes(cmd.id)
    ).slice(0, 10);
    
    return [...recent, ...remaining];
  }

  const lowerQuery = query.toLowerCase();
  
  return COMMAND_REGISTRY
    .filter(command => {
      const labelMatch = command.label.toLowerCase().includes(lowerQuery);
      const categoryMatch = command.category.toLowerCase().includes(lowerQuery);
      const keywordMatch = command.keywords?.some(kw => kw.toLowerCase().includes(lowerQuery));
      
      return labelMatch || categoryMatch || keywordMatch;
    })
    .sort((a, b) => {
      // Prioritize label matches
      const aLabelMatch = a.label.toLowerCase().startsWith(lowerQuery);
      const bLabelMatch = b.label.toLowerCase().startsWith(lowerQuery);
      
      if (aLabelMatch && !bLabelMatch) return -1;
      if (!aLabelMatch && bLabelMatch) return 1;
      
      // Then by recent usage
      const aRecent = recentCommands.indexOf(a.id);
      const bRecent = recentCommands.indexOf(b.id);
      
      if (aRecent !== -1 && bRecent === -1) return -1;
      if (aRecent === -1 && bRecent !== -1) return 1;
      if (aRecent !== -1 && bRecent !== -1) return aRecent - bRecent;
      
      // Finally alphabetically
      return a.label.localeCompare(b.label);
    })
    .slice(0, 15);
}
