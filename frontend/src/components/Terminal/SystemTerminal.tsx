/**
 * SystemTerminal Component
 * 
 * Real terminal using xterm.js connected to backend via WebSocket.
 * Provides full shell access (bash/cmd/powershell) through backend.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { io, Socket } from 'socket.io-client';
import 'xterm/css/xterm.css';
import './SystemTerminal.css';

interface SystemTerminalProps {
  terminalId?: string;
}

export function SystemTerminal({ terminalId = 'default' }: SystemTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: '"Cascadia Code", "Fira Code", "Consolas", "Monaco", monospace',
      theme: {
        background: '#0a0f23',
        foreground: '#e5e7eb',
        cursor: '#C96731',
        cursorAccent: '#0a0f23',
        selection: 'rgba(201, 103, 49, 0.3)',
        black: '#1e293b',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#06b6d4',
        white: '#e5e7eb',
        brightBlack: '#475569',
        brightRed: '#f87171',
        brightGreen: '#4ade80',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#c084fc',
        brightCyan: '#22d3ee',
        brightWhite: '#f8fafc',
      },
      allowProposedApi: true,
    });

    // Add addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Connect to backend WebSocket
    // TODO: Backend developer should implement this endpoint
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const socket = io(`${BACKEND_URL}/terminal`, {
      transports: ['websocket'],
      query: { terminalId },
    });

    socketRef.current = socket;

    // Connection handlers
    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      term.writeln('\x1b[1;32m✓ Connected to system terminal\x1b[0m');
      term.writeln('');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      term.writeln('');
      term.writeln('\x1b[1;31m✗ Disconnected from terminal server\x1b[0m');
    });

    socket.on('connect_error', (err) => {
      setError('Failed to connect to terminal server. Is the backend running?');
      term.writeln('\x1b[1;31m✗ Connection error: ' + err.message + '\x1b[0m');
      term.writeln('\x1b[33mBackend terminal server not available.\x1b[0m');
      term.writeln('\x1b[33mPlease ensure the backend is running on ' + BACKEND_URL + '\x1b[0m');
    });

    // Receive output from backend
    socket.on('output', (data: string) => {
      term.write(data);
    });

    // Send input to backend
    term.onData((data) => {
      socket.emit('input', data);
    });

    // Handle terminal resize
    const handleResize = () => {
      fitAddon.fit();
      socket.emit('resize', {
        cols: term.cols,
        rows: term.rows,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      socket.disconnect();
      term.dispose();
    };
  }, [terminalId]);

  return (
    <div className="system-terminal-container">
      {error && (
        <div className="terminal-error-banner">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 4V8M8 11V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      <div 
        ref={terminalRef} 
        className={`system-terminal ${isConnected ? 'connected' : 'disconnected'}`}
      />
      <div className="terminal-status">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          <span className="status-text">
            {isConnected ? 'System Terminal' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
}
