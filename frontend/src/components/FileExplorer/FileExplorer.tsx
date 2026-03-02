/**
 * FileExplorer Component
 * 
 * Main container for the file explorer sidebar panel.
 * Displays workspace file tree and handles file operations.
 * 
 * Validates Requirements: 1.1, 1.6
 */

import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { FileNode } from '../../services/WorkspaceManager';
import { FileTreeNode } from './FileTreeNode';
import { ContextMenu, InputModal, ConfirmModal } from './ContextMenu';
import './FileExplorer.css';

type ModalType = 'newFile' | 'newFolder' | 'rename' | 'delete' | null;

export function FileExplorer() {
  const {
    state,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    toggleFolder,
    openFileFromWorkspace,
  } = useEditor();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: FileNode;
  } | null>(null);

  const [modal, setModal] = useState<{
    type: ModalType;
    node?: FileNode;
  }>({ type: null });

  const handleFileClick = (path: string) => {
    openFileFromWorkspace(path);
  };

  const handleFolderToggle = (path: string) => {
    toggleFolder(path);
  };

  const handleContextMenu = (event: React.MouseEvent, node: FileNode) => {
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      node,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleNewFile = (parentPath: string) => {
    setModal({ type: 'newFile', node: contextMenu?.node });
  };

  const handleNewFolder = (parentPath: string) => {
    setModal({ type: 'newFolder', node: contextMenu?.node });
  };

  const handleDelete = (path: string) => {
    setModal({ type: 'delete', node: contextMenu?.node });
  };

  const handleRename = (path: string) => {
    setModal({ type: 'rename', node: contextMenu?.node });
  };

  const confirmNewFile = (name: string) => {
    if (modal.node) {
      const parentPath = modal.node.type === 'folder' ? modal.node.path : modal.node.path.split('/').slice(0, -1).join('/');
      try {
        createFile(parentPath, name, '');
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to create file');
      }
    }
    setModal({ type: null });
  };

  const confirmNewFolder = (name: string) => {
    if (modal.node) {
      const parentPath = modal.node.type === 'folder' ? modal.node.path : modal.node.path.split('/').slice(0, -1).join('/');
      try {
        createFolder(parentPath, name);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to create folder');
      }
    }
    setModal({ type: null });
  };

  const confirmRename = (newName: string) => {
    if (modal.node) {
      try {
        renameNode(modal.node.path, newName);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to rename');
      }
    }
    setModal({ type: null });
  };

  const confirmDelete = () => {
    if (modal.node) {
      try {
        deleteNode(modal.node.path);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete');
      }
    }
    setModal({ type: null });
  };

  const cancelModal = () => {
    setModal({ type: null });
  };

  if (!state.workspace) {
    return (
      <div className="file-explorer">
        <div className="explorer-header">EXPLORER</div>
        <div className="explorer-empty">
          <p>Loading workspace...</p>
        </div>
      </div>
    );
  }

  const hasFiles = state.workspace.root.children && state.workspace.root.children.length > 0;

  return (
    <div className="file-explorer">
      <div className="explorer-header">EXPLORER</div>
      
      {hasFiles ? (
        <div className="explorer-tree">
          {state.workspace.root.children?.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              depth={0}
              onFileClick={handleFileClick}
              onFolderToggle={handleFolderToggle}
              onContextMenu={handleContextMenu}
            />
          ))}
        </div>
      ) : (
        <div className="explorer-empty">
          <p>No files in workspace</p>
          <p className="hint">Right-click to create files and folders</p>
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onClose={closeContextMenu}
          onNewFile={handleNewFile}
          onNewFolder={handleNewFolder}
          onDelete={handleDelete}
          onRename={handleRename}
        />
      )}

      {modal.type === 'newFile' && (
        <InputModal
          title="New File"
          placeholder="Enter file name (e.g., script.py)"
          onConfirm={confirmNewFile}
          onCancel={cancelModal}
        />
      )}

      {modal.type === 'newFolder' && (
        <InputModal
          title="New Folder"
          placeholder="Enter folder name"
          onConfirm={confirmNewFolder}
          onCancel={cancelModal}
        />
      )}

      {modal.type === 'rename' && modal.node && (
        <InputModal
          title="Rename"
          placeholder="Enter new name"
          defaultValue={modal.node.name}
          onConfirm={confirmRename}
          onCancel={cancelModal}
        />
      )}

      {modal.type === 'delete' && modal.node && (
        <ConfirmModal
          title="Delete"
          message={`Are you sure you want to delete "${modal.node.name}"?${
            modal.node.type === 'folder' && modal.node.children?.length
              ? ` This folder contains ${modal.node.children.length} item(s).`
              : ''
          }`}
          onConfirm={confirmDelete}
          onCancel={cancelModal}
        />
      )}
    </div>
  );
}
