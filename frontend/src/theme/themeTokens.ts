/**
 * Centralized Theme Tokens
 * 
 * All color values for different themes.
 * NO hardcoded colors anywhere else in the app.
 */

export interface ThemeTokens {
  // Background colors
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgHover: string;
  bgActive: string;
  bgSelected: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  
  // Border colors
  borderPrimary: string;
  borderSecondary: string;
  borderFocus: string;
  
  // Accent colors
  accentPrimary: string;
  accentSecondary: string;
  accentHover: string;
  
  // Status colors
  statusSuccess: string;
  statusWarning: string;
  statusError: string;
  statusInfo: string;
  
  // Editor specific
  editorBg: string;
  editorText: string;
  editorSelection: string;
  editorActiveLine: string;
  editorGutter: string;
  editorCursor: string;
  
  // Scrollbar
  scrollbarThumb: string;
  scrollbarThumbHover: string;
  scrollbarTrack: string;
  
  // Shadow
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
}

// Dark Theme (Default)
export const darkTheme: ThemeTokens = {
  bgPrimary: 'rgba(15, 20, 40, 0.95)',
  bgSecondary: 'rgba(10, 15, 35, 0.95)',
  bgTertiary: 'rgba(20, 25, 45, 0.95)',
  bgHover: 'rgba(255, 255, 255, 0.05)',
  bgActive: 'rgba(255, 255, 255, 0.1)',
  bgSelected: 'rgba(201, 103, 49, 0.2)',
  
  textPrimary: 'rgb(229, 231, 235)',
  textSecondary: 'rgb(156, 163, 175)',
  textTertiary: 'rgb(107, 114, 128)',
  textDisabled: 'rgb(75, 85, 99)',
  
  borderPrimary: 'rgba(255, 255, 255, 0.08)',
  borderSecondary: 'rgba(255, 255, 255, 0.05)',
  borderFocus: 'rgba(201, 103, 49, 0.5)',
  
  accentPrimary: '#C96731',
  accentSecondary: '#E07B42',
  accentHover: 'rgba(201, 103, 49, 0.8)',
  
  statusSuccess: '#10b981',
  statusWarning: '#f59e0b',
  statusError: '#ef4444',
  statusInfo: '#3b82f6',
  
  editorBg: '#1e1e1e',
  editorText: '#d4d4d4',
  editorSelection: '#264f78',
  editorActiveLine: '#2a2a2a',
  editorGutter: '#858585',
  editorCursor: '#d4d4d4',
  
  scrollbarThumb: 'rgba(201, 103, 49, 0.3)',
  scrollbarThumbHover: 'rgba(201, 103, 49, 0.5)',
  scrollbarTrack: 'rgba(10, 15, 35, 0.5)',
  
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
};

// Dark+ Theme
export const darkPlusTheme: ThemeTokens = {
  bgPrimary: 'rgba(20, 25, 45, 0.95)',
  bgSecondary: 'rgba(15, 20, 40, 0.95)',
  bgTertiary: 'rgba(25, 30, 50, 0.95)',
  bgHover: 'rgba(255, 255, 255, 0.06)',
  bgActive: 'rgba(255, 255, 255, 0.12)',
  bgSelected: 'rgba(201, 103, 49, 0.25)',
  
  textPrimary: 'rgb(229, 231, 235)',
  textSecondary: 'rgb(156, 163, 175)',
  textTertiary: 'rgb(107, 114, 128)',
  textDisabled: 'rgb(75, 85, 99)',
  
  borderPrimary: 'rgba(255, 255, 255, 0.1)',
  borderSecondary: 'rgba(255, 255, 255, 0.06)',
  borderFocus: 'rgba(201, 103, 49, 0.6)',
  
  accentPrimary: '#C96731',
  accentSecondary: '#E07B42',
  accentHover: 'rgba(201, 103, 49, 0.85)',
  
  statusSuccess: '#10b981',
  statusWarning: '#f59e0b',
  statusError: '#ef4444',
  statusInfo: '#3b82f6',
  
  editorBg: '#252526',
  editorText: '#d4d4d4',
  editorSelection: '#3a3d41',
  editorActiveLine: '#2d2d30',
  editorGutter: '#858585',
  editorCursor: '#d4d4d4',
  
  scrollbarThumb: 'rgba(201, 103, 49, 0.35)',
  scrollbarThumbHover: 'rgba(201, 103, 49, 0.55)',
  scrollbarTrack: 'rgba(15, 20, 40, 0.5)',
  
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
};

// Light Theme
export const lightTheme: ThemeTokens = {
  bgPrimary: '#ffffff',
  bgSecondary: '#f5f5f5',
  bgTertiary: '#e5e5e5',
  bgHover: 'rgba(0, 0, 0, 0.05)',
  bgActive: 'rgba(0, 0, 0, 0.1)',
  bgSelected: 'rgba(201, 103, 49, 0.15)',
  
  textPrimary: '#000000',
  textSecondary: '#4b5563',
  textTertiary: '#6b7280',
  textDisabled: '#9ca3af',
  
  borderPrimary: 'rgba(0, 0, 0, 0.1)',
  borderSecondary: 'rgba(0, 0, 0, 0.05)',
  borderFocus: 'rgba(201, 103, 49, 0.5)',
  
  accentPrimary: '#C96731',
  accentSecondary: '#E07B42',
  accentHover: 'rgba(201, 103, 49, 0.8)',
  
  statusSuccess: '#059669',
  statusWarning: '#d97706',
  statusError: '#dc2626',
  statusInfo: '#2563eb',
  
  editorBg: '#ffffff',
  editorText: '#000000',
  editorSelection: '#add6ff',
  editorActiveLine: '#f0f0f0',
  editorGutter: '#237893',
  editorCursor: '#000000',
  
  scrollbarThumb: 'rgba(0, 0, 0, 0.2)',
  scrollbarThumbHover: 'rgba(0, 0, 0, 0.3)',
  scrollbarTrack: 'rgba(0, 0, 0, 0.05)',
  
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
};

// High Contrast Theme
export const highContrastTheme: ThemeTokens = {
  bgPrimary: '#000000',
  bgSecondary: '#0a0a0a',
  bgTertiary: '#1a1a1a',
  bgHover: 'rgba(255, 255, 255, 0.1)',
  bgActive: 'rgba(255, 255, 255, 0.2)',
  bgSelected: 'rgba(201, 103, 49, 0.3)',
  
  textPrimary: '#ffffff',
  textSecondary: '#e5e5e5',
  textTertiary: '#cccccc',
  textDisabled: '#999999',
  
  borderPrimary: '#ffffff',
  borderSecondary: 'rgba(255, 255, 255, 0.5)',
  borderFocus: '#C96731',
  
  accentPrimary: '#C96731',
  accentSecondary: '#E07B42',
  accentHover: '#E07B42',
  
  statusSuccess: '#00ff00',
  statusWarning: '#ffff00',
  statusError: '#ff0000',
  statusInfo: '#00ffff',
  
  editorBg: '#000000',
  editorText: '#ffffff',
  editorSelection: '#0066cc',
  editorActiveLine: '#1a1a1a',
  editorGutter: '#ffffff',
  editorCursor: '#ffffff',
  
  scrollbarThumb: '#ffffff',
  scrollbarThumbHover: '#cccccc',
  scrollbarTrack: '#000000',
  
  shadowSm: '0 0 0 1px #ffffff',
  shadowMd: '0 0 0 2px #ffffff',
  shadowLg: '0 0 0 3px #ffffff',
};

// Theme map
export const themes = {
  dark: darkTheme,
  'dark-plus': darkPlusTheme,
  light: lightTheme,
  'high-contrast': highContrastTheme,
};

export type ThemeName = keyof typeof themes;
