# Design Document: Data Scientist Editor (Foundation Phase)

## Overview

The Data Scientist Editor is a browser-based IDE that provides visual, behavioral, and experiential parity with Visual Studio Code. Built with React and Monaco Editor, it delivers a professional coding environment optimized for data scientists working with Python and SQL on datasets.

This Foundation Phase focuses on establishing the UI shell and editor experience with VS Code-accurate visuals, interactions, and layout patterns. The goal is not to inspire from VS Code, but to recreate it faithfully in a web context.

### Key Design Principles

1. **Visual Parity**: Match VS Code's Dark Theme, typography, spacing, and color system exactly
2. **Behavioral Parity**: Replicate VS Code's interaction patterns, animations, and focus behavior
3. **Developer Muscle Memory**: Ensure familiar keyboard navigation and UI responses work identically
4. **Editor Dominance**: The code editor is the primary focus; all other UI should feel secondary
5. **Data Context Integration**: Add dataset awareness without disrupting the VS Code experience

## Architecture

### Component Hierarchy

```
DataScientistEditor (Root)
├── Sidebar
│   ├── IconBar
│   └── ExpandablePanel
│       ├── ExplorerPanel
│       ├── SearchPanel
│       ├── SourceControlPanel (placeholder)
│       ├── ExtensionsPanel (placeholder)
│       └── SettingsPanel
├── MainEditorArea
│   ├── TabBar
│   │   └── Tab[] (with close buttons, unsaved indicators)
│   ├── MonacoEditorWrapper
│   └── DatasetContextPanel
└── BottomPanel
    ├── PanelTabBar (Terminal, Output, Problems, Logs)
    ├── TerminalView (mock)
    ├── OutputView
    ├── ProblemsView
    └── LogsView
```

### Technology Stack

- **Frontend Framework**: React 18+
- **Code Editor**: Monaco Editor (standalone, not via iframe)
- **Styling**: CSS Modules or Styled Components with VS Code theme tokens
- **State Management**: React Context or lightweight state library (Zustand/Jotai)
- **Font**: JetBrains Mono (loaded via CDN or bundled)

### Layout System

The editor uses a flexbox-based layout with three primary zones:

1. **Left Zone**: Sidebar (collapsible, fixed width when expanded: ~250px)
2. **Center Zone**: Main editor area (flexible, takes remaining space)
3. **Bottom Zone**: Bottom panel (collapsible, resizable height: 200-500px)

```
┌─────────────────────────────────────────────────┐
│  [Icon] │ Tab1  Tab2* Tab3        [Dataset ▼]  │
│  [Icon] ├───────────────────────────────────────┤
│  [Icon] │                                       │
│  [Icon] │         Monaco Editor                 │
│  [Icon] │         (Main Content)                │
│         │                                       │
├─────────┴───────────────────────────────────────┤
│  Terminal │ Output │ Problems │ Logs            │
│  $ _                                            │
└─────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. DataScientistEditor (Root Component)

**Responsibilities**:
- Orchestrate layout of Sidebar, MainEditorArea, and BottomPanel
- Manage global state (open files, active file, sidebar state, bottom panel state)
- Handle window resize events
- Provide theme context to all children

**State**:
```typescript
interface EditorState {
  openFiles: FileDescriptor[];
  activeFileId: string | null;
  sidebarExpanded: boolean;
  activeSidebarPanel: 'explorer' | 'search' | 'source-control' | 'extensions' | 'settings';
  bottomPanelExpanded: boolean;
  bottomPanelHeight: number;
  activeBottomTab: 'terminal' | 'output' | 'problems' | 'logs';
  selectedDataset: 'raw' | 'cleaned';
}

interface FileDescriptor {
  id: string;
  name: string;
  path: string;
  language: 'python' | 'sql';
  content: string;
  isDirty: boolean; // has unsaved changes
}
```

**Props**: None (root component)

### 2. Sidebar Component

**Responsibilities**:
- Render icon bar with navigation icons
- Toggle between collapsed (icon-only) and expanded states
- Render active panel content when expanded
- Highlight active icon

**Props**:
```typescript
interface SidebarProps {
  expanded: boolean;
  activePanel: 'explorer' | 'search' | 'source-control' | 'extensions' | 'settings';
  onPanelChange: (panel: string) => void;
  onToggle: () => void;
}
```

**Styling**:
- Background: `#252526` (VS Code sidebar background)
- Icon bar width: `48px`
- Expanded panel width: `250px`
- Active icon background: `#37373d`
- Border right: `1px solid #2d2d30`

### 3. IconBar Component

**Responsibilities**:
- Render vertical list of navigation icons
- Handle icon clicks
- Apply active state styling

**Icons** (using VS Code icon set or similar):
- Explorer: folder icon
- Search: magnifying glass
- Source Control: git branch icon
- Extensions: blocks icon
- Settings: gear icon

### 4. MainEditorArea Component

**Responsibilities**:
- Render TabBar with open file tabs
- Render Monaco Editor with active file content
- Render DatasetContextPanel
- Handle file switching
- Manage editor focus

**Props**:
```typescript
interface MainEditorAreaProps {
  openFiles: FileDescriptor[];
  activeFileId: string | null;
  onFileChange: (fileId: string, content: string) => void;
  onTabClose: (fileId: string) => void;
  onTabSwitch: (fileId: string) => void;
  selectedDataset: 'raw' | 'cleaned';
  onDatasetChange: (dataset: 'raw' | 'cleaned') => void;
}
```

### 5. TabBar Component

**Responsibilities**:
- Render tabs for all open files
- Show unsaved indicator (dot) for dirty files
- Highlight active tab
- Handle tab clicks and close button clicks
- Support horizontal scrolling for overflow

**Tab Styling**:
- Inactive tab background: `#2d2d2d`
- Active tab background: `#1e1e1e` (matches editor background)
- Tab height: `35px`
- Tab padding: `0 12px`
- Close button: appears on hover
- Unsaved dot: white circle, 6px diameter, positioned before filename

### 6. MonacoEditorWrapper Component

**Responsibilities**:
- Initialize and configure Monaco Editor instance
- Load language support for Python and SQL
- Configure theme to match VS Code Dark
- Enable line numbers, minimap, IntelliSense
- Handle content changes and sync with parent state
- Apply JetBrains Mono font

**Monaco Configuration**:
```typescript
const editorOptions = {
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
}
```

### 7. DatasetContextPanel Component

**Responsibilities**:
- Display dataset selector dropdown
- Show dataset metadata (rows, columns, missing %, memory)
- Update when dataset selection changes
- Remain non-intrusive and secondary to editor

**Props**:
```typescript
interface DatasetContextPanelProps {
  selectedDataset: 'raw' | 'cleaned';
  metadata: DatasetMetadata;
  onDatasetChange: (dataset: 'raw' | 'cleaned') => void;
}

interface DatasetMetadata {
  rows: number;
  columns: number;
  missingPercentage: number;
  memoryUsage: string; // e.g., "2.4 MB"
}
```

**Placement**: Top-right corner of MainEditorArea, above the editor, aligned with TabBar

**Styling**:
- Background: `#2d2d2d`
- Border: `1px solid #3e3e42`
- Padding: `8px 12px`
- Font size: `12px`
- Dropdown uses VS Code select styling

### 8. BottomPanel Component

**Responsibilities**:
- Render panel tab bar (Terminal, Output, Problems, Logs)
- Render active panel content
- Handle collapse/expand toggle
- Handle resize drag interaction
- Maintain height state

**Props**:
```typescript
interface BottomPanelProps {
  expanded: boolean;
  height: number;
  activeTab: 'terminal' | 'output' | 'problems' | 'logs';
  onToggle: () => void;
  onHeightChange: (height: number) => void;
  onTabChange: (tab: string) => void;
}
```

**Styling**:
- Background: `#1e1e1e`
- Border top: `1px solid #2d2d30`
- Tab bar height: `35px`
- Tab bar background: `#252526`
- Active tab background: `#1e1e1e`
- Resize handle: 4px tall, cursor: `ns-resize`

### 9. TerminalView Component (Mock)

**Responsibilities**:
- Render a mock terminal UI with prompt
- Display placeholder text indicating terminal is not yet functional
- Use monospace font and terminal-like styling

**Styling**:
- Background: `#1e1e1e`
- Text color: `#cccccc`
- Font: `JetBrains Mono, 13px`
- Prompt: `$ ` in green (`#4ec9b0`)
- Cursor: blinking underscore

## Data Models

### FileDescriptor

Represents an open file in the editor.

```typescript
interface FileDescriptor {
  id: string;           // Unique identifier (UUID or path-based)
  name: string;         // Display name (e.g., "analysis.py")
  path: string;         // Full path (e.g., "/datasets/analysis.py")
  language: 'python' | 'sql';  // Language for syntax highlighting
  content: string;      // File content
  isDirty: boolean;     // True if file has unsaved changes
}
```

### DatasetMetadata

Represents metadata about a selected dataset.

```typescript
interface DatasetMetadata {
  rows: number;              // Number of rows
  columns: number;           // Number of columns
  missingPercentage: number; // Percentage of missing values (0-100)
  memoryUsage: string;       // Human-readable memory usage (e.g., "2.4 MB")
}
```

### EditorState

Global state for the editor application.

```typescript
interface EditorState {
  openFiles: FileDescriptor[];
  activeFileId: string | null;
  sidebarExpanded: boolean;
  activeSidebarPanel: 'explorer' | 'search' | 'source-control' | 'extensions' | 'settings';
  bottomPanelExpanded: boolean;
  bottomPanelHeight: number;
  activeBottomTab: 'terminal' | 'output' | 'problems' | 'logs';
  selectedDataset: 'raw' | 'cleaned';
  datasetMetadata: {
    raw: DatasetMetadata;
    cleaned: DatasetMetadata;
  };
}
```

### Theme Tokens

VS Code Dark Theme color tokens for consistent styling.

```typescript
const VSCodeDarkTheme = {
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
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Syntax Highlighting for All Files

*For any* file opened in the editor, if the file language is Python or SQL, then the editor SHALL render syntax-highlighted content with language-specific tokens.

**Validates: Requirements 1.2, 1.3**

### Property 2: Tab Bar Reflects Open Files

*For any* set of open files, the tab bar SHALL display exactly one tab for each file, with each tab showing the correct filename.

**Validates: Requirements 2.1**

### Property 3: Tab Selection Updates Editor Content

*For any* tab in the tab bar, when clicked, the editor SHALL display the content of the corresponding file.

**Validates: Requirements 2.2**

### Property 4: Dirty Files Show Unsaved Indicator

*For any* file marked as dirty (unsaved changes), the corresponding tab SHALL display a visible dot indicator.

**Validates: Requirements 2.3**

### Property 5: Active Tab Visual Distinction

*For any* active tab, it SHALL have a background color matching the editor background (`#1e1e1e`), visually distinguishing it from inactive tabs.

**Validates: Requirements 2.4**

### Property 6: Tab Removal on Close

*For any* tab, when its close button is clicked, the tab SHALL be removed from the tab bar and the file SHALL be removed from the open files list.

**Validates: Requirements 2.5**

### Property 7: Sidebar Panel Expansion

*For any* sidebar icon, when clicked while the sidebar is collapsed or a different panel is active, the sidebar SHALL expand and display the corresponding panel content.

**Validates: Requirements 3.3**

### Property 8: Sidebar Toggle Collapse

*For any* active sidebar icon, when clicked again, the sidebar SHALL collapse to icon-only state.

**Validates: Requirements 3.4**

### Property 9: Active Icon Highlighting

*For any* active sidebar icon, it SHALL have a background color of `#37373d`, visually distinguishing it from inactive icons.

**Validates: Requirements 3.5**

### Property 10: Dataset Metadata Display

*For any* selected dataset (raw or cleaned), the Dataset Context Panel SHALL display all four metadata fields: row count, column count, missing data percentage, and memory usage.

**Validates: Requirements 4.2, 4.3, 4.4, 4.5**

### Property 11: Dataset Metadata Updates on Selection Change

*For any* dataset selection change, the Dataset Context Panel SHALL update to display the metadata corresponding to the newly selected dataset.

**Validates: Requirements 4.7**

### Property 12: Bottom Panel Height Persistence

*For any* bottom panel tab switch, the panel height SHALL remain unchanged from its value before the switch.

**Validates: Requirements 5.7**

### Property 13: Panel Transitions

*For any* panel (sidebar or bottom panel) that opens or closes, a CSS transition SHALL be applied with a duration not exceeding 200ms.

**Validates: Requirements 7.1, 7.2, 7.4**

### Property 14: Editor Focus Retention

*For any* panel opening action (sidebar expansion or bottom panel expansion), if the editor had focus before the action, it SHALL retain focus after the action completes.

**Validates: Requirements 9.2**

### Property 15: Tab Switch Focus Transfer

*For any* tab switch action, focus SHALL move to the Monaco editor instance displaying the newly active file.

**Validates: Requirements 9.5**

## Error Handling

### Editor Initialization Errors

**Scenario**: Monaco Editor fails to load or initialize

**Handling**:
- Display error message in editor area: "Failed to initialize code editor"
- Log detailed error to browser console
- Provide retry button
- Gracefully degrade: show read-only textarea with file content

### File Content Loading Errors

**Scenario**: File content cannot be loaded or is corrupted

**Handling**:
- Display error message in tab: "Error loading file"
- Keep tab in tab bar but mark with error icon
- Show error details in editor area
- Allow user to close tab or retry loading

### Dataset Metadata Fetch Errors

**Scenario**: Dataset metadata API call fails

**Handling**:
- Display "N/A" for unavailable metadata fields
- Show warning icon in Dataset Context Panel
- Log error to console
- Retry automatically after 5 seconds (max 3 retries)

### Theme/Font Loading Errors

**Scenario**: JetBrains Mono font fails to load

**Handling**:
- Fallback to system monospace font
- Log warning to console
- Continue normal operation (non-blocking error)

### Resize Boundary Violations

**Scenario**: User attempts to resize bottom panel beyond constraints

**Handling**:
- Clamp height to valid range (minimum 150px, maximum 50% of viewport height)
- Provide visual feedback when limit is reached (cursor change)
- No error message needed (expected behavior)

### State Persistence Errors

**Scenario**: Cannot save editor state to localStorage

**Handling**:
- Log warning to console
- Continue operation without persistence
- Show non-intrusive notification: "Settings will not be saved"

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, component rendering, and error conditions
- **Property tests**: Verify universal properties across all inputs using randomized test data

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Library Selection**:
- **JavaScript/React**: Use `fast-check` library for property-based testing
- **Integration**: Use with Jest or Vitest test framework

**Test Configuration**:
- Each property test MUST run minimum 100 iterations
- Each test MUST include a comment tag referencing the design property
- Tag format: `// Feature: data-scientist-editor, Property {number}: {property_text}`

**Example Property Test Structure**:
```javascript
import fc from 'fast-check';

// Feature: data-scientist-editor, Property 2: Tab Bar Reflects Open Files
test('tab bar displays one tab per open file', () => {
  fc.assert(
    fc.property(
      fc.array(fileDescriptorArbitrary, { minLength: 0, maxLength: 20 }),
      (openFiles) => {
        const { container } = render(<TabBar openFiles={openFiles} />);
        const tabs = container.querySelectorAll('.tab');
        expect(tabs.length).toBe(openFiles.length);
        
        openFiles.forEach((file, index) => {
          expect(tabs[index].textContent).toContain(file.name);
        });
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Focus Areas

Unit tests should focus on:

1. **Component Rendering**: Verify components render without errors
2. **Specific Examples**: Test concrete scenarios (e.g., opening a specific Python file)
3. **Edge Cases**: Empty file lists, very long filenames, special characters
4. **User Interactions**: Click handlers, keyboard events, drag interactions
5. **Error Conditions**: Failed API calls, missing data, invalid props
6. **Integration Points**: Component communication, state updates, event propagation

### Property Testing Focus Areas

Property tests should focus on:

1. **Universal Invariants**: Properties that hold for all valid inputs
2. **State Consistency**: UI state matches data model state
3. **Interaction Outcomes**: User actions produce expected results across all scenarios
4. **Visual Consistency**: Styling rules apply consistently
5. **Focus Management**: Focus behavior is correct for all interaction sequences

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% line coverage
- **Property Test Coverage**: All 15 correctness properties implemented
- **Integration Tests**: Key user workflows (open file → edit → save, switch tabs, toggle panels)
- **Visual Regression Tests**: Screenshot comparisons for VS Code parity (optional but recommended)

### Testing Tools

- **Test Framework**: Jest or Vitest
- **React Testing**: React Testing Library
- **Property Testing**: fast-check
- **E2E Testing**: Playwright or Cypress (for integration tests)
- **Visual Testing**: Percy or Chromatic (optional)

### Mocking Strategy

**Monaco Editor**:
- Mock Monaco Editor in unit tests to avoid heavy initialization
- Use real Monaco Editor in integration tests
- Create mock that simulates key APIs: `setValue`, `getValue`, `onDidChangeModelContent`

**Dataset Metadata API**:
- Mock API calls in unit and property tests
- Use MSW (Mock Service Worker) for realistic API mocking
- Test both success and error responses

**Browser APIs**:
- Mock `localStorage` for state persistence tests
- Mock `ResizeObserver` for layout tests
- Mock `requestAnimationFrame` for animation tests

