# Requirements Document: Monaco to CodeMirror 6 Migration

## Introduction

This specification defines the requirements for migrating the Data Scientist Editor from Monaco Editor to CodeMirror 6. The migration must replace only the editor core while maintaining complete functional and visual parity with the existing implementation. All surrounding components, state management, styling, and backend integration must remain unchanged.

## Glossary

- **Editor_Core**: The text editing component responsible for syntax highlighting, line numbers, and text manipulation (currently Monaco Editor, to be replaced with CodeMirror 6)
- **EditorContext**: The React context providing state management for open files, active file, and editor operations
- **MonacoEditorWrapper**: The existing React component wrapping Monaco Editor (to be replaced)
- **CodeMirrorEditor**: The new React component wrapping CodeMirror 6 (to be created)
- **MainEditorArea**: The parent component that renders the editor and manages tab interactions
- **VS_Code_Parity**: Visual and behavioral consistency with VS Code's editor experience
- **Existing_Components**: All React components that must remain unchanged (Sidebar, TabBar, BottomPanel, DatasetContextPanel, EditorContext)

## Requirements

### Requirement 1: Editor Core Replacement

**User Story:** As a developer, I want to replace Monaco Editor with CodeMirror 6, so that the editor uses a lighter-weight library while maintaining all existing functionality.

#### Acceptance Criteria

1. THE System SHALL remove all Monaco Editor dependencies from package.json
2. THE System SHALL install CodeMirror 6 core packages (@codemirror/state, @codemirror/view, @codemirror/commands, @codemirror/language)
3. THE System SHALL install language support packages (@codemirror/lang-python, @codemirror/lang-sql)
4. THE System SHALL delete the MonacoEditorWrapper component and its associated files
5. THE System SHALL create a new CodeMirrorEditor component with identical props interface to MonacoEditorWrapper

### Requirement 2: Visual Parity with Monaco Implementation

**User Story:** As a user, I want the editor to look identical to the Monaco version, so that I experience no visual disruption during the migration.

#### Acceptance Criteria

1. THE CodeMirrorEditor SHALL use the VS Code Dark+ color palette (#1e1e1e background, #d4d4d4 text, #007acc accent)
2. THE CodeMirrorEditor SHALL use JetBrains Mono font at 13-14px with 1.6 line height
3. THE CodeMirrorEditor SHALL display line numbers in the same style as Monaco Editor
4. THE CodeMirrorEditor SHALL highlight the active line with the same visual treatment as Monaco Editor
5. THE CodeMirrorEditor SHALL use VS Code-style cursor animation and appearance
6. THE CodeMirrorEditor SHALL apply the same scrollbar styling as the existing implementation

### Requirement 3: Syntax Highlighting and Language Support

**User Story:** As a data scientist, I want syntax highlighting for Python and SQL code, so that I can read and write code efficiently.

#### Acceptance Criteria

1. WHEN a file with Python language is opened, THE CodeMirrorEditor SHALL apply Python syntax highlighting
2. WHEN a file with SQL language is opened, THE CodeMirrorEditor SHALL apply SQL syntax highlighting
3. THE CodeMirrorEditor SHALL support bracket matching for all bracket types
4. THE CodeMirrorEditor SHALL provide auto-indentation based on language syntax
5. THE CodeMirrorEditor SHALL highlight matching brackets when cursor is adjacent to a bracket

### Requirement 4: Editor Features and Behavior

**User Story:** As a developer, I want all existing editor features to work identically, so that no functionality is lost during migration.

#### Acceptance Criteria

1. WHEN content changes in the editor, THE CodeMirrorEditor SHALL invoke the onChange callback with the updated content
2. WHEN the editor mounts, THE CodeMirrorEditor SHALL invoke the onMount callback with the editor instance
3. THE CodeMirrorEditor SHALL support smooth scrolling behavior
4. THE CodeMirrorEditor SHALL display selection highlighting using the VS Code color (#264f78)
5. THE CodeMirrorEditor SHALL support multi-line editing and selection

### Requirement 5: State Management Integration

**User Story:** As a developer, I want the new editor to integrate seamlessly with EditorContext, so that file management and state synchronization continue working without changes.

#### Acceptance Criteria

1. THE MainEditorArea SHALL use CodeMirrorEditor instead of MonacoEditorWrapper without modifying EditorContext
2. WHEN a file's content changes, THE System SHALL update the EditorContext state identically to the Monaco implementation
3. WHEN switching between tabs, THE CodeMirrorEditor SHALL display the correct file content from EditorContext
4. WHEN a file is marked dirty, THE System SHALL display the dirty indicator (●) in the tab
5. THE CodeMirrorEditor SHALL receive value and language props from EditorContext state

### Requirement 6: Component Interface Compatibility

**User Story:** As a developer, I want the CodeMirrorEditor component to have the same interface as MonacoEditorWrapper, so that integration requires minimal code changes.

#### Acceptance Criteria

1. THE CodeMirrorEditor SHALL accept a 'value' prop of type string
2. THE CodeMirrorEditor SHALL accept a 'language' prop of type 'python' | 'sql'
3. THE CodeMirrorEditor SHALL accept an optional 'onChange' prop of type (value: string) => void
4. THE CodeMirrorEditor SHALL accept an optional 'onMount' prop of type (editor: EditorView) => void
5. THE CodeMirrorEditor SHALL render within the same DOM structure as MonacoEditorWrapper

### Requirement 7: Preservation of Existing Architecture

**User Story:** As a developer, I want all non-editor components to remain unchanged, so that the migration has minimal risk and scope.

#### Acceptance Criteria

1. THE System SHALL NOT modify the EditorContext implementation
2. THE System SHALL NOT modify the Sidebar component
3. THE System SHALL NOT modify the TabBar component
4. THE System SHALL NOT modify the BottomPanel component
5. THE System SHALL NOT modify the DatasetContextPanel component
6. THE System SHALL NOT modify any existing CSS files except to remove Monaco-specific styles
7. THE System SHALL NOT modify the FastAPI backend integration code
8. THE System SHALL NOT modify the existing folder structure except for editor component files

### Requirement 8: Theme Configuration

**User Story:** As a developer, I want a custom CodeMirror theme that matches VS Code Dark+, so that visual consistency is maintained.

#### Acceptance Criteria

1. THE System SHALL create an editorTheme.ts file defining CodeMirror theme configuration
2. THE Theme SHALL use #1e1e1e for editor background
3. THE Theme SHALL use #d4d4d4 for default text color
4. THE Theme SHALL use #007acc for selection and active elements
5. THE Theme SHALL use #3c3c3c for borders and gutters
6. THE Theme SHALL configure line number styling to match VS Code appearance

### Requirement 9: CodeMirror Extensions Configuration

**User Story:** As a developer, I want CodeMirror configured with appropriate extensions, so that the editor provides a professional development experience.

#### Acceptance Criteria

1. THE CodeMirrorEditor SHALL enable the line numbers extension
2. THE CodeMirrorEditor SHALL enable the highlight active line extension
3. THE CodeMirrorEditor SHALL enable the bracket matching extension
4. THE CodeMirrorEditor SHALL enable the auto-indent extension
5. THE CodeMirrorEditor SHALL enable the appropriate language extension based on the language prop
6. THE CodeMirrorEditor SHALL apply the custom VS Code Dark+ theme extension

### Requirement 10: Performance and User Experience

**User Story:** As a user, I want the editor to be responsive and smooth, so that my coding experience is not degraded.

#### Acceptance Criteria

1. WHEN typing in the editor, THE CodeMirrorEditor SHALL update without perceptible lag
2. WHEN scrolling through large files, THE CodeMirrorEditor SHALL render smoothly
3. WHEN switching between files, THE CodeMirrorEditor SHALL update content within 100ms
4. THE CodeMirrorEditor SHALL handle files up to 10,000 lines without performance degradation
5. THE CodeMirrorEditor SHALL not cause memory leaks when mounting and unmounting

### Requirement 11: Testing and Validation

**User Story:** As a developer, I want comprehensive tests for the CodeMirrorEditor component, so that I can verify correct behavior and prevent regressions.

#### Acceptance Criteria

1. THE System SHALL include unit tests verifying CodeMirrorEditor renders with provided value
2. THE System SHALL include unit tests verifying onChange callback is invoked on content changes
3. THE System SHALL include unit tests verifying language switching updates syntax highlighting
4. THE System SHALL include unit tests verifying onMount callback is invoked with editor instance
5. THE System SHALL include integration tests verifying CodeMirrorEditor works with MainEditorArea
