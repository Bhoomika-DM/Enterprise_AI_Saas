/**
 * GitService - Browser-based Git operations
 * 
 * Uses isomorphic-git for git operations in the browser.
 * Requires File System Access API support.
 */

import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';

export interface GitFileStatus {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked' | 'staged';
  staged: boolean;
}

export interface GitCommitInfo {
  oid: string;
  message: string;
  author: string;
  timestamp: number;
}

class GitService {
  private fs: any = null;
  private dir: string = '';

  /**
   * Initialize git service with file system handle
   */
  async initialize(dirHandle: FileSystemDirectoryHandle) {
    // Create a simple FS adapter for isomorphic-git
    this.fs = {
      promises: {
        readFile: async (filepath: string) => {
          const handle = await this.getFileHandle(dirHandle, filepath);
          const file = await handle.getFile();
          return new Uint8Array(await file.arrayBuffer());
        },
        writeFile: async (filepath: string, data: Uint8Array) => {
          const handle = await this.getFileHandle(dirHandle, filepath, true);
          const writable = await handle.createWritable();
          await writable.write(data);
          await writable.close();
        },
        readdir: async (filepath: string) => {
          const handle = await this.getDirHandle(dirHandle, filepath);
          const entries = [];
          for await (const entry of handle.values()) {
            entries.push(entry.name);
          }
          return entries;
        },
        mkdir: async (filepath: string) => {
          await this.getDirHandle(dirHandle, filepath, true);
        },
        rmdir: async (filepath: string) => {
          // Not implemented for safety
        },
        unlink: async (filepath: string) => {
          // Not implemented for safety
        },
        stat: async (filepath: string) => {
          try {
            const handle = await this.getFileHandle(dirHandle, filepath);
            const file = await handle.getFile();
            return {
              isFile: () => true,
              isDirectory: () => false,
              size: file.size,
              mtimeMs: file.lastModified,
            };
          } catch {
            const handle = await this.getDirHandle(dirHandle, filepath);
            return {
              isFile: () => false,
              isDirectory: () => true,
              size: 0,
              mtimeMs: Date.now(),
            };
          }
        },
        lstat: async (filepath: string) => {
          return this.fs.promises.stat(filepath);
        },
      },
    };
    this.dir = '/';
  }

  private async getFileHandle(
    dirHandle: FileSystemDirectoryHandle,
    filepath: string,
    create: boolean = false
  ): Promise<FileSystemFileHandle> {
    const parts = filepath.split('/').filter(p => p);
    let currentHandle: any = dirHandle;

    for (let i = 0; i < parts.length - 1; i++) {
      currentHandle = await currentHandle.getDirectoryHandle(parts[i], { create });
    }

    return await currentHandle.getFileHandle(parts[parts.length - 1], { create });
  }

  private async getDirHandle(
    dirHandle: FileSystemDirectoryHandle,
    filepath: string,
    create: boolean = false
  ): Promise<FileSystemDirectoryHandle> {
    if (!filepath || filepath === '/' || filepath === '.') {
      return dirHandle;
    }

    const parts = filepath.split('/').filter(p => p);
    let currentHandle: FileSystemDirectoryHandle = dirHandle;

    for (const part of parts) {
      currentHandle = await currentHandle.getDirectoryHandle(part, { create });
    }

    return currentHandle;
  }

  /**
   * Get status of all files in the repository
   */
  async getStatus(): Promise<GitFileStatus[]> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    try {
      const status = await git.statusMatrix({
        fs: this.fs,
        dir: this.dir,
      });

      return status
        .filter(([filepath, , worktreeStatus, stageStatus]) => {
          // Filter out unchanged files
          return worktreeStatus !== 1 || stageStatus !== 1;
        })
        .map(([filepath, , worktreeStatus, stageStatus]) => {
          let fileStatus: GitFileStatus['status'] = 'modified';
          let staged = false;

          if (worktreeStatus === 0 && stageStatus === 0) {
            fileStatus = 'deleted';
          } else if (worktreeStatus === 2 && stageStatus === 0) {
            fileStatus = 'untracked';
          } else if (worktreeStatus === 2 && stageStatus === 2) {
            fileStatus = 'added';
            staged = true;
          } else if (stageStatus === 2) {
            fileStatus = 'modified';
            staged = true;
          } else if (stageStatus === 3) {
            fileStatus = 'staged';
            staged = true;
          }

          return {
            path: filepath,
            status: fileStatus,
            staged,
          };
        });
    } catch (error) {
      console.error('Error getting git status:', error);
      return [];
    }
  }

  /**
   * Stage a file
   */
  async stageFile(filepath: string): Promise<void> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    await git.add({
      fs: this.fs,
      dir: this.dir,
      filepath,
    });
  }

  /**
   * Unstage a file
   */
  async unstageFile(filepath: string): Promise<void> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    await git.resetIndex({
      fs: this.fs,
      dir: this.dir,
      filepath,
    });
  }

  /**
   * Commit staged changes
   */
  async commit(message: string, author?: { name: string; email: string }): Promise<string> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    const defaultAuthor = author || {
      name: 'User',
      email: 'user@example.com',
    };

    const sha = await git.commit({
      fs: this.fs,
      dir: this.dir,
      message,
      author: defaultAuthor,
    });

    return sha;
  }

  /**
   * Get commit history
   */
  async getLog(depth: number = 10): Promise<GitCommitInfo[]> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    try {
      const commits = await git.log({
        fs: this.fs,
        dir: this.dir,
        depth,
      });

      return commits.map(commit => ({
        oid: commit.oid,
        message: commit.commit.message,
        author: `${commit.commit.author.name} <${commit.commit.author.email}>`,
        timestamp: commit.commit.author.timestamp * 1000,
      }));
    } catch (error) {
      console.error('Error getting git log:', error);
      return [];
    }
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch(): Promise<string> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    try {
      const branch = await git.currentBranch({
        fs: this.fs,
        dir: this.dir,
      });
      return branch || 'main';
    } catch (error) {
      return 'main';
    }
  }

  /**
   * Push to remote repository
   */
  async push(
    remote: string = 'origin',
    branch?: string,
    credentials?: { username: string; password: string }
  ): Promise<void> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    const currentBranch = branch || await this.getCurrentBranch();

    await git.push({
      fs: this.fs,
      http,
      dir: this.dir,
      remote,
      ref: currentBranch,
      onAuth: () => credentials || { username: '', password: '' },
    });
  }

  /**
   * Pull from remote repository
   */
  async pull(
    remote: string = 'origin',
    branch?: string,
    credentials?: { username: string; password: string }
  ): Promise<void> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    const currentBranch = branch || await this.getCurrentBranch();

    await git.pull({
      fs: this.fs,
      http,
      dir: this.dir,
      remote,
      ref: currentBranch,
      onAuth: () => credentials || { username: '', password: '' },
      author: {
        name: 'User',
        email: 'user@example.com',
      },
    });
  }

  /**
   * Fetch from remote repository
   */
  async fetch(
    remote: string = 'origin',
    credentials?: { username: string; password: string }
  ): Promise<void> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    await git.fetch({
      fs: this.fs,
      http,
      dir: this.dir,
      remote,
      onAuth: () => credentials || { username: '', password: '' },
    });
  }

  /**
   * Clone a repository
   */
  async clone(
    url: string,
    dirHandle: FileSystemDirectoryHandle,
    credentials?: { username: string; password: string }
  ): Promise<void> {
    await this.initialize(dirHandle);

    await git.clone({
      fs: this.fs,
      http,
      dir: this.dir,
      url,
      onAuth: () => credentials || { username: '', password: '' },
    });
  }

  /**
   * Get list of branches
   */
  async getBranches(): Promise<string[]> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    try {
      const branches = await git.listBranches({
        fs: this.fs,
        dir: this.dir,
      });
      return branches;
    } catch (error) {
      console.error('Error getting branches:', error);
      return [];
    }
  }

  /**
   * Create a new branch
   */
  async createBranch(branchName: string, checkout: boolean = true): Promise<void> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    await git.branch({
      fs: this.fs,
      dir: this.dir,
      ref: branchName,
      checkout,
    });
  }

  /**
   * Switch to a different branch
   */
  async checkoutBranch(branchName: string): Promise<void> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    await git.checkout({
      fs: this.fs,
      dir: this.dir,
      ref: branchName,
    });
  }

  /**
   * Delete a branch
   */
  async deleteBranch(branchName: string): Promise<void> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    await git.deleteBranch({
      fs: this.fs,
      dir: this.dir,
      ref: branchName,
    });
  }

  /**
   * Get remote URL
   */
  async getRemoteUrl(remote: string = 'origin'): Promise<string | null> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    try {
      const config = await git.getConfig({
        fs: this.fs,
        dir: this.dir,
        path: `remote.${remote}.url`,
      });
      return config || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Add a remote
   */
  async addRemote(name: string, url: string): Promise<void> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    await git.addRemote({
      fs: this.fs,
      dir: this.dir,
      remote: name,
      url,
    });
  }

  /**
   * Get diff for a file
   */
  async getDiff(filepath: string): Promise<string> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    try {
      // Get HEAD commit
      const commits = await git.log({
        fs: this.fs,
        dir: this.dir,
        depth: 1,
      });

      if (commits.length === 0) {
        return 'No commits yet';
      }

      // Read current file
      const currentContent = await this.fs.promises.readFile(filepath, 'utf8');

      // Read file from HEAD
      const headContent = await git.readBlob({
        fs: this.fs,
        dir: this.dir,
        oid: commits[0].oid,
        filepath,
      });

      // Simple diff (you might want to use a proper diff library)
      return `--- a/${filepath}\n+++ b/${filepath}\n\nOld:\n${new TextDecoder().decode(headContent.blob)}\n\nNew:\n${currentContent}`;
    } catch (error) {
      console.error('Error getting diff:', error);
      return 'Error getting diff';
    }
  }

  /**
   * Check if directory is a git repository
   */
  async isGitRepo(): Promise<boolean> {
    if (!this.fs) {
      return false;
    }

    try {
      await git.currentBranch({
        fs: this.fs,
        dir: this.dir,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Initialize a new git repository
   */
  async initRepo(defaultBranch: string = 'main'): Promise<void> {
    if (!this.fs) {
      throw new Error('Git service not initialized');
    }

    await git.init({
      fs: this.fs,
      dir: this.dir,
      defaultBranch,
    });
  }
}

export const gitService = new GitService();
