/**
 * Unit tests for EditorContext
 * 
 * Tests state initialization, file operations, and state update functions.
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { EditorProvider, useEditor } from '../EditorContext';
import { FileDescriptor } from '../../types/editor';

// Helper to render hook with provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <EditorProvider>{children}</EditorProvider>
);

describe('EditorContext', () => {
  describe('State Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      expect(result.current.state.openFiles).toEqual([]);
      expect(result.current.state.activeFileId).toBeNull();
      expect(result.current.state.sidebarExpanded).toBe(false);
      expect(result.current.state.activeSidebarPanel).toBe('explorer');
      expect(result.current.state.bottomPanelExpanded).toBe(false);
      expect(result.current.state.bottomPanelHeight).toBe(300);
      expect(result.current.state.activeBottomTab).toBe('terminal');
      expect(result.current.state.selectedDataset).toBe('raw');
    });

    it('should initialize with custom initial state', () => {
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <EditorProvider initialState={{ sidebarExpanded: true, bottomPanelHeight: 400 }}>
          {children}
        </EditorProvider>
      );

      const { result } = renderHook(() => useEditor(), { wrapper: customWrapper });

      expect(result.current.state.sidebarExpanded).toBe(true);
      expect(result.current.state.bottomPanelHeight).toBe(400);
    });

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useEditor());
      }).toThrow('useEditor must be used within an EditorProvider');

      console.error = originalError;
    });
  });

  describe('File Operations', () => {
    const mockFile: FileDescriptor = {
      id: 'file-1',
      name: 'test.py',
      path: '/test.py',
      language: 'python',
      content: 'print("hello")',
      isDirty: false,
    };

    const mockFile2: FileDescriptor = {
      id: 'file-2',
      name: 'query.sql',
      path: '/query.sql',
      language: 'sql',
      content: 'SELECT * FROM users;',
      isDirty: false,
    };

    it('should open a new file', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile(mockFile);
      });

      expect(result.current.state.openFiles).toHaveLength(1);
      expect(result.current.state.openFiles[0]).toEqual(mockFile);
      expect(result.current.state.activeFileId).toBe('file-1');
    });

    it('should not duplicate files when opening an already open file', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile(mockFile);
        result.current.openFile(mockFile);
      });

      expect(result.current.state.openFiles).toHaveLength(1);
      expect(result.current.state.activeFileId).toBe('file-1');
    });

    it('should open multiple files', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile(mockFile);
        result.current.openFile(mockFile2);
      });

      expect(result.current.state.openFiles).toHaveLength(2);
      expect(result.current.state.activeFileId).toBe('file-2');
    });

    it('should close a file', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile(mockFile);
        result.current.openFile(mockFile2);
        result.current.closeFile('file-1');
      });

      expect(result.current.state.openFiles).toHaveLength(1);
      expect(result.current.state.openFiles[0].id).toBe('file-2');
    });

    it('should switch to previous file when closing active file', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile(mockFile);
        result.current.openFile(mockFile2);
        result.current.closeFile('file-2'); // Close active file
      });

      expect(result.current.state.openFiles).toHaveLength(1);
      expect(result.current.state.activeFileId).toBe('file-1');
    });

    it('should set activeFileId to null when closing the last file', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile(mockFile);
        result.current.closeFile('file-1');
      });

      expect(result.current.state.openFiles).toHaveLength(0);
      expect(result.current.state.activeFileId).toBeNull();
    });

    it('should not change state when closing non-existent file', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile(mockFile);
      });

      const stateBefore = result.current.state;

      act(() => {
        result.current.closeFile('non-existent');
      });

      expect(result.current.state).toEqual(stateBefore);
    });
  });

  describe('Tab Switching', () => {
    const mockFile: FileDescriptor = {
      id: 'file-1',
      name: 'test.py',
      path: '/test.py',
      language: 'python',
      content: 'print("hello")',
      isDirty: false,
    };

    const mockFile2: FileDescriptor = {
      id: 'file-2',
      name: 'query.sql',
      path: '/query.sql',
      language: 'sql',
      content: 'SELECT * FROM users;',
      isDirty: false,
    };

    it('should switch to a different tab', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile(mockFile);
        result.current.openFile(mockFile2);
        result.current.switchTab('file-1');
      });

      expect(result.current.state.activeFileId).toBe('file-1');
    });

    it('should not switch to non-existent file', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile(mockFile);
      });

      act(() => {
        result.current.switchTab('non-existent');
      });

      expect(result.current.state.activeFileId).toBe('file-1');
    });
  });

  describe('File Content Updates', () => {
    const mockFile: FileDescriptor = {
      id: 'file-1',
      name: 'test.py',
      path: '/test.py',
      language: 'python',
      content: 'print("hello")',
      isDirty: false,
    };

    it('should update file content', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile(mockFile);
        result.current.updateFileContent('file-1', 'print("world")');
      });

      expect(result.current.state.openFiles[0].content).toBe('print("world")');
    });

    it('should mark file as dirty', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile(mockFile);
        result.current.markFileDirty('file-1', true);
      });

      expect(result.current.state.openFiles[0].isDirty).toBe(true);
    });

    it('should mark file as clean', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.openFile({ ...mockFile, isDirty: true });
        result.current.markFileDirty('file-1', false);
      });

      expect(result.current.state.openFiles[0].isDirty).toBe(false);
    });
  });

  describe('Sidebar Operations', () => {
    it('should toggle sidebar', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.state.sidebarExpanded).toBe(true);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.state.sidebarExpanded).toBe(false);
    });

    it('should set sidebar panel and expand', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.setSidebarPanel('search');
      });

      expect(result.current.state.sidebarExpanded).toBe(true);
      expect(result.current.state.activeSidebarPanel).toBe('search');
    });

    it('should collapse sidebar when clicking active panel', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.setSidebarPanel('explorer');
      });

      expect(result.current.state.sidebarExpanded).toBe(true);

      act(() => {
        result.current.setSidebarPanel('explorer');
      });

      expect(result.current.state.sidebarExpanded).toBe(false);
    });

    it('should switch panels without collapsing', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.setSidebarPanel('explorer');
        result.current.setSidebarPanel('search');
      });

      expect(result.current.state.sidebarExpanded).toBe(true);
      expect(result.current.state.activeSidebarPanel).toBe('search');
    });
  });

  describe('Bottom Panel Operations', () => {
    it('should toggle bottom panel', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.toggleBottomPanel();
      });

      expect(result.current.state.bottomPanelExpanded).toBe(true);

      act(() => {
        result.current.toggleBottomPanel();
      });

      expect(result.current.state.bottomPanelExpanded).toBe(false);
    });

    it('should set bottom panel height', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.setBottomPanelHeight(400);
      });

      expect(result.current.state.bottomPanelHeight).toBe(400);
    });

    it('should clamp bottom panel height to minimum', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.setBottomPanelHeight(100); // Below minimum of 150
      });

      expect(result.current.state.bottomPanelHeight).toBe(150);
    });

    it('should clamp bottom panel height to maximum (50% viewport)', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      // Mock window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1000,
      });

      act(() => {
        result.current.setBottomPanelHeight(600); // Above 50% of 1000
      });

      expect(result.current.state.bottomPanelHeight).toBe(500);
    });

    it('should set bottom tab', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.setBottomTab('output');
      });

      expect(result.current.state.activeBottomTab).toBe('output');
    });
  });

  describe('Dataset Operations', () => {
    it('should set selected dataset', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      act(() => {
        result.current.setSelectedDataset('cleaned');
      });

      expect(result.current.state.selectedDataset).toBe('cleaned');
    });

    it('should have dataset metadata structure', () => {
      const { result } = renderHook(() => useEditor(), { wrapper });

      expect(result.current.state.datasetMetadata).toHaveProperty('raw');
      expect(result.current.state.datasetMetadata).toHaveProperty('cleaned');
      expect(result.current.state.datasetMetadata.raw).toHaveProperty('rows');
      expect(result.current.state.datasetMetadata.raw).toHaveProperty('columns');
      expect(result.current.state.datasetMetadata.raw).toHaveProperty('missingPercentage');
      expect(result.current.state.datasetMetadata.raw).toHaveProperty('memoryUsage');
    });
  });
});
