/**
 * Terminal Component
 * 
 * Interactive terminal with command execution, history navigation, and output display.
 * Implements VS Code terminal behavior with built-in commands.
 * 
 * Validates Requirements: 7.1, 7.2, 7.4, 7.5
 */

import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { WorkspaceManager } from '../../services/WorkspaceManager';
import './Terminal.css';

const workspaceManager = new WorkspaceManager();

export function Terminal() {
  const { state, addTerminalLine, clearTerminal, addTerminalHistory } = useEditor();
  const { terminalOutput, terminalHistory, workspace } = state;
  
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        executeCommand(input.trim());
        setInput('');
        setHistoryIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (terminalHistory.length > 0) {
        const newIndex = historyIndex < terminalHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(terminalHistory[terminalHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(terminalHistory[terminalHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const executeCommand = (command: string) => {
    // Add to history
    addTerminalHistory(command);
    
    // Add input line to output
    addTerminalLine({
      type: 'input',
      content: `$ ${command}`,
      timestamp: Date.now(),
    });

    // Parse and execute command
    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    try {
      const output = executeBuiltInCommand(cmd, args);
      if (output) {
        addTerminalLine({
          type: 'output',
          content: output,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      addTerminalLine({
        type: 'error',
        content: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
      });
    }
  };

  const executeBuiltInCommand = (cmd: string, args: string[]): string => {
    switch (cmd) {
      case 'clear':
        clearTerminal();
        return '';

      case 'help':
        return `Available commands:
  clear       Clear the terminal
  help        Show this help message
  ls          List files in current directory
  pwd         Print working directory
  cat <file>  Display file contents
  echo <text> Print text to terminal`;

      case 'ls':
        if (!workspace) return 'No workspace loaded';
        return listFiles(workspace.root);

      case 'pwd':
        return '/workspace';

      case 'cat':
        if (args.length === 0) {
          throw new Error('cat: missing file operand');
        }
        if (!workspace) return 'No workspace loaded';
        const content = workspaceManager.readFile(args[0]);
        if (content === null) {
          throw new Error(`cat: ${args[0]}: No such file`);
        }
        return content;

      case 'echo':
        return args.join(' ');

      default:
        throw new Error(`${cmd}: command not found`);
    }
  };

  const listFiles = (node: any, prefix = ''): string => {
    let result = '';
    
    if (node.type === 'folder' && node.children) {
      for (const child of node.children) {
        const icon = child.type === 'folder' ? '📁' : '📄';
        result += `${prefix}${icon} ${child.name}\n`;
        
        if (child.type === 'folder' && child.children) {
          result += listFiles(child, prefix + '  ');
        }
      }
    }
    
    return result.trim();
  };

  return (
    <div className="terminal">
      <div className="terminal-output" ref={outputRef}>
        {terminalOutput.map((line, index) => {
          // Check if content is a base64 image
          const isImage = line.content.startsWith('data:image/');
          
          return (
            <div key={index} className={`terminal-line terminal-line-${line.type}`}>
              {isImage ? (
                <img 
                  src={line.content} 
                  alt="Plot" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    marginTop: '8px',
                    marginBottom: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px'
                  }} 
                />
              ) : (
                line.content
              )}
            </div>
          );
        })}
      </div>
      
      <div className="terminal-input-line">
        <span className="terminal-prompt">$</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}
