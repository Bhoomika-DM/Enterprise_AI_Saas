# Implementation Plan: Monaco to CodeMirror 6 Migration

## Overview

This plan outlines the step-by-step migration from Monaco Editor to CodeMirror 6. The approach is incremental: first create the new CodeMirrorEditor component with all features, test it thoroughly, then integrate it into MainEditorArea, and finally remove Monaco dependencies. Each step builds on the previous one to ensure a smooth, low-risk migration.

## Tasks

- [x] 1. Install CodeMirror 6 dependencies
  - Add @codemirror/state, @codemirror/view, @codemirror/commands, @codemirror/language packages
  - Add @codemirror/lang-python and @codemirror/lang-sql for language support
  - Add fast-check for property-based testing
  - Run npm install to verify all packages install correctly
  - _Requirements: 1.2, 1.3_

- [ ] 2. Create VS Code Dark+ theme configuration
  - [x] 2.1 Create editorTheme.ts file with VS Code Dark+ color palette
    - Define theme using EditorView.theme() with dark: true
    - Configure editor background (#1e1e1e), text color (#d4d4d4), accent (#007acc)
    - Configure gutters, line numbers, selection, active line, cursor styles
    - Configure bracket matching and scrollbar behavior
    - Use JetBrains Mono font at 14px with 1.6 line height
    - _Requirements: 2.1, 2.2, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [ ] 2.2 Write unit tests for theme configuration
    - Test theme object contains correct background color
    - Test theme object contains correct text color
    - Test theme object contains correct accent color
    - Test theme object contains correct border color
    - Test theme object specifies JetBrains Mono font
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [ ] 3. Create CodeMirrorEditor component with basic structure
  - [x] 3.1 Create CodeMirrorEditor.tsx with props interface
    - Define CodeMirrorEditorProps interface (value, language, onChange, onMount)
    - Create functional component with refs for editor container and EditorView
    - Implement useEffect for editor initialization with basic extensions
    - Implement useEffect cleanup to destroy editor on unmount
    - Add error handling for initialization failures
    - _Requirements: 1.5, 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 3.2 Write unit tests for component structure
    - Test component renders without crashing
    - Test component accepts value prop
    - Test component accepts language prop
    - Test component accepts optional onChange prop
    - Test component accepts optional onMount prop
    - Test component destroys editor on unmount
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 10.5_

- [ ] 4. Implement CodeMirror extensions configuration
  - [x] 4.1 Configure core editor extensions
    - Add lineNumbers() extension
    - Add highlightActiveLineGutter() extension
    - Add highlightActiveLine() extension
    - Add bracketMatching() extension
    - Add indentOnInput() extension
    - Apply vsCodeDarkTheme extension
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6_
  
  - [x] 4.2 Implement language extension switching
    - Add conditional logic to include python() or sql() extension based on language prop
    - Implement useEffect to reconfigure extensions when language prop changes
    - Use StateEffect.reconfigure to update language extension dynamically
    - _Requirements: 3.1, 3.2, 9.5_
  
  - [ ] 4.3 Write unit tests for extensions configuration
    - Test line numbers extension is enabled
    - Test active line highlighting extension is enabled
    - Test bracket matching extension is enabled
    - Test auto-indent extension is enabled
    - Test theme extension is applied
    - Test python extension is active when language='python'
    - Test sql extension is active when language='sql'
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 5. Implement content synchronization
  - [x] 5.1 Implement onChange callback handling
    - Add EditorView.updateListener extension to detect document changes
    - Extract updated content using update.state.doc.toString()
    - Invoke onChange callback with updated content
    - Ensure onChange is only called when document actually changes (check update.docChanged)
    - _Requirements: 4.1, 5.2_
  
  - [x] 5.2 Implement value prop synchronization
    - Add useEffect to watch value prop changes
    - Compare incoming value with current editor content
    - Use view.dispatch with changes transaction to update content
    - Prevent infinite loops by checking if value differs from current content
    - _Requirements: 5.3_
  
  - [ ] 5.3 Write property test for onChange callback
    - **Property 1: Content changes trigger onChange callback**
    - **Validates: Requirements 4.1, 5.2**
    - Generate random content strings
    - Simulate typing/changes in editor
    - Verify onChange is called with correct updated content
    - Run 100 iterations
    - _Requirements: 4.1, 5.2_
  
  - [ ] 5.4 Write property test for value prop updates
    - **Property 2: Value prop updates editor content**
    - **Validates: Requirements 5.3**
    - Generate random value strings
    - Update value prop
    - Verify editor displays the new value
    - Run 100 iterations
    - _Requirements: 5.3_

- [ ] 6. Implement onMount callback and editor instance access
  - [x] 6.1 Add onMount callback invocation
    - Call onMount with EditorView instance after editor creation
    - Store EditorView reference in viewRef for later access
    - Ensure onMount is called only once on initial mount
    - _Requirements: 4.2_
  
  - [ ] 6.2 Write unit test for onMount callback
    - Test onMount is called with EditorView instance
    - Test onMount is called exactly once
    - Test onMount receives valid editor instance
    - _Requirements: 4.2_

- [ ] 7. Add styling for CodeMirrorEditor
  - [x] 7.1 Create CodeMirrorEditor.css
    - Set container to fill parent height and width
    - Ensure no margin or padding conflicts
    - Configure overflow behavior for scrolling
    - Match existing editor container styling from MonacoEditorWrapper.css
    - _Requirements: 2.6, 4.3_
  
  - [x] 7.2 Import CSS in CodeMirrorEditor component
    - Add import statement for CodeMirrorEditor.css
    - Apply 'codemirror-editor' className to container div
    - _Requirements: 2.6_

- [ ] 8. Checkpoint - Test CodeMirrorEditor in isolation
  - Run all unit tests for CodeMirrorEditor component
  - Run all property tests
  - Manually test component in Storybook or isolated test page
  - Verify syntax highlighting works for Python and SQL
  - Verify onChange and onMount callbacks work correctly
  - Verify theme matches VS Code Dark+ appearance
  - Ensure all tests pass, ask the user if questions arise.

- [-] 9. Integrate CodeMirrorEditor into MainEditorArea
  - [x] 9.1 Update MainEditorArea imports
    - Remove import for MonacoEditorWrapper
    - Add import for CodeMirrorEditor
    - _Requirements: 5.1_
  
  - [x] 9.2 Replace MonacoEditorWrapper with CodeMirrorEditor in render
    - Update JSX to use <CodeMirrorEditor /> instead of <MonacoEditorWrapper />
    - Ensure all props (value, language, onChange, onMount) are passed correctly
    - Verify prop names and types match exactly
    - _Requirements: 5.1, 5.5_
  
  - [ ] 9.3 Write integration tests for MainEditorArea with CodeMirrorEditor
    - Test MainEditorArea renders CodeMirrorEditor
    - Test file content from EditorContext displays in editor
    - Test editing content updates EditorContext state
    - Test switching tabs updates editor content
    - Test dirty indicator appears when content changes
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 10. Write property tests for language switching and performance
  - [ ] 10.1 Write property test for language extension switching
    - **Property 3: Language prop determines active syntax highlighting**
    - **Validates: Requirements 9.5**
    - Generate random language switches between 'python' and 'sql'
    - Verify correct language extension is active after each switch
    - Run 100 iterations
    - _Requirements: 9.5_
  
  - [ ] 10.2 Write property test for file switching performance
    - **Property 4: File switching updates content quickly**
    - **Validates: Requirements 10.3**
    - Generate random file content strings
    - Measure time to update editor when value prop changes
    - Verify update completes within 100ms
    - Run 100 iterations
    - _Requirements: 10.3_

- [ ] 11. Checkpoint - Test full integration
  - Run full test suite (unit + property + integration tests)
  - Manually test complete editor workflow:
    - Open Python file, verify syntax highlighting
    - Open SQL file, verify syntax highlighting
    - Edit content, verify dirty indicator appears
    - Switch between tabs, verify content updates
    - Save file, verify dirty indicator clears
  - Test with empty files and large files (10,000+ lines)
  - Check browser console for errors or warnings
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Remove Monaco Editor dependencies
  - [x] 12.1 Delete MonacoEditorWrapper component files
    - Delete frontend/src/components/MonacoEditor/MonacoEditorWrapper.tsx
    - Delete frontend/src/components/MonacoEditor/MonacoEditorWrapper.css
    - Delete frontend/src/components/MonacoEditor directory if empty
    - _Requirements: 1.4_
  
  - [x] 12.2 Remove Monaco packages from package.json
    - Remove monaco-editor dependency
    - Remove @monaco-editor/react dependency
    - Run npm install to update lock file
    - _Requirements: 1.1_
  
  - [x] 12.3 Search for and remove any remaining Monaco references
    - Search codebase for "monaco" (case-insensitive)
    - Remove any unused imports or references
    - Update any documentation mentioning Monaco Editor
    - _Requirements: 1.1, 1.4_

- [ ] 13. Final validation and testing
  - [ ] 13.1 Run complete test suite
    - Run all unit tests
    - Run all property tests
    - Run all integration tests
    - Verify 90%+ code coverage for CodeMirrorEditor
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 13.2 Perform manual testing checklist
    - Test Python syntax highlighting
    - Test SQL syntax highlighting
    - Test onChange updates state
    - Test tab switching
    - Test dirty indicator
    - Test file save
    - Test bracket matching
    - Test auto-indent
    - Test scrolling performance
    - Test text selection
    - Test line numbers
    - Test active line highlighting
    - Test empty file handling
    - Test large file handling (10,000+ lines)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.3, 4.4, 10.1, 10.2, 10.4_
  
  - [ ] 13.3 Perform visual regression testing
    - Take screenshots of CodeMirror version
    - Compare with screenshots of Monaco version (if available)
    - Verify identical appearance of line numbers, gutters, selection
    - Verify cursor appearance matches
    - Verify scrollbar styling matches
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 14. Final checkpoint - Migration complete
  - Verify no Monaco dependencies remain in package.json
  - Verify no Monaco code remains in codebase
  - Verify all tests pass
  - Verify no console errors or warnings
  - Verify editor functionality is identical to Monaco version
  - Document any known differences or limitations
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties with 100 iterations each
- Unit tests validate specific examples, edge cases, and configuration
- Integration tests validate CodeMirrorEditor works correctly with EditorContext and MainEditorArea
- Manual testing checklist ensures visual and behavioral parity with Monaco version
