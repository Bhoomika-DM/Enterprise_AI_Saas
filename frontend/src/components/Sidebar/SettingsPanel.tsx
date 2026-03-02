/**
 * SettingsPanel Component
 * 
 * IDE settings and preferences configuration.
 * Organized into three categories: Editor, Appearance, and Workspace.
 * Includes LanguageSelector for backend-driven language switching.
 */

import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { LanguageSelector } from '../LanguageSelector/LanguageSelector';
import './SettingsPanel.css';

interface Setting {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'number' | 'readonly';
  value: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  category: 'editor' | 'appearance' | 'workspace';
}

export function SettingsPanel() {
  const { state, updateEditorSettings } = useEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'editor' | 'appearance' | 'workspace'>('editor');

  // All settings organized by category
  const allSettings: Setting[] = [
    // EDITOR SETTINGS
    {
      id: 'lineNumbers',
      label: 'Line Numbers',
      description: 'Show line numbers in the editor',
      type: 'toggle',
      value: state.editorSettings.lineNumbers,
      category: 'editor',
    },
    {
      id: 'wordWrap',
      label: 'Word Wrap',
      description: 'Wrap long lines in the editor',
      type: 'toggle',
      value: state.editorSettings.wordWrap,
      category: 'editor',
    },
    {
      id: 'tabSize',
      label: 'Tab Size',
      description: 'Number of spaces per tab',
      type: 'number',
      value: state.editorSettings.tabSize,
      min: 2,
      max: 8,
      category: 'editor',
    },
    {
      id: 'minimap',
      label: 'Minimap',
      description: 'Show code minimap on the right side (Currently unavailable due to compatibility issues)',
      type: 'toggle',
      value: false, // Disabled
      category: 'editor',
    },
    {
      id: 'bracketPairs',
      label: 'Bracket Pair Colorization',
      description: 'Colorize matching brackets',
      type: 'toggle',
      value: state.editorSettings.bracketPairs,
      category: 'editor',
    },
    
    // APPEARANCE SETTINGS
    {
      id: 'theme',
      label: 'Color Theme',
      description: 'Choose your preferred color theme (applies globally)',
      type: 'select',
      value: state.editorSettings.theme,
      options: [
        { label: 'Dark (Default)', value: 'dark' },
        { label: 'Dark+', value: 'dark-plus' },
        { label: 'Light', value: 'light' },
        { label: 'High Contrast', value: 'high-contrast' },
      ],
      category: 'appearance',
    },
    {
      id: 'fontFamily',
      label: 'Font Family',
      description: 'Editor font family',
      type: 'select',
      value: state.editorSettings.fontFamily,
      options: [
        { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
        { label: 'JetBrains Mono', value: 'JetBrains Mono' },
        { label: 'Fira Code', value: 'Fira Code' },
        { label: 'Consolas', value: 'Consolas' },
        { label: 'Monaco', value: 'Monaco' },
        { label: 'Courier New', value: 'Courier New' },
        { label: 'Source Code Pro', value: 'Source Code Pro' },
        { label: 'Roboto Mono', value: 'Roboto Mono' },
        { label: 'Ubuntu Mono', value: 'Ubuntu Mono' },
        { label: 'Cascadia Code', value: 'Cascadia Code' },
      ],
      category: 'appearance',
    },
    {
      id: 'fontSize',
      label: 'Font Size',
      description: 'Editor font size in pixels',
      type: 'number',
      value: state.editorSettings.fontSize,
      min: 10,
      max: 24,
      category: 'appearance',
    },
    {
      id: 'iconTheme',
      label: 'Icon Theme',
      description: 'File and folder icon theme',
      type: 'select',
      value: state.editorSettings.iconTheme,
      options: [
        { label: 'VS Code Icons (Default)', value: 'vs-code-icons' },
      ],
      category: 'appearance',
    },
    {
      id: 'uiDensity',
      label: 'UI Density',
      description: 'Controls padding and spacing',
      type: 'select',
      value: state.editorSettings.uiDensity,
      options: [
        { label: 'Compact', value: 'compact' },
        { label: 'Comfortable', value: 'comfortable' },
      ],
      category: 'appearance',
    },
    {
      id: 'animations',
      label: 'Animations',
      description: 'Enable smooth UI transitions',
      type: 'toggle',
      value: state.editorSettings.animations,
      category: 'appearance',
    },
    
    // WORKSPACE SETTINGS
    {
      id: 'defaultLanguageMode',
      label: 'Default Language Mode',
      description: 'Default language for new files',
      type: 'select',
      value: state.editorSettings.defaultLanguageMode,
      options: [
        { label: 'Python', value: 'python' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'HTML', value: 'html' },
        { label: 'CSS', value: 'css' },
        { label: 'JSON', value: 'json' },
        { label: 'SQL', value: 'sql' },
      ],
      category: 'workspace',
    },
    {
      id: 'autoSave',
      label: 'Auto Save',
      description: 'Automatically save files after a delay',
      type: 'toggle',
      value: state.editorSettings.autoSave,
      category: 'workspace',
    },
    {
      id: 'autoSaveDelay',
      label: 'Auto Save Delay',
      description: 'Delay in milliseconds before auto-saving',
      type: 'number',
      value: state.editorSettings.autoSaveDelay,
      min: 500,
      max: 5000,
      category: 'workspace',
    },
    {
      id: 'formatOnSave',
      label: 'Format On Save',
      description: 'Automatically format code when saving',
      type: 'toggle',
      value: state.editorSettings.formatOnSave,
      category: 'workspace',
    },
    {
      id: 'rememberOpenFiles',
      label: 'Remember Open Files',
      description: 'Restore open files on workspace reload',
      type: 'toggle',
      value: state.editorSettings.rememberOpenFiles,
      category: 'workspace',
    },
    {
      id: 'rememberActiveTab',
      label: 'Remember Active Tab',
      description: 'Restore active tab on workspace reload',
      type: 'toggle',
      value: state.editorSettings.rememberActiveTab,
      category: 'workspace',
    },
    {
      id: 'rememberDataset',
      label: 'Remember Dataset Selection',
      description: 'Restore last selected dataset (Raw/Cleaned)',
      type: 'toggle',
      value: state.editorSettings.rememberDataset,
      category: 'workspace',
    },
    {
      id: 'rememberPanelVisibility',
      label: 'Remember Panel Visibility',
      description: 'Restore panel visibility state',
      type: 'toggle',
      value: state.editorSettings.rememberPanelVisibility,
      category: 'workspace',
    },
    {
      id: 'executionMode',
      label: 'Execution Mode',
      description: 'Where to execute code',
      type: 'select',
      value: state.editorSettings.executionMode,
      options: [
        { label: 'Browser (Pyodide)', value: 'browser' },
        { label: 'Server (Coming Soon)', value: 'server' },
      ],
      category: 'workspace',
    },
  ];

  const handleSettingChange = (id: string, value: any) => {
    console.log(`⚙️ Setting ${id} changed to:`, value);
    updateEditorSettings({ [id]: value });
  };

  const handleResetCategory = () => {
    const defaultSettings: any = {
      // Editor defaults
      lineNumbers: true,
      wordWrap: false,
      tabSize: 4,
      minimap: false,
      bracketPairs: true,
      
      // Appearance defaults
      theme: 'dark',
      fontFamily: 'Plus Jakarta Sans',
      fontSize: 14,
      iconTheme: 'vs-code-icons',
      uiDensity: 'comfortable',
      animations: true,
      
      // Workspace defaults
      defaultLanguageMode: 'python',
      autoSave: true,
      autoSaveDelay: 1000,
      formatOnSave: true,
      rememberOpenFiles: true,
      rememberActiveTab: true,
      rememberDataset: true,
      rememberPanelVisibility: true,
      executionMode: 'browser',
    };

    // Reset only the active category
    const categorySettings = allSettings
      .filter(s => s.category === activeCategory)
      .reduce((acc, s) => {
        acc[s.id] = defaultSettings[s.id];
        return acc;
      }, {} as any);

    updateEditorSettings(categorySettings);
    console.log(`✅ ${activeCategory} settings reset to defaults`);
  };

  const handleResetWorkspace = () => {
    if (confirm('Are you sure you want to reset workspace settings? This will clear workspace state but not affect global preferences.')) {
      const workspaceDefaults = {
        defaultLanguageMode: 'python' as const,
        autoSave: true,
        autoSaveDelay: 1000,
        formatOnSave: true,
        rememberOpenFiles: true,
        rememberActiveTab: true,
        rememberDataset: true,
        rememberPanelVisibility: true,
        executionMode: 'browser' as const,
      };
      updateEditorSettings(workspaceDefaults);
      console.log('✅ Workspace reset complete');
    }
  };

  // Filter settings by category and search query
  const filteredSettings = allSettings.filter(s => {
    const matchesCategory = s.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderSettingControl = (setting: Setting) => {
    switch (setting.type) {
      case 'readonly':
        return (
          <div className="readonly-value">
            {setting.value}
          </div>
        );
      case 'toggle':
        return (
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={setting.value}
              onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        );
      case 'number':
        return (
          <input
            type="number"
            className="number-input"
            value={setting.value}
            min={setting.min}
            max={setting.max}
            onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value))}
          />
        );
      case 'select':
        return (
          <select
            className="select-input"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            disabled={setting.id === 'executionMode' && setting.value === 'server'}
          >
            {setting.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-panel">
      <div className="panel-header">SETTINGS</div>

      {/* Language Selector - Backend-Driven */}
      <div className="language-selector-section">
        <div className="section-title">Language & Runtime</div>
        <LanguageSelector />
      </div>

      <div className="settings-search">
        <svg className="search-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 14L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search settings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="settings-categories">
        <button
          className={`category-button ${activeCategory === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveCategory('editor')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 3H14V13H2V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 6L7 8L5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 10H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Editor
        </button>
        <button
          className={`category-button ${activeCategory === 'appearance' ? 'active' : ''}`}
          onClick={() => setActiveCategory('appearance')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C8 2 6 4 6 8C6 12 8 14 8 14C8 14 10 12 10 8C10 4 8 2 8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Appearance
        </button>
        <button
          className={`category-button ${activeCategory === 'workspace' ? 'active' : ''}`}
          onClick={() => setActiveCategory('workspace')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4C2 3.44772 2.44772 3 3 3H6L7 5H13C13.5523 5 14 5.44772 14 6V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Workspace
        </button>
      </div>

      <div className="settings-list">
        {filteredSettings.length === 0 ? (
          <div className="no-settings">
            <p>No settings found</p>
            <span>Try a different search query</span>
          </div>
        ) : (
          filteredSettings.map(setting => (
            <div key={setting.id} className="setting-item">
              <div className="setting-info">
                <div className="setting-label">{setting.label}</div>
                <div className="setting-description">{setting.description}</div>
              </div>
              <div className="setting-control">
                {renderSettingControl(setting)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="settings-footer">
        {activeCategory === 'workspace' ? (
          <button className="reset-button" onClick={handleResetWorkspace}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 8L4 6M2 8L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reset Workspace
          </button>
        ) : (
          <button className="reset-button" onClick={handleResetCategory}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 8L4 6M2 8L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reset {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Settings
          </button>
        )}
      </div>
    </div>
  );
}
