# Design Document: Monaco to CodeMirror 6 Migration

## Overview

This design describes the migration from Monaco Editor to CodeMirror 6 for the Data Scientist Editor. The migration is a surgical replacement of the editor core component while preserving all existing architecture, state management, styling, and functionality. The goal is to achieve complete visual and behavioral parity with the Monaco implementation while using CodeMirror 6's lighter-weight library.

The migration involves:
1. Removing Monaco Editor dependencies
2. Installing CodeMirror 6 packages
3. Creating a new CodeMirrorEditor component with identical interface to MonacoEditorWrapper
4. Configuring CodeMirror extensions for VS Code-like behavior
5. Creating a custom theme matching VS Code Dark+
6. Updating MainEditorArea to use the new component

## Architecture

### High-Level Component Structure

The existing architecture remains unchanged:

```
DataScientistEditor (Root)
├── Sidebar (File Explorer)
├── MainEditorArea
│   ├── TabBar
│   └── CodeMirrorEditor ← NEW (replaces MonacoEditorWrapper)
├── BottomPanel (Output/Terminal)
└── DatasetContextPanel
```

### State Management (Unchanged)

EditorContext continues to manage:
- `openFiles`: Array of open file objects
- `activeFileId`: Currently active file ID
- `updateFileContent()`: Updates file content and marks as dirty
- `openFile()`: Opens a new file
- `closeFile()`: Closes a file
- `setActiveFile()`: Switches active file

### Component Replacement Strategy

**Before:**
```
MainEditorArea
  └── MonacoEditorWrapper
        ├── Monaco Editor instance
        └── Monaco configuration
```

**After:**
```
MainEditorArea
  └── CodeMirrorEditor
        ├── CodeMirror EditorView
        └── CodeMirror extensions
```

The interface between MainEditorArea and the editor component remains identical.

## Components and Interfaces

### CodeMirrorEditor Component

**File:** `frontend/src/components/CodeMirrorEditor/CodeMirrorEditor.tsx`

**Props Interface:**
```typescript
interface CodeMirrorEditorProps {
  value: string;              // Current file content
  language: 'python' | 'sql'; // Syntax highlighting language
  onChange?: (value: string) => void;  // Content change callback
  onMount?: (editor: EditorView) => void; // Editor instance callback
}
```

**Component Structure:**
```typescript
export const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({
  value,
  language,
  onChange,
  onMount
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Initialize CodeMirror on mount
  useEffect(() => {
    if (!editorRef.current) return;

    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      bracketMatching(),
      indentOnInput(),
      language === 'python' ? python() : sql(),
      vsCodeDarkTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange) {
          onChange(update.state.doc.toString());
        }
      })
    ];

    const view = new EditorView({
      doc: value,
      extensions,
      parent: editorRef.current
    });

    viewRef.current = view;
    if (onMount) onMount(view);

    return () => view.destroy();
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value
        }
      });
    }
  }, [value]);

  // Update language when language prop changes
  useEffect(() => {
    if (viewRef.current) {
      // Reconfigure language extension
      const newExtensions = [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        bracketMatching(),
        indentOnInput(),
        language === 'python' ? python() : sql(),
        vsCodeDarkTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        })
      ];
      
      viewRef.current.dispatch({
        effects: StateEffect.reconfigure.of(newExtensions)
      });
    }
  }, [language]);

  return <div ref={editorRef} className="codemirror-editor" />;
};
```

### Theme Configuration

**File:** `frontend/src/components/CodeMirrorEditor/editorTheme.ts`

**VS Code Dark+ Theme:**
```typescript
import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';

export const vsCodeDarkTheme: Extension = EditorView.theme({
  '&': {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    height: '100%',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  '.cm-content': {
    caretColor: '#d4d4d4',
    padding: '0'
  },
  '.cm-cursor': {
    borderLeftColor: '#d4d4d4',
    borderLeftWidth: '2px'
  },
  '.cm-selectionBackground, ::selection': {
    backgroundColor: '#264f78'
  },
  '.cm-activeLine': {
    backgroundColor: '#2a2a2a'
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#2a2a2a'
  },
  '.cm-gutters': {
    backgroundColor: '#1e1e1e',
    color: '#858585',
    border: 'none',
    borderRight: '1px solid #3c3c3c'
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px',
    minWidth: '40px',
    textAlign: 'right'
  },
  '.cm-foldGutter': {
    width: '16px'
  },
  '.cm-scroller': {
    overflow: 'auto',
    scrollBehavior: 'smooth'
  },
  '.cm-matchingBracket': {
    backgroundColor: '#3c3c3c',
    outline: '1px solid #007acc'
  }
}, { dark: true });
```

### MainEditorArea Integration

**File:** `frontend/src/components/MainEditorArea.tsx` (modified)

**Changes:**
```typescript
// Before:
import { MonacoEditorWrapper } from './MonacoEditor/MonacoEditorWrapper';

// After:
import { CodeMirrorEditor } from './CodeMirrorEditor/CodeMirrorEditor';

// In render:
// Before:
<MonacoEditorWrapper
  value={activeFile.content}
  language={activeFile.language}
  onChange={handleContentChange}
  onMount={handleEditorMount}
/>

// After:
<CodeMirrorEditor
  value={activeFile.content}
  language={activeFile.language}
  onChange={handleContentChange}
  onMount={handleEditorMount}
/>
```

## Data Models

No changes to existing data models. The editor continues to work with:

```typescript
interface EditorFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: 'python' | 'sql';
  isDirty: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Content changes trigger onChange callback

*For any* content modification in the editor, the onChange callback should be invoked with the updated content string.

**Validates: Requirements 4.1, 5.2**

### Property 2: Value prop updates editor content

*For any* new value passed to the value prop, the editor's displayed content should update to match the new value.

**Validates: Requirements 5.3**

### Property 3: Language prop determines active syntax highlighting

*For any* language value ('python' or 'sql'), the editor should activate the corresponding language extension for syntax highlighting.

**Validates: Requirements 9.5**

### Property 4: File switching updates content quickly

*For any* file switch operation (changing the value prop), the editor content should update within 100ms.

**Validates: Requirements 10.3**

## Error Handling

### Editor Initialization Errors

**Scenario:** CodeMirror fails to initialize due to missing DOM element or invalid configuration.

**Handling:**
- Check for `editorRef.current` before creating EditorView
- Log error to console if initialization fails
- Render error boundary message to user
- Prevent app crash with try-catch around EditorView creation

### Language Extension Loading Errors

**Scenario:** Language extension (python or sql) fails to load or is not installed.

**Handling:**
- Provide fallback to basic text highlighting
- Log warning about missing language support
- Continue editor operation without syntax highlighting
- Display notification to user about degraded functionality

### Content Synchronization Errors

**Scenario:** Value prop changes but editor fails to update, or onChange callback fails.

**Handling:**
- Wrap dispatch calls in try-catch blocks
- Log synchronization errors to console
- Attempt to re-sync on next update
- Preserve user's current editor content to prevent data loss

### Memory Leak Prevention

**Scenario:** Editor view not properly destroyed on component unmount.

**Handling:**
- Always call `view.destroy()` in useEffect cleanup function
- Clear all event listeners and references
- Set `viewRef.current = null` after destruction
- Use React strict mode during development to catch double-mount issues

## Testing Strategy

### Dual Testing Approach

This migration requires both unit tests and property-based tests to ensure correctness:

**Unit Tests** focus on:
- Component renders with correct props
- Editor initializes with correct extensions
- Theme configuration contains correct colors
- Lifecycle methods (mount/unmount) work correctly
- Language switching updates extensions
- Specific edge cases (empty content, very long content)

**Property Tests** focus on:
- Content changes always trigger onChange (Property 1)
- Value prop changes always update editor (Property 2)
- Language prop always activates correct highlighting (Property 3)
- File switching performance meets timing requirements (Property 4)

### Testing Framework

**Unit Testing:**
- Framework: Vitest + React Testing Library
- Location: `frontend/src/components/CodeMirrorEditor/__tests__/`
- Coverage target: 90%+ for CodeMirrorEditor component

**Property-Based Testing:**
- Library: fast-check (JavaScript property-based testing)
- Configuration: Minimum 100 iterations per property test
- Tag format: `// Feature: monaco-to-codemirror-migration, Property N: [property text]`

### Test Organization

```
frontend/src/components/CodeMirrorEditor/
├── CodeMirrorEditor.tsx
├── CodeMirrorEditor.css
├── editorTheme.ts
└── __tests__/
    ├── CodeMirrorEditor.test.tsx        # Unit tests
    ├── CodeMirrorEditor.properties.test.tsx  # Property tests
    └── editorTheme.test.ts              # Theme configuration tests
```

### Key Test Cases

**Unit Tests:**
1. Renders with initial value
2. Accepts python and sql language props
3. Calls onChange when content is modified
4. Calls onMount with EditorView instance
5. Destroys editor on unmount (no memory leaks)
6. Applies VS Code Dark+ theme
7. Enables all required extensions (line numbers, active line, bracket matching, auto-indent)
8. Switches language extensions when language prop changes
9. Handles empty content gracefully
10. Updates content when value prop changes

**Property Tests:**
1. **Property 1**: Generate random content changes, verify onChange called with correct content
   - Tag: `// Feature: monaco-to-codemirror-migration, Property 1: Content changes trigger onChange callback`
   
2. **Property 2**: Generate random value prop changes, verify editor content updates
   - Tag: `// Feature: monaco-to-codemirror-migration, Property 2: Value prop updates editor content`
   
3. **Property 3**: Generate random language switches, verify correct extension active
   - Tag: `// Feature: monaco-to-codemirror-migration, Property 3: Language prop determines active syntax highlighting`
   
4. **Property 4**: Generate random file switches, verify update time < 100ms
   - Tag: `// Feature: monaco-to-codemirror-migration, Property 4: File switching updates content quickly`

### Integration Testing

**MainEditorArea Integration:**
- Test CodeMirrorEditor works with EditorContext
- Test tab switching updates editor content
- Test dirty file indicator appears on content change
- Test file save operation preserves content
- Test multiple files can be opened and switched between

**Visual Regression Testing:**
- Compare screenshots of Monaco version vs CodeMirror version
- Verify identical appearance of line numbers, gutters, selection
- Verify cursor appearance and animation
- Verify scrollbar styling matches

### Manual Testing Checklist

Before considering migration complete:
- [ ] Open Python file, verify syntax highlighting
- [ ] Open SQL file, verify syntax highlighting
- [ ] Type in editor, verify onChange updates state
- [ ] Switch between multiple tabs, verify content updates
- [ ] Make changes, verify dirty indicator appears
- [ ] Save file, verify dirty indicator clears
- [ ] Test bracket matching by placing cursor near brackets
- [ ] Test auto-indent by pressing Enter after opening bracket
- [ ] Scroll through large file, verify smooth scrolling
- [ ] Select text, verify selection color matches VS Code
- [ ] Verify line numbers appear and are styled correctly
- [ ] Verify active line highlighting works
- [ ] Test with empty file
- [ ] Test with very large file (10,000+ lines)
- [ ] Verify no console errors or warnings
- [ ] Verify no memory leaks (check DevTools memory profiler)

## Implementation Notes

### Package Dependencies

**Remove:**
```json
"monaco-editor": "^0.x.x",
"@monaco-editor/react": "^4.x.x"
```

**Add:**
```json
"@codemirror/state": "^6.4.0",
"@codemirror/view": "^6.23.0",
"@codemirror/commands": "^6.3.0",
"@codemirror/language": "^6.10.0",
"@codemirror/lang-python": "^6.1.0",
"@codemirror/lang-sql": "^6.5.0",
"fast-check": "^3.15.0"
```

### Migration Sequence

1. Install CodeMirror packages
2. Create editorTheme.ts with VS Code Dark+ theme
3. Create CodeMirrorEditor component with basic structure
4. Add all required extensions
5. Implement value prop synchronization
6. Implement language prop switching
7. Add onChange callback handling
8. Add onMount callback handling
9. Write unit tests
10. Write property tests
11. Update MainEditorArea to use CodeMirrorEditor
12. Remove MonacoEditorWrapper component
13. Remove Monaco packages
14. Run full test suite
15. Perform manual testing
16. Visual regression testing

### Rollback Plan

If critical issues are discovered:
1. Revert MainEditorArea to use MonacoEditorWrapper
2. Keep CodeMirrorEditor code for future fixes
3. Document issues encountered
4. Create plan to address issues
5. Retry migration after fixes

### Performance Considerations

- CodeMirror 6 uses virtual scrolling for large documents
- Syntax highlighting is done incrementally
- Extension reconfiguration should be minimized (only on language change)
- Editor view should be reused, not recreated on every render
- Content updates should use transactions, not full document replacement

### Accessibility

CodeMirror 6 provides built-in accessibility features:
- Screen reader support
- Keyboard navigation
- ARIA labels for editor regions
- Focus management

Ensure these are not disabled by custom configuration.
