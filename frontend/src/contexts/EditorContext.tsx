/**
 * EditorContext - Global state management for the Data Scientist Editor
 * 
 * This context provides the editor state and actions to all components in the application.
 * It uses React's useReducer hook for predictable state updates.
 * 
 * Enhanced with workspace management, terminal integration, and execution state.
 */

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { EditorState, EditorAction, FileDescriptor, TerminalLine } from '../types/editor';
import { WorkspaceManager, WorkspaceState } from '../services/WorkspaceManager';
import { FormatterService } from '../services/FormatterService';

// Create workspace manager instance
const workspaceManager = new WorkspaceManager();

/**
 * Initial state for the editor
 */
const initialState: EditorState = {
  workspace: null,
  openFiles: [],
  activeFileId: null,
  sidebarExpanded: false, // Default to collapsed (icon-only)
  activeSidebarPanel: 'explorer',
  bottomPanelExpanded: false,
  bottomPanelHeight: 300, // Default height in pixels
  activeBottomTab: 'terminal',
  selectedDataset: 'raw',
  datasetMetadata: {
    raw: {
      rows: 0,
      columns: 0,
      missingPercentage: 0,
      memoryUsage: '0 MB',
    },
    cleaned: {
      rows: 0,
      columns: 0,
      missingPercentage: 0,
      memoryUsage: '0 MB',
    },
  },
  commandPaletteOpen: false,
  isExecuting: false,
  executionOutput: [],
  terminalHistory: [],
  terminalOutput: [],
  cursorPosition: { line: 1, column: 1 },
  recentCommands: [],
  editorSettings: {
    // Editor
    autoSave: true,
    lineNumbers: true,
    wordWrap: false,
    fontSize: 14,
    tabSize: 4,
    minimap: false,
    bracketPairs: true,
    formatOnSave: true,
    
    // Appearance
    theme: 'dark',
    fontFamily: 'Plus Jakarta Sans', // Selectable
    uiDensity: 'comfortable',
    iconTheme: 'vs-code-icons',
    animations: true,
    
    // Workspace
    defaultLanguageMode: 'python',
    autoSaveDelay: 1000,
    rememberOpenFiles: true,
    rememberActiveTab: true,
    rememberDataset: true,
    rememberPanelVisibility: true,
    executionMode: 'browser',
  },
};

/**
 * Reducer function for editor state updates
 */
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'OPEN_FILE': {
      // Check if file is already open
      const existingFile = state.openFiles.find(f => f.id === action.payload.id);
      if (existingFile) {
        // If already open, just switch to it
        return {
          ...state,
          activeFileId: action.payload.id,
        };
      }
      // Add new file and make it active
      return {
        ...state,
        openFiles: [...state.openFiles, action.payload],
        activeFileId: action.payload.id,
      };
    }

    case 'CLOSE_FILE': {
      const fileIndex = state.openFiles.findIndex(f => f.id === action.payload);
      if (fileIndex === -1) return state;

      const newOpenFiles = state.openFiles.filter(f => f.id !== action.payload);
      
      // If closing the active file, switch to another file
      let newActiveFileId = state.activeFileId;
      if (state.activeFileId === action.payload) {
        if (newOpenFiles.length > 0) {
          // Switch to the file before the closed one, or the first file if closing the first
          const newIndex = fileIndex > 0 ? fileIndex - 1 : 0;
          newActiveFileId = newOpenFiles[newIndex]?.id || null;
        } else {
          newActiveFileId = null;
        }
      }

      return {
        ...state,
        openFiles: newOpenFiles,
        activeFileId: newActiveFileId,
      };
    }

    case 'SWITCH_TAB': {
      // Only switch if the file exists
      const fileExists = state.openFiles.some(f => f.id === action.payload);
      if (!fileExists) return state;

      return {
        ...state,
        activeFileId: action.payload,
      };
    }

    case 'UPDATE_FILE_CONTENT': {
      return {
        ...state,
        openFiles: state.openFiles.map(file =>
          file.id === action.payload.id
            ? { ...file, content: action.payload.content }
            : file
        ),
      };
    }

    case 'MARK_FILE_DIRTY': {
      return {
        ...state,
        openFiles: state.openFiles.map(file =>
          file.id === action.payload.id
            ? { ...file, isDirty: action.payload.isDirty }
            : file
        ),
      };
    }

    case 'TOGGLE_SIDEBAR': {
      return {
        ...state,
        sidebarExpanded: !state.sidebarExpanded,
      };
    }

    case 'SET_SIDEBAR_PANEL': {
      // If clicking the same panel while expanded, collapse the sidebar
      if (state.sidebarExpanded && state.activeSidebarPanel === action.payload) {
        return {
          ...state,
          sidebarExpanded: false,
        };
      }
      // Otherwise, expand and switch to the new panel
      return {
        ...state,
        sidebarExpanded: true,
        activeSidebarPanel: action.payload,
      };
    }

    case 'TOGGLE_BOTTOM_PANEL': {
      return {
        ...state,
        bottomPanelExpanded: !state.bottomPanelExpanded,
      };
    }

    case 'SET_BOTTOM_PANEL_HEIGHT': {
      // Clamp height to valid range (150px min, 50% viewport max)
      const maxHeight = window.innerHeight * 0.5;
      const clampedHeight = Math.max(150, Math.min(action.payload, maxHeight));
      
      return {
        ...state,
        bottomPanelHeight: clampedHeight,
      };
    }

    case 'SET_BOTTOM_TAB': {
      return {
        ...state,
        activeBottomTab: action.payload,
      };
    }

    case 'SET_SELECTED_DATASET': {
      return {
        ...state,
        selectedDataset: action.payload,
      };
    }

    case 'SET_WORKSPACE': {
      return {
        ...state,
        workspace: action.payload,
      };
    }

    case 'CREATE_FILE': {
      if (!state.workspace) return state;
      try {
        const newFile = workspaceManager.createFile(
          action.payload.parentPath,
          action.payload.name,
          action.payload.content
        );
        workspaceManager.save(state.workspace);
        return {
          ...state,
          workspace: { ...state.workspace, root: workspaceManager.getRoot() },
        };
      } catch (error) {
        console.error('Failed to create file:', error);
        return state;
      }
    }

    case 'CREATE_FOLDER': {
      if (!state.workspace) return state;
      try {
        workspaceManager.createFolder(action.payload.parentPath, action.payload.name);
        workspaceManager.save(state.workspace);
        return {
          ...state,
          workspace: { ...state.workspace, root: workspaceManager.getRoot() },
        };
      } catch (error) {
        console.error('Failed to create folder:', error);
        return state;
      }
    }

    case 'DELETE_NODE': {
      if (!state.workspace) return state;
      try {
        workspaceManager.deleteNode(action.payload);
        workspaceManager.save(state.workspace);
        
        // Close file if it was open
        const newOpenFiles = state.openFiles.filter(f => f.path !== action.payload);
        let newActiveFileId = state.activeFileId;
        if (state.openFiles.some(f => f.path === action.payload && f.id === state.activeFileId)) {
          newActiveFileId = newOpenFiles.length > 0 ? newOpenFiles[0].id : null;
        }
        
        return {
          ...state,
          workspace: { ...state.workspace, root: workspaceManager.getRoot() },
          openFiles: newOpenFiles,
          activeFileId: newActiveFileId,
        };
      } catch (error) {
        console.error('Failed to delete node:', error);
        return state;
      }
    }

    case 'RENAME_NODE': {
      if (!state.workspace) return state;
      try {
        const oldPath = action.payload.path;
        workspaceManager.renameNode(oldPath, action.payload.newName);
        workspaceManager.save(state.workspace);
        
        // Update open files if renamed file was open
        const node = workspaceManager.findNode(action.payload.path);
        const newOpenFiles = state.openFiles.map(f => {
          if (f.path === oldPath && node) {
            return { ...f, path: node.path, name: node.name };
          }
          return f;
        });
        
        return {
          ...state,
          workspace: { ...state.workspace, root: workspaceManager.getRoot() },
          openFiles: newOpenFiles,
        };
      } catch (error) {
        console.error('Failed to rename node:', error);
        return state;
      }
    }

    case 'TOGGLE_FOLDER': {
      if (!state.workspace) return state;
      workspaceManager.toggleFolder(action.payload);
      return {
        ...state,
        workspace: { ...state.workspace, root: workspaceManager.getRoot() },
      };
    }

    case 'OPEN_FILE_FROM_WORKSPACE': {
      if (!state.workspace) return state;
      const content = workspaceManager.readFile(action.payload);
      if (content === null) return state;
      
      // Check if file is already open
      const existingFile = state.openFiles.find(f => f.path === action.payload);
      if (existingFile) {
        return {
          ...state,
          activeFileId: existingFile.id,
        };
      }
      
      // Create new file descriptor
      const node = workspaceManager.findNode(action.payload);
      if (!node || node.type !== 'file') return state;
      
      const newFile: FileDescriptor = {
        id: action.payload, // Use path as ID
        name: node.name,
        path: action.payload,
        language: (node.metadata?.language as 'python' | 'sql') || 'python',
        content,
        isDirty: false,
      };
      
      return {
        ...state,
        openFiles: [...state.openFiles, newFile],
        activeFileId: newFile.id,
      };
    }

    case 'SAVE_FILE': {
      if (!state.workspace) return state;
      const file = state.openFiles.find(f => f.id === action.payload);
      if (!file) return state;
      
      try {
        workspaceManager.writeFile(file.path, file.content);
        workspaceManager.save(state.workspace);
        
        return {
          ...state,
          openFiles: state.openFiles.map(f =>
            f.id === action.payload ? { ...f, isDirty: false } : f
          ),
        };
      } catch (error) {
        console.error('Failed to save file:', error);
        return state;
      }
    }

    case 'SAVE_ALL_FILES': {
      if (!state.workspace) return state;
      try {
        state.openFiles.forEach(file => {
          if (file.isDirty) {
            workspaceManager.writeFile(file.path, file.content);
          }
        });
        workspaceManager.save(state.workspace);
        
        return {
          ...state,
          openFiles: state.openFiles.map(f => ({ ...f, isDirty: false })),
        };
      } catch (error) {
        console.error('Failed to save all files:', error);
        return state;
      }
    }

    case 'TOGGLE_COMMAND_PALETTE': {
      return {
        ...state,
        commandPaletteOpen: !state.commandPaletteOpen,
      };
    }

    case 'SET_EXECUTING': {
      return {
        ...state,
        isExecuting: action.payload,
      };
    }

    case 'ADD_EXECUTION_OUTPUT': {
      return {
        ...state,
        executionOutput: [...state.executionOutput, action.payload],
      };
    }

    case 'CLEAR_EXECUTION_OUTPUT': {
      return {
        ...state,
        executionOutput: [],
      };
    }

    case 'ADD_TERMINAL_LINE': {
      return {
        ...state,
        terminalOutput: [...state.terminalOutput, action.payload],
      };
    }

    case 'CLEAR_TERMINAL': {
      return {
        ...state,
        terminalOutput: [],
      };
    }

    case 'ADD_TERMINAL_HISTORY': {
      return {
        ...state,
        terminalHistory: [...state.terminalHistory, action.payload],
      };
    }

    case 'UPDATE_CURSOR_POSITION': {
      return {
        ...state,
        cursorPosition: action.payload,
      };
    }

    case 'ADD_RECENT_COMMAND': {
      // Keep only last 10 commands
      const newRecent = [action.payload, ...state.recentCommands.filter(c => c !== action.payload)].slice(0, 10);
      return {
        ...state,
        recentCommands: newRecent,
      };
    }

    case 'UPDATE_EDITOR_SETTINGS': {
      const newSettings = { ...state.editorSettings, ...action.payload };
      // Save to localStorage
      try {
        localStorage.setItem('editorSettings', JSON.stringify(newSettings));
      } catch (error) {
        console.error('Failed to save editor settings:', error);
      }
      return {
        ...state,
        editorSettings: newSettings,
      };
    }

    default:
      return state;
  }
}

/**
 * Context type definition
 */
interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  // Existing convenience action functions
  openFile: (file: FileDescriptor) => void;
  closeFile: (fileId: string) => void;
  switchTab: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  markFileDirty: (fileId: string, isDirty: boolean) => void;
  toggleSidebar: () => void;
  setSidebarPanel: (panel: 'explorer' | 'search' | 'source-control' | 'extensions' | 'settings') => void;
  toggleBottomPanel: () => void;
  setBottomPanelHeight: (height: number) => void;
  setBottomTab: (tab: 'terminal' | 'output' | 'problems' | 'logs') => void;
  setSelectedDataset: (dataset: 'raw' | 'cleaned') => void;
  // New workspace action functions
  createFile: (parentPath: string, name: string, content?: string) => void;
  createFolder: (parentPath: string, name: string) => void;
  deleteNode: (path: string) => void;
  renameNode: (path: string, newName: string) => void;
  toggleFolder: (path: string) => void;
  openFileFromWorkspace: (path: string) => void;
  saveFile: (fileId: string) => void;
  saveAllFiles: () => void;
  // Command palette
  toggleCommandPalette: () => void;
  // Execution
  setExecuting: (isExecuting: boolean) => void;
  addExecutionOutput: (output: string) => void;
  clearExecutionOutput: () => void;
  // Terminal
  addTerminalLine: (line: TerminalLine) => void;
  clearTerminal: () => void;
  addTerminalHistory: (command: string) => void;
  // Editor
  updateCursorPosition: (line: number, column: number) => void;
  // Commands
  addRecentCommand: (commandId: string) => void;
  // Settings
  updateEditorSettings: (settings: Partial<EditorState['editorSettings']>) => void;
  // Formatting
  formatCode: (fileId: string) => void;
}

/**
 * Create the context
 */
const EditorContext = createContext<EditorContextType | undefined>(undefined);

/**
 * Provider component props
 */
interface EditorProviderProps {
  children: ReactNode;
  initialState?: Partial<EditorState>;
}

/**
 * Provider component that wraps the application
 */
export function EditorProvider({ children, initialState: customInitialState }: EditorProviderProps) {
  const [state, dispatch] = useReducer(
    editorReducer,
    customInitialState ? { ...initialState, ...customInitialState } : initialState
  );

  // Initialize workspace from localStorage on mount
  useEffect(() => {
    const workspace = workspaceManager.load();
    workspaceManager.setRoot(workspace.root);
    dispatch({ type: 'SET_WORKSPACE', payload: workspace });

    // Load editor settings from localStorage
    try {
      const savedSettings = localStorage.getItem('editorSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_EDITOR_SETTINGS', payload: settings });
      }
    } catch (error) {
      console.error('Failed to load editor settings:', error);
    }
  }, []);

  // Save workspace to localStorage whenever it changes
  useEffect(() => {
    if (state.workspace) {
      try {
        workspaceManager.save(state.workspace);
      } catch (error) {
        console.error('Failed to save workspace:', error);
      }
    }
  }, [state.workspace]);

  // Existing convenience action functions
  const openFile = (file: FileDescriptor) => {
    dispatch({ type: 'OPEN_FILE', payload: file });
  };

  const closeFile = (fileId: string) => {
    dispatch({ type: 'CLOSE_FILE', payload: fileId });
  };

  const switchTab = (fileId: string) => {
    dispatch({ type: 'SWITCH_TAB', payload: fileId });
  };

  const updateFileContent = (fileId: string, content: string) => {
    dispatch({ type: 'UPDATE_FILE_CONTENT', payload: { id: fileId, content } });
  };

  const markFileDirty = (fileId: string, isDirty: boolean) => {
    dispatch({ type: 'MARK_FILE_DIRTY', payload: { id: fileId, isDirty } });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setSidebarPanel = (panel: 'explorer' | 'search' | 'source-control' | 'extensions' | 'settings') => {
    dispatch({ type: 'SET_SIDEBAR_PANEL', payload: panel });
  };

  const toggleBottomPanel = () => {
    dispatch({ type: 'TOGGLE_BOTTOM_PANEL' });
  };

  const setBottomPanelHeight = (height: number) => {
    dispatch({ type: 'SET_BOTTOM_PANEL_HEIGHT', payload: height });
  };

  const setBottomTab = (tab: 'terminal' | 'output' | 'problems' | 'logs') => {
    dispatch({ type: 'SET_BOTTOM_TAB', payload: tab });
  };

  const setSelectedDataset = (dataset: 'raw' | 'cleaned') => {
    dispatch({ type: 'SET_SELECTED_DATASET', payload: dataset });
  };

  // New workspace action functions
  const createFile = (parentPath: string, name: string, content?: string) => {
    dispatch({ type: 'CREATE_FILE', payload: { parentPath, name, content } });
  };

  const createFolder = (parentPath: string, name: string) => {
    dispatch({ type: 'CREATE_FOLDER', payload: { parentPath, name } });
  };

  const deleteNode = (path: string) => {
    dispatch({ type: 'DELETE_NODE', payload: path });
  };

  const renameNode = (path: string, newName: string) => {
    dispatch({ type: 'RENAME_NODE', payload: { path, newName } });
  };

  const toggleFolder = (path: string) => {
    dispatch({ type: 'TOGGLE_FOLDER', payload: path });
  };

  const openFileFromWorkspace = (path: string) => {
    dispatch({ type: 'OPEN_FILE_FROM_WORKSPACE', payload: path });
  };

  const saveFile = (fileId: string) => {
    dispatch({ type: 'SAVE_FILE', payload: fileId });
  };

  const saveAllFiles = () => {
    dispatch({ type: 'SAVE_ALL_FILES' });
  };

  // Command palette
  const toggleCommandPalette = () => {
    dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
  };

  // Execution
  const setExecuting = (isExecuting: boolean) => {
    dispatch({ type: 'SET_EXECUTING', payload: isExecuting });
  };

  const addExecutionOutput = (output: string) => {
    dispatch({ type: 'ADD_EXECUTION_OUTPUT', payload: output });
  };

  const clearExecutionOutput = () => {
    dispatch({ type: 'CLEAR_EXECUTION_OUTPUT' });
  };

  // Terminal
  const addTerminalLine = (line: TerminalLine) => {
    dispatch({ type: 'ADD_TERMINAL_LINE', payload: line });
  };

  const clearTerminal = () => {
    dispatch({ type: 'CLEAR_TERMINAL' });
  };

  const addTerminalHistory = (command: string) => {
    dispatch({ type: 'ADD_TERMINAL_HISTORY', payload: command });
  };

  // Editor
  const updateCursorPosition = (line: number, column: number) => {
    dispatch({ type: 'UPDATE_CURSOR_POSITION', payload: { line, column } });
  };

  // Commands
  const addRecentCommand = (commandId: string) => {
    dispatch({ type: 'ADD_RECENT_COMMAND', payload: commandId });
  };

  // Settings
  const updateEditorSettings = (settings: Partial<EditorState['editorSettings']>) => {
    dispatch({ type: 'UPDATE_EDITOR_SETTINGS', payload: settings });
  };

  // Format code
  const formatCode = (fileId: string) => {
    const file = state.openFiles.find(f => f.id === fileId);
    if (!file) return;

    if (FormatterService.canFormat(file.language)) {
      const formatted = FormatterService.format(
        file.content,
        file.language,
        state.editorSettings.tabSize
      );
      updateFileContent(fileId, formatted);
      console.log('✨ Code formatted:', file.path);
    }
  };

  const value: EditorContextType = {
    state,
    dispatch,
    openFile,
    closeFile,
    switchTab,
    updateFileContent,
    markFileDirty,
    toggleSidebar,
    setSidebarPanel,
    toggleBottomPanel,
    setBottomPanelHeight,
    setBottomTab,
    setSelectedDataset,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    toggleFolder,
    openFileFromWorkspace,
    saveFile,
    saveAllFiles,
    toggleCommandPalette,
    setExecuting,
    addExecutionOutput,
    clearExecutionOutput,
    addTerminalLine,
    clearTerminal,
    addTerminalHistory,
    updateCursorPosition,
    addRecentCommand,
    updateEditorSettings,
    formatCode,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

/**
 * Custom hook to use the editor context
 * 
 * @throws Error if used outside of EditorProvider
 */
export function useEditor(): EditorContextType {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
