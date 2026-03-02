/**
 * LanguageService - LSP Client for Backend-Driven IDE
 * 
 * Manages Language Server Protocol communication with backend.
 * Handles language switching, autocomplete, diagnostics, and hover info.
 */

interface LanguageConfig {
  language: string;
  lspEndpoint: string;
  runtime: RuntimeInfo;
  features: FeatureFlags;
  extensions: string[];
  editorConfig: EditorConfig;
}

interface RuntimeInfo {
  name: string;
  version: string;
  path: string;
}

interface FeatureFlags {
  autocomplete: boolean;
  diagnostics: boolean;
  hover: boolean;
  formatting: boolean;
  debugging: boolean;
  execution: boolean;
}

interface EditorConfig {
  tabSize: number;
  insertSpaces: boolean;
  fileExtensions: string[];
}

interface LSPMessage {
  jsonrpc: string;
  id?: number;
  method?: string;
  params?: any;
  result?: any;
  error?: any;
}

interface Position {
  line: number;
  character: number;
}

interface Range {
  start: Position;
  end: Position;
}

interface Diagnostic {
  range: Range;
  severity: number; // 1=Error, 2=Warning, 3=Info, 4=Hint
  message: string;
  source?: string;
}

type LanguageChangeListener = (config: LanguageConfig) => void;
type DiagnosticsListener = (uri: string, diagnostics: Diagnostic[]) => void;
type ConnectionStatusListener = (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void;

class LanguageService {
  private lspSocket: WebSocket | null = null;
  private currentLanguage: string | null = null;
  private config: LanguageConfig | null = null;
  private messageId = 0;
  private pendingRequests = new Map<number, (result: any) => void>();
  private languageChangeListeners: LanguageChangeListener[] = [];
  private diagnosticsListeners: DiagnosticsListener[] = [];
  private connectionStatusListeners: ConnectionStatusListener[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private backendUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

  /**
   * Switch to a new language
   */
  async switchLanguage(language: string, fileId: string, workspaceId: string = 'default'): Promise<void> {
    console.log(`🔄 Switching language to: ${language}`);
    
    // 1. Disconnect old LSP
    this.disconnect();

    try {
      // 2. Request language config from backend
      this.notifyConnectionStatus('connecting');
      
      const response = await fetch(`${this.backendUrl}/api/language/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, fileId, workspaceId }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
      }

      const config: LanguageConfig = await response.json();
      this.config = config;
      this.currentLanguage = language;

      console.log('✅ Language config received:', this.config);

      // 3. Connect to new LSP endpoint
      await this.connect(config.lspEndpoint);

      // 4. Notify listeners (update UI)
      this.notifyLanguageChanged(config);
      this.reconnectAttempts = 0; // Reset on successful connection
    } catch (error) {
      console.error('❌ Failed to switch language:', error);
      this.notifyConnectionStatus('error');
      throw error;
    }
  }

  /**
   * Connect to LSP WebSocket
   */
  private async connect(endpoint: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`🔌 Connecting to LSP: ${endpoint}`);
      
      try {
        this.lspSocket = new WebSocket(endpoint);

        this.lspSocket.onopen = () => {
          console.log('✅ LSP connected');
          this.notifyConnectionStatus('connected');
          this.sendInitialize();
          resolve();
        };

        this.lspSocket.onmessage = (event) => {
          try {
            const message: LSPMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse LSP message:', error);
          }
        };

        this.lspSocket.onerror = (error) => {
          console.error('❌ LSP WebSocket error:', error);
          this.notifyConnectionStatus('error');
          reject(error);
        };

        this.lspSocket.onclose = () => {
          console.log('🔌 LSP disconnected');
          this.notifyConnectionStatus('disconnected');
          this.handleDisconnect();
        };
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from LSP
   */
  private disconnect(): void {
    if (this.lspSocket) {
      this.lspSocket.close();
      this.lspSocket = null;
    }
    this.pendingRequests.clear();
  }

  /**
   * Send LSP initialize request
   */
  private sendInitialize(): void {
    this.send({
      jsonrpc: '2.0',
      id: this.nextId(),
      method: 'initialize',
      params: {
        processId: null,
        rootUri: 'file:///workspace',
        capabilities: {
          textDocument: {
            completion: { dynamicRegistration: true },
            hover: { dynamicRegistration: true },
            signatureHelp: { dynamicRegistration: true },
            publishDiagnostics: { relatedInformation: true },
          },
        },
      },
    });
  }

  /**
   * Document opened
   */
  documentOpened(uri: string, languageId: string, text: string, version: number = 1): void {
    this.send({
      jsonrpc: '2.0',
      method: 'textDocument/didOpen',
      params: {
        textDocument: { uri, languageId, version, text },
      },
    });
  }

  /**
   * Document changed
   */
  documentChanged(uri: string, version: number, text: string): void {
    this.send({
      jsonrpc: '2.0',
      method: 'textDocument/didChange',
      params: {
        textDocument: { uri, version },
        contentChanges: [{ text }], // Full document sync
      },
    });
  }

  /**
   * Document closed
   */
  documentClosed(uri: string): void {
    this.send({
      jsonrpc: '2.0',
      method: 'textDocument/didClose',
      params: {
        textDocument: { uri },
      },
    });
  }

  /**
   * Request autocomplete
   */
  async requestCompletion(uri: string, line: number, character: number): Promise<any> {
    const id = this.nextId();
    
    return new Promise((resolve) => {
      this.pendingRequests.set(id, resolve);
      
      this.send({
        jsonrpc: '2.0',
        id,
        method: 'textDocument/completion',
        params: {
          textDocument: { uri },
          position: { line, character },
        },
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          resolve(null);
        }
      }, 5000);
    });
  }

  /**
   * Request hover info
   */
  async requestHover(uri: string, line: number, character: number): Promise<any> {
    const id = this.nextId();
    
    return new Promise((resolve) => {
      this.pendingRequests.set(id, resolve);
      
      this.send({
        jsonrpc: '2.0',
        id,
        method: 'textDocument/hover',
        params: {
          textDocument: { uri },
          position: { line, character },
        },
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          resolve(null);
        }
      }, 5000);
    });
  }

  /**
   * Handle incoming LSP messages
   */
  private handleMessage(message: LSPMessage): void {
    // Response to a request
    if (message.id !== undefined && this.pendingRequests.has(message.id)) {
      const resolve = this.pendingRequests.get(message.id)!;
      resolve(message.result || message.error);
      this.pendingRequests.delete(message.id);
      return;
    }

    // Notification from server
    if (message.method === 'textDocument/publishDiagnostics') {
      this.handleDiagnostics(message.params);
    } else if (message.method === 'window/showMessage') {
      console.log('LSP Message:', message.params.message);
    }
  }

  /**
   * Handle diagnostics (errors/warnings)
   */
  private handleDiagnostics(params: any): void {
    const { uri, diagnostics } = params;
    console.log(`📋 Diagnostics for ${uri}:`, diagnostics);
    
    // Notify all listeners
    this.diagnosticsListeners.forEach(listener => {
      listener(uri, diagnostics);
    });
  }

  /**
   * Send message to LSP
   */
  private send(message: LSPMessage): void {
    if (this.lspSocket && this.lspSocket.readyState === WebSocket.OPEN) {
      this.lspSocket.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send LSP message: WebSocket not connected');
    }
  }

  private nextId(): number {
    return ++this.messageId;
  }

  /**
   * Handle disconnection with reconnection logic
   */
  private handleDisconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.config) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        if (this.config) {
          this.connect(this.config.lspEndpoint).catch(error => {
            console.error('Reconnection failed:', error);
          });
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  /**
   * Event listeners
   */
  onLanguageChanged(listener: LanguageChangeListener): () => void {
    this.languageChangeListeners.push(listener);
    return () => {
      const index = this.languageChangeListeners.indexOf(listener);
      if (index > -1) {
        this.languageChangeListeners.splice(index, 1);
      }
    };
  }

  onDiagnostics(listener: DiagnosticsListener): () => void {
    this.diagnosticsListeners.push(listener);
    return () => {
      const index = this.diagnosticsListeners.indexOf(listener);
      if (index > -1) {
        this.diagnosticsListeners.splice(index, 1);
      }
    };
  }

  onConnectionStatus(listener: ConnectionStatusListener): () => void {
    this.connectionStatusListeners.push(listener);
    return () => {
      const index = this.connectionStatusListeners.indexOf(listener);
      if (index > -1) {
        this.connectionStatusListeners.splice(index, 1);
      }
    };
  }

  private notifyLanguageChanged(config: LanguageConfig): void {
    this.languageChangeListeners.forEach(listener => listener(config));
  }

  private notifyConnectionStatus(status: 'connected' | 'disconnected' | 'connecting' | 'error'): void {
    this.connectionStatusListeners.forEach(listener => listener(status));
  }

  /**
   * Get current language config
   */
  getConfig(): LanguageConfig | null {
    return this.config;
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string | null {
    return this.currentLanguage;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.lspSocket !== null && this.lspSocket.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const languageService = new LanguageService();
export type { LanguageConfig, RuntimeInfo, FeatureFlags, Diagnostic, Position, Range };
