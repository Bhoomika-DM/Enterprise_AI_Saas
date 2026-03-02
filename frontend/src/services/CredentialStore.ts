/**
 * CredentialStore - Secure credential storage for git operations
 * 
 * Stores credentials in browser localStorage with basic encryption.
 * Note: For production, consider using more secure storage methods.
 */

interface StoredCredential {
  username: string;
  token: string; // Encrypted
  remoteUrl: string;
  timestamp: number;
}

class CredentialStore {
  private readonly STORAGE_KEY = 'git_credentials';
  private readonly ENCRYPTION_KEY = 'git_cred_key_v1'; // In production, use a proper key

  /**
   * Simple XOR encryption (for demo purposes)
   * In production, use a proper encryption library like crypto-js
   */
  private encrypt(text: string): string {
    return btoa(text.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length))
    ).join(''));
  }

  private decrypt(encrypted: string): string {
    return atob(encrypted).split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length))
    ).join('');
  }

  /**
   * Save credentials for a remote URL
   */
  saveCredentials(remoteUrl: string, username: string, token: string): void {
    try {
      const credentials = this.getAllCredentials();
      
      const credential: StoredCredential = {
        username,
        token: this.encrypt(token),
        remoteUrl,
        timestamp: Date.now(),
      };

      // Remove existing credential for this remote
      const filtered = credentials.filter(c => c.remoteUrl !== remoteUrl);
      filtered.push(credential);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  }

  /**
   * Get credentials for a remote URL
   */
  getCredentials(remoteUrl: string): { username: string; password: string } | null {
    try {
      const credentials = this.getAllCredentials();
      const credential = credentials.find(c => c.remoteUrl === remoteUrl);

      if (!credential) {
        return null;
      }

      return {
        username: credential.username,
        password: this.decrypt(credential.token),
      };
    } catch (error) {
      console.error('Error getting credentials:', error);
      return null;
    }
  }

  /**
   * Remove credentials for a remote URL
   */
  removeCredentials(remoteUrl: string): void {
    try {
      const credentials = this.getAllCredentials();
      const filtered = credentials.filter(c => c.remoteUrl !== remoteUrl);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing credentials:', error);
    }
  }

  /**
   * Check if credentials exist for a remote URL
   */
  hasCredentials(remoteUrl: string): boolean {
    const credentials = this.getAllCredentials();
    return credentials.some(c => c.remoteUrl === remoteUrl);
  }

  /**
   * Get all stored credentials
   */
  private getAllCredentials(): StoredCredential[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error reading credentials:', error);
      return [];
    }
  }

  /**
   * Clear all stored credentials
   */
  clearAll(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  }

  /**
   * Get list of remote URLs with saved credentials
   */
  getSavedRemotes(): string[] {
    const credentials = this.getAllCredentials();
    return credentials.map(c => c.remoteUrl);
  }
}

export const credentialStore = new CredentialStore();
