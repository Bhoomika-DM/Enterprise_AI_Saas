/**
 * ExtensionsPanel Component
 * 
 * Marketplace for IDE extensions and plugins.
 * Shows popular extensions for data science and Python development.
 */

import React, { useState } from 'react';
import './ExtensionsPanel.css';

interface Extension {
  id: string;
  name: string;
  description: string;
  author: string;
  downloads: string;
  rating: number;
  installed: boolean;
  category: 'python' | 'data' | 'theme' | 'tool' | 'language' | 'framework' | 'ai' | 'devops';
}

const MOCK_EXTENSIONS: Extension[] = [
  // Python Extensions
  {
    id: 'python-linter',
    name: 'Python Linter',
    description: 'Advanced linting and code quality checks for Python',
    author: 'Python Tools',
    downloads: '2.5M',
    rating: 4.8,
    installed: true,
    category: 'python',
  },
  {
    id: 'jupyter-notebook',
    name: 'Jupyter Notebook',
    description: 'Run Jupyter notebooks directly in the IDE',
    author: 'Jupyter Team',
    downloads: '3.2M',
    rating: 4.9,
    installed: false,
    category: 'python',
  },
  {
    id: 'python-debugger',
    name: 'Python Debugger',
    description: 'Advanced debugging with breakpoints and variable inspection',
    author: 'Python Tools',
    downloads: '1.9M',
    rating: 4.7,
    installed: false,
    category: 'python',
  },
  
  // Data Science Extensions
  {
    id: 'data-preview',
    name: 'Data Preview',
    description: 'Interactive data frame viewer with sorting and filtering',
    author: 'Data Science Tools',
    downloads: '1.8M',
    rating: 4.7,
    installed: false,
    category: 'data',
  },
  {
    id: 'plotly-visualizer',
    name: 'Plotly Visualizer',
    description: 'Interactive data visualization with Plotly charts',
    author: 'Plotly Team',
    downloads: '1.5M',
    rating: 4.6,
    installed: false,
    category: 'data',
  },
  {
    id: 'data-profiler',
    name: 'Data Profiler',
    description: 'Automatic data quality and statistical analysis',
    author: 'Data Tools',
    downloads: '890K',
    rating: 4.5,
    installed: false,
    category: 'data',
  },
  
  // Language Extensions
  {
    id: 'javascript-support',
    name: 'JavaScript & Node.js',
    description: 'Full JavaScript and Node.js development support',
    author: 'JS Foundation',
    downloads: '8.2M',
    rating: 4.9,
    installed: true,
    category: 'language',
  },
  {
    id: 'typescript-support',
    name: 'TypeScript',
    description: 'TypeScript language support with type checking',
    author: 'Microsoft',
    downloads: '6.5M',
    rating: 4.8,
    installed: false,
    category: 'language',
  },
  {
    id: 'java-support',
    name: 'Java Development Kit',
    description: 'Complete Java development environment',
    author: 'Red Hat',
    downloads: '4.1M',
    rating: 4.6,
    installed: false,
    category: 'language',
  },
  {
    id: 'go-support',
    name: 'Go Language',
    description: 'Go programming language support',
    author: 'Go Team',
    downloads: '2.3M',
    rating: 4.7,
    installed: false,
    category: 'language',
  },
  {
    id: 'rust-support',
    name: 'Rust Analyzer',
    description: 'Rust language support with cargo integration',
    author: 'Rust Foundation',
    downloads: '1.7M',
    rating: 4.8,
    installed: false,
    category: 'language',
  },
  {
    id: 'r-support',
    name: 'R Language',
    description: 'R programming for statistical computing',
    author: 'R Consortium',
    downloads: '980K',
    rating: 4.5,
    installed: false,
    category: 'language',
  },
  
  // Framework Extensions
  {
    id: 'react-tools',
    name: 'React Developer Tools',
    description: 'React component development and debugging',
    author: 'Meta',
    downloads: '5.8M',
    rating: 4.8,
    installed: false,
    category: 'framework',
  },
  {
    id: 'vue-tools',
    name: 'Vue.js Tools',
    description: 'Vue.js development with component preview',
    author: 'Vue Team',
    downloads: '3.2M',
    rating: 4.7,
    installed: false,
    category: 'framework',
  },
  {
    id: 'django-support',
    name: 'Django Framework',
    description: 'Django web framework support and templates',
    author: 'Django Software Foundation',
    downloads: '1.4M',
    rating: 4.6,
    installed: false,
    category: 'framework',
  },
  {
    id: 'fastapi-tools',
    name: 'FastAPI Tools',
    description: 'FastAPI development with auto-documentation',
    author: 'FastAPI Community',
    downloads: '1.1M',
    rating: 4.7,
    installed: true,
    category: 'framework',
  },
  
  // AI/ML Extensions
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI-powered code completion and suggestions',
    author: 'GitHub',
    downloads: '12.5M',
    rating: 4.9,
    installed: false,
    category: 'ai',
  },
  {
    id: 'tensorflow-tools',
    name: 'TensorFlow Tools',
    description: 'TensorFlow model development and visualization',
    author: 'Google',
    downloads: '2.1M',
    rating: 4.6,
    installed: false,
    category: 'ai',
  },
  {
    id: 'pytorch-support',
    name: 'PyTorch Extension',
    description: 'PyTorch development with tensor visualization',
    author: 'Meta AI',
    downloads: '1.9M',
    rating: 4.7,
    installed: false,
    category: 'ai',
  },
  {
    id: 'huggingface-hub',
    name: 'Hugging Face Hub',
    description: 'Access and deploy models from Hugging Face',
    author: 'Hugging Face',
    downloads: '1.3M',
    rating: 4.8,
    installed: false,
    category: 'ai',
  },
  
  // DevOps & Tools
  {
    id: 'docker-tools',
    name: 'Docker',
    description: 'Docker container management and debugging',
    author: 'Docker Inc',
    downloads: '7.2M',
    rating: 4.8,
    installed: false,
    category: 'devops',
  },
  {
    id: 'kubernetes-tools',
    name: 'Kubernetes',
    description: 'Kubernetes cluster management and YAML support',
    author: 'Cloud Native Foundation',
    downloads: '3.5M',
    rating: 4.6,
    installed: false,
    category: 'devops',
  },
  {
    id: 'git-graph',
    name: 'Git Graph',
    description: 'Visualize git history and branches',
    author: 'Git Tools',
    downloads: '4.3M',
    rating: 4.8,
    installed: false,
    category: 'tool',
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries automatically',
    author: 'SQL Tools',
    downloads: '1.2M',
    rating: 4.5,
    installed: false,
    category: 'tool',
  },
  {
    id: 'rest-client',
    name: 'REST Client',
    description: 'Test REST APIs directly from the editor',
    author: 'HTTP Tools',
    downloads: '2.8M',
    rating: 4.7,
    installed: false,
    category: 'tool',
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Live markdown preview with GitHub styling',
    author: 'Markdown Tools',
    downloads: '6.1M',
    rating: 4.6,
    installed: false,
    category: 'tool',
  },
  
  // Themes
  {
    id: 'dark-plus-theme',
    name: 'Dark+ Theme',
    description: 'Enhanced dark theme with better syntax highlighting',
    author: 'Theme Studio',
    downloads: '5.1M',
    rating: 4.6,
    installed: true,
    category: 'theme',
  },
  {
    id: 'dracula-theme',
    name: 'Dracula Official',
    description: 'Popular dark theme with vibrant colors',
    author: 'Dracula Theme',
    downloads: '4.8M',
    rating: 4.8,
    installed: false,
    category: 'theme',
  },
  {
    id: 'nord-theme',
    name: 'Nord Theme',
    description: 'Arctic, north-bluish color palette',
    author: 'Nord Team',
    downloads: '3.2M',
    rating: 4.7,
    installed: false,
    category: 'theme',
  },
  {
    id: 'monokai-pro',
    name: 'Monokai Pro',
    description: 'Professional Monokai theme with multiple variants',
    author: 'Monokai',
    downloads: '2.9M',
    rating: 4.9,
    installed: false,
    category: 'theme',
  },
];

export function ExtensionsPanel() {
  const [extensions, setExtensions] = useState<Extension[]>(MOCK_EXTENSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'installed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'installed' && ext.installed);
    const matchesCategory = categoryFilter === 'all' || ext.category === categoryFilter;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const handleInstall = (id: string) => {
    setExtensions(extensions.map(ext =>
      ext.id === id ? { ...ext, installed: !ext.installed } : ext
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'python':
        return '🐍';
      case 'data':
        return '📊';
      case 'theme':
        return '🎨';
      case 'tool':
        return '🔧';
      case 'language':
        return '💻';
      case 'framework':
        return '⚡';
      case 'ai':
        return '🤖';
      case 'devops':
        return '🚀';
      default:
        return '📦';
    }
  };

  return (
    <div className="extensions-panel">
      <div className="panel-header">EXTENSIONS</div>

      <div className="extensions-search">
        <input
          type="text"
          placeholder="Search extensions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="extensions-filters">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === 'installed' ? 'active' : ''}`}
          onClick={() => setFilter('installed')}
        >
          Installed ({extensions.filter(e => e.installed).length})
        </button>
      </div>

      <div className="category-filters">
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-select"
        >
          <option value="all">All Categories</option>
          <option value="python">🐍 Python</option>
          <option value="language">💻 Languages</option>
          <option value="framework">⚡ Frameworks</option>
          <option value="data">📊 Data Science</option>
          <option value="ai">🤖 AI/ML</option>
          <option value="devops">🚀 DevOps</option>
          <option value="tool">🔧 Tools</option>
          <option value="theme">🎨 Themes</option>
        </select>
      </div>

      <div className="extensions-list">
        {filteredExtensions.length === 0 ? (
          <div className="no-extensions">
            <p>No extensions found</p>
            <span>Try a different search query</span>
          </div>
        ) : (
          filteredExtensions.map(ext => (
            <div key={ext.id} className="extension-item">
              <div className="extension-icon">
                {getCategoryIcon(ext.category)}
              </div>
              <div className="extension-content">
                <div className="extension-header">
                  <div className="extension-title-row">
                    <div className="extension-name">{ext.name}</div>
                    {ext.installed && (
                      <span className="installed-badge">Installed</span>
                    )}
                  </div>
                </div>
                <div className="extension-description">{ext.description}</div>
                <div className="extension-meta">
                  <span className="extension-author">{ext.author}</span>
                  <span className="extension-separator">•</span>
                  <span className="extension-downloads">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M8 12L3 7L4.5 5.5L7 8V2H9V8L11.5 5.5L13 7L8 12Z" fill="currentColor"/>
                      <path d="M2 14H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {ext.downloads}
                  </span>
                  <span className="extension-separator">•</span>
                  <span className="extension-rating">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2L10 6L14 6.5L11 9.5L12 14L8 11.5L4 14L5 9.5L2 6.5L6 6L8 2Z" fill="#C96731"/>
                    </svg>
                    {ext.rating}
                  </span>
                </div>
              </div>
              <button
                className={`extension-button ${ext.installed ? 'uninstall' : 'install'}`}
                onClick={() => handleInstall(ext.id)}
              >
                {ext.installed ? 'Uninstall' : 'Install'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
