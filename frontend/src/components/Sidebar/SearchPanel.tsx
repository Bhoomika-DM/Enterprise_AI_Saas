/**
 * SearchPanel Component
 * 
 * Search functionality for finding text across all files in the workspace.
 * Supports case-sensitive search and regex patterns.
 */

import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { WorkspaceManager } from '../../services/WorkspaceManager';
import './SearchPanel.css';

interface SearchResult {
  filePath: string;
  fileName: string;
  lineNumber: number;
  lineContent: string;
  matchStart: number;
  matchEnd: number;
}

export function SearchPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { state, openFileFromWorkspace } = useEditor();

  const performSearch = () => {
    if (!searchQuery.trim() || !state.workspace) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Use setTimeout to avoid blocking UI
    setTimeout(() => {
      const foundResults: SearchResult[] = [];
      const workspaceManager = new WorkspaceManager();
      workspaceManager.setRoot(state.workspace.root);

      // Collect all files
      const collectFiles = (node: any, parentPath: string = ''): string[] => {
        const files: string[] = [];
        const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;

        if (node.type === 'file') {
          files.push(currentPath);
        } else if (node.type === 'folder' && node.children) {
          node.children.forEach((child: any) => {
            files.push(...collectFiles(child, currentPath));
          });
        }

        return files;
      };

      const allFiles = state.workspace.root.children?.flatMap((child: any) =>
        collectFiles(child, '')
      ) || [];

      // Search in each file
      allFiles.forEach(filePath => {
        const content = workspaceManager.readFile(filePath);
        if (!content) return;

        const lines = content.split('\n');
        lines.forEach((line, index) => {
          let matches: RegExpMatchArray | null = null;
          let matchStart = -1;

          if (useRegex) {
            try {
              const regex = new RegExp(searchQuery, caseSensitive ? 'g' : 'gi');
              const match = regex.exec(line);
              if (match) {
                matches = [match[0]];
                matchStart = match.index;
              }
            } catch (e) {
              // Invalid regex, skip
              return;
            }
          } else {
            const searchText = caseSensitive ? searchQuery : searchQuery.toLowerCase();
            const lineText = caseSensitive ? line : line.toLowerCase();
            matchStart = lineText.indexOf(searchText);
            if (matchStart !== -1) {
              matches = [line.substring(matchStart, matchStart + searchQuery.length)];
            }
          }

          if (matches && matchStart !== -1) {
            foundResults.push({
              filePath,
              fileName: filePath.split('/').pop() || filePath,
              lineNumber: index + 1,
              lineContent: line.trim(),
              matchStart,
              matchEnd: matchStart + matches[0].length,
            });
          }
        });
      });

      setResults(foundResults);
      setIsSearching(false);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    openFileFromWorkspace(result.filePath);
    // TODO: Jump to line number in editor
  };

  return (
    <div className="search-panel">
      <div className="panel-header">SEARCH</div>
      
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search in files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="search-button" onClick={performSearch}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 14L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="search-options">
        <button
          className={`option-button ${caseSensitive ? 'active' : ''}`}
          onClick={() => setCaseSensitive(!caseSensitive)}
          title="Match Case"
        >
          Aa
        </button>
        <button
          className={`option-button ${useRegex ? 'active' : ''}`}
          onClick={() => setUseRegex(!useRegex)}
          title="Use Regular Expression"
        >
          .*
        </button>
      </div>

      <div className="search-results">
        {isSearching ? (
          <div className="search-status">Searching...</div>
        ) : results.length === 0 && searchQuery ? (
          <div className="search-status">No results found</div>
        ) : results.length === 0 ? (
          <div className="search-status">Enter search query</div>
        ) : (
          <>
            <div className="results-count">
              {results.length} result{results.length !== 1 ? 's' : ''} in {new Set(results.map(r => r.filePath)).size} file{new Set(results.map(r => r.filePath)).size !== 1 ? 's' : ''}
            </div>
            <div className="results-list">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="result-file">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M4 2H9L12 5V13C12 13.5523 11.5523 14 11 14H4C3.44772 14 3 13.5523 3 13V3C3 2.44772 3.44772 2 4 2Z" fill="rgba(255, 255, 255, 0.1)" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <span>{result.fileName}</span>
                    <span className="result-line">:{result.lineNumber}</span>
                  </div>
                  <div className="result-content">
                    {result.lineContent}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
