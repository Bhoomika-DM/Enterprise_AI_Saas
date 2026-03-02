# Implementation Plan: Data Scientist Editor (Foundation Phase)

## Overview

This implementation plan breaks down the Data Scientist Editor into incremental coding tasks. Each task builds on previous work, starting with foundational setup and progressing through component implementation, integration, and testing. The focus is on achieving VS Code visual and behavioral parity in a React-based web application.

## Tasks

- [x] 1. Project setup and core infrastructure
  - Initialize React project with TypeScript support
  - Install and configure Monaco Editor package
  - Install fast-check for property-based testing
  - Set up Jest/Vitest with React Testing Library
  - Load JetBrains Mono font (via CDN or bundle)
  - Create VS Code Dark Theme token constants file
  - _Requirements: 10.1, 10.2, 6.5, 6.6_

- [x] 2. Implement root layout and state management
  - [x] 2.1 Create EditorState interface and initial state
    - Define TypeScript interfaces for EditorState, FileDescriptor, DatasetMetadata
    - Set up React Context for global editor state
    - Implement state update functions (open file, close file, switch tab, etc.)
    - _Requirements: 1.1, 2.1, 4.1_
  
  - [x] 2.2 Create DataScientistEditor root component
    - Implement three-zone flexbox layout (sidebar, main, bottom)
    - Wire up state context provider
    - Handle window resize events for responsive layout
    - _Requirements: 8.1, 8.4, 8.5_
  
  - [x] 2.3 Write unit tests for state management
    - Test state initialization
    - Test file open/close operations
    - Test tab switching logic
    - _Requirements: 2.1, 2.5_

- [ ] 3. Implement Sidebar component
  - [x] 3.1 Create IconBar component
    - Render vertical list of 5 navigation icons (Explorer, Search, Source Control, Extensions, Settings)
    - Implement click handlers for icon selection
    - Apply VS Code styling (background: `#252526`, width: `48px`)
    - _Requirements: 3.1, 3.2, 6.1_
  
  - [x] 3.2 Create Sidebar container with expand/collapse behavior
    - Implement collapsed (icon-only) and expanded states
    - Add smooth transition animation (≤200ms)
    - Apply active icon highlighting (background: `#37373d`)
    - Wire up panel switching logic
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 7.1_
  
  - [x] 3.3 Create placeholder panels (Explorer, Search, Settings)
    - Implement ExplorerPanel with placeholder content
    - Implement SearchPanel with placeholder content
    - Implement SettingsPanel with placeholder content
    - Apply consistent panel styling (background: `#252526`, width: `250px`)
    - _Requirements: 3.3, 6.1_
  
  - [ ] 3.4 Write property test for sidebar panel expansion
    - **Property 7: Sidebar Panel Expansion**
    - **Validates: Requirements 3.3**
  
  - [ ] 3.5 Write property test for sidebar toggle collapse
    - **Property 8: Sidebar Toggle Collapse**
    - **Validates: Requirements 3.4**
  
  - [ ] 3.6 Write property test for active icon highlighting
    - **Property 9: Active Icon Highlighting**
    - **Validates: Requirements 3.5**

- [ ] 4. Implement TabBar component
  - [x] 4.1 Create Tab component with close button
    - Render tab with filename and close button
    - Show unsaved dot indicator when file is dirty
    - Apply active/inactive tab styling
    - Handle tab click and close button click
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 4.2 Create TabBar container with horizontal layout
    - Render tabs for all open files
    - Implement horizontal scrolling for overflow
    - Apply VS Code tab bar styling (background: `#2d2d2d`, height: `35px`)
    - _Requirements: 2.1, 2.6, 6.1_
  
  - [ ] 4.3 Write property test for tab bar reflects open files
    - **Property 2: Tab Bar Reflects Open Files**
    - **Validates: Requirements 2.1**
  
  - [ ] 4.4 Write property test for tab selection updates editor
    - **Property 3: Tab Selection Updates Editor Content**
    - **Validates: Requirements 2.2**
  
  - [ ] 4.5 Write property test for dirty files show indicator
    - **Property 4: Dirty Files Show Unsaved Indicator**
    - **Validates: Requirements 2.3**
  
  - [ ] 4.6 Write property test for active tab visual distinction
    - **Property 5: Active Tab Visual Distinction**
    - **Validates: Requirements 2.4**
  
  - [ ] 4.7 Write property test for tab removal on close
    - **Property 6: Tab Removal on Close**
    - **Validates: Requirements 2.5**

- [ ] 5. Implement Monaco Editor integration
  - [x] 5.1 Create MonacoEditorWrapper component
    - Initialize Monaco Editor instance with configuration options
    - Configure theme to 'vs-dark'
    - Set font to JetBrains Mono with size 14px, line height 21px
    - Enable line numbers, minimap, IntelliSense
    - Configure cursor width (2px) and blinking behavior
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 1.7, 1.8, 6.5, 6.6, 6.7_
  
  - [x] 5.2 Implement language support for Python and SQL
    - Register Python language with Monaco
    - Register SQL language with Monaco
    - Configure syntax highlighting for both languages
    - _Requirements: 1.2, 1.3, 10.5_
  
  - [ ] 5.3 Wire up content changes to state
    - Implement onDidChangeModelContent handler
    - Update file content in global state
    - Mark file as dirty when content changes
    - _Requirements: 2.3_
  
  - [ ] 5.4 Write property test for syntax highlighting
    - **Property 1: Syntax Highlighting for All Files**
    - **Validates: Requirements 1.2, 1.3**
  
  - [ ] 5.5 Write unit tests for editor configuration
    - Test line numbers are displayed
    - Test minimap is displayed
    - Test JetBrains Mono font is applied
    - Test cursor styling
    - _Requirements: 1.4, 1.5, 1.7, 1.8_

- [ ] 6. Implement Dataset Context Panel
  - [x] 6.1 Create DatasetContextPanel component
    - Render dataset selector dropdown (Raw/Cleaned options)
    - Display metadata fields: rows, columns, missing %, memory
    - Position in top-right corner above editor
    - Apply VS Code styling (background: `#2d2d2d`, border: `#3e3e42`)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [x] 6.2 Implement dataset selection and metadata updates
    - Handle dataset selector change events
    - Update displayed metadata when selection changes
    - Ensure panel doesn't steal focus from editor
    - _Requirements: 4.6, 4.7_
  
  - [ ] 6.3 Write property test for dataset metadata display
    - **Property 10: Dataset Metadata Display**
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.5**
  
  - [ ] 6.4 Write property test for metadata updates on selection change
    - **Property 11: Dataset Metadata Updates on Selection Change**
    - **Validates: Requirements 4.7**
  
  - [ ] 6.5 Write unit test for focus behavior
    - Test that clicking panel doesn't remove editor focus
    - _Requirements: 4.6_

- [ ] 7. Implement Bottom Panel
  - [x] 7.1 Create PanelTabBar component
    - Render tabs for Terminal, Output, Problems, Logs
    - Implement tab selection logic
    - Apply VS Code tab styling
    - _Requirements: 5.1, 6.2_
  
  - [x] 7.2 Create TerminalView mock component
    - Render mock terminal UI with prompt (`$ ` in green)
    - Display placeholder text indicating terminal is not functional
    - Use JetBrains Mono font, 13px
    - Apply terminal colors (background: `#1e1e1e`, text: `#cccccc`)
    - _Requirements: 5.4_
  
  - [x] 7.3 Create placeholder views for Output, Problems, Logs
    - Implement OutputView with placeholder content
    - Implement ProblemsView with placeholder content
    - Implement LogsView with placeholder content
    - _Requirements: 5.1_
  
  - [x] 7.4 Create BottomPanel container with collapse/resize
    - Implement collapse/expand toggle
    - Implement drag-to-resize on top edge
    - Clamp height to valid range (150px min, 50% viewport max)
    - Apply smooth transition animation (≤200ms)
    - Maintain height when switching tabs
    - _Requirements: 5.2, 5.3, 5.5, 5.6, 5.7, 7.1, 8.3_
  
  - [ ] 7.5 Write property test for bottom panel height persistence
    - **Property 12: Bottom Panel Height Persistence**
    - **Validates: Requirements 5.7**
  
  - [ ] 7.6 Write unit tests for bottom panel behavior
    - Test collapse/expand toggle
    - Test resize drag interaction
    - Test height clamping
    - Test tab switching
    - _Requirements: 5.2, 5.3, 5.4, 8.3_

- [ ] 8. Implement MainEditorArea integration
  - [x] 8.1 Create MainEditorArea component
    - Compose TabBar, MonacoEditorWrapper, and DatasetContextPanel
    - Handle file switching between tabs
    - Manage editor focus
    - Apply flexbox layout for proper spacing
    - _Requirements: 8.1, 9.1_
  
  - [x] 8.2 Wire up file content synchronization
    - Pass active file content to Monaco Editor
    - Update state when editor content changes
    - Handle tab switches and update editor content
    - _Requirements: 2.2_
  
  - [ ] 8.3 Write unit tests for editor area integration
    - Test tab switching updates editor content
    - Test editor changes update state
    - Test focus management
    - _Requirements: 2.2, 9.1_

- [ ] 9. Implement animations and transitions
  - [ ] 9.1 Add CSS transitions to panels
    - Add transition to sidebar expand/collapse (≤200ms)
    - Add transition to bottom panel expand/collapse (≤200ms)
    - Add transition to tab selection highlight (≤200ms)
    - Ensure no animations on editor focus
    - _Requirements: 7.1, 7.2, 7.4, 7.5_
  
  - [ ] 9.2 Write property test for panel transitions
    - **Property 13: Panel Transitions**
    - **Validates: Requirements 7.1, 7.2, 7.4**
  
  - [ ] 9.3 Write unit test for editor focus no animation
    - Test that editor focus doesn't trigger animations
    - _Requirements: 7.5_

- [ ] 10. Implement focus management
  - [ ] 10.1 Add focus retention logic
    - Ensure editor retains focus when panels open
    - Transfer focus to editor on tab switch
    - Support keyboard navigation between UI elements
    - Apply VS Code focus indicator styling
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 10.2 Write property test for editor focus retention
    - **Property 14: Editor Focus Retention**
    - **Validates: Requirements 9.2**
  
  - [ ] 10.3 Write property test for tab switch focus transfer
    - **Property 15: Tab Switch Focus Transfer**
    - **Validates: Requirements 9.5**
  
  - [ ] 10.4 Write unit tests for keyboard navigation
    - Test tab key navigation
    - Test focus indicators
    - _Requirements: 9.3, 9.4_

- [ ] 11. Implement error handling
  - [ ] 11.1 Add Monaco Editor initialization error handling
    - Display error message if Monaco fails to load
    - Provide retry button
    - Fallback to read-only textarea
    - Log errors to console
    - _Requirements: 1.1_
  
  - [ ] 11.2 Add dataset metadata error handling
    - Display "N/A" for unavailable metadata
    - Show warning icon in Dataset Context Panel
    - Implement automatic retry (max 3 attempts)
    - _Requirements: 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 11.3 Add font loading fallback
    - Fallback to system monospace if JetBrains Mono fails
    - Log warning to console
    - Continue normal operation
    - _Requirements: 1.7, 6.5_
  
  - [ ] 11.4 Write unit tests for error scenarios
    - Test Monaco initialization failure
    - Test metadata fetch failure
    - Test font loading failure
    - _Requirements: 1.1, 4.2, 1.7_

- [ ] 12. Visual styling and VS Code parity
  - [ ] 12.1 Apply VS Code Dark Theme colors throughout
    - Verify all backgrounds match VS Code palette
    - Verify all borders and separators match VS Code
    - Verify muted grays for structural elements
    - Verify accent colors only on active states
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 12.2 Fine-tune spacing and typography
    - Match VS Code padding and margins
    - Verify font smoothing settings
    - Verify letter spacing
    - _Requirements: 6.7, 6.8_
  
  - [ ] 12.3 Write unit tests for theme compliance
    - Test background colors match VS Code
    - Test border colors match VS Code
    - Test font properties match VS Code
    - Test spacing values match VS Code
    - _Requirements: 6.1, 6.2, 6.5, 6.6, 6.8_

- [ ] 13. Implement responsive layout behavior
  - [ ] 13.1 Add layout adjustment logic
    - Expand editor when sidebar collapses
    - Expand editor when bottom panel collapses
    - Maintain minimum dimensions to prevent overlap
    - _Requirements: 8.4, 8.5, 8.6_
  
  - [ ] 13.2 Write unit tests for responsive behavior
    - Test editor expands when sidebar collapses
    - Test editor expands when bottom panel collapses
    - Test minimum dimension constraints
    - _Requirements: 8.4, 8.5, 8.6_

- [ ] 14. Integration and final wiring
  - [x] 14.1 Wire all components together in root
    - Connect all state management
    - Verify all event handlers work end-to-end
    - Test complete user workflows (open file, edit, switch tabs, toggle panels)
    - _Requirements: All_
  
  - [x] 14.2 Add no-iframe verification
    - Ensure no iframe elements are used
    - Verify all features are native React components
    - _Requirements: 10.3_
  
  - [ ] 14.3 Write integration tests for key workflows
    - Test: Open file → Edit → Mark dirty → Close
    - Test: Switch tabs → Editor updates → Focus transfers
    - Test: Toggle sidebar → Editor resizes → Focus retained
    - Test: Toggle bottom panel → Editor resizes
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 3.3, 3.4, 5.2, 8.4, 8.5, 9.2, 9.5_

- [ ] 15. Final checkpoint - Ensure all tests pass
  - Run all unit tests and verify 80%+ coverage
  - Run all property tests (100 iterations each)
  - Fix any failing tests
  - Verify VS Code visual parity manually
  - Ask the user if questions arise

## Notes

- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples, edge cases, and error conditions
- Monaco Editor should be mocked in unit tests but used in integration tests
- JetBrains Mono font is critical for VS Code parity - ensure it loads correctly
