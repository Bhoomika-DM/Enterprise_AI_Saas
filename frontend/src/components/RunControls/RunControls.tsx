/**
 * RunControls Component
 * 
 * Play/Stop buttons for code execution in the top-right of editor area.
 * Positioned like VS Code's run button.
 * 
 * Now with REAL Python execution using Pyodide!
 * 
 * Validates Requirements: 3.1, 3.3
 */

import { useState, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { pythonExecutor } from '../../services/PythonExecutor';
import './RunControls.css';

type RunType = 'python' | 'sql' | 'auto';

export function RunControls() {
  const { state, setExecuting, addExecutionOutput, addTerminalLine } = useEditor();
  const { openFiles, activeFileId, isExecuting } = state;
  const [runType, setRunType] = useState<RunType>('auto');
  const [isPythonReady, setIsPythonReady] = useState(false);

  const activeFile = openFiles.find(f => f.id === activeFileId);

  // Initialize Python environment on mount
  useEffect(() => {
    const initPython = async () => {
      try {
        addTerminalLine({
          type: 'output',
          content: '🐍 Initializing Python environment (Pyodide)...',
          timestamp: Date.now(),
        });
        
        await pythonExecutor.initialize();
        
        setIsPythonReady(true);
        addTerminalLine({
          type: 'output',
          content: `✅ Python ${pythonExecutor.getVersion()} ready! You can now run Python code with NumPy, Pandas, and more.`,
          timestamp: Date.now(),
        });
      } catch (error: any) {
        addTerminalLine({
          type: 'error',
          content: `❌ Failed to initialize Python: ${error.message}`,
          timestamp: Date.now(),
        });
      }
    };

    initPython();
  }, []);

  const handleRun = async () => {
    if (!activeFile || isExecuting) return;

    const language = runType === 'auto' ? activeFile.language : runType;

    setExecuting(true);
    addTerminalLine({
      type: 'input',
      content: `▶ Running ${activeFile.name}...`,
      timestamp: Date.now(),
    });

    try {
      if (language === 'python') {
        // Execute real Python code
        const result = await pythonExecutor.execute(activeFile.content);
        
        let output = '';
        
        if (result.output) {
          output += `${result.output}\n`;
        }
        
        // Display plots if any
        if (result.plots && result.plots.length > 0) {
          output += `\n📊 Generated ${result.plots.length} plot(s)\n`;
          
          // Add plots to terminal as base64 images
          result.plots.forEach((plotBase64, index) => {
            addTerminalLine({
              type: 'output',
              content: `data:image/png;base64,${plotBase64}`,
              timestamp: Date.now(),
            });
          });
        }
        
        if (result.error) {
          output += `\n❌ Error:\n${result.error}\n`;
          addTerminalLine({
            type: 'error',
            content: output,
            timestamp: Date.now(),
          });
        } else {
          output += `\n✅ Execution completed in ${result.executionTime.toFixed(3)}s`;
          addTerminalLine({
            type: 'output',
            content: output,
            timestamp: Date.now(),
          });
        }
        
        addExecutionOutput(output);
      } else if (language === 'sql') {
        // Mock SQL execution (can be replaced with real SQL later)
        const output = mockExecuteSQL(activeFile.content);
        addTerminalLine({
          type: 'output',
          content: output,
          timestamp: Date.now(),
        });
        addExecutionOutput(output);
      }
    } catch (error: any) {
      const errorMsg = `❌ Execution failed: ${error.message}`;
      addTerminalLine({
        type: 'error',
        content: errorMsg,
        timestamp: Date.now(),
      });
      addExecutionOutput(errorMsg);
    } finally {
      setExecuting(false);
    }
  };

  const handleStop = () => {
    setExecuting(false);
    addTerminalLine({
      type: 'error',
      content: '⏹ Execution stopped by user',
      timestamp: Date.now(),
    });
  };

  if (!activeFile) {
    return null;
  }

  return (
    <div className="run-controls">
      {!isExecuting ? (
        <button
          className="run-button"
          onClick={handleRun}
          title="Run Code (F5)"
          disabled={!isPythonReady && (runType === 'python' || (runType === 'auto' && activeFile.language === 'python'))}
        >
          <span className="run-icon">▶</span>
          <span className="run-label">Run</span>
        </button>
      ) : (
        <button
          className="stop-button"
          onClick={handleStop}
          title="Stop Execution"
        >
          <span className="stop-icon">■</span>
          <span className="stop-label">Stop</span>
        </button>
      )}
    </div>
  );
}

// Mock SQL execution (can be replaced with real SQL engine later)
function mockExecuteSQL(code: string): string {
  return `SQL Query Executed
Rows affected: 5
Execution time: 0.045s

Note: Real SQL execution coming soon!`;
}
