/**
 * PythonExecutor Service
 * 
 * Manages Pyodide instance and executes Python code in the browser.
 * Supports real Python execution with NumPy, Pandas, and other data science libraries.
 */

import { loadPyodide, type PyodideInterface } from 'pyodide';

class PythonExecutor {
  private pyodide: PyodideInterface | null = null;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;

  /**
   * Initialize Pyodide (lazy loading)
   */
  async initialize(): Promise<void> {
    if (this.pyodide) return;
    
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = (async () => {
      try {
        this.pyodide = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.3/full/',
        });
        
        // Setup stdout/stderr capture
        await this.pyodide.runPythonAsync(`
          import sys
          from io import StringIO
          
          class OutputCapture:
              def __init__(self):
                  self.stdout = StringIO()
                  self.stderr = StringIO()
              
              def reset(self):
                  self.stdout = StringIO()
                  self.stderr = StringIO()
              
              def get_output(self):
                  return self.stdout.getvalue()
              
              def get_error(self):
                  return self.stderr.getvalue()
          
          _output_capture = OutputCapture()
        `);
        
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        throw error;
      }
    })();

    return this.loadPromise;
  }

  /**
   * Execute Python code and return output
   */
  async execute(code: string): Promise<{ output: string; error: string | null; executionTime: number; plots?: string[] }> {
    const startTime = performance.now();
    
    try {
      // Initialize if not already done
      if (!this.pyodide) {
        await this.initialize();
      }

      if (!this.pyodide) {
        throw new Error('Failed to initialize Python environment');
      }

      // Check if code uses matplotlib, numpy, or pandas and load packages
      const needsMatplotlib = code.includes('matplotlib') || code.includes('plt.') || /import\s+matplotlib/.test(code) || /from\s+matplotlib/.test(code);
      const needsNumpy = code.includes('numpy') || code.includes('np.') || /import\s+numpy/.test(code) || /from\s+numpy/.test(code);
      const needsPandas = code.includes('pandas') || code.includes('pd.') || /import\s+pandas/.test(code) || /from\s+pandas/.test(code);
      
      if (needsMatplotlib || needsNumpy || needsPandas) {
        const packagesToLoad: string[] = [];
        if (needsMatplotlib) packagesToLoad.push('matplotlib');
        if (needsNumpy) packagesToLoad.push('numpy');
        if (needsPandas) packagesToLoad.push('pandas');
        
        console.log('📦 Loading packages:', packagesToLoad.join(', '));
        
        try {
          await this.pyodide.loadPackage(packagesToLoad);
          console.log('✅ Packages loaded successfully');
        } catch (loadError) {
          console.error('❌ Failed to load packages:', loadError);
          throw new Error(`Failed to load required packages: ${packagesToLoad.join(', ')}`);
        }
      }

      // Reset output capture
      await this.pyodide.runPythonAsync(`
        _output_capture.reset()
        sys.stdout = _output_capture.stdout
        sys.stderr = _output_capture.stderr
      `);

      // Setup matplotlib for non-interactive backend if matplotlib is used
      if (needsMatplotlib) {
        await this.pyodide.runPythonAsync(`
          import matplotlib
          import matplotlib.pyplot as plt
          matplotlib.use('AGG')  # Non-interactive backend
          import io
          import base64
          
          # Store plots
          _plots = []
        `);
      }

      // Execute user code
      try {
        await this.pyodide.runPythonAsync(code);
      } catch (execError: any) {
        // Capture execution errors
        const errorOutput = await this.pyodide.runPythonAsync('_output_capture.get_error()');
        const stdOutput = await this.pyodide.runPythonAsync('_output_capture.get_output()');
        
        const executionTime = performance.now() - startTime;
        
        return {
          output: stdOutput || '',
          error: errorOutput || execError.message || 'Execution error',
          executionTime: executionTime / 1000,
        };
      }

      // Capture matplotlib plots if any
      let plots: string[] = [];
      if (needsMatplotlib) {
        try {
          const plotsData = await this.pyodide.runPythonAsync(`
            import matplotlib.pyplot as plt
            plot_images = []
            
            # Get all figures
            for fig_num in plt.get_fignums():
                fig = plt.figure(fig_num)
                buf = io.BytesIO()
                fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
                buf.seek(0)
                img_base64 = base64.b64encode(buf.read()).decode('utf-8')
                plot_images.append(img_base64)
                plt.close(fig)
            
            plot_images
          `);
          
          if (plotsData && plotsData.length > 0) {
            plots = plotsData.toJs();
          }
        } catch (plotError) {
          console.warn('Failed to capture plots:', plotError);
        }
      }

      // Get captured output
      const output = await this.pyodide.runPythonAsync('_output_capture.get_output()');
      const errorOutput = await this.pyodide.runPythonAsync('_output_capture.get_error()');
      
      const executionTime = performance.now() - startTime;

      return {
        output: output || '',
        error: errorOutput || null,
        executionTime: executionTime / 1000,
        plots: plots.length > 0 ? plots : undefined,
      };
    } catch (error: any) {
      const executionTime = performance.now() - startTime;
      return {
        output: '',
        error: error.message || 'Unknown error occurred',
        executionTime: executionTime / 1000,
      };
    }
  }

  /**
   * Load a Python package (e.g., numpy, pandas, matplotlib)
   */
  async loadPackage(packageName: string): Promise<void> {
    if (!this.pyodide) {
      await this.initialize();
    }

    if (!this.pyodide) {
      throw new Error('Failed to initialize Python environment');
    }

    await this.pyodide.loadPackage(packageName);
  }

  /**
   * Check if Pyodide is ready
   */
  isReady(): boolean {
    return this.pyodide !== null;
  }

  /**
   * Get Pyodide version
   */
  getVersion(): string {
    return this.pyodide?.version || 'Not loaded';
  }
}

// Export singleton instance
export const pythonExecutor = new PythonExecutor();
