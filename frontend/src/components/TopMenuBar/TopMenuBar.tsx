/**
 * TopMenuBar Component
 * 
 * Horizontal menu bar at the top of the IDE.
 * Contains File, Edit, View, Run, and Help menus.
 * 
 * Validates Requirements: 2.1
 */

import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { Menu } from './Menu';
import { FILE_MENU, EDIT_MENU, VIEW_MENU, RUN_MENU, HELP_MENU } from './commands';
import { NewFileDialog } from './NewFileDialog';
import { OpenFileDialog } from './OpenFileDialog';
import { FindReplaceDialog } from './FindReplaceDialog';
import './TopMenuBar.css';

export function TopMenuBar() {
  const {
    toggleSidebar,
    toggleBottomPanel,
    toggleCommandPalette,
    setSidebarPanel,
    setBottomTab,
    saveFile,
    saveAllFiles,
    closeFile,
    formatCode,
    state,
  } = useEditor();

  // Dialog state
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [openFileDialogOpen, setOpenFileDialogOpen] = useState(false);
  const [openFolderDialogOpen, setOpenFolderDialogOpen] = useState(false);
  const [findDialogOpen, setFindDialogOpen] = useState(false);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);

  const handleCommand = (commandId: string) => {
    console.log('Executing command:', commandId);

    switch (commandId) {
      // File commands
      case 'file.new':
        setNewFileDialogOpen(true);
        break;
      case 'file.newFolder':
        setNewFolderDialogOpen(true);
        break;
      case 'file.open':
        setOpenFileDialogOpen(true);
        break;
      case 'file.openFolder':
        setOpenFolderDialogOpen(true);
        break;
      case 'file.save':
        if (state.activeFileId) {
          saveFile(state.activeFileId);
        }
        break;
      case 'file.saveAll':
        saveAllFiles();
        break;
      case 'file.close':
        if (state.activeFileId) {
          closeFile(state.activeFileId);
        }
        break;
      case 'file.closeAll':
        state.openFiles.forEach(file => closeFile(file.id));
        break;

      // View commands
      case 'commandPalette.open':
        toggleCommandPalette();
        break;
      case 'view.explorer':
        setSidebarPanel('explorer');
        break;
      case 'view.search':
        setSidebarPanel('search');
        break;
      case 'view.toggleSidebar':
        toggleSidebar();
        break;
      case 'view.toggleBottomPanel':
        toggleBottomPanel();
        break;
      case 'view.terminal':
        setBottomTab('terminal');
        if (!state.bottomPanelExpanded) {
          toggleBottomPanel();
        }
        break;
      case 'view.output':
        setBottomTab('output');
        if (!state.bottomPanelExpanded) {
          toggleBottomPanel();
        }
        break;
      case 'view.problems':
        setBottomTab('problems');
        if (!state.bottomPanelExpanded) {
          toggleBottomPanel();
        }
        break;

      // Edit commands
      case 'editor.undo':
        document.execCommand('undo');
        break;
      case 'editor.redo':
        document.execCommand('redo');
        break;
      case 'editor.cut':
        document.execCommand('cut');
        break;
      case 'editor.copy':
        document.execCommand('copy');
        break;
      case 'editor.paste':
        document.execCommand('paste');
        break;
      case 'editor.find':
        setFindDialogOpen(true);
        break;
      case 'editor.replace':
        setReplaceDialogOpen(true);
        break;
      case 'editor.format':
        if (state.activeFileId) {
          formatCode(state.activeFileId);
        }
        break;

      // Run commands
      case 'run.debug':
      case 'run.file':
      case 'run.python':
      case 'run.sql':
        // Trigger the run button programmatically
        const runButton = document.querySelector('.run-button') as HTMLButtonElement;
        if (runButton) {
          runButton.click();
        } else {
          alert('Open a Python or SQL file to run code');
        }
        break;
      case 'run.stop':
        const stopButton = document.querySelector('.stop-button') as HTMLButtonElement;
        if (stopButton) {
          stopButton.click();
        }
        break;
      case 'run.restart':
        const stopBtn = document.querySelector('.stop-button') as HTMLButtonElement;
        if (stopBtn) {
          stopBtn.click();
          setTimeout(() => {
            const runBtn = document.querySelector('.run-button') as HTMLButtonElement;
            if (runBtn) runBtn.click();
          }, 500);
        } else {
          const runBtn = document.querySelector('.run-button') as HTMLButtonElement;
          if (runBtn) runBtn.click();
        }
        break;
      case 'run.openConfig':
        alert('Run Configurations:\n\n• Python: Auto-detected for .py files\n• SQL: Auto-detected for .sql files\n\nUse the dropdown next to the Run button to select run type.');
        break;
      case 'run.addConfig':
        alert('Add Configuration:\n\nCurrently supported:\n• Python (auto)\n• SQL (auto)\n\nMore configurations coming soon!');
        break;

      // Help commands
      case 'help.welcome':
        alert('Welcome to Data Scientist IDE!\n\nA VS Code-like editor for data science.');
        break;
      case 'help.docs':
        alert('Documentation: Check the README.md file in your workspace');
        break;
      case 'help.shortcuts':
        alert('Keyboard Shortcuts:\n\nCtrl+S - Save\nCtrl+B - Toggle Sidebar\nCtrl+J - Toggle Panel\nCtrl+Shift+P - Command Palette\nF5 - Run Code');
        break;
      case 'help.about':
        alert('Data Scientist IDE v1.0\n\nBuilt with React, TypeScript, and CodeMirror');
        break;

      default:
        console.warn('Unhandled command:', commandId);
    }
  };

  return (
    <div className="top-menu-bar">
      <div className="menu-bar-left">
        <Menu label="File" items={FILE_MENU} onCommand={handleCommand} />
        <Menu label="Edit" items={EDIT_MENU} onCommand={handleCommand} />
        <Menu label="View" items={VIEW_MENU} onCommand={handleCommand} />
        <Menu label="Run" items={RUN_MENU} onCommand={handleCommand} />
        <Menu label="Help" items={HELP_MENU} onCommand={handleCommand} />
      </div>

      <div className="menu-bar-center">
        <span className="ide-title">Data Scientist IDE</span>
      </div>

      <div className="menu-bar-right">
        {/* Future: Add user profile, settings icon, etc. */}
      </div>

      {/* Dialogs */}
      <NewFileDialog
        isOpen={newFileDialogOpen}
        mode="file"
        onClose={() => setNewFileDialogOpen(false)}
      />
      <NewFileDialog
        isOpen={newFolderDialogOpen}
        mode="folder"
        onClose={() => setNewFolderDialogOpen(false)}
      />
      <OpenFileDialog
        isOpen={openFileDialogOpen}
        mode="file"
        onClose={() => setOpenFileDialogOpen(false)}
      />
      <OpenFileDialog
        isOpen={openFolderDialogOpen}
        mode="folder"
        onClose={() => setOpenFolderDialogOpen(false)}
      />
      <FindReplaceDialog
        isOpen={findDialogOpen}
        mode="find"
        onClose={() => setFindDialogOpen(false)}
      />
      <FindReplaceDialog
        isOpen={replaceDialogOpen}
        mode="replace"
        onClose={() => setReplaceDialogOpen(false)}
      />
    </div>
  );
}
