/**
 * VS Code Dark Theme Color Tokens
 * 
 * This file contains the exact color palette from VS Code Dark Theme
 * to ensure visual parity with the VS Code editor experience.
 */

export const VSCodeDarkTheme = {
  // Backgrounds
  editorBackground: '#1e1e1e',
  sidebarBackground: '#252526',
  tabBarBackground: '#2d2d2d',
  activeTabBackground: '#1e1e1e',
  panelBackground: '#1e1e1e',
  
  // Borders
  border: '#2d2d30',
  activeBorder: '#007acc',
  
  // Text
  foreground: '#cccccc',
  secondaryForeground: '#858585',
  
  // Active states
  activeBackground: '#37373d',
  hoverBackground: '#2a2d2e',
  
  // Accents
  focusBorder: '#007acc',
  selectionBackground: '#264f78',
  
  // Terminal
  terminalForeground: '#cccccc',
  terminalPrompt: '#4ec9b0',
};

/**
 * Monaco Editor Configuration
 * 
 * Standard configuration options to match VS Code editor behavior
 */
export const monacoEditorConfig = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: 'JetBrains Mono, monospace',
  lineHeight: 21,
  letterSpacing: 0,
  fontLigatures: true,
  minimap: { enabled: true },
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 4,
  insertSpaces: true,
  cursorBlinking: 'blink',
  cursorWidth: 2,
  renderWhitespace: 'selection',
  quickSuggestions: true,
  suggestOnTriggerCharacters: true,
};
