/**
 * ThemeProvider Component
 * 
 * Wraps the entire IDE and applies theme CSS variables to the root element.
 * Reads theme from EditorContext and updates CSS variables dynamically.
 */

import React, { useEffect } from 'react';
import { useEditor } from '../contexts/EditorContext';
import { themes, ThemeName } from './themeTokens';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { state } = useEditor();
  const themeName = (state.editorSettings.theme || 'dark') as ThemeName;
  const theme = themes[themeName] || themes.dark;

  useEffect(() => {
    // Apply theme CSS variables to root element
    const root = document.documentElement;
    
    // Background colors
    root.style.setProperty('--bg-primary', theme.bgPrimary);
    root.style.setProperty('--bg-secondary', theme.bgSecondary);
    root.style.setProperty('--bg-tertiary', theme.bgTertiary);
    root.style.setProperty('--bg-hover', theme.bgHover);
    root.style.setProperty('--bg-active', theme.bgActive);
    root.style.setProperty('--bg-selected', theme.bgSelected);
    
    // Text colors
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--text-tertiary', theme.textTertiary);
    root.style.setProperty('--text-disabled', theme.textDisabled);
    
    // Border colors
    root.style.setProperty('--border-primary', theme.borderPrimary);
    root.style.setProperty('--border-secondary', theme.borderSecondary);
    root.style.setProperty('--border-focus', theme.borderFocus);
    
    // Accent colors
    root.style.setProperty('--accent-primary', theme.accentPrimary);
    root.style.setProperty('--accent-secondary', theme.accentSecondary);
    root.style.setProperty('--accent-hover', theme.accentHover);
    
    // Status colors
    root.style.setProperty('--status-success', theme.statusSuccess);
    root.style.setProperty('--status-warning', theme.statusWarning);
    root.style.setProperty('--status-error', theme.statusError);
    root.style.setProperty('--status-info', theme.statusInfo);
    
    // Editor specific
    root.style.setProperty('--editor-bg', theme.editorBg);
    root.style.setProperty('--editor-text', theme.editorText);
    root.style.setProperty('--editor-selection', theme.editorSelection);
    root.style.setProperty('--editor-active-line', theme.editorActiveLine);
    root.style.setProperty('--editor-gutter', theme.editorGutter);
    root.style.setProperty('--editor-cursor', theme.editorCursor);
    
    // Scrollbar
    root.style.setProperty('--scrollbar-thumb', theme.scrollbarThumb);
    root.style.setProperty('--scrollbar-thumb-hover', theme.scrollbarThumbHover);
    root.style.setProperty('--scrollbar-track', theme.scrollbarTrack);
    
    // Shadow
    root.style.setProperty('--shadow-sm', theme.shadowSm);
    root.style.setProperty('--shadow-md', theme.shadowMd);
    root.style.setProperty('--shadow-lg', theme.shadowLg);

    console.log(`[ThemeProvider] Applied theme: ${themeName}`, theme);
  }, [themeName, theme]);

  return <>{children}</>;
}
