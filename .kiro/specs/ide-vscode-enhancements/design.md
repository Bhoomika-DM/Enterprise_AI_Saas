# Design Document: IDE VS Code Enhancements

## Overview

This design transforms the Data Scientist IDE from a basic editor into a fully functional VS Code-like integrated development environment. The enhancement adds seven major feature areas: a functional file explorer with tree navigation, a top menu bar with standard IDE menus, run/debug controls for code execution, an enhanced status bar with contextual information, a command palette for quick command access, workspace management with localStorage persistence, and terminal integration for command execution.

The design maintains the existing CodeMirror editor and VS Code Dark+ theme while adding new components that integrate seamlessly through the existing EditorContext state management system. All features are implemented as React components with TypeScript for type safety.

## Architecture

### High-Level Component Structure

```
DataScientistIDE (root)
├── TopMenuBar (new)
│   ├── FileMenu
│   ├── EditMenu
│   ├── ViewMenu
│   ├── RunMenu
│   └── HelpMenu
├── Sidebar (enhanced)
│   └── FileExplorer (new)
│       ├── FileTreeNode
│       └── ContextMenu
├── EditorArea
│   ├── RunControls (new)
│   └── CodeMirrorEditor (existing)
├── BottomPanel (enhanced)
│   ├── Terminal (new - functional)
│   ├── Output (enhanced)
│   ├── Problems (enhanced)
│   └── Logs (existing)
├── StatusBar (enhanced)
└── CommandPalette (new - modal overlay)
```

### State Management Architecture

The design extends the existing EditorContext to manage all IDE state:

```typescript
interface EditorState {
  // Existing state
  activeFile: string | null;
  
  // New workspace state
  workspace: WorkspaceState;
  openFiles: OpenFile[];
  activeFileIndex: number;
  
  // UI state
  sidebarVisible: boolean;
  bottomPanelVisible: boolean;
  commandPaletteOpen: boolean;
  
  // Execution state
  isExecuting: boolean;
  executionOutput: string[];
  
  // Terminal state
  terminalHistory: string[];
  terminalOutput: TerminalLine[];
}

interface WorkspaceState {
  root: FileNode;
  version: number; // for localStorage versioning
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string; // for files only
  expanded?: boolean; // for folders only
}

interface OpenFile {
  path: string;
  content: string;
  isDirty: boolean;
  language: string;
}

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: number;
}
```

### Data Flow

1. **File Operations**: User action → FileExplorer → EditorContext → Workspace update → localStorage persistence → UI re-render
2. **Code Execution**: Run button → EditorContext → Execution service → Output → BottomPanel Terminal
3. **Command Palette**: Keyboard shortcut → CommandPalette modal → Command execution → EditorContext update
4. **Status Bar**: Editor cursor move → EditorContext → StatusBar update

## Components and Interfaces

### 1. FileExplorer Component

**Purpose**: Display and manage the workspace file tree structure.

**Props**:
```typescript
interface FileExplorerProps {
  workspace: WorkspaceState;
  onFileClick: (path: string) => void;
  onFileCreate: (parentPath: string, name: string, type: 'file' | 'folder') => void;
  onFileDelete: (path: string) => void;
  onFileRename: (path: string, newName: string) => void;
  onFolderToggle: (path: string) => void;
}
```

**Key Methods**:
- `renderFileTree(node: FileNode, depth: number): JSX.Element` - Recursively renders the file tree
- `handleContextMenu(event: MouseEvent, node: FileNode)` - Shows context menu on right-click
- `getFileIcon(fileName: string): string` - Returns appropriate icon based on file extension

**File Type Icons**:
- `.py` → Python icon
- `.sql` → Database icon
- `.json` → JSON icon
- `.md` → Markdown icon
- `.csv` → Table icon
- Default → File icon

### 2. TopMenuBar Component

**Purpose**: Provide menu-based access to IDE commands.

**Props**:
```typescript
interface TopMenuBarProps {
  onCommand: (command: string, args?: any) => void;
}
```

**Menu Structure**:
```typescript
interface MenuItem {
  label: string;
  command?: string;
  shortcut?: string;
  separator?: boolean;
  submenu?: MenuItem[];
}

const FILE_MENU: MenuItem[] = [
  { label: 'New File', command: 'file.new', shortcut: 'Ctrl+N' },
  { label: 'Open File', command: 'file.open', shortcut: 'Ctrl+O' },
  { separator: true },
  { label: 'Save', command: 'file.save', shortcut: 'Ctrl+S' },
  { label: 'Save All', command: 'file.saveAll', shortcut: 'Ctrl+K S' },
];

const EDIT_MENU: MenuItem[] = [
  { label: 'Undo', command: 'editor.undo', shortcut: 'Ctrl+Z' },
  { label: 'Redo', command: 'editor.redo', shortcut: 'Ctrl+Y' },
  { separator: true },
  { label: 'Cut', command: 'editor.cut', shortcut: 'Ctrl+X' },
  { label: 'Copy', command: 'editor.copy', shortcut: 'Ctrl+C' },
  { label: 'Paste', command: 'editor.paste', shortcut: 'Ctrl+V' },
];

const VIEW_MENU: MenuItem[] = [
  { label: 'Command Palette', command: 'commandPalette.open', shortcut: 'Ctrl+Shift+P' },
  { separator: true },
  { label: 'Toggle Sidebar', command: 'view.toggleSidebar', shortcut: 'Ctrl+B' },
  { label: 'Toggle Bottom Panel', command: 'view.toggleBottomPanel', shortcut: 'Ctrl+J' },
];

const RUN_MENU: MenuItem[] = [
  { label: 'Run Python File', command: 'run.python', shortcut: 'F5' },
  { label: 'Run SQL Query', command: 'run.sql', shortcut: 'Shift+F5' },
  { separator: true },
  { label: 'Stop Execution', command: 'run.stop', shortcut: 'Shift+F5' },
];
```

### 3. RunControls Component

**Purpose**: Provide UI controls for executing code.

**Props**:
```typescript
interface RunControlsProps {
  language: string | null;
  isExecuting: boolean;
  onRun: (runType: RunType) => void;
  onStop: () => void;
}

type RunType = 'python' | 'sql' | 'auto';
```

**UI Elements**:
- Play button (▶) - Executes current file
- Stop button (■) - Terminates execution (shown only when executing)
- Dropdown - Selects run type (Python, SQL, Auto-detect)

**Positioning**: Absolute positioned in top-right of editor area, similar to VS Code.

### 4. StatusBar Component (Enhanced)

**Purpose**: Display contextual information about the current file and editor state.

**Props**:
```typescript
interface StatusBarProps {
  language: string | null;
  lineNumber: number;
  columnNumber: number;
  encoding: string;
  lineEnding: 'LF' | 'CRLF';
  gitBranch?: string;
  onItemClick: (item: StatusBarItem) => void;
}

type StatusBarItem = 'language' | 'position' | 'encoding' | 'lineEnding' | 'git';
```

**Layout** (left to right):
1. Language indicator (e.g., "Python")
2. Line:Column position (e.g., "Ln 42, Col 15")
3. Encoding (e.g., "UTF-8")
4. Line ending (e.g., "LF")
5. Git branch (e.g., "main") - if available

**Clickable Items**:
- Language → Opens language selector
- Encoding → Opens encoding selector
- Line ending → Toggles LF/CRLF

### 5. CommandPalette Component

**Purpose**: Provide quick access to all IDE commands through search.

**Props**:
```typescript
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (command: Command) => void;
  recentCommands: Command[];
}

interface Command {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  keywords?: string[];
}
```

**Key Features**:
- Fuzzy search across command labels and keywords
- Recent commands shown first
- Category grouping (File, Edit, View, Run, etc.)
- Keyboard navigation (up/down arrows, Enter to execute)
- Escape to close

**Command Registry**:
```typescript
const COMMAND_REGISTRY: Command[] = [
  { id: 'file.new', label: 'New File', category: 'File', shortcut: 'Ctrl+N' },
  { id: 'file.save', label: 'Save', category: 'File', shortcut: 'Ctrl+S' },
  { id: 'view.toggleSidebar', label: 'Toggle Sidebar', category: 'View', shortcut: 'Ctrl+B' },
  { id: 'run.python', label: 'Run Python File', category: 'Run', shortcut: 'F5' },
  // ... all other commands
];
```

### 6. WorkspaceManager Service

**Purpose**: Manage file system operations and localStorage persistence.

**Interface**:
```typescript
class WorkspaceManager {
  private root: FileNode;
  private storageKey = 'ide-workspace-v1';
  
  // Initialization
  load(): WorkspaceState;
  save(workspace: WorkspaceState): void;
  
  // File operations
  createFile(parentPath: string, name: string, content?: string): FileNode;
  createFolder(parentPath: string, name: string): FileNode;
  deleteNode(path: string): void;
  renameNode(path: string, newName: string): void;
  moveNode(sourcePath: string, targetPath: string): void;
  
  // File content
  readFile(path: string): string | null;
  writeFile(path: string, content: string): void;
  
  // Tree operations
  findNode(path: string): FileNode | null;
  getParentPath(path: string): string;
  toggleFolder(path: string): void;
  
  // Utilities
  getFileExtension(fileName: string): string;
  getLanguageFromExtension(extension: string): string;
}
```

**localStorage Schema**:
```typescript
interface StoredWorkspace {
  version: number;
  timestamp: number;
  root: FileNode;
  openFiles: string[]; // paths of open files
  activeFile: string | null;
}
```

**Default Workspace** (created on first load):
```
workspace/
├── examples/
│   ├── hello.py
│   ├── query.sql
│   └── data.csv
└── README.md
```

### 7. Terminal Component

**Purpose**: Provide an interactive terminal for command execution.

**Props**:
```typescript
interface TerminalProps {
  history: string[];
  output: TerminalLine[];
  onCommand: (command: string) => void;
  onClear: () => void;
}
```

**Key Features**:
- Command input with prompt (e.g., `$ `)
- Command history navigation (up/down arrows)
- Output display with type-based styling (input, output, error)
- Built-in commands: `clear`, `help`, `ls`, `pwd`, `cat <file>`
- Integration with code execution output

**Command Execution Flow**:
1. User types command and presses Enter
2. Command added to history
3. Command parsed and executed
4. Output added to terminal output array
5. Terminal scrolls to bottom

### 8. ExecutionService

**Purpose**: Execute Python and SQL code and capture output.

**Interface**:
```typescript
class ExecutionService {
  async executePython(code: string): Promise<ExecutionResult>;
  async executeSQL(query: string): Promise<ExecutionResult>;
  stop(): void;
}

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}
```

**Implementation Notes**:
- For MVP, use mock execution that simulates output
- Future: Integrate with backend API for actual code execution
- Python: Use Pyodide (WebAssembly Python) for client-side execution
- SQL: Use sql.js (SQLite in WebAssembly) for client-side execution

## Data Models

### FileNode (Tree Structure)

```typescript
interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string; // full path from workspace root
  children?: FileNode[]; // only for folders
  content?: string; // only for files
  expanded?: boolean; // only for folders
  metadata?: FileMetadata;
}

interface FileMetadata {
  created: number; // timestamp
  modified: number; // timestamp
  size: number; // bytes
  language?: string; // detected language
}
```

**Path Format**: Use forward slashes, relative to workspace root
- Example: `examples/hello.py`
- Root folder: `/` or empty string

**Tree Operations**:
- Insert: Add node to parent's children array, sort alphabetically (folders first)
- Delete: Remove node from parent's children array
- Rename: Update node name and path, recursively update children paths
- Move: Remove from old parent, add to new parent

### Command Model

```typescript
interface Command {
  id: string; // unique identifier (e.g., 'file.new')
  label: string; // display name (e.g., 'New File')
  category: string; // grouping (e.g., 'File')
  shortcut?: string; // keyboard shortcut (e.g., 'Ctrl+N')
  keywords?: string[]; // search keywords
  handler: (args?: any) => void | Promise<void>;
  enabled?: () => boolean; // conditional availability
}
```

### EditorContext State Model

```typescript
interface EditorContextState {
  // Workspace
  workspace: WorkspaceState;
  
  // Open files
  openFiles: OpenFile[];
  activeFileIndex: number;
  
  // UI visibility
  sidebarVisible: boolean;
  bottomPanelVisible: boolean;
  bottomPanelTab: 'terminal' | 'output' | 'problems' | 'logs';
  commandPaletteOpen: boolean;
  
  // Execution
  isExecuting: boolean;
  executionOutput: string[];
  
  // Terminal
  terminalHistory: string[];
  terminalOutput: TerminalLine[];
  
  // Status bar
  cursorPosition: { line: number; column: number };
  
  // Recent commands
  recentCommands: string[];
}

interface EditorContextActions {
  // Workspace operations
  createFile: (parentPath: string, name: string) => void;
  createFolder: (parentPath: string, name: string) => void;
  deleteNode: (path: string) => void;
  renameNode: (path: string, newName: string) => void;
  
  // File operations
  openFile: (path: string) => void;
  closeFile: (index: number) => void;
  saveFile: (index: number) => void;
  saveAllFiles: () => void;
  setActiveFile: (index: number) => void;
  updateFileContent: (index: number, content: string) => void;
  
  // UI operations
  toggleSidebar: () => void;
  toggleBottomPanel: () => void;
  setBottomPanelTab: (tab: string) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  
  // Execution operations
  executeCode: (runType: RunType) => Promise<void>;
  stopExecution: () => void;
  
  // Terminal operations
  executeTerminalCommand: (command: string) => void;
  clearTerminal: () => void;
  
  // Command operations
  executeCommand: (commandId: string, args?: any) => void;
  addRecentCommand: (commandId: string) => void;
  
  // Editor operations
  updateCursorPosition: (line: number, column: number) => void;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### File Explorer Properties

Property 1: Workspace tree rendering
*For any* workspace structure, when the IDE loads, the File_Explorer should render all files and folders in the correct hierarchical structure with proper nesting.
**Validates: Requirements 1.1**

Property 2: Folder expansion toggle
*For any* folder in the workspace, clicking on it should toggle its expanded state (expanded → collapsed, collapsed → expanded).
**Validates: Requirements 1.2**

Property 3: File opening
*For any* file in the workspace, clicking on it should open that file in the editor with its content displayed.
**Validates: Requirements 1.3**

Property 4: Context menu display
*For any* file or folder node, right-clicking should display a context menu containing the options: New File, New Folder, Delete, and Rename.
**Validates: Requirements 1.4**

Property 5: File icon mapping
*For any* file with a given extension, the File_Explorer should display the correct icon corresponding to that file type (e.g., Python icon for .py files, SQL icon for .sql files).
**Validates: Requirements 1.5**

### Menu Bar Properties

Property 6: Menu dropdown display
*For any* menu item in the Top_Menu_Bar, clicking on it should display a dropdown containing its associated commands.
**Validates: Requirements 2.2**

Property 7: File save persistence
*For any* file with content, selecting "Save" from the File menu should persist that file's content to the Workspace and localStorage.
**Validates: Requirements 2.4**

Property 8: View toggle commands
*For any* view toggle command (Toggle Sidebar, Toggle Bottom Panel), executing it should change the visibility state of the corresponding panel.
**Validates: Requirements 2.5**

Property 9: Editor command execution
*For any* edit command (Undo, Redo, Cut, Copy, Paste), selecting it from the Edit menu should execute the corresponding editor operation.
**Validates: Requirements 2.6**

### Run Controls Properties

Property 10: Run button visibility and execution state
*For any* file containing Python or SQL code, the Run_Controls should display a run button when idle and a stop button when code is executing.
**Validates: Requirements 3.1, 3.3**

Property 11: Code execution trigger
*For any* executable file (Python or SQL), clicking the run button should execute the file's code.
**Validates: Requirements 3.2**

Property 12: Execution output display
*For any* code execution that produces output, the output should appear in the Bottom_Panel Terminal or Output tab.
**Validates: Requirements 3.4**

Property 13: Interpreter selection
*For any* run type selection (Python, SQL), executing code should use the selected interpreter.
**Validates: Requirements 3.5**

Property 14: Error output routing
*For any* code execution that produces errors, the error messages should appear in the Bottom_Panel Problems tab.
**Validates: Requirements 3.6**

### Status Bar Properties

Property 15: File attribute display
*For any* open file, the Status_Bar should display all file attributes: programming language, encoding, and line ending type.
**Validates: Requirements 4.1, 4.3, 4.4**

Property 16: Cursor position tracking
*For any* cursor movement in the editor, the Status_Bar should update to show the current line and column position.
**Validates: Requirements 4.2**

Property 17: Git branch display
*For any* workspace with Git repository detection, the Status_Bar should display the current branch name.
**Validates: Requirements 4.5**

Property 18: Status bar item interactivity
*For any* clickable Status_Bar item, clicking on it should display options to change that setting (where applicable).
**Validates: Requirements 4.6**

### Command Palette Properties

Property 19: Command search filtering
*For any* search query entered in the Command_Palette, the displayed commands should be filtered to only show commands matching the query.
**Validates: Requirements 5.3**

Property 20: Command execution and closure
*For any* command selected in the Command_Palette, the IDE should execute that command and close the Command_Palette.
**Validates: Requirements 5.4**

Property 21: Recent commands ordering
*For any* Command_Palette opening, recently used commands should appear at the top of the command list.
**Validates: Requirements 5.5**

### Workspace Management Properties

Property 22: Workspace persistence round-trip
*For any* workspace state, saving to localStorage and then reloading the IDE should restore the exact same workspace structure and file contents.
**Validates: Requirements 6.1**

Property 23: Workspace operation persistence
*For any* workspace operation (create file/folder, rename, delete, modify content), the change should be immediately persisted to localStorage.
**Validates: Requirements 6.2, 6.3, 6.4, 6.5**

### Terminal Properties

Property 24: Terminal command execution
*For any* command entered in the Terminal, pressing Enter should execute the command and display the output.
**Validates: Requirements 7.2**

Property 25: Execution output routing
*For any* code executed via Run_Controls, the output should appear in the Terminal.
**Validates: Requirements 7.3**

Property 26: Command history navigation
*For any* Terminal with command history, pressing the up arrow key should display the previous command from history.
**Validates: Requirements 7.4**

Property 27: Error output formatting
*For any* command execution that produces an error, the Terminal should display the error message in a visually distinguishable format (different color or styling).
**Validates: Requirements 7.6**

### State Management Properties

Property 28: Context state consistency
*For any* state change in the IDE, the Editor_Context should maintain consistent state across all components (File_Explorer, editor, Status_Bar, etc.).
**Validates: Requirements 8.1, 8.2, 8.3**

Property 29: Context initialization from storage
*For any* IDE load, the Editor_Context should initialize with the persisted state from localStorage (if available).
**Validates: Requirements 8.4**

## Error Handling

### File System Errors

**File Not Found**:
- When attempting to open a file that doesn't exist, display error toast: "File not found: {path}"
- Remove the file from openFiles list if it was previously open

**Invalid File Name**:
- When creating/renaming with invalid characters (/, \, :, *, ?, ", <, >, |), display error: "Invalid file name: {name}"
- Prevent the operation and keep existing state

**Duplicate Name**:
- When creating a file/folder with a name that already exists in the same directory, display error: "A file or folder with this name already exists"
- Prompt user to choose a different name

**Delete Confirmation**:
- When deleting a file/folder, show confirmation dialog: "Are you sure you want to delete {name}?"
- For folders with children, warn: "This folder contains {count} items. Are you sure?"

### localStorage Errors

**Quota Exceeded**:
- When localStorage quota is exceeded, display warning: "Storage quota exceeded. Some changes may not be saved."
- Implement cleanup strategy: remove oldest unused files first
- Offer option to export workspace as JSON file

**localStorage Unavailable**:
- When localStorage is not available (private browsing, disabled), display warning: "Browser storage is unavailable. Your work will not be saved between sessions."
- Continue operating with in-memory storage only
- Show persistent warning banner in UI

**Corrupted Data**:
- When loading corrupted workspace data, display error: "Workspace data is corrupted. Loading default workspace."
- Fall back to default workspace structure
- Offer option to restore from backup (if available)

### Execution Errors

**Execution Timeout**:
- When code execution exceeds timeout (30 seconds), automatically stop execution
- Display error: "Execution timed out after 30 seconds"
- Show stop button to allow manual termination

**Runtime Errors**:
- When code execution fails, capture error message and stack trace
- Display in Problems tab with file location (if available)
- Show error indicator in editor gutter at error line

**Unsupported File Type**:
- When attempting to run unsupported file type, display error: "Cannot execute {extension} files"
- Disable run button for unsupported file types

### UI Errors

**Command Not Found**:
- When executing a command that doesn't exist, display error: "Command not found: {commandId}"
- Log error to console for debugging

**Invalid State**:
- When UI enters invalid state (e.g., no active file but editor shows content), attempt recovery:
  1. Close all files
  2. Reset to default state
  3. Display warning: "IDE state was reset due to an error"

**Keyboard Shortcut Conflicts**:
- When multiple commands have the same shortcut, prioritize by context (editor shortcuts take precedence)
- Log warning to console: "Shortcut conflict: {shortcut}"

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests** focus on:
- Specific examples of file operations (create, rename, delete)
- Edge cases (empty workspace, single file, deeply nested folders)
- Error conditions (invalid names, localStorage unavailable)
- Integration between components (FileExplorer → EditorContext → Editor)
- UI interactions (menu clicks, keyboard shortcuts)

**Property-Based Tests** focus on:
- Universal properties that hold for all inputs (see Correctness Properties section)
- Comprehensive input coverage through randomization
- State consistency across operations
- Round-trip properties (save/load, serialize/deserialize)

### Property-Based Testing Configuration

**Library**: Use `@fast-check/vitest` for TypeScript/React property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: `Feature: ide-vscode-enhancements, Property {number}: {property_text}`
- Each correctness property implemented by a SINGLE property-based test

**Example Property Test**:
```typescript
// Feature: ide-vscode-enhancements, Property 2: Folder expansion toggle
it('should toggle folder expanded state on click', () => {
  fc.assert(
    fc.property(
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 20 }),
        type: fc.constant('folder' as const),
        path: fc.string(),
        expanded: fc.boolean(),
        children: fc.array(fc.anything())
      }),
      (folder) => {
        const initialExpanded = folder.expanded;
        // Click folder
        const result = toggleFolder(folder);
        // Verify state toggled
        expect(result.expanded).toBe(!initialExpanded);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Organization

**Unit Tests**:
- `FileExplorer.test.tsx` - File tree rendering, context menu, icons
- `TopMenuBar.test.tsx` - Menu rendering, dropdown display, command execution
- `RunControls.test.tsx` - Run button visibility, execution triggering
- `StatusBar.test.tsx` - Attribute display, cursor tracking, interactivity
- `CommandPalette.test.tsx` - Search filtering, command execution, keyboard navigation
- `WorkspaceManager.test.ts` - File operations, localStorage persistence
- `Terminal.test.tsx` - Command execution, history navigation, output display
- `EditorContext.test.tsx` - State management, consistency, initialization

**Property-Based Tests**:
- `FileExplorer.property.test.tsx` - Properties 1-5
- `MenuBar.property.test.tsx` - Properties 6-9
- `RunControls.property.test.tsx` - Properties 10-14
- `StatusBar.property.test.tsx` - Properties 15-18
- `CommandPalette.property.test.tsx` - Properties 19-21
- `WorkspaceManager.property.test.ts` - Properties 22-23
- `Terminal.property.test.tsx` - Properties 24-27
- `EditorContext.property.test.tsx` - Properties 28-29

### Integration Testing

**End-to-End Flows**:
1. Create file → Edit content → Save → Reload IDE → Verify content persisted
2. Create folder → Create file inside → Delete folder → Verify both removed
3. Open file → Run code → Verify output in terminal
4. Use command palette → Execute command → Verify action performed
5. Toggle panels → Verify visibility changes → Verify state persisted

**Cross-Component Testing**:
- FileExplorer click → Editor update → StatusBar update
- Menu command → EditorContext update → UI re-render
- Run button → Execution → Terminal output → Problems tab
- Command palette → Command execution → Multiple component updates

### Mock Strategy

**ExecutionService**: Mock for unit tests, use real implementation for integration tests
**localStorage**: Mock for unit tests to test error conditions, use real for integration tests
**File System**: Use in-memory implementation for all tests (no real file system access)

### Coverage Goals

- Unit test coverage: 80% minimum
- Property test coverage: All 29 properties implemented
- Integration test coverage: All major user flows
- Edge case coverage: All error conditions tested
