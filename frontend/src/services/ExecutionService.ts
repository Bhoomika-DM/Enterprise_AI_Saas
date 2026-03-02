/**
 * ExecutionService - Backend Code Execution
 * 
 * Handles code execution requests to backend.
 * Supports both complete and streaming execution modes.
 */

interface ExecutionRequest {
  language: string;
  code: string;
  files?: Array<{ path: string; content: string }>;
  workspaceId?: string;
  runtime?: string;
}

interface ExecutionResult {
  executionId: string;
  status: 'running' | 'completed' | 'failed';
  exitCode: number;
  stdout: string;
  stderr: string;
  executionTime: number;
  memoryUsed: string;
}

type OutputListener = (chunk: string, type: 'stdout' | 'stderr') => void;
type StatusListener = (status: 'running' | 'completed' | 'failed') => void;

class ExecutionService {
  private backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:8000';
  private activeExecutions = new Map<string, AbortController>();

  /**
   * Execute code on backend (complete response)
   */
  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    console.log('🚀 Executing code:', request.language);
    
    const controller = new AbortController();
    const executionId = this.generateExecutionId();
    this.activeExecutions.set(executionId, controller);

    try {
      const response = await fetch(`${this.backendUrl}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Execution failed: ${response.status} ${response.statusText}`);
      }

      const result: ExecutionResult = await response.json();
      console.log('✅ Execution completed:', result);
      
      this.activeExecutions.delete(executionId);
      return result;
    } catch (error: any) {
      console.error('❌ Execution error:', error);
      this.activeExecutions.delete(executionId);
      
      if (error.name === 'AbortError') {
        throw new Error('Execution was cancelled');
      }
      
      throw error;
    }
  }

  /**
   * Execute with streaming output
   */
  async executeStreaming(
    request: ExecutionRequest,
    onOutput: OutputListener,
    onStatus?: StatusListener
  ): Promise<ExecutionResult> {
    console.log('🚀 Executing code (streaming):', request.language);
    
    const controller = new AbortController();
    const executionId = this.generateExecutionId();
    this.activeExecutions.set(executionId, controller);

    try {
      const response = await fetch(`${this.backendUrl}/api/execute/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Execution failed: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let result: ExecutionResult | null = null;
      onStatus?.('running');

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const data = JSON.parse(line);
            
            if (data.type === 'stdout') {
              onOutput(data.content, 'stdout');
            } else if (data.type === 'stderr') {
              onOutput(data.content, 'stderr');
            } else if (data.type === 'status') {
              onStatus?.(data.status);
            } else if (data.type === 'result') {
              result = data;
            }
          } catch (e) {
            // Not JSON, treat as raw output
            onOutput(line + '\n', 'stdout');
          }
        }
      }

      this.activeExecutions.delete(executionId);

      if (!result) {
        throw new Error('No execution result received');
      }

      onStatus?.(result.status);
      console.log('✅ Streaming execution completed:', result);
      
      return result;
    } catch (error: any) {
      console.error('❌ Streaming execution error:', error);
      this.activeExecutions.delete(executionId);
      onStatus?.('failed');
      
      if (error.name === 'AbortError') {
        throw new Error('Execution was cancelled');
      }
      
      throw error;
    }
  }

  /**
   * Stop execution
   */
  async stop(executionId: string): Promise<void> {
    console.log('🛑 Stopping execution:', executionId);
    
    // Cancel local request
    const controller = this.activeExecutions.get(executionId);
    if (controller) {
      controller.abort();
      this.activeExecutions.delete(executionId);
    }

    // Notify backend to stop
    try {
      await fetch(`${this.backendUrl}/api/execute/${executionId}/stop`, {
        method: 'POST',
      });
      console.log('✅ Execution stopped');
    } catch (error) {
      console.error('Failed to stop execution on backend:', error);
    }
  }

  /**
   * Stop all active executions
   */
  stopAll(): void {
    console.log('🛑 Stopping all executions');
    this.activeExecutions.forEach((controller, id) => {
      controller.abort();
      this.stop(id).catch(console.error);
    });
    this.activeExecutions.clear();
  }

  /**
   * Get active execution IDs
   */
  getActiveExecutions(): string[] {
    return Array.from(this.activeExecutions.keys());
  }

  /**
   * Check if any execution is running
   */
  isExecuting(): boolean {
    return this.activeExecutions.size > 0;
  }

  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const executionService = new ExecutionService();
export type { ExecutionRequest, ExecutionResult, OutputListener, StatusListener };
