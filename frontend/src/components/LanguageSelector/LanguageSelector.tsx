/**
 * LanguageSelector Component
 * 
 * Dropdown for switching programming languages.
 * Communicates with backend to get available languages and switch LSP servers.
 */

import React, { useState, useEffect } from 'react';
import { languageService } from '../../services/LanguageService';
import type { LanguageConfig } from '../../services/LanguageService';
import './LanguageSelector.css';

interface Language {
  id: string;
  name: string;
  icon: string;
}

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('python');
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript', icon: '📜' },
    { id: 'typescript', name: 'TypeScript', icon: '📘' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'sql', name: 'SQL', icon: '🗄️' },
    { id: 'cpp', name: 'C/C++', icon: '⚙️' },
    { id: 'go', name: 'Go', icon: '🐹' },
    { id: 'rust', name: 'Rust', icon: '🦀' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected');

  useEffect(() => {
    // Fetch available languages from backend
    fetchAvailableLanguages();

    // Listen for language changes
    const unsubscribeLanguage = languageService.onLanguageChanged((config: LanguageConfig) => {
      setCurrentLanguage(config.language);
      setError(null);
    });

    // Listen for connection status
    const unsubscribeStatus = languageService.onConnectionStatus((status) => {
      setConnectionStatus(status);
    });

    return () => {
      unsubscribeLanguage();
      unsubscribeStatus();
    };
  }, []);

  const fetchAvailableLanguages = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/languages');
      if (response.ok) {
        const languages = await response.json();
        // Map backend response to Language objects
        const mappedLanguages = languages.map((lang: string) => {
          const existing = availableLanguages.find(l => l.id === lang);
          return existing || { id: lang, name: lang.charAt(0).toUpperCase() + lang.slice(1), icon: '📄' };
        });
        setAvailableLanguages(mappedLanguages);
      }
    } catch (error) {
      console.warn('Could not fetch languages from backend, using defaults');
      // Keep default languages
    }
  };

  const handleLanguageChange = async (languageId: string) => {
    if (languageId === currentLanguage) return;

    setLoading(true);
    setError(null);

    try {
      await languageService.switchLanguage(languageId, 'current-file', 'default-workspace');
      setCurrentLanguage(languageId);
    } catch (err: any) {
      console.error('Failed to switch language:', err);
      setError(err.message || 'Failed to switch language');
      
      // Show user-friendly error
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
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
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Not Connected';
    }
  };

  const currentLang = availableLanguages.find(l => l.id === currentLanguage);

  return (
    <div className="language-selector">
      <div className="language-selector-main">
        <span className="language-icon">{currentLang?.icon || '📄'}</span>
        <select
          value={currentLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          disabled={loading}
          className="language-dropdown"
          title="Select Programming Language"
        >
          {availableLanguages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
        {loading && <span className="loading-spinner">⏳</span>}
      </div>
      
      <div className="connection-status" title={getStatusText()}>
        <span className="status-icon">{getStatusIcon()}</span>
        <span className="status-text">{getStatusText()}</span>
      </div>

      {error && (
        <div className="language-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
        </div>
      )}
    </div>
  );
}
