# EditorContext - State Management for Data Scientist Editor

## Overview

This directory contains the global state management for the Data Scientist Editor using React Context and useReducer.

## Files

### `EditorContext.tsx`
The main context provider that manages all editor state including:
- Open files and active file tracking
- Sidebar state (expanded/collapsed, active panel)
- Bottom panel state (expanded/collapsed, height, active tab)
- Dataset selection and metadata

### `../types/editor.ts`
TypeScript interfaces defining:
- `EditorState`: Global editor state shape
- `FileDescriptor`: Open file metadata
- `DatasetMetadata`: Dataset information
- `EditorAction`: All possible state actions

## Usage

### Wrap your app with the provider:

```tsx
import { EditorProvider } from './contexts/EditorContext';

function App() {
  return (
    <EditorProvider>
      <YourComponents />
    </EditorProvider>
  );
}
```

### Use the context in components:

```tsx
import { useEditor } from './contexts/EditorContext';

function MyComponent() {
  const { state, openFile, closeFile, switchTab } = useEditor();
  
  // Access state
  console.log(state.openFiles);
  console.log(state.activeFileId);
  
  // Update state
  openFile({
    id: 'file-1',
    name: 'analysis.py',
    path: '/analysis.py',
    language: 'python',
    content: 'print("hello")',
    isDirty: false,
  });
  
  switchTab('file-1');
  closeFile('file-1');
}
```

## State Management Functions

### File Operations
- `openFile(file: FileDescriptor)` - Open a new file or switch to existing
- `closeFile(fileId: string)` - Close a file and switch to another if needed
- `switchTab(fileId: string)` - Switch to a different open file
- `updateFileContent(fileId: string, content: string)` - Update file content
- `markFileDirty(fileId: string, isDirty: boolean)` - Mark file as having unsaved changes

### Sidebar Operations
- `toggleSidebar()` - Toggle sidebar expanded/collapsed
- `setSidebarPanel(panel)` - Set active sidebar panel (explorer, search, etc.)

### Bottom Panel Operations
- `toggleBottomPanel()` - Toggle bottom panel expanded/collapsed
- `setBottomPanelHeight(height: number)` - Set bottom panel height (clamped to 150px-50% viewport)
- `setBottomTab(tab)` - Set active bottom panel tab (terminal, output, etc.)

### Dataset Operations
- `setSelectedDataset(dataset: 'raw' | 'cleaned')` - Switch between raw and cleaned datasets

## State Structure

```typescript
{
  openFiles: FileDescriptor[],
  activeFileId: string | null,
  sidebarExpanded: boolean,
  activeSidebarPanel: 'explorer' | 'search' | 'source-control' | 'extensions' | 'settings',
  bottomPanelExpanded: boolean,
  bottomPanelHeight: number,
  activeBottomTab: 'terminal' | 'output' | 'problems' | 'logs',
  selectedDataset: 'raw' | 'cleaned',
  datasetMetadata: {
    raw: DatasetMetadata,
    cleaned: DatasetMetadata
  }
}
```

## Testing

Unit tests are located in `__tests__/EditorContext.test.tsx` and cover:
- State initialization
- File operations (open, close, switch)
- Content updates and dirty state
- Sidebar operations
- Bottom panel operations
- Dataset operations

Note: Due to Tailwind CSS/Vitest compatibility issues in the current project setup, tests may need to be run in a separate environment or with updated dependencies.

## Implementation Details

### File Closing Logic
When closing a file:
1. If it's the active file, switch to the previous file in the list
2. If it's the first file, switch to the next file
3. If it's the last file, set activeFileId to null

### Sidebar Panel Logic
When setting a sidebar panel:
1. If the sidebar is collapsed, expand it and show the panel
2. If the sidebar is expanded and a different panel is clicked, switch to that panel
3. If the sidebar is expanded and the same panel is clicked, collapse the sidebar

### Bottom Panel Height Clamping
The bottom panel height is automatically clamped to:
- Minimum: 150px
- Maximum: 50% of viewport height

This ensures the editor always has sufficient space.

## Requirements Validated

This implementation validates the following requirements from the spec:
- **Requirement 1.1**: Editor state management for file handling
- **Requirement 2.1**: Tab bar state for open files
- **Requirement 4.1**: Dataset context state management

## Next Steps

After this task, the next steps are:
1. Create the DataScientistEditor root component (Task 2.2)
2. Implement the three-zone layout
3. Wire up the state context to UI components
