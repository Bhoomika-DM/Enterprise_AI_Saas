/**
 * Multiple Themes for CodeMirror 6
 * 
 * Now reads from centralized CSS variables for full theme support
 * Validates Requirements: 2.1, 2.2, 8.2, 8.3, 8.4, 8.5, 8.6
 */

import { EditorView } from '@codemirror/view';

// Base theme styles that work with CSS variables
const baseThemeStyles = {
  '&': {
    color: 'var(--editor-text)',
    backgroundColor: 'var(--editor-bg)',
    fontSize: '14px',
    fontFamily: 'var(--editor-font-family, "Plus Jakarta Sans"), "JetBrains Mono", Consolas, "Courier New", monospace',
    lineHeight: '1.6',
  },
  
  '.cm-content': {
    caretColor: 'var(--editor-cursor)',
    padding: '0',
  },
  
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--editor-cursor)',
    borderLeftWidth: '2px',
  },
  
  '&.cm-focused .cm-cursor': {
    borderLeftColor: 'var(--editor-cursor)',
  },
  
  '&.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: 'var(--editor-selection)',
  },
  
  '.cm-selectionBackground': {
    backgroundColor: 'var(--editor-selection)',
  },
  
  '.cm-activeLine': {
    backgroundColor: 'var(--editor-active-line)',
  },
  
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--editor-active-line)',
  },
  
  '.cm-gutters': {
    backgroundColor: 'var(--editor-bg)',
    color: 'var(--editor-gutter)',
    border: 'none',
    borderRight: '1px solid var(--border-primary)',
  },
  
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 16px',
    minWidth: '40px',
    textAlign: 'right',
  },
  
  '.cm-foldGutter': {
    width: '16px',
  },
  
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: 'var(--editor-font-family, "Plus Jakarta Sans"), "JetBrains Mono", Consolas, "Courier New", monospace',
  },
  
  '.cm-matchingBracket': {
    backgroundColor: 'rgba(0, 122, 204, 0.2)',
    outline: '1px solid #007acc',
  },
  
  '.cm-nonmatchingBracket': {
    backgroundColor: 'transparent',
    outline: '1px solid var(--status-error)',
  },
  
  '&.cm-focused .cm-matchingBracket': {
    backgroundColor: 'rgba(0, 122, 204, 0.3)',
  },
  
  '.cm-searchMatch': {
    backgroundColor: 'var(--bg-selected)',
    outline: '1px solid var(--border-focus)',
  },
  
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: 'var(--accent-primary)',
  },
  
  '.cm-scroller::-webkit-scrollbar': {
    width: '14px',
    height: '10px',
  },
  
  '.cm-scroller::-webkit-scrollbar-thumb': {
    backgroundColor: 'var(--scrollbar-thumb)',
    borderRadius: '0',
  },
  
  '.cm-scroller::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'var(--scrollbar-thumb-hover)',
  },
  
  '.cm-scroller::-webkit-scrollbar-track': {
    backgroundColor: 'var(--scrollbar-track)',
  },
  
  '.cm-scroller::-webkit-scrollbar-corner': {
    backgroundColor: 'var(--editor-bg)',
  },
  
  '.cm-tooltip': {
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '3px',
  },
  
  '.cm-tooltip.cm-tooltip-autocomplete': {
    '& > ul': {
      fontFamily: 'var(--editor-font-family, "Plus Jakarta Sans"), "JetBrains Mono", Consolas, "Courier New", monospace',
      fontSize: '13px',
    },
    '& > ul > li': {
      padding: '2px 8px',
    },
    '& > ul > li[aria-selected]': {
      backgroundColor: 'var(--accent-primary)',
      color: '#ffffff',
    },
  },
};

// Dark themes (dark: true)
export const vsCodeDarkTheme = EditorView.theme(baseThemeStyles, { dark: true });
export const vsCodeDarkPlusTheme = EditorView.theme(baseThemeStyles, { dark: true });
export const vsCodeHighContrastTheme = EditorView.theme(baseThemeStyles, { dark: true });

// Light theme (dark: false)
export const vsCodeLightTheme = EditorView.theme(baseThemeStyles, { dark: false });

// Theme selector function
export function getTheme(themeName: string) {
  switch (themeName) {
    case 'light':
      return vsCodeLightTheme;
    case 'dark-plus':
      return vsCodeDarkPlusTheme;
    case 'high-contrast':
      return vsCodeHighContrastTheme;
    case 'dark':
    default:
      return vsCodeDarkTheme;
  }
}

// Theme map for easy access
export const themes = {
  'dark': vsCodeDarkTheme,
  'dark-plus': vsCodeDarkPlusTheme,
  'light': vsCodeLightTheme,
  'high-contrast': vsCodeHighContrastTheme,
};
