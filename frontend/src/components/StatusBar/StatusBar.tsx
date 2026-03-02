/**
 * StatusBar Component
 * 
 * Bottom status bar displaying file and editor information.
 * Shows language, cursor position, encoding, line endings, git branch, and LSP status.
 * 
 * Validates Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import React, { useState, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { languageService } from '../../services/LanguageService';
import type { LanguageConfig } from '../../services/LanguageService';
import './StatusBar.css';

export function StatusBar() {
  const { state, setSelectedDataset } = useEditor();
  const { openFiles, activeFileId, cursorPosition, selectedDataset, datasetMetadata } = state;
  const [languageConfig, setLanguageConfig] = useState<LanguageConfig | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected');

  const activeFile = openFiles.find(f => f.id === activeFileId);
  const metadata = datasetMetadata[selectedDataset];

  const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDataset(e.target.value as 'raw' | 'cleaned');
  };

  useEffect(() => {
    // Listen for language changes
    const unsubscribeLanguage = languageService.onLanguageChanged((config: LanguageConfig) => {
      setLanguageConfig(config);
    });

    // Listen for connection status
    const unsubscribeStatus = languageService.onConnectionStatus((status) => {
      setConnectionStatus(status);
    });

    // Get initial config
    const config = languageService.getConfig();
    if (config) {
      setLanguageConfig(config);
    }

    return () => {
      unsubscribeLanguage();
      unsubscribeStatus();
    };
  }, []);

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        {/* Git branch indicator */}
        <div className="status-item git-branch">
          <span className="status-icon">⎇</span>
          <span className="status-text">main</span>
        </div>

        {/* Problems/Warnings/Errors count */}
        <div className="status-item">
          <span className="status-icon">✕</span>
          <span className="status-text">0</span>
        </div>
        <div className="status-item">
          <span className="status-icon">⚠</span>
          <span className="status-text">0</span>
        </div>
      </div>

      <div className="status-bar-right">
        {/* Dataset Selector - VS Code style clickable */}
        <div 
          className="status-item clickable dataset-selector-status"
          onClick={() => {
            const newDataset = selectedDataset === 'raw' ? 'cleaned' : 'raw';
            setSelectedDataset(newDataset);
          }}
          title={`Dataset: ${selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)} (click to switch)`}
        >
          <span className="status-icon">📊</span>
          <span className="status-text">{selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)}</span>
        </div>

        {/* Dataset Metadata - Only show if data exists */}
        {metadata.rows > 0 && (
          <>
            <div className="status-item" title={`${metadata.rows.toLocaleString()} rows`}>
              <span className="status-text">{metadata.rows.toLocaleString()} rows</span>
            </div>
            <div className="status-item" title={`${metadata.columns} columns`}>
              <span className="status-text">{metadata.columns} cols</span>
            </div>
            {metadata.missingPercentage > 0 && (
              <div className="status-item" title={`${metadata.missingPercentage}% missing values`}>
                <span className="status-text">{metadata.missingPercentage}% missing</span>
              </div>
            )}
          </>
        )}

        {/* LSP Connection Status */}
        {languageConfig && (
          <div className="status-item" title={`${languageConfig.runtime.name} - ${getConnectionStatusText(connectionStatus)}`}>
            <span className="status-icon">{getConnectionStatusIcon(connectionStatus)}</span>
            <span className="status-text">{languageConfig.runtime.name}</span>
          </div>
        )}

        {activeFile && (
          <>
            {/* Line and column position */}
            <div className="status-item clickable">
              <span className="status-text">
                Ln {cursorPosition.line}, Col {cursorPosition.column}
              </span>
            </div>

            {/* Spaces/Tabs */}
            <div className="status-item clickable">
              <span className="status-text">Spaces: 2</span>
            </div>

            {/* Encoding */}
            <div className="status-item clickable">
              <span className="status-text">UTF-8</span>
            </div>

            {/* Line ending */}
            <div className="status-item clickable">
              <span className="status-text">LF</span>
            </div>

            {/* Language mode */}
            <div className="status-item clickable language">
              <span className="status-text">
                {getLanguageDisplay(activeFile.language)}
              </span>
            </div>
          </>
        )}

        {/* Notifications bell */}
        <div className="status-item clickable">
          <span className="status-icon">🔔</span>
        </div>
      </div>
    </div>
  );
}

function getLanguageDisplay(language: string): string {
  const languageMap: Record<string, string> = {
    'python': 'Python',
    'sql': 'SQL',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'json': 'JSON',
    'markdown': 'Markdown',
    'plaintext': 'Plain Text',
    'html': 'HTML',
    'css': 'CSS',
  };
  return languageMap[language] || language;
}

function getConnectionStatusIcon(status: 'connected' | 'disconnected' | 'connecting' | 'error'): string {
  switch (status) {
    case 'connected':
      return '🟢';
    case 'connecting':
      return '🟡';
    case 'disconnected':
      return '⚪';
    case 'error':
      return '🔴';
    default:
      return '⚪';
  }
}

function getConnectionStatusText(status: 'connected' | 'disconnected' | 'connecting' | 'error'): string {
  switch (status) {
    case 'connected':
      return 'Connected to LSP';
    case 'connecting':
      return 'Connecting to LSP...';
    case 'disconnected':
      return 'LSP Disconnected';
    case 'error':
      return 'LSP Connection Error';
    default:
      return 'Not Connected';
  }
}
