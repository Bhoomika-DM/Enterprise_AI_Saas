/**
 * GitCredentialsDialog Component
 * 
 * Dialog for entering Git credentials (username/token) for push/pull operations
 */

import React, { useState } from 'react';
import './GitCredentialsDialog.css';

interface GitCredentialsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (credentials: { username: string; password: string }, remember: boolean) => void;
  operation: 'push' | 'pull' | 'clone' | 'fetch';
}

export function GitCredentialsDialog({
  isOpen,
  onClose,
  onSubmit,
  operation,
}: GitCredentialsDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password }, remember);
    setUsername('');
    setPassword('');
    setRemember(true);
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setRemember(true);
    onClose();
  };

  return (
    <div className="git-credentials-overlay" onClick={handleCancel}>
      <div className="git-credentials-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>Git Credentials Required</h3>
          <button className="close-button" onClick={handleCancel}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="dialog-body">
          <p className="operation-info">
            Enter your credentials to {operation} to/from the remote repository.
          </p>

          <div className="credentials-info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4V8M8 11V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>
              For GitHub, use your username and a Personal Access Token (not your password).
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
                Create token →
              </a>
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-username"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Personal Access Token</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember credentials for this repository</span>
              </label>
              <p className="checkbox-hint">
                Credentials will be stored securely in your browser
              </p>
            </div>

            <div className="dialog-actions">
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="submit-button">
                {operation.charAt(0).toUpperCase() + operation.slice(1)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
