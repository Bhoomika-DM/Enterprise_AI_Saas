/**
 * Command Registry
 * 
 * Central registry of all IDE commands with their metadata.
 * Used by TopMenuBar and CommandPalette.
 * 
 * Validates Requirements: 2.3, 2.4, 2.5, 2.6
 */

import { MenuItem } from './Menu';

export interface Command {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  keywords?: string[];
}

// File Menu Commands
export const FILE_MENU: MenuItem[] = [
  { label: 'New File', command: 'file.new', shortcut: 'Ctrl+N' },
  { label: 'New Folder', command: 'file.newFolder' },
  { separator: true },
  { label: 'Open File...', command: 'file.open', shortcut: 'Ctrl+O' },
  { label: 'Open Folder...', command: 'file.openFolder', shortcut: 'Ctrl+K Ctrl+O' },
  { separator: true },
  { label: 'Save', command: 'file.save', shortcut: 'Ctrl+S' },
  { label: 'Save All', command: 'file.saveAll', shortcut: 'Ctrl+K S' },
  { separator: true },
  { label: 'Close Editor', command: 'file.close', shortcut: 'Ctrl+W' },
  { label: 'Close All', command: 'file.closeAll' },
];

// Edit Menu Commands
export const EDIT_MENU: MenuItem[] = [
  { label: 'Undo', command: 'editor.undo', shortcut: 'Ctrl+Z' },
  { label: 'Redo', command: 'editor.redo', shortcut: 'Ctrl+Y' },
  { separator: true },
  { label: 'Cut', command: 'editor.cut', shortcut: 'Ctrl+X' },
  { label: 'Copy', command: 'editor.copy', shortcut: 'Ctrl+C' },
  { label: 'Paste', command: 'editor.paste', shortcut: 'Ctrl+V' },
  { separator: true },
  { label: 'Find', command: 'editor.find', shortcut: 'Ctrl+F' },
  { label: 'Replace', command: 'editor.replace', shortcut: 'Ctrl+H' },
  { separator: true },
  { label: 'Format Document', command: 'editor.format', shortcut: 'Shift+Alt+F' },
];

// View Menu Commands
export const VIEW_MENU: MenuItem[] = [
  { label: 'Command Palette', command: 'commandPalette.open', shortcut: 'Ctrl+Shift+P' },
  { separator: true },
  { label: 'Explorer', command: 'view.explorer', shortcut: 'Ctrl+Shift+E' },
  { label: 'Search', command: 'view.search', shortcut: 'Ctrl+Shift+F' },
  { separator: true },
  { label: 'Toggle Sidebar', command: 'view.toggleSidebar', shortcut: 'Ctrl+B' },
  { label: 'Toggle Bottom Panel', command: 'view.toggleBottomPanel', shortcut: 'Ctrl+J' },
  { separator: true },
  { label: 'Terminal', command: 'view.terminal', shortcut: 'Ctrl+`' },
  { label: 'Output', command: 'view.output' },
  { label: 'Problems', command: 'view.problems' },
];

// Run Menu Commands
export const RUN_MENU: MenuItem[] = [
  { label: 'Start Debugging', command: 'run.debug', shortcut: 'F5' },
  { label: 'Run Without Debugging', command: 'run.file', shortcut: 'Ctrl+F5' },
  { separator: true },
  { label: 'Run Python File', command: 'run.python', shortcut: 'Shift+F10' },
  { label: 'Run SQL Query', command: 'run.sql' },
  { separator: true },
  { label: 'Stop Execution', command: 'run.stop', shortcut: 'Shift+F5' },
  { label: 'Restart', command: 'run.restart', shortcut: 'Ctrl+Shift+F5' },
  { separator: true },
  { label: 'Open Configurations', command: 'run.openConfig' },
  { label: 'Add Configuration...', command: 'run.addConfig' },
];

// Help Menu Commands
export const HELP_MENU: MenuItem[] = [
  { label: 'Welcome', command: 'help.welcome' },
  { label: 'Documentation', command: 'help.docs' },
  { separator: true },
  { label: 'Keyboard Shortcuts', command: 'help.shortcuts', shortcut: 'Ctrl+K Ctrl+S' },
  { separator: true },
  { label: 'About', command: 'help.about' },
];

// Complete command registry for Command Palette
export const COMMAND_REGISTRY: Command[] = [
  // File commands
  { id: 'file.new', label: 'New File', category: 'File', shortcut: 'Ctrl+N', keywords: ['create', 'file'] },
  { id: 'file.newFolder', label: 'New Folder', category: 'File', keywords: ['create', 'folder', 'directory'] },
  { id: 'file.open', label: 'Open File', category: 'File', shortcut: 'Ctrl+O', keywords: ['open', 'file'] },
  { id: 'file.openFolder', label: 'Open Folder', category: 'File', shortcut: 'Ctrl+K Ctrl+O', keywords: ['open', 'folder'] },
  { id: 'file.save', label: 'Save', category: 'File', shortcut: 'Ctrl+S', keywords: ['save', 'write'] },
  { id: 'file.saveAll', label: 'Save All', category: 'File', shortcut: 'Ctrl+K S', keywords: ['save', 'all'] },
  { id: 'file.close', label: 'Close Editor', category: 'File', shortcut: 'Ctrl+W', keywords: ['close'] },
  { id: 'file.closeAll', label: 'Close All Editors', category: 'File', keywords: ['close', 'all'] },
  
  // Edit commands
  { id: 'editor.undo', label: 'Undo', category: 'Edit', shortcut: 'Ctrl+Z', keywords: ['undo'] },
  { id: 'editor.redo', label: 'Redo', category: 'Edit', shortcut: 'Ctrl+Y', keywords: ['redo'] },
  { id: 'editor.cut', label: 'Cut', category: 'Edit', shortcut: 'Ctrl+X', keywords: ['cut'] },
  { id: 'editor.copy', label: 'Copy', category: 'Edit', shortcut: 'Ctrl+C', keywords: ['copy'] },
  { id: 'editor.paste', label: 'Paste', category: 'Edit', shortcut: 'Ctrl+V', keywords: ['paste'] },
  { id: 'editor.find', label: 'Find', category: 'Edit', shortcut: 'Ctrl+F', keywords: ['find', 'search'] },
  { id: 'editor.replace', label: 'Replace', category: 'Edit', shortcut: 'Ctrl+H', keywords: ['replace'] },
  { id: 'editor.format', label: 'Format Document', category: 'Edit', shortcut: 'Shift+Alt+F', keywords: ['format', 'beautify', 'indent'] },
  
  // View commands
  { id: 'commandPalette.open', label: 'Command Palette', category: 'View', shortcut: 'Ctrl+Shift+P', keywords: ['command', 'palette'] },
  { id: 'view.explorer', label: 'Show Explorer', category: 'View', shortcut: 'Ctrl+Shift+E', keywords: ['explorer', 'files'] },
  { id: 'view.search', label: 'Show Search', category: 'View', shortcut: 'Ctrl+Shift+F', keywords: ['search', 'find'] },
  { id: 'view.toggleSidebar', label: 'Toggle Sidebar', category: 'View', shortcut: 'Ctrl+B', keywords: ['sidebar', 'toggle'] },
  { id: 'view.toggleBottomPanel', label: 'Toggle Bottom Panel', category: 'View', shortcut: 'Ctrl+J', keywords: ['panel', 'toggle'] },
  { id: 'view.terminal', label: 'Toggle Terminal', category: 'View', shortcut: 'Ctrl+`', keywords: ['terminal'] },
  { id: 'view.output', label: 'Show Output', category: 'View', keywords: ['output'] },
  { id: 'view.problems', label: 'Show Problems', category: 'View', keywords: ['problems', 'errors'] },
  
  // Run commands
  { id: 'run.debug', label: 'Start Debugging', category: 'Run', shortcut: 'F5', keywords: ['debug', 'run', 'start'] },
  { id: 'run.file', label: 'Run Without Debugging', category: 'Run', shortcut: 'Ctrl+F5', keywords: ['run', 'execute'] },
  { id: 'run.python', label: 'Run Python File', category: 'Run', shortcut: 'Shift+F10', keywords: ['run', 'python'] },
  { id: 'run.sql', label: 'Run SQL Query', category: 'Run', keywords: ['run', 'sql', 'query'] },
  { id: 'run.stop', label: 'Stop Execution', category: 'Run', shortcut: 'Shift+F5', keywords: ['stop', 'terminate'] },
  { id: 'run.restart', label: 'Restart', category: 'Run', shortcut: 'Ctrl+Shift+F5', keywords: ['restart', 'rerun'] },
  { id: 'run.openConfig', label: 'Open Configurations', category: 'Run', keywords: ['config', 'configuration', 'settings'] },
  { id: 'run.addConfig', label: 'Add Configuration', category: 'Run', keywords: ['add', 'config', 'configuration'] },
  
  // Help commands
  { id: 'help.welcome', label: 'Welcome', category: 'Help', keywords: ['welcome', 'start'] },
  { id: 'help.docs', label: 'Documentation', category: 'Help', keywords: ['docs', 'documentation', 'help'] },
  { id: 'help.shortcuts', label: 'Keyboard Shortcuts', category: 'Help', shortcut: 'Ctrl+K Ctrl+S', keywords: ['shortcuts', 'keyboard'] },
  { id: 'help.about', label: 'About', category: 'Help', keywords: ['about', 'version'] },
];
