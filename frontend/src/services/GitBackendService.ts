/**
 * GitBackendService - Real Git operations via backend API
 * 
 * Replaces browser-based isomorphic-git with backend Git commands
 * that operate on the real filesystem.
 */

const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:8000';

export interface GitFileStatus {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked' | 'renamed';
  staged: boolean;
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  timestamp: number;
  filesChanged: number;
}

class GitBackendService {
  private workspaceId: string = 'default';

  /**
   * Set workspace ID
   */
  setWorkspace(workspaceId: string): void {
    this.workspaceId = workspaceId;
  }

  /**
   * Initialize Git repository
   */
  async initRepo(): Promise<void> {
    const response = await fetch(`${API_BASE}/api/git/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId: this.workspaceId }),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize repository');
    }

    const result = await response.json();
    console.log('✅ Repository initialized:', result.path);
  }

  /**
   * Check if repository exists
   */
  async isGitRepo(): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE}/api/git/check?workspaceId=${this.workspaceId}`
      );

      if (!response.ok) return false;

      const result = await response.json();
      return result.isRepo;
    } catch (error) {
      console.error('Error checking repository:', error);
      return false;
    }
  }

  /**
   * Get repository status
   */
  async getStatus(): Promise<GitFileStatus[]> {
    const response = await fetch(
      `${API_BASE}/api/git/status?workspaceId=${this.workspaceId}`
    );

    if (!response.ok) {
      throw new Error('Failed to get status');
    }

    const result = await response.json();
    return result.changes || [];
  }

  /**
   * Get current branch
   */
  async getCurrentBranch(): Promise<string> {
    const response = await fetch(
      `${API_BASE}/api/git/check?workspaceId=${this.workspaceId}`
    );

    if (!response.ok) {
      return 'main';
    }

    const result = await response.json();
    return result.branch || 'main';
  }

  /**
   * Stage file(s)
   */
  async stageFile(filepath: string | string[]): Promise<void> {
    const files = Array.isArray(filepath) ? filepath : [filepath];

    const response = await fetch(`${API_BASE}/api/git/stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspaceId: this.workspaceId,
        files,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to stage file');
    }
  }

  /**
   * Unstage file(s)
   */
  async unstageFile(filepath: string | string[]): Promise<void> {
    const files = Array.isArray(filepath) ? filepath : [filepath];

    const response = await fetch(`${API_BASE}/api/git/unstage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspaceId: this.workspaceId,
        files,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to unstage file');
    }
  }

  /**
   * Commit staged changes
   */
  async commit(
    message: string,
    author?: { name: string; email: string }
  ): Promise<string> {
    const response = await fetch(`${API_BASE}/api/git/commit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspaceId: this.workspaceId,
        message,
        author: author || {
          name: 'User',
          email: 'user@example.com',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to commit');
    }

    const result = await response.json();
    return result.commitHash;
  }

  /**
   * Get commit history
   */
  async getLog(limit: number = 50): Promise<GitCommit[]> {
    const response = await fetch(
      `${API_BASE}/api/git/log?workspaceId=${this.workspaceId}&limit=${limit}`
    );

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    return result.commits || [];
  }

  /**
   * Get file diff
   */
  async getDiff(filepath: string, staged: boolean = false): Promise<string> {
    const response = await fetch(
      `${API_BASE}/api/git/diff?workspaceId=${this.workspaceId}&file=${encodeURIComponent(filepath)}&staged=${staged}`
    );

    if (!response.ok) {
      return '';
    }

    const result = await response.json();
    return result.diff || '';
  }

  /**
   * Get remote URL
   */
  async getRemoteUrl(remote: string = 'origin'): Promise<string | null> {
    try {
      const response = await fetch(
        `${API_BASE}/api/git/remote?workspaceId=${this.workspaceId}&name=${remote}`
      );

      if (!response.ok) return null;

      const result = await response.json();
      return result.url || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Push to remote (placeholder - requires backend implementation)
   */
  async push(
    remote: string = 'origin',
    branch?: string,
    credentials?: { username: string; password: string }
  ): Promise<void> {
    console.warn('Push operation requires backend implementation');
    throw new Error('Push operation not yet implemented in backend');
  }

  /**
   * Pull from remote (placeholder - requires backend implementation)
   */
  async pull(
    remote: string = 'origin',
    branch?: string,
    credentials?: { username: string; password: string }
  ): Promise<void> {
    console.warn('Pull operation requires backend implementation');
    throw new Error('Pull operation not yet implemented in backend');
  }

  /**
   * Fetch from remote (placeholder - requires backend implementation)
   */
  async fetch(
    remote: string = 'origin',
    credentials?: { username: string; password: string }
  ): Promise<void> {
    console.warn('Fetch operation requires backend implementation');
    throw new Error('Fetch operation not yet implemented in backend');
  }
}

export const gitBackendService = new GitBackendService();
