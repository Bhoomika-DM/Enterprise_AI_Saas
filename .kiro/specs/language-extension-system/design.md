# Language Extension System - Design Document

## Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        IDE Core (UI)                         │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │  Editor    │  │  Run Button  │  │  Status Bar       │   │
│  │ (Language  │  │  (Delegates  │  │  (Shows Language) │   │
│  │  Agnostic) │  │  to Plugin)  │  │                   │   │
│  └────────────┘  └──────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Extension Manager                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Plugin Registry                                     │   │
│  │  - Load/Unload Plugins                              │   │
│  │  - Manage Plugin Lifecycle                          │   │
│  │  - Route Execution Requests                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Python     │   │  JavaScript  │   │     SQL      │
│   Plugin     │   │    Plugin    │   │    Plugin    │
│              │   │              │   │              │
│ - Pyodide    │   │ - Node.js    │   │ - SQLite     │
│ - Frontend   │   │ - Backend    │   │ - Backend    │
└──────────────┘   └──────────────┘   └──────────────┘
```

## Component Design

### 1. Extension Manager

**Location**: `frontend/src/services/ExtensionManager.ts`

**Responsibilities**:
- Register and manage language plugins
- Load/unload plugins dynamically
- Route execution requests to appropriate plugin
- Manage plugin lifecycle (install, enable, disable, uninstall)
- Provide plugin discovery API

**Interface**:
```typescript
interface ExtensionManager {
  registerPlugin(plugin: LanguagePlugin): void;
  unregisterPlugin(languageId: string): void;
  getPlugin(languageId: string): LanguagePlugin | null;
  getAllPlugins(): LanguagePlugin[];
  getEnabledPlugins(): LanguagePlugin[];
  executeCode(languageId: string, code: string, config?: ExecutionConfig): Promise<ExecutionResult>;
  detectLanguage(filename: string): string | null;
}
```

### 2. Language Plugin Interface

**Location**: `frontend/src/types/plugin.ts`

**Plugin Structure**:
```typescript
interface LanguagePlugin {
  // Metadata
  id: string;                    // e.g., 'python', 'javascript', 'sql'
  name: string;                  // e.g., 'Python', 'JavaScript', 'SQL'
  version: string;               // e.g., '1.0.0'
  author: string;                // e.g., 'IDE Team'
  description: string;           // Short description
  icon: string;                  // Emoji or SVG icon
  
  // Language Configuration
  fileExtensions: string[];      // e.g., ['.py', '.pyw']
  mimeType: string;              // e.g., 'text/x-python'
  codemirrorMode: string;        // e.g., 'python'
  
  // Execution Configuration
  executionType: 'frontend' | 'backend';
  executor: LanguageExecutor;
  
  // Optional Features
  snippets?: CodeSnippet[];
  templates?: FileTemplate[];
  linter?: Linter;
  formatter?: Formatter;
}

interface LanguageExecutor {
  initialize(): Promise<void>;
  execute(code: string, config?: ExecutionConfig): Promise<ExecutionResult>;
  isReady(): boolean;
  cleanup(): Promise<void>;
}

interface ExecutionConfig {
  timeout?: number;              // Execution timeout in ms
  args?: string[];               // Command-line arguments
  env?: Record<string, string>;  // Environment variables
  workingDir?: string;           // Working directory
  [key: string]: any;            // Plugin-specific config
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;         // in seconds
  plots?: string[];              // Base64 encoded images
  error?: string;
}
```

### 3. Python Plugin (Refactored)

**Location**: `frontend/src/plugins/PythonPlugin.ts`

**Implementation**:
```typescript
import { LanguagePlugin, LanguageExecutor } from '../types/plugin';
import { pythonExecutor } from '../services/PythonExecutor';

class PythonExecutor implements LanguageExecutor {
  async initialize(): Promise<void> {
    await pythonExecutor.initialize();
  }

  async execute(code: string, config?: ExecutionConfig): Promise<ExecutionResult> {
    const result = await pythonExecutor.execute(code);
    return {
      stdout: result.output,
      stderr: result.error || '',
      exitCode: result.error ? 1 : 0,
      executionTime: result.executionTime,
      plots: result.plots,
    };
  }

  isReady(): boolean {
    return pythonExecutor.isReady();
  }

  async cleanup(): Promise<void> {
    // No cleanup needed for Pyodide
  }
}

export const PythonPlugin: LanguagePlugin = {
  id: 'python',
  name: 'Python',
  version: '1.0.0',
  author: 'IDE Team',
  description: 'Python 3.11 with NumPy, Pandas, and Matplotlib support',
  icon: '🐍',
  fileExtensions: ['.py', '.pyw'],
  mimeType: 'text/x-python',
  codemirrorMode: 'python',
  executionType: 'frontend',
  executor: new PythonExecutor(),
  templates: [
    {
      name: 'Empty Python File',
      content: '# Python script\n\n',
    },
    {
      name: 'Data Analysis Script',
      content: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load data
# df = pd.read_csv('data.csv')

# Analysis code here
`,
    },
  ],
};
```

### 4. JavaScript Plugin (New)

**Location**: `frontend/src/plugins/JavaScriptPlugin.ts`

**Implementation**:
```typescript
class JavaScriptExecutor implements LanguageExecutor {
  async initialize(): Promise<void> {
    // Check backend availability
  }

  async execute(code: string, config?: ExecutionConfig): Promise<ExecutionResult> {
    // Send to backend for Node.js execution
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'javascript',
        code,
        config,
      }),
    });

    if (!response.ok) {
      throw new Error('Execution failed');
    }

    return await response.json();
  }

  isReady(): boolean {
    return true; // Backend always ready
  }

  async cleanup(): Promise<void> {
    // No cleanup needed
  }
}

export const JavaScriptPlugin: LanguagePlugin = {
  id: 'javascript',
  name: 'JavaScript',
  version: '1.0.0',
  author: 'IDE Team',
  description: 'JavaScript (Node.js) with ES6+ support',
  icon: '📜',
  fileExtensions: ['.js', '.mjs'],
  mimeType: 'text/javascript',
  codemirrorMode: 'javascript',
  executionType: 'backend',
  executor: new JavaScriptExecutor(),
  templates: [
    {
      name: 'Empty JavaScript File',
      content: '// JavaScript code\n\n',
    },
    {
      name: 'Node.js Script',
      content: `const fs = require('fs');
const path = require('path');

// Your code here
console.log('Hello from Node.js!');
`,
    },
  ],
};
```

### 5. SQL Plugin (Refactored)

**Location**: `frontend/src/plugins/SQLPlugin.ts`

**Implementation**:
```typescript
class SQLExecutor implements LanguageExecutor {
  async initialize(): Promise<void> {
    // Initialize SQL.js or backend connection
  }

  async execute(code: string, config?: ExecutionConfig): Promise<ExecutionResult> {
    // Execute SQL query via backend
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'sql',
        code,
        config: {
          database: config?.database || 'sqlite',
          connection: config?.connection,
        },
      }),
    });

    return await response.json();
  }

  isReady(): boolean {
    return true;
  }

  async cleanup(): Promise<void> {
    // Close database connections
  }
}

export const SQLPlugin: LanguagePlugin = {
  id: 'sql',
  name: 'SQL',
  version: '1.0.0',
  author: 'IDE Team',
  description: 'SQL with SQLite, PostgreSQL, and MySQL support',
  icon: '🗄️',
  fileExtensions: ['.sql'],
  mimeType: 'text/x-sql',
  codemirrorMode: 'sql',
  executionType: 'backend',
  executor: new SQLExecutor(),
  templates: [
    {
      name: 'Empty SQL File',
      content: '-- SQL query\n\n',
    },
    {
      name: 'SELECT Query',
      content: `-- Select data from table
SELECT * FROM table_name
WHERE condition
ORDER BY column_name;
`,
    },
  ],
};
```

## Integration Points

### 1. RunControls Component

**Changes Required**:
```typescript
// Before (hard-coded)
const handleRun = async () => {
  if (language === 'python') {
    const result = await pythonExecutor.execute(code);
    // ...
  } else if (language === 'sql') {
    // SQL execution
  }
};

// After (plugin-based)
const handleRun = async () => {
  const plugin = extensionManager.getPlugin(language);
  if (!plugin) {
    addTerminalLine({ type: 'error', content: `No plugin found for ${language}` });
    return;
  }

  const result = await extensionManager.executeCode(language, code);
  // Handle result
};
```

### 2. CodeMirrorEditor Component

**Changes Required**:
```typescript
// Before (hard-coded)
const getLanguageMode = (lang: string) => {
  if (lang === 'python') return python();
  if (lang === 'sql') return sql();
  return python(); // default
};

// After (plugin-based)
const getLanguageMode = (lang: string) => {
  const plugin = extensionManager.getPlugin(lang);
  if (!plugin) return python(); // fallback
  
  // Map plugin mode to CodeMirror extension
  switch (plugin.codemirrorMode) {
    case 'python': return python();
    case 'javascript': return javascript();
    case 'sql': return sql();
    default: return python();
  }
};
```

### 3. StatusBar Component

**Changes Required**:
```typescript
// Add language selector dropdown
const handleLanguageChange = (newLanguage: string) => {
  const plugin = extensionManager.getPlugin(newLanguage);
  if (plugin) {
    // Update active file language
    updateFileLanguage(activeFileId, newLanguage);
  }
};
```

### 4. NewFileDialog Component

**Changes Required**:
```typescript
// Use plugin templates
const getFileTemplate = (extension: string) => {
  const language = extensionManager.detectLanguage(`file${extension}`);
  if (!language) return '';
  
  const plugin = extensionManager.getPlugin(language);
  return plugin?.templates?.[0]?.content || '';
};
```

## Backend API Design

### Execution Endpoint

**Route**: `POST /api/execute`

**Request**:
```json
{
  "language": "javascript",
  "code": "console.log('Hello World');",
  "config": {
    "timeout": 30000,
    "args": [],
    "env": {},
    "workingDir": "/tmp"
  }
}
```

**Response**:
```json
{
  "stdout": "Hello World\n",
  "stderr": "",
  "exitCode": 0,
  "executionTime": 0.123
}
```

**Error Response**:
```json
{
  "error": "Execution timeout",
  "exitCode": 124,
  "executionTime": 30.0
}
```

### Backend Implementation (FastAPI)

**Location**: `backend-fastapi/routers/execution.py`

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import subprocess
import tempfile
import os

router = APIRouter()

class ExecutionRequest(BaseModel):
    language: str
    code: str
    config: dict = {}

class ExecutionResponse(BaseModel):
    stdout: str
    stderr: str
    exitCode: int
    executionTime: float

@router.post("/execute", response_model=ExecutionResponse)
async def execute_code(request: ExecutionRequest):
    if request.language == "javascript":
        return await execute_javascript(request.code, request.config)
    elif request.language == "sql":
        return await execute_sql(request.code, request.config)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported language: {request.language}")

async def execute_javascript(code: str, config: dict):
    # Create temp file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
        f.write(code)
        temp_file = f.name
    
    try:
        # Execute with Node.js
        result = subprocess.run(
            ['node', temp_file],
            capture_output=True,
            text=True,
            timeout=config.get('timeout', 30)
        )
        
        return ExecutionResponse(
            stdout=result.stdout,
            stderr=result.stderr,
            exitCode=result.returncode,
            executionTime=0.0  # TODO: measure time
        )
    finally:
        os.unlink(temp_file)
```

## Data Flow

### Code Execution Flow
```
1. User clicks Run button
   ↓
2. RunControls gets active file language
   ↓
3. RunControls calls extensionManager.executeCode(language, code)
   ↓
4. ExtensionManager finds plugin by language ID
   ↓
5. ExtensionManager calls plugin.executor.execute(code, config)
   ↓
6. Plugin Executor:
   - Frontend: Executes in browser (Pyodide)
   - Backend: Sends HTTP request to /api/execute
   ↓
7. Execution Result returned to RunControls
   ↓
8. RunControls displays output in Terminal
```

### Language Detection Flow
```
1. User opens/creates file
   ↓
2. EditorContext detects file extension
   ↓
3. EditorContext calls extensionManager.detectLanguage(filename)
   ↓
4. ExtensionManager checks all plugins for matching extension
   ↓
5. Returns language ID (e.g., 'python', 'javascript')
   ↓
6. EditorContext updates file language
   ↓
7. CodeMirrorEditor updates syntax highlighting
   ↓
8. StatusBar updates language display
```

## Plugin Discovery and Loading

### Plugin Registry

**Location**: `frontend/src/plugins/index.ts`

```typescript
import { PythonPlugin } from './PythonPlugin';
import { JavaScriptPlugin } from './JavaScriptPlugin';
import { SQLPlugin } from './SQLPlugin';

export const BUILTIN_PLUGINS = [
  PythonPlugin,
  JavaScriptPlugin,
  SQLPlugin,
];

// Future: Load plugins from external sources
export async function loadExternalPlugins(): Promise<LanguagePlugin[]> {
  // Load from localStorage, API, or CDN
  return [];
}
```

### Extension Manager Initialization

```typescript
// In App initialization
import { extensionManager } from './services/ExtensionManager';
import { BUILTIN_PLUGINS } from './plugins';

// Register built-in plugins
BUILTIN_PLUGINS.forEach(plugin => {
  extensionManager.registerPlugin(plugin);
});

// Initialize all plugins
await extensionManager.initializeAll();
```

## Migration Strategy

### Phase 1: Create Plugin Infrastructure
1. Create plugin types and interfaces
2. Implement ExtensionManager
3. Add plugin registry
4. No breaking changes to existing code

### Phase 2: Refactor Python Support
1. Create PythonPlugin
2. Update RunControls to use ExtensionManager
3. Test Python execution
4. Ensure feature parity

### Phase 3: Refactor SQL Support
1. Create SQLPlugin
2. Update SQL execution logic
3. Test SQL queries
4. Ensure feature parity

### Phase 4: Add JavaScript Support
1. Create JavaScriptPlugin
2. Implement backend execution endpoint
3. Add Node.js runtime to backend
4. Test JavaScript execution

### Phase 5: UI Integration
1. Update StatusBar with language selector
2. Update NewFileDialog with plugin templates
3. Update ExtensionsPanel with language plugins
4. Add plugin enable/disable functionality

## Testing Strategy

### Unit Tests
- ExtensionManager plugin registration
- Plugin detection by file extension
- Execution routing to correct plugin
- Error handling for missing plugins

### Integration Tests
- Python plugin execution
- JavaScript plugin execution
- SQL plugin execution
- Language switching
- Output display

### E2E Tests
- Create Python file → Run → See output
- Create JavaScript file → Run → See output
- Create SQL file → Run → See results
- Install plugin → Enable → Use
- Disable plugin → Cannot use

## Performance Considerations

### Lazy Loading
- Only load plugin executor when first used
- Don't initialize all plugins on startup
- Cache plugin instances

### Memory Management
- Cleanup plugin resources when disabled
- Limit concurrent executions
- Clear output buffers regularly

### Execution Optimization
- Reuse Pyodide instance for Python
- Connection pooling for SQL
- Process pooling for backend execution

## Security Considerations

### Frontend Execution (Pyodide)
- Already sandboxed by browser
- No file system access
- No network access (except CORS-allowed)
- Memory limits enforced by browser

### Backend Execution
- Run in Docker containers
- Resource limits (CPU, memory, time)
- No network access from containers
- Read-only file system
- Separate container per execution
- Automatic cleanup after execution

## Future Enhancements

### Phase 6: Advanced Features
- Language Server Protocol (LSP) integration
- Debugger support
- Breakpoints and step-through
- Variable inspection

### Phase 7: More Languages
- Java plugin (JVM execution)
- C++ plugin (compiled execution)
- Go plugin (compiled execution)
- R plugin (data science)
- Rust plugin (compiled execution)

### Phase 8: Plugin Marketplace
- External plugin repository
- Plugin search and discovery
- Plugin ratings and reviews
- Plugin updates and versioning
- Community-contributed plugins

## Correctness Properties

### Property 1: Plugin Registration
**Statement**: All registered plugins must have unique IDs
**Test**: Register two plugins with same ID → Second registration fails

### Property 2: Language Detection
**Statement**: File extension must map to exactly one language
**Test**: For any file extension, detectLanguage returns consistent result

### Property 3: Execution Routing
**Statement**: Code execution must route to correct plugin
**Test**: Execute Python code → PythonPlugin.executor.execute() is called

### Property 4: Plugin Isolation
**Statement**: Disabling a plugin must not affect other plugins
**Test**: Disable Python plugin → JavaScript plugin still works

### Property 5: Error Handling
**Statement**: Missing plugin must return clear error message
**Test**: Execute code for unregistered language → Error message contains language name

## Documentation Requirements

### Developer Documentation
- Plugin API reference
- Plugin development guide
- Example plugin implementation
- Testing guide for plugins

### User Documentation
- How to install plugins
- How to enable/disable plugins
- Supported languages list
- Execution configuration guide
