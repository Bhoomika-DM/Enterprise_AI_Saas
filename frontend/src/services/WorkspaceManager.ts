/**
 * WorkspaceManager Service
 * 
 * Manages virtual file system operations and localStorage persistence.
 * Provides methods for creating, reading, updating, and deleting files and folders.
 * 
 * Validates Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  expanded?: boolean;
  metadata?: FileMetadata;
}

export interface FileMetadata {
  created: number;
  modified: number;
  size: number;
  language?: string;
}

/**
 * Detect language from file extension
 */
function detectLanguage(filename: string): 'python' | 'sql' | 'javascript' | 'typescript' | 'html' | 'css' | 'json' {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'py':
      return 'python';
    case 'sql':
      return 'sql';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
      return 'css';
    case 'json':
      return 'json';
    default:
      return 'python'; // Default fallback
  }
}

export interface WorkspaceState {
  root: FileNode;
  version: number;
}

interface StoredWorkspace {
  version: number;
  timestamp: number;
  root: FileNode;
  openFiles: string[];
  activeFile: string | null;
}

export class WorkspaceManager {
  private root: FileNode;
  private storageKey = 'ide-workspace-v1';
  private version = 1;

  constructor() {
    this.root = this.createDefaultWorkspace();
  }

  /**
   * Load workspace from localStorage or create default
   */
  load(): WorkspaceState {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data: StoredWorkspace = JSON.parse(stored);
        this.root = data.root;
        return { root: this.root, version: data.version };
      }
    } catch (error) {
      console.error('Failed to load workspace from localStorage:', error);
    }
    
    // Return default workspace if load fails
    this.root = this.createDefaultWorkspace();
    return { root: this.root, version: this.version };
  }

  /**
   * Save workspace to localStorage
   */
  save(workspace: WorkspaceState): void {
    try {
      const data: StoredWorkspace = {
        version: workspace.version,
        timestamp: Date.now(),
        root: workspace.root,
        openFiles: [],
        activeFile: null,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save workspace to localStorage:', error);
      throw new Error('Storage quota exceeded or localStorage unavailable');
    }
  }

  /**
   * Create a new file
   */
  createFile(parentPath: string, name: string, content: string = ''): FileNode {
    // Validate file name
    if (!this.isValidFileName(name)) {
      throw new Error(`Invalid file name: ${name}`);
    }

    const parent = this.findNode(parentPath);
    if (!parent || parent.type !== 'folder') {
      throw new Error(`Parent folder not found: ${parentPath}`);
    }

    // Check for duplicate
    if (parent.children?.some(child => child.name === name)) {
      throw new Error('A file or folder with this name already exists');
    }

    const filePath = this.joinPath(parentPath, name);
    const newFile: FileNode = {
      name,
      type: 'file',
      path: filePath,
      content,
      metadata: {
        created: Date.now(),
        modified: Date.now(),
        size: content.length,
        language: this.getLanguageFromExtension(this.getFileExtension(name)),
      },
    };

    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(newFile);
    this.sortChildren(parent);

    return newFile;
  }

  /**
   * Create a new folder
   */
  createFolder(parentPath: string, name: string): FileNode {
    // Validate folder name
    if (!this.isValidFileName(name)) {
      throw new Error(`Invalid folder name: ${name}`);
    }

    const parent = this.findNode(parentPath);
    if (!parent || parent.type !== 'folder') {
      throw new Error(`Parent folder not found: ${parentPath}`);
    }

    // Check for duplicate
    if (parent.children?.some(child => child.name === name)) {
      throw new Error('A file or folder with this name already exists');
    }

    const folderPath = this.joinPath(parentPath, name);
    const newFolder: FileNode = {
      name,
      type: 'folder',
      path: folderPath,
      children: [],
      expanded: false,
      metadata: {
        created: Date.now(),
        modified: Date.now(),
        size: 0,
      },
    };

    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(newFolder);
    this.sortChildren(parent);

    return newFolder;
  }

  /**
   * Delete a file or folder
   */
  deleteNode(path: string): void {
    const parentPath = this.getParentPath(path);
    const parent = this.findNode(parentPath);
    
    if (!parent || parent.type !== 'folder') {
      throw new Error(`Parent folder not found: ${parentPath}`);
    }

    const nodeName = path.split('/').pop() || '';
    const index = parent.children?.findIndex(child => child.name === nodeName);
    
    if (index === undefined || index === -1) {
      throw new Error(`File or folder not found: ${path}`);
    }

    parent.children?.splice(index, 1);
  }

  /**
   * Rename a file or folder
   */
  renameNode(path: string, newName: string): void {
    // Validate new name
    if (!this.isValidFileName(newName)) {
      throw new Error(`Invalid name: ${newName}`);
    }

    const node = this.findNode(path);
    if (!node) {
      throw new Error(`File or folder not found: ${path}`);
    }

    const parentPath = this.getParentPath(path);
    const parent = this.findNode(parentPath);
    
    if (parent && parent.type === 'folder') {
      // Check for duplicate in parent
      if (parent.children?.some(child => child.name === newName && child.path !== path)) {
        throw new Error('A file or folder with this name already exists');
      }
    }

    // Update node name and path
    const oldPath = node.path;
    const newPath = this.joinPath(parentPath, newName);
    node.name = newName;
    node.path = newPath;

    // Update metadata
    if (node.metadata) {
      node.metadata.modified = Date.now();
      if (node.type === 'file') {
        node.metadata.language = this.getLanguageFromExtension(this.getFileExtension(newName));
      }
    }

    // Recursively update children paths
    if (node.type === 'folder' && node.children) {
      this.updateChildrenPaths(node, oldPath, newPath);
    }

    // Re-sort parent children
    if (parent && parent.type === 'folder') {
      this.sortChildren(parent);
    }
  }

  /**
   * Read file content
   */
  readFile(path: string): string | null {
    const node = this.findNode(path);
    if (!node || node.type !== 'file') {
      return null;
    }
    return node.content || '';
  }

  /**
   * Write file content
   */
  writeFile(path: string, content: string): void {
    const node = this.findNode(path);
    if (!node || node.type !== 'file') {
      throw new Error(`File not found: ${path}`);
    }

    node.content = content;
    if (node.metadata) {
      node.metadata.modified = Date.now();
      node.metadata.size = content.length;
    }
  }

  /**
   * Find a node by path
   */
  findNode(path: string): FileNode | null {
    if (!path || path === '/' || path === '') {
      return this.root;
    }

    const parts = path.split('/').filter(p => p);
    let current: FileNode | null = this.root;

    for (const part of parts) {
      if (!current || current.type !== 'folder' || !current.children) {
        return null;
      }
      current = current.children.find(child => child.name === part) || null;
    }

    return current;
  }

  /**
   * Get parent path
   */
  getParentPath(path: string): string {
    const parts = path.split('/').filter(p => p);
    parts.pop();
    return parts.length > 0 ? parts.join('/') : '';
  }

  /**
   * Toggle folder expanded state
   */
  toggleFolder(path: string): void {
    const node = this.findNode(path);
    if (node && node.type === 'folder') {
      node.expanded = !node.expanded;
    }
  }

  /**
   * Get file extension
   */
  getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot > 0 ? fileName.substring(lastDot + 1).toLowerCase() : '';
  }

  /**
   * Get language from file extension
   */
  getLanguageFromExtension(extension: string): string {
    const languageMap: Record<string, string> = {
      'py': 'python',
      'sql': 'sql',
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'json': 'json',
      'md': 'markdown',
      'csv': 'csv',
      'txt': 'plaintext',
      'html': 'html',
      'css': 'css',
    };
    return languageMap[extension] || 'plaintext';
  }

  /**
   * Get workspace root
   */
  getRoot(): FileNode {
    return this.root;
  }

  /**
   * Set workspace root
   */
  setRoot(root: FileNode): void {
    this.root = root;
  }

  // Private helper methods

  private createDefaultWorkspace(): FileNode {
    const now = Date.now();
    return {
      name: 'workspace',
      type: 'folder',
      path: '',
      expanded: true,
      children: [
        {
          name: 'examples',
          type: 'folder',
          path: 'examples',
          expanded: true,
          children: [
            {
              name: 'hello.py',
              type: 'file',
              path: 'examples/hello.py',
              content: `# Hello World in Python
print("Hello, World!")

# Variables and calculations
x = 10
y = 50
print(f"Sum: {x + y}")
print(f"Product: {x * y}")

# Lists and loops
numbers = [1, 2, 3, 4, 5]
print(f"Numbers: {numbers}")
print(f"Sum of numbers: {sum(numbers)}")

# Functions
def greet(name):
    return f"Hello, {name}!"

print(greet("Data Scientist"))
`,
              metadata: {
                created: now,
                modified: now,
                size: 350,
                language: 'python',
              },
            },
            {
              name: 'data_analysis.py',
              type: 'file',
              path: 'examples/data_analysis.py',
              content: `# Data Analysis Example
# This IDE supports NumPy, Pandas, and more!

# Basic statistics
data = [23, 45, 67, 89, 12, 34, 56, 78, 90, 11]
print(f"Data: {data}")
print(f"Mean: {sum(data) / len(data):.2f}")
print(f"Max: {max(data)}")
print(f"Min: {min(data)}")

# String operations
text = "Data Science is Amazing"
print(f"Original: {text}")
print(f"Uppercase: {text.upper()}")
print(f"Word count: {len(text.split())}")

# Dictionary operations
person = {
    "name": "Alice",
    "age": 30,
    "role": "Data Scientist"
}
print(f"Person: {person}")
print(f"Name: {person['name']}")
`,
              metadata: {
                created: now,
                modified: now,
                size: 600,
                language: 'python',
              },
            },
            {
              name: 'query.sql',
              type: 'file',
              path: 'examples/query.sql',
              content: `-- Sample SQL Query
SELECT * FROM users
WHERE created_at >= '2024-01-01'
ORDER BY created_at DESC
LIMIT 10;
`,
              metadata: {
                created: now,
                modified: now,
                size: 108,
                language: 'sql',
              },
            },
          ],
          metadata: {
            created: now,
            modified: now,
            size: 0,
          },
        },
        {
          name: 'README.md',
          type: 'file',
          path: 'README.md',
          content: `# Data Scientist IDE

Welcome to your workspace! 🚀

## Features
- ✅ **Real Python Execution** - Powered by Pyodide (Python in the browser)
- ✅ **Data Science Libraries** - NumPy, Pandas, Matplotlib support
- ✅ **File Explorer** - Create, edit, and organize files
- ✅ **Terminal Integration** - Interactive command execution
- ✅ **Code Execution** - Run Python and SQL code

## Getting Started
1. Open \`examples/hello.py\` to see basic Python examples
2. Try \`examples/data_analysis.py\` for data operations
3. Click the ▶ Run button to execute your code
4. Check the Terminal tab for output

## Python Support
This IDE runs real Python using Pyodide (CPython compiled to WebAssembly).
You can use:
- Variables, functions, classes
- Lists, dictionaries, sets
- String operations
- Math operations
- And much more!

Happy coding! 🐍
`,
          metadata: {
            created: now,
            modified: now,
            size: 750,
            language: 'markdown',
          },
        },
      ],
      metadata: {
        created: now,
        modified: now,
        size: 0,
      },
    };
  }

  private isValidFileName(name: string): boolean {
    // Check for invalid characters
    const invalidChars = /[\/\\:*?"<>|]/;
    if (invalidChars.test(name)) {
      return false;
    }
    // Check for empty or whitespace-only names
    if (!name || name.trim().length === 0) {
      return false;
    }
    return true;
  }

  private joinPath(parentPath: string, name: string): string {
    if (!parentPath || parentPath === '') {
      return name;
    }
    return `${parentPath}/${name}`;
  }

  private sortChildren(parent: FileNode): void {
    if (!parent.children) return;
    
    parent.children.sort((a, b) => {
      // Folders first
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      // Then alphabetically
      return a.name.localeCompare(b.name);
    });
  }

  private updateChildrenPaths(node: FileNode, oldPath: string, newPath: string): void {
    if (node.type !== 'folder' || !node.children) return;

    for (const child of node.children) {
      child.path = child.path.replace(oldPath, newPath);
      if (child.type === 'folder' && child.children) {
        this.updateChildrenPaths(child, oldPath, newPath);
      }
    }
  }
}

// Singleton instance
export const workspaceManager = new WorkspaceManager();
