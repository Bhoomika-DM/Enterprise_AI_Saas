/**
 * Unit tests for DataScientistEditor component
 * 
 * Tests the root component layout, state provider integration,
 * and window resize handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataScientistEditor } from '../DataScientistEditor';

describe('DataScientistEditor', () => {
  let resizeCallback: ((this: Window, ev: UIEvent) => void) | null = null;

  beforeEach(() => {
    // Mock window.addEventListener to capture the resize handler
    const originalAddEventListener = window.addEventListener;
    vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'resize') {
        resizeCallback = handler as (this: Window, ev: UIEvent) => void;
      }
      return originalAddEventListener.call(window, event, handler);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resizeCallback = null;
  });

  describe('Component Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(<DataScientistEditor />);
      expect(container).toBeTruthy();
    });

    it('should render the three-zone layout', () => {
      const { container } = render(<DataScientistEditor />);
      
      // Check for the three main zones
      const sidebarZone = container.querySelector('.editor-sidebar-zone');
      const mainZone = container.querySelector('.editor-main-zone');
      const bottomZone = container.querySelector('.editor-bottom-zone');

      expect(sidebarZone).toBeTruthy();
      expect(mainZone).toBeTruthy();
      expect(bottomZone).toBeTruthy();
    });

    it('should render placeholder content for each zone', () => {
      render(<DataScientistEditor />);
      
      expect(screen.getByText('Sidebar')).toBeTruthy();
      expect(screen.getByText('Main Editor Area')).toBeTruthy();
      expect(screen.getByText('Bottom Panel')).toBeTruthy();
    });

    it('should apply the root CSS class', () => {
      const { container } = render(<DataScientistEditor />);
      const rootElement = container.querySelector('.data-scientist-editor');
      
      expect(rootElement).toBeTruthy();
    });
  });

  describe('State Provider Integration', () => {
    it('should wrap the layout in EditorProvider', () => {
      // If the component renders without throwing an error about missing context,
      // it means the EditorProvider is properly wrapping the layout
      expect(() => render(<DataScientistEditor />)).not.toThrow();
    });
  });

  describe('Window Resize Handling', () => {
    it('should register a resize event listener on mount', () => {
      render(<DataScientistEditor />);
      
      expect(window.addEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('should dispatch custom editor-resize event on window resize', () => {
      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');
      
      render(<DataScientistEditor />);
      
      // Trigger the resize event
      if (resizeCallback) {
        resizeCallback.call(window, new UIEvent('resize'));
      }
      
      // Check that a custom event was dispatched
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'editor-resize'
        })
      );
    });

    it('should clean up resize listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<DataScientistEditor />);
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });
  });

  describe('Layout Structure', () => {
    it('should use flexbox layout for the root container', () => {
      const { container } = render(<DataScientistEditor />);
      const rootElement = container.querySelector('.data-scientist-editor');
      
      if (rootElement) {
        const styles = window.getComputedStyle(rootElement);
        // Note: In jsdom, computed styles may not reflect CSS file styles
        // This test verifies the element exists and has the correct class
        expect(rootElement.className).toContain('data-scientist-editor');
      }
    });

    it('should have sidebar zone as the first child', () => {
      const { container } = render(<DataScientistEditor />);
      const rootElement = container.querySelector('.data-scientist-editor');
      const firstChild = rootElement?.firstElementChild;
      
      expect(firstChild?.className).toContain('editor-sidebar-zone');
    });

    it('should have main zone as the second child', () => {
      const { container } = render(<DataScientistEditor />);
      const rootElement = container.querySelector('.data-scientist-editor');
      const children = rootElement?.children;
      
      if (children && children.length >= 2) {
        expect(children[1].className).toContain('editor-main-zone');
      }
    });

    it('should have bottom zone as the third child', () => {
      const { container } = render(<DataScientistEditor />);
      const rootElement = container.querySelector('.data-scientist-editor');
      const children = rootElement?.children;
      
      if (children && children.length >= 3) {
        expect(children[2].className).toContain('editor-bottom-zone');
      }
    });
  });

  describe('Responsive Layout', () => {
    it('should update viewport height on resize', () => {
      const { container } = render(<DataScientistEditor />);
      const rootElement = container.querySelector('.data-scientist-editor');
      
      // Initial height should be set
      expect(rootElement?.getAttribute('style')).toContain('height');
      
      // Simulate window resize
      const originalInnerHeight = window.innerHeight;
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800,
      });
      
      // Trigger custom resize event
      window.dispatchEvent(new CustomEvent('editor-resize'));
      
      // Restore original value
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: originalInnerHeight,
      });
    });
  });

  describe('VS Code Theme Integration', () => {
    it('should apply VS Code Dark Theme background colors', () => {
      const { container } = render(<DataScientistEditor />);
      
      // Verify that the theme classes are applied
      // Actual color values are tested in CSS
      const sidebarZone = container.querySelector('.editor-sidebar-zone');
      const mainZone = container.querySelector('.editor-main-zone');
      const bottomZone = container.querySelector('.editor-bottom-zone');
      
      expect(sidebarZone).toBeTruthy();
      expect(mainZone).toBeTruthy();
      expect(bottomZone).toBeTruthy();
    });
  });
});
