/**
 * CodeMirrorEditor Component
 * 
 * VS Code-like code editor using CodeMirror 6 with LSP integration
 * Supports autocomplete, diagnostics, and hover from backend Language Server
 * 
 * Validates Requirements: 1.5, 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { useEffect, useRef, useState } from 'react';
import { EditorView, hoverTooltip } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { lineNumbers, highlightActiveLineGutter, highlightActiveLine } from '@codemirror/view';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { linter, Diagnostic as CMDiagnostic } from '@codemirror/lint';
import { debounce } from 'lodash';
import { languageService } from '../../services/LanguageService';
import type { Diagnostic } from '../../services/LanguageService';
import { 
  getTheme
} from './editorTheme';
import './CodeMirrorEditor.css';

interface EditorSettings {
  lineNumbers: boolean;
  wordWrap: boolean;
  fontSize: number;
  tabSize: number;
  bracketPairs: boolean;
  theme: string;
  minimap?: boolean;
  fontFamily?: string;
}

interface CodeMirrorEditorProps {
  value: string;
  language: 'python' | 'sql' | 'javascript' | 'typescript' | 'html' | 'css' | 'json';
  onChange?: (value: string) => void;
  onMount?: (view: EditorView) => void;
  settings?: EditorSettings;
  filePath?: string; // For LSP document URI
  enableLSP?: boolean; // Enable LSP features
}

// Helper function to get language extension
function getLanguageExtension(language: 'python' | 'sql' | 'javascript' | 'typescript' | 'html' | 'css' | 'json') {
  switch (language) {
    case 'python':
      return python();
    case 'sql':
      return sql();
    case 'javascript':
      return javascript();
    case 'typescript':
      return javascript({ typescript: true });
    case 'html':
      return html();
    case 'css':
      return css();
    case 'json':
      return json();
    default:
      return python();
  }
}

// Helper function to map LSP completion kind to CodeMirror type
function getCompletionType(kind: number): string {
  const kindMap: Record<number, string> = {
    1: 'text',
    2: 'method',
    3: 'function',
    4: 'constructor',
    5: 'field',
    6: 'variable',
    7: 'class',
    8: 'interface',
    9: 'module',
    10: 'property',
    11: 'unit',
    12: 'value',
    13: 'enum',
    14: 'keyword',
    15: 'snippet',
    16: 'color',
    17: 'file',
    18: 'reference',
    19: 'folder',
    20: 'enumMember',
    21: 'constant',
    22: 'struct',
    23: 'event',
    24: 'operator',
    25: 'typeParameter'
  };
  return kindMap[kind] || 'text';
}

// Helper function to get theme by name
function getThemeExtension(themeName: string) {
  return getTheme(themeName);
}

// Helper function to convert LSP position to CodeMirror offset
function positionToOffset(view: EditorView, line: number, character: number): number {
  try {
    const lineObj = view.state.doc.line(line + 1); // CodeMirror lines are 1-indexed
    return lineObj.from + Math.min(character, lineObj.length);
  } catch {
    return 0;
  }
}

// Helper function to convert CodeMirror offset to LSP position
function offsetToPosition(view: EditorView, offset: number): { line: number; character: number } {
  const line = view.state.doc.lineAt(offset);
  return {
    line: line.number - 1, // LSP lines are 0-indexed
    character: offset - line.from
  };
}

// Helper function to convert LSP diagnostics to CodeMirror format
function convertDiagnostics(view: EditorView, lspDiags: Diagnostic[]): CMDiagnostic[] {
  return lspDiags.map(diag => ({
    from: positionToOffset(view, diag.range.start.line, diag.range.start.character),
    to: positionToOffset(view, diag.range.end.line, diag.range.end.character),
    severity: diag.severity === 1 ? 'error' : diag.severity === 2 ? 'warning' : 'info',
    message: diag.message,
    source: diag.source
  }));
}

export function CodeMirrorEditor({
  value,
  language,
  onChange,
  onMount,
  settings = {
    lineNumbers: true,
    wordWrap: false,
    fontSize: 14,
    tabSize: 4,
    bracketPairs: true,
    theme: 'dark',
    minimap: false,
    fontFamily: 'Plus Jakarta Sans',
  },
  filePath = 'untitled',
  enableLSP = true,
}: CodeMirrorEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef(new Compartment());
  const lineNumbersCompartment = useRef(new Compartment());
  const wordWrapCompartment = useRef(new Compartment());
  const bracketMatchingCompartment = useRef(new Compartment());
  const tabSizeCompartment = useRef(new Compartment());
  const themeCompartment = useRef(new Compartment());
  const minimapCompartment = useRef(new Compartment());
  const [error, setError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const documentVersion = useRef(1);

  // LSP: Autocomplete function
  const lspCompletions = async (context: CompletionContext) => {
    if (!enableLSP || !viewRef.current) return null;

    const { state, pos } = context;
    const { line, character } = offsetToPosition(viewRef.current, pos);
    const uri = `file:///workspace/${filePath}`;

    try {
      const result = await languageService.requestCompletion(uri, line, character);
      
      if (!result || !result.items || result.items.length === 0) return null;

      return {
        from: pos,
        options: result.items.map((item: any) => ({
          label: item.label,
          type: getCompletionType(item.kind),
          detail: item.detail,
          info: item.documentation?.value || item.documentation
        }))
      };
    } catch (error) {
      console.error('Autocomplete error:', error);
      return null;
    }
  };

  // LSP: Hover tooltip function
  const lspHover = hoverTooltip(async (view, pos) => {
    if (!enableLSP) return null;

    const { line, character } = offsetToPosition(view, pos);
    const uri = `file:///workspace/${filePath}`;

    try {
      const result = await languageService.requestHover(uri, line, character);
      
      if (!result || !result.contents) return null;

      const content = typeof result.contents === 'string' 
        ? result.contents 
        : result.contents.value || JSON.stringify(result.contents);

      return {
        pos,
        above: true,
        create() {
          const dom = document.createElement('div');
          dom.className = 'cm-hover-tooltip';
          dom.textContent = content;
          return { dom };
        }
      };
    } catch (error) {
      console.error('Hover error:', error);
      return null;
    }
  });

  // LSP: Linter function
  const lspLinter = linter((view) => {
    if (!enableLSP || diagnostics.length === 0) return [];
    return convertDiagnostics(view, diagnostics);
  });

  // Debounced document change handler
  const debouncedDocumentChange = useRef(
    debounce((uri: string, version: number, text: string) => {
      if (enableLSP) {
        languageService.documentChanged(uri, version, text);
      }
    }, 300)
  ).current;

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    try {
      // Get language extension
      const languageExtension = getLanguageExtension(language);

      // Build extensions based on settings
      const extensions = [
        highlightActiveLineGutter(),
        highlightActiveLine(),
        indentOnInput(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        languageCompartment.current.of(languageExtension),
        lineNumbersCompartment.current.of(settings.lineNumbers ? lineNumbers() : []),
        wordWrapCompartment.current.of(settings.wordWrap ? EditorView.lineWrapping : []),
        bracketMatchingCompartment.current.of(settings.bracketPairs ? bracketMatching() : []),
        tabSizeCompartment.current.of(EditorState.tabSize.of(settings.tabSize)),
        themeCompartment.current.of(getThemeExtension(settings.theme)),
        // LSP Features
        enableLSP ? autocompletion({ override: [lspCompletions] }) : [],
        enableLSP ? lspHover : [],
        enableLSP ? lspLinter : [],
        // minimapCompartment.current.of(settings.minimap ? [showMinimap] : []), // Disabled due to compatibility issues
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            const newValue = update.state.doc.toString();
            onChange(newValue);
            
            // LSP: Send document change
            if (enableLSP) {
              documentVersion.current++;
              const uri = `file:///workspace/${filePath}`;
              debouncedDocumentChange(uri, documentVersion.current, newValue);
            }
          }
        }),
      ];

      // Create editor state
      const startState = EditorState.create({
        doc: value,
        extensions,
      });

      // Create editor view
      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      viewRef.current = view;

      // Apply font size and font family
      if (editorRef.current) {
        editorRef.current.style.fontSize = `${settings.fontSize}px`;
        if (settings.fontFamily) {
          editorRef.current.style.setProperty('--editor-font-family', `'${settings.fontFamily}'`);
        }
      }

      // Call onMount callback
      if (onMount) {
        onMount(view);
      }

      // Cleanup
      return () => {
        view.destroy();
        viewRef.current = null;
      };
    } catch (err) {
      console.error('Failed to initialize CodeMirror editor:', err);
      setError('Failed to initialize code editor');
    }
  }, []); // Only run on mount

  // Update content when value prop changes
  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== value) {
      const transaction = viewRef.current.state.update({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value,
        },
      });
      viewRef.current.dispatch(transaction);
    }
  }, [value]);

  // Update language when language prop changes
  useEffect(() => {
    if (!viewRef.current) return;

    const languageExtension = getLanguageExtension(language);
    
    // Reconfigure language compartment
    viewRef.current.dispatch({
      effects: languageCompartment.current.reconfigure(languageExtension),
    });
  }, [language]);

  // Update settings when they change
  useEffect(() => {
    if (!viewRef.current) return;

    console.log('🎨 Theme change detected:', settings.theme);

    const effects = [];

    // Line numbers
    effects.push(
      lineNumbersCompartment.current.reconfigure(
        settings.lineNumbers ? lineNumbers() : []
      )
    );

    // Word wrap
    effects.push(
      wordWrapCompartment.current.reconfigure(
        settings.wordWrap ? EditorView.lineWrapping : []
      )
    );

    // Bracket matching
    effects.push(
      bracketMatchingCompartment.current.reconfigure(
        settings.bracketPairs ? bracketMatching() : []
      )
    );

    // Tab size
    effects.push(
      tabSizeCompartment.current.reconfigure(
        EditorState.tabSize.of(settings.tabSize)
      )
    );

    // Theme
    const newTheme = getThemeExtension(settings.theme);
    console.log('🎨 Applying theme:', settings.theme, newTheme);
    effects.push(
      themeCompartment.current.reconfigure(newTheme)
    );

    // Minimap - Disabled due to compatibility issues with @replit/codemirror-minimap
    // effects.push(
    //   minimapCompartment.current.reconfigure(
    //     settings.minimap ? [showMinimap] : []
    //   )
    // );

    viewRef.current.dispatch({ effects });
    console.log('✅ Theme applied successfully');

    // Font size and font family (CSS)
    if (editorRef.current) {
      editorRef.current.style.fontSize = `${settings.fontSize}px`;
      if (settings.fontFamily) {
        editorRef.current.style.setProperty('--editor-font-family', `'${settings.fontFamily}'`);
      }
    }
  }, [settings.lineNumbers, settings.wordWrap, settings.fontSize, settings.tabSize, settings.bracketPairs, settings.theme, settings.minimap, settings.fontFamily]);

  // LSP: Document lifecycle management
  useEffect(() => {
    if (!enableLSP || !filePath) return;

    const uri = `file:///workspace/${filePath}`;
    
    // Send document opened event
    languageService.documentOpened(uri, language, value, documentVersion.current);
    console.log('📄 LSP: Document opened:', uri);

    // Cleanup: Send document closed event
    return () => {
      languageService.documentClosed(uri);
      console.log('📄 LSP: Document closed:', uri);
    };
  }, [filePath, language, enableLSP]); // Only when file/language changes

  // LSP: Listen for diagnostics
  useEffect(() => {
    if (!enableLSP) return;

    const unsubscribe = languageService.onDiagnostics((uri, diags) => {
      const currentUri = `file:///workspace/${filePath}`;
      if (uri === currentUri) {
        console.log('🔍 LSP: Received diagnostics:', diags.length);
        setDiagnostics(diags);
      }
    });

    return unsubscribe;
  }, [filePath, enableLSP]);

  if (error) {
    return (
      <div className="codemirror-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return <div ref={editorRef} className="codemirror-editor" />;
}
