/**
 * Type definitions for the Data Scientist Editor
 * 
 * These interfaces define the shape of the editor state and related data structures
 * to ensure type safety throughout the application.
 */

import { FileNode, WorkspaceState } from '../services/WorkspaceManager';

/**
 * Represents an open file in the editor
 */
export interface FileDescriptor {
  /** Unique identifier (UUID or path-based) */
  id: string;
  /** Display name (e.g., "analysis.py") */
  name: string;
  /** Full path (e.g., "/datasets/analysis.py") */
  path: string;
  /** Language for syntax highlighting */
  language: 'python' | 'sql' | 'javascript' | 'typescript' | 'html' | 'css' | 'json';
  /** File content */
  content: string;
  /** True if file has unsaved changes */
  isDirty: boolean;
}

/**
 * Terminal line output
 */
export interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: number;
}

/**
 * Represents metadata about a dataset
 */
export interface DatasetMetadata {
  /** Number of rows */
  rows: number;
  /** Number of columns */
  columns: number;
  /** Percentage of missing values (0-100) */
  missingPercentage: number;
  /** Human-readable memory usage (e.g., "2.4 MB") */
  memoryUsage: string;
}

/**
 * Global state for the editor application
 */
export interface EditorState {
  /** Workspace file system state */
  workspace: WorkspaceState | null;
  /** List of currently open files */
  openFiles: FileDescriptor[];
  /** ID of the currently active file, or null if no files are open */
  activeFileId: string | null;
  /** Whether the sidebar is expanded */
  sidebarExpanded: boolean;
  /** Currently active sidebar panel */
  activeSidebarPanel: 'explorer' | 'search' | 'source-control' | 'extensions' | 'settings';
  /** Whether the bottom panel is expanded */
  bottomPanelExpanded: boolean;
  /** Height of the bottom panel in pixels */
  bottomPanelHeight: number;
  /** Currently active bottom panel tab */
  activeBottomTab: 'terminal' | 'system-terminal' | 'output' | 'problems' | 'logs';
  /** Currently selected dataset */
  selectedDataset: 'raw' | 'cleaned';
  /** Metadata for both raw and cleaned datasets */
  datasetMetadata: {
    raw: DatasetMetadata;
    cleaned: DatasetMetadata;
  };
  /** Command palette open state */
  commandPaletteOpen: boolean;
  /** Code execution state */
  isExecuting: boolean;
  /** Execution output lines */
  executionOutput: string[];
  /** Terminal command history */
  terminalHistory: string[];
  /** Terminal output lines */
  terminalOutput: TerminalLine[];
  /** Cursor position in editor */
  cursorPosition: { line: number; column: number };
  /** Recent command IDs */
  recentCommands: string[];
  /** Editor settings */
  editorSettings: {
    // Editor
    autoSave: boolean;
    lineNumbers: boolean;
    wordWrap: boolean;
    fontSize: number;
    tabSize: number;
    minimap: boolean;
    bracketPairs: boolean;
    formatOnSave: boolean;
    
    // Appearance
    theme: string;
    fontFamily: string; // Read-only, display only
    uiDensity: 'compact' | 'comfortable';
    iconTheme: string;
    animations: boolean;
    
    // Workspace
    defaultLanguageMode: 'python' | 'javascript' | 'sql';
    autoSaveDelay: number; // milliseconds
    rememberOpenFiles: boolean;
    rememberActiveTab: boolean;
    rememberDataset: boolean;
    rememberPanelVisibility: boolean;
    executionMode: 'browser' | 'server';
  };
}

/**
 * Actions for updating editor state
 */
export type EditorAction =
  | { type: 'OPEN_FILE'; payload: FileDescriptor }
  | { type: 'CLOSE_FILE'; payload: string } // file id
  | { type: 'SWITCH_TAB'; payload: string } // file id
  | { type: 'UPDATE_FILE_CONTENT'; payload: { id: string; content: string } }
  | { type: 'MARK_FILE_DIRTY'; payload: { id: string; isDirty: boolean } }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_PANEL'; payload: 'explorer' | 'search' | 'source-control' | 'extensions' | 'settings' }
  | { type: 'TOGGLE_BOTTOM_PANEL' }
  | { type: 'SET_BOTTOM_PANEL_HEIGHT'; payload: number }
  | { type: 'SET_BOTTOM_TAB'; payload: 'terminal' | 'output' | 'problems' | 'logs' }
  | { type: 'SET_SELECTED_DATASET'; payload: 'raw' | 'cleaned' }
  | { type: 'SET_WORKSPACE'; payload: WorkspaceState }
  | { type: 'CREATE_FILE'; payload: { parentPath: string; name: string; content?: string } }
  | { type: 'CREATE_FOLDER'; payload: { parentPath: string; name: string } }
  | { type: 'DELETE_NODE'; payload: string } // path
  | { type: 'RENAME_NODE'; payload: { path: string; newName: string } }
  | { type: 'TOGGLE_FOLDER'; payload: string } // path
  | { type: 'OPEN_FILE_FROM_WORKSPACE'; payload: string } // path
  | { type: 'SAVE_FILE'; payload: string } // file id
  | { type: 'SAVE_ALL_FILES' }
  | { type: 'TOGGLE_COMMAND_PALETTE' }
  | { type: 'SET_EXECUTING'; payload: boolean }
  | { type: 'ADD_EXECUTION_OUTPUT'; payload: string }
  | { type: 'CLEAR_EXECUTION_OUTPUT' }
  | { type: 'ADD_TERMINAL_LINE'; payload: TerminalLine }
  | { type: 'CLEAR_TERMINAL' }
  | { type: 'ADD_TERMINAL_HISTORY'; payload: string }
  | { type: 'UPDATE_CURSOR_POSITION'; payload: { line: number; column: number } }
  | { type: 'ADD_RECENT_COMMAND'; payload: string }
  | { type: 'UPDATE_EDITOR_SETTINGS'; payload: Partial<EditorState['editorSettings']> };
