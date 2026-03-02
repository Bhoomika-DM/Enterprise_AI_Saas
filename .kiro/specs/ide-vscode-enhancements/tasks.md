# Implementation Plan: IDE VS Code Enhancements

## Overview

This implementation plan transforms the Data Scientist IDE into a fully functional VS Code-like environment by adding seven major feature areas. The implementation follows an incremental approach, building core infrastructure first (workspace management, state management), then adding UI components (file explorer, menu bar, status bar), and finally integrating execution and terminal features. Each task builds on previous work, with checkpoints to ensure stability.

## Tasks

- [ ] 1. Set up workspace management infrastructure
  - [x] 1.1 Create WorkspaceManager service with file system operations
    - Implement WorkspaceManager class with methods: createFile, createFolder, deleteNode, renameNode, readFile, writeFile, findNode
    - Implement localStorage persistence (save/load methods)
    - Create default workspace structure with example files
    - Add file type detection and language mapping utilities
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 1.2 Write property tests for WorkspaceManager
    - **Property 22: Workspace persistence round-trip**
    - **Validates: Requirements 6.1**
  
  - [ ] 1.3 Write property tests for workspace operations
    - **Property 23: Workspace operation persistence**
    - **Validates: Requirements 6.2, 6.3, 6.4, 6.5**
  
  - [ ] 1.4 Write unit tests for WorkspaceManager edge cases
    - Test invalid file names, duplicate names, file not found errors
    - Test localStorage quota exceeded and unavailable scenarios
    - _Requirements: 6.6_

- [ ] 2. Extend EditorContext for IDE state management
  - [x] 2.1 Add workspace state to EditorContext
    - Extend EditorContextState interface with workspace, openFiles, UI visibility states
    - Add action methods: createFile, createFolder, deleteNode, renameNode, openFile, closeFile, saveFile
    - Integrate WorkspaceManager into EditorContext
    - Add localStorage initialization on context load
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ] 2.2 Write property tests for EditorContext state consistency
    - **Property 28: Context state consistency**
    - **Validates: Requirements 8.1, 8.2, 8.3**
  
  - [ ] 2.3 Write property tests for EditorContext initialization
    - **Property 29: Context initialization from storage**
    - **Validates: Requirements 8.4**
  
  - [ ] 2.4 Write unit tests for EditorContext actions
    - Test file operations, UI toggles, state updates
    - Test error handling and recovery
    - _Requirements: 8.1, 8.2, 8.3_

- [ ] 3. Checkpoint - Ensure workspace and state management tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement FileExplorer component
  - [x] 4.1 Create FileTreeNode component for recursive tree rendering
    - Implement FileTreeNode with expand/collapse functionality
    - Add file/folder icons based on file type
    - Add click handlers for files (open) and folders (toggle)
    - Add indentation based on tree depth
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  
  - [x] 4.2 Create ContextMenu component for file operations
    - Implement right-click context menu with options: New File, New Folder, Delete, Rename
    - Add modal dialogs for name input (create, rename)
    - Add confirmation dialog for delete operations
    - Wire up to EditorContext actions
    - _Requirements: 1.4_
  
  - [x] 4.3 Create FileExplorer container component
    - Integrate FileTreeNode and ContextMenu
    - Connect to EditorContext for workspace state
    - Add empty workspace message
    - Style with VS Code Dark+ theme
    - _Requirements: 1.1, 1.6_
  
  - [ ] 4.4 Write property tests for FileExplorer
    - **Property 1: Workspace tree rendering**
    - **Property 2: Folder expansion toggle**
    - **Property 3: File opening**
    - **Property 4: Context menu display**
    - **Property 5: File icon mapping**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
  
  - [ ] 4.5 Write unit tests for FileExplorer edge cases
    - Test empty workspace, single file, deeply nested folders
    - Test context menu positioning and keyboard navigation
    - _Requirements: 1.6_

- [ ] 5. Implement TopMenuBar component
  - [x] 5.1 Create Menu and MenuItem components
    - Implement Menu component with dropdown functionality
    - Implement MenuItem with label, shortcut display, and click handler
    - Add keyboard navigation (arrow keys, Enter, Escape)
    - Style with VS Code Dark+ theme
    - _Requirements: 2.1, 2.2_
  
  - [x] 5.2 Create command registry and handler system
    - Define COMMAND_REGISTRY with all IDE commands
    - Implement command handler that routes to EditorContext actions
    - Add keyboard shortcut listener for global shortcuts
    - _Requirements: 2.3, 2.4, 2.5, 2.6_
  
  - [x] 5.3 Create TopMenuBar container with all menus
    - Implement File, Edit, View, Run, and Help menus
    - Wire up menu items to command handler
    - Add menu bar styling and layout
    - _Requirements: 2.1_
  
  - [ ] 5.4 Write property tests for TopMenuBar
    - **Property 6: Menu dropdown display**
    - **Property 7: File save persistence**
    - **Property 8: View toggle commands**
    - **Property 9: Editor command execution**
    - **Validates: Requirements 2.2, 2.4, 2.5, 2.6**
  
  - [ ] 5.5 Write unit tests for menu interactions
    - Test menu opening/closing, keyboard navigation
    - Test command execution for each menu item
    - _Requirements: 2.3, 2.4, 2.5, 2.6_

- [ ] 6. Checkpoint - Ensure FileExplorer and TopMenuBar tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement StatusBar component
  - [x] 7.1 Create StatusBar with file attribute display
    - Implement StatusBar component with sections: language, position, encoding, line ending, git branch
    - Connect to EditorContext for active file information
    - Add cursor position tracking from CodeMirror editor
    - Style with VS Code Dark+ theme
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 7.2 Add interactive status bar items
    - Make language, encoding, and line ending items clickable
    - Implement dropdown/modal for changing settings
    - Update EditorContext when settings change
    - _Requirements: 4.6_
  
  - [ ] 7.3 Write property tests for StatusBar
    - **Property 15: File attribute display**
    - **Property 16: Cursor position tracking**
    - **Property 17: Git branch display**
    - **Property 18: Status bar item interactivity**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**
  
  - [ ] 7.4 Write unit tests for StatusBar
    - Test attribute display for different file types
    - Test cursor position updates
    - Test clickable item interactions
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6_

- [ ] 8. Implement CommandPalette component
  - [x] 8.1 Create CommandPalette modal component
    - Implement modal overlay with search input
    - Implement command list with filtering
    - Add keyboard navigation (up/down arrows, Enter, Escape)
    - Connect to command registry from TopMenuBar
    - _Requirements: 5.1, 5.2_
  
  - [ ] 8.2 Add command search and filtering
    - Implement fuzzy search across command labels and keywords
    - Display recent commands at top of list
    - Group commands by category
    - _Requirements: 5.3, 5.5_
  
  - [ ] 8.3 Wire up command execution and palette lifecycle
    - Execute selected command and close palette
    - Track recent commands in EditorContext
    - Add Ctrl+Shift+P keyboard shortcut
    - Style with VS Code Dark+ theme
    - _Requirements: 5.4, 5.6_
  
  - [ ] 8.4 Write property tests for CommandPalette
    - **Property 19: Command search filtering**
    - **Property 20: Command execution and closure**
    - **Property 21: Recent commands ordering**
    - **Validates: Requirements 5.3, 5.4, 5.5**
  
  - [ ] 8.5 Write unit tests for CommandPalette
    - Test keyboard shortcuts, search filtering, command execution
    - Test recent commands tracking
    - _Requirements: 5.1, 5.2, 5.6_

- [ ] 9. Checkpoint - Ensure StatusBar and CommandPalette tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement ExecutionService for code execution
  - [ ] 10.1 Create ExecutionService with mock execution
    - Implement ExecutionService class with executePython and executeSQL methods
    - Create mock execution that simulates output (for MVP)
    - Add execution timeout handling (30 seconds)
    - Add error capture and formatting
    - _Requirements: 3.2, 3.5, 3.6_
  
  - [ ] 10.2 Add execution state to EditorContext
    - Add isExecuting, executionOutput to EditorContext state
    - Add executeCode and stopExecution actions
    - Integrate ExecutionService into EditorContext
    - _Requirements: 3.2_
  
  - [ ] 10.3 Write unit tests for ExecutionService
    - Test Python and SQL execution
    - Test timeout handling and error capture
    - Test execution cancellation
    - _Requirements: 3.2, 3.5, 3.6_

- [ ] 11. Implement RunControls component
  - [x] 11.1 Create RunControls with run/stop buttons
    - Implement RunControls component with play and stop buttons
    - Add run type dropdown (Python, SQL, Auto)
    - Show run button when idle, stop button when executing
    - Position in top-right of editor area
    - _Requirements: 3.1, 3.3_
  
  - [ ] 11.2 Wire up code execution
    - Connect run button to EditorContext executeCode action
    - Connect stop button to stopExecution action
    - Detect file language and set default run type
    - Style with VS Code Dark+ theme
    - _Requirements: 3.2, 3.5_
  
  - [ ] 11.3 Write property tests for RunControls
    - **Property 10: Run button visibility and execution state**
    - **Property 11: Code execution trigger**
    - **Property 13: Interpreter selection**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.5**
  
  - [ ] 11.4 Write unit tests for RunControls
    - Test button visibility based on file type and execution state
    - Test run type dropdown selection
    - _Requirements: 3.1, 3.3, 3.5_

- [ ] 12. Enhance BottomPanel with Terminal component
  - [x] 12.1 Create Terminal component with command execution
    - Implement Terminal component with command input and output display
    - Add command history navigation (up/down arrows)
    - Implement built-in commands: clear, help, ls, pwd, cat
    - Style output with type-based formatting (input, output, error)
    - _Requirements: 7.1, 7.2, 7.4, 7.5_
  
  - [ ] 12.2 Integrate execution output into Terminal
    - Route code execution output to Terminal
    - Display errors in distinguishable format
    - Add terminal state to EditorContext
    - _Requirements: 7.3, 7.6_
  
  - [ ] 12.3 Enhance Output and Problems tabs
    - Update Output tab to show execution output
    - Update Problems tab to show execution errors with file locations
    - Add error indicators in editor gutter
    - _Requirements: 3.4, 3.6_
  
  - [ ] 12.4 Write property tests for Terminal
    - **Property 24: Terminal command execution**
    - **Property 25: Execution output routing**
    - **Property 26: Command history navigation**
    - **Property 27: Error output formatting**
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.6**
  
  - [ ] 12.5 Write property tests for execution output
    - **Property 12: Execution output display**
    - **Property 14: Error output routing**
    - **Validates: Requirements 3.4, 3.6**
  
  - [ ] 12.6 Write unit tests for Terminal
    - Test built-in commands, history navigation, output formatting
    - Test integration with execution output
    - _Requirements: 7.1, 7.2, 7.5_

- [ ] 13. Checkpoint - Ensure execution and terminal tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Integrate all components into DataScientistIDE
  - [ ] 14.1 Update DataScientistIDE layout with new components
    - Add TopMenuBar at the top
    - Replace Sidebar placeholder with FileExplorer
    - Add RunControls to editor area
    - Replace StatusBar with enhanced version
    - Add CommandPalette modal overlay
    - Update BottomPanel with functional Terminal
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 7.1_
  
  - [ ] 14.2 Wire up keyboard shortcuts globally
    - Add global keyboard listener for shortcuts (Ctrl+S, Ctrl+N, Ctrl+Shift+P, F5, etc.)
    - Route shortcuts to command handler
    - Handle shortcut conflicts (editor vs global)
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 5.1_
  
  - [ ] 14.3 Add panel visibility toggles
    - Implement sidebar and bottom panel visibility state
    - Add toggle buttons and keyboard shortcuts
    - Persist visibility state to localStorage
    - _Requirements: 2.5_
  
  - [ ] 14.4 Write integration tests for end-to-end flows
    - Test: Create file → Edit → Save → Reload → Verify persisted
    - Test: Create folder → Create file inside → Delete folder → Verify removed
    - Test: Open file → Run code → Verify output in terminal
    - Test: Command palette → Execute command → Verify action
    - Test: Toggle panels → Verify visibility → Verify persisted
    - _Requirements: 1.1, 1.2, 1.3, 2.4, 3.2, 3.4, 5.4, 6.1, 6.2, 6.4_

- [ ] 15. Add error handling and edge cases
  - [ ] 15.1 Implement file system error handling
    - Add error toasts for file not found, invalid name, duplicate name
    - Add delete confirmation dialogs
    - Add error recovery for invalid state
    - _Requirements: 6.2, 6.3, 6.4_
  
  - [ ] 15.2 Implement localStorage error handling
    - Add quota exceeded warning and cleanup strategy
    - Add localStorage unavailable warning banner
    - Add corrupted data recovery with fallback to default workspace
    - _Requirements: 6.6_
  
  - [ ] 15.3 Implement execution error handling
    - Add execution timeout with automatic stop
    - Add runtime error display in Problems tab
    - Add unsupported file type handling
    - _Requirements: 3.6_
  
  - [ ] 15.4 Write unit tests for error handling
    - Test all error conditions and recovery strategies
    - Test error messages and user feedback
    - _Requirements: 6.6, 3.6_

- [ ] 16. Final checkpoint - Ensure all tests pass and integration works
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (29 properties total)
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end user flows
- The implementation uses TypeScript and React with the existing CodeMirror editor
- All components follow VS Code Dark+ theme for visual consistency
