/**
 * SourceControlPanel Component
 * 
 * Git source control interface with real git integration.
 * Shows modified, staged, and untracked files.
 */

import React, { useState, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { gitBackendService as gitService, GitFileStatus } from '../../services/GitBackendService';
import { credentialStore } from '../../services/CredentialStore';
import { GitCredentialsDialog } from './GitCredentialsDialog';
import './SourceControlPanel.css';

export function SourceControlPanel() {
  const [commitMessage, setCommitMessage] = useState('');
  const [changes, setChanges] = useState<GitFileStatus[]>([]);
  const [isGitRepo, setIsGitRepo] = useState(false);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [loading, setLoading] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<'push' | 'pull' | 'fetch' | null>(null);
  const { state, openFileFromWorkspace } = useEditor();

  useEffect(() => {
    loadGitStatus();
    const interval = setInterval(loadGitStatus, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const loadGitStatus = async () => {
    try {
      const isRepo = await gitService.isGitRepo();
      setIsGitRepo(isRepo);

      if (isRepo) {
        const status = await gitService.getStatus();
        setChanges(status);
        
        const branch = await gitService.getCurrentBranch();
        setCurrentBranch(branch);

        const url = await gitService.getRemoteUrl();
        setRemoteUrl(url);
      } else {
        // Fallback to dirty file detection
        const detectedChanges: GitFileStatus[] = state.openFiles
          .filter(file => file.isDirty)
          .map(file => ({
            path: file.path,
            status: 'modified' as const,
            staged: false,
          }));
        setChanges(detectedChanges);
      }
    } catch (error) {
      console.error('Error loading git status:', error);
    }
  };

  const handleStage = async (filepath: string) => {
    try {
      setLoading(true);
      await gitService.stageFile(filepath);
      await loadGitStatus();
    } catch (error) {
      alert(`Error staging file: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstage = async (filepath: string) => {
    try {
      setLoading(true);
      await gitService.unstageFile(filepath);
      await loadGitStatus();
    } catch (error) {
      alert(`Error unstaging file: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStageAll = async () => {
    try {
      setLoading(true);
      const unstagedFiles = changes.filter(c => !c.staged);
      for (const file of unstagedFiles) {
        await gitService.stageFile(file.path);
      }
      await loadGitStatus();
    } catch (error) {
      alert(`Error staging files: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      alert('Please enter a commit message');
      return;
    }

    const stagedFiles = changes.filter(c => c.staged);
    if (stagedFiles.length === 0) {
      alert('No staged changes to commit');
      return;
    }

    try {
      setLoading(true);
      if (isGitRepo) {
        const sha = await gitService.commit(commitMessage);
        alert(`Committed successfully!\nSHA: ${sha.substring(0, 7)}`);
      } else {
        alert(`Simulated commit of ${stagedFiles.length} file(s):\n"${commitMessage}"\n\nNote: Initialize a git repository to enable real commits.`);
      }
      setCommitMessage('');
      await loadGitStatus();
    } catch (error) {
      alert(`Error committing: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePush = async () => {
    if (!remoteUrl) {
      alert('No remote repository configured. Add a remote first.');
      return;
    }

    // Check if we have saved credentials
    const savedCreds = credentialStore.getCredentials(remoteUrl);
    if (savedCreds) {
      // Use saved credentials directly
      await performOperation('push', savedCreds);
    } else {
      // Ask for credentials
      setPendingOperation('push');
      setShowCredentialsDialog(true);
    }
  };

  const handlePull = async () => {
    if (!remoteUrl) {
      alert('No remote repository configured. Add a remote first.');
      return;
    }

    const savedCreds = credentialStore.getCredentials(remoteUrl);
    if (savedCreds) {
      await performOperation('pull', savedCreds);
    } else {
      setPendingOperation('pull');
      setShowCredentialsDialog(true);
    }
  };

  const handleSync = async () => {
    if (!remoteUrl) {
      alert('No remote repository configured. Add a remote first.');
      return;
    }

    const savedCreds = credentialStore.getCredentials(remoteUrl);
    if (savedCreds) {
      await performOperation('fetch', savedCreds);
    } else {
      setPendingOperation('fetch');
      setShowCredentialsDialog(true);
    }
  };

  const handleInitRepo = async () => {
    try {
      setLoading(true);
      await gitService.initRepo('main');
      alert('Git repository initialized successfully!');
      await loadGitStatus();
    } catch (error) {
      alert(`Error initializing repository: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const performOperation = async (
    operation: 'push' | 'pull' | 'fetch',
    credentials: { username: string; password: string }
  ) => {
    setLoading(true);

    try {
      if (operation === 'push') {
        await gitService.push('origin', undefined, credentials);
        alert('Pushed successfully!');
      } else if (operation === 'pull') {
        await gitService.pull('origin', undefined, credentials);
        alert('Pulled successfully!');
      } else if (operation === 'fetch') {
        await gitService.fetch('origin', credentials);
        alert('Fetched successfully!');
      }
      await loadGitStatus();
    } catch (error: any) {
      alert(`Error during ${operation}: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsSubmit = async (
    credentials: { username: string; password: string },
    remember: boolean
  ) => {
    setShowCredentialsDialog(false);

    // Save credentials if user wants to remember them
    if (remember && remoteUrl) {
      credentialStore.saveCredentials(remoteUrl, credentials.username, credentials.password);
    }

    if (pendingOperation) {
      await performOperation(pendingOperation, credentials);
      setPendingOperation(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'modified':
        return (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" fill="#C96731" fillOpacity="0.3" stroke="#C96731" strokeWidth="1.5"/>
            <text x="8" y="11" fontSize="10" fill="#C96731" textAnchor="middle" fontWeight="bold">M</text>
          </svg>
        );
      case 'added':
      case 'staged':
        return (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" fill="rgba(34, 197, 94, 0.3)" stroke="rgb(34, 197, 94)" strokeWidth="1.5"/>
            <text x="8" y="11" fontSize="10" fill="rgb(34, 197, 94)" textAnchor="middle" fontWeight="bold">A</text>
          </svg>
        );
      case 'deleted':
        return (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" fill="rgba(239, 68, 68, 0.3)" stroke="rgb(239, 68, 68)" strokeWidth="1.5"/>
            <text x="8" y="11" fontSize="10" fill="rgb(239, 68, 68)" textAnchor="middle" fontWeight="bold">D</text>
          </svg>
        );
      case 'untracked':
        return (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" fill="rgba(59, 130, 246, 0.3)" stroke="rgb(59, 130, 246)" strokeWidth="1.5"/>
            <text x="8" y="11" fontSize="10" fill="rgb(59, 130, 246)" textAnchor="middle" fontWeight="bold">U</text>
          </svg>
        );
      default:
        return null;
    }
  };

  const stagedChanges = changes.filter(c => c.staged);
  const unstagedChanges = changes.filter(c => !c.staged);

  return (
    <div className="source-control-panel">
      <div className="panel-header">SOURCE CONTROL</div>

      <div className="commit-section">
        <textarea
          className="commit-message"
          placeholder="Message (Ctrl+Enter to commit)"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleCommit();
            }
          }}
          rows={3}
          disabled={loading}
        />
        <button
          className="commit-button"
          onClick={handleCommit}
          disabled={!commitMessage.trim() || stagedChanges.length === 0 || loading}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13 5L6 12L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Commit ({stagedChanges.length})
        </button>
      </div>

      {isGitRepo && remoteUrl && (
        <div className="sync-section">
          <button
            className="sync-button"
            onClick={handleSync}
            disabled={loading}
            title="Sync with remote"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8C3 5.23858 5.23858 3 8 3C9.36 3 10.59 3.54 11.5 4.4M11.5 4.4V2M11.5 4.4H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sync Changes
          </button>
          <div className="sync-actions">
            <button
              className="action-button"
              onClick={handlePull}
              disabled={loading}
              title="Pull from remote"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 12V4M8 12L5 9M8 12L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Pull
            </button>
            <button
              className="action-button"
              onClick={handlePush}
              disabled={loading}
              title="Push to remote"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Push
            </button>
          </div>
        </div>
      )}

      {unstagedChanges.length > 0 && (
        <div className="changes-section">
          <div className="section-title">
            <span>CHANGES ({unstagedChanges.length})</span>
            <button
              className="stage-all-button"
              onClick={handleStageAll}
              disabled={loading}
              title="Stage All Changes"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="changes-list">
            {unstagedChanges.map((change, index) => (
              <div key={index} className="change-item">
                <div className="change-icon">
                  {getStatusIcon(change.status)}
                </div>
                <div
                  className="change-name"
                  onClick={() => openFileFromWorkspace(change.path)}
                >
                  {change.path}
                </div>
                <button
                  className="stage-button"
                  onClick={() => handleStage(change.path)}
                  disabled={loading}
                  title="Stage Changes"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {stagedChanges.length > 0 && (
        <div className="changes-section">
          <div className="section-title">
            STAGED CHANGES ({stagedChanges.length})
          </div>

          <div className="changes-list">
            {stagedChanges.map((change, index) => (
              <div key={index} className="change-item">
                <div className="change-icon">
                  {getStatusIcon(change.status)}
                </div>
                <div
                  className="change-name"
                  onClick={() => openFileFromWorkspace(change.path)}
                >
                  {change.path}
                </div>
                <button
                  className="stage-button"
                  onClick={() => handleUnstage(change.path)}
                  disabled={loading}
                  title="Unstage Changes"
                >
                  −
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {changes.length === 0 && (
        <div className="no-changes">
          <div className="no-changes-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>No Changes</h3>
          <p className="no-changes-description">
            {isGitRepo 
              ? 'Your working tree is clean. All changes have been committed.'
              : 'Make changes to files to see them here. Files will appear as you edit them.'}
          </p>
          {!isGitRepo && (
            <div className="no-changes-actions">
              <div className="no-changes-hint">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 4V8M8 11V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Initialize a git repository to enable version control</span>
              </div>
              <button
                className="init-repo-button"
                onClick={handleInitRepo}
                disabled={loading}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L3 7L8 12L13 7L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Initialize Repository
              </button>
            </div>
          )}
        </div>
      )}

      <div className="git-info">
        <div className="info-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L3 7L8 12L13 7L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{currentBranch}</span>
        </div>
        <div className="info-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>{isGitRepo ? 'Git repository' : 'Local workspace'}</span>
        </div>
        {remoteUrl && (
          <div className="info-item remote-url" title={remoteUrl}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1C4.13 1 1 4.13 1 8C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8C15 4.13 11.87 1 8 1Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 1C9.5 3 10 5.5 10 8C10 10.5 9.5 13 8 15M8 1C6.5 3 6 5.5 6 8C6 10.5 6.5 13 8 15M1 8H15" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="remote-url-text">{remoteUrl.split('/').pop()}</span>
          </div>
        )}
      </div>

      <GitCredentialsDialog
        isOpen={showCredentialsDialog}
        onClose={() => {
          setShowCredentialsDialog(false);
          setPendingOperation(null);
        }}
        onSubmit={handleCredentialsSubmit}
        operation={pendingOperation || 'push'}
      />
    </div>
  );
}
