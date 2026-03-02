/**
 * TerminalView Component (Mock)
 * 
 * Mock terminal UI with placeholder text.
 * Uses JetBrains Mono font and terminal-like styling.
 * 
 * Validates Requirements: 5.4
 */

import React from 'react';
import './TerminalView.css';

export function TerminalView() {
  return (
    <div className="terminal-view">
      <div className="terminal-line">
        <span className="terminal-prompt">$ </span>
        <span className="terminal-cursor">_</span>
      </div>
      <div className="terminal-placeholder">
        Terminal functionality is not yet implemented.
      </div>
    </div>
  );
}
