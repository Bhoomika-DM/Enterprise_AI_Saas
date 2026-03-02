/**
 * DatasetContextPanel Component
 * 
 * Displays dataset selector and metadata for data scientists.
 * Non-intrusive panel positioned in top-right corner.
 * 
 * Validates Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import React from 'react';
import { useEditor } from '../../contexts/EditorContext';
import './DatasetContextPanel.css';

export function DatasetContextPanel() {
  const { state, setSelectedDataset } = useEditor();
  const { selectedDataset, datasetMetadata } = state;
  
  const metadata = datasetMetadata[selectedDataset];

  const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDataset(e.target.value as 'raw' | 'cleaned');
  };

  return (
    <div className="dataset-context-panel">
      <div className="dataset-selector">
        <label htmlFor="dataset-select">Dataset:</label>
        <select
          id="dataset-select"
          value={selectedDataset}
          onChange={handleDatasetChange}
          className="dataset-dropdown"
        >
          <option value="raw">Raw</option>
          <option value="cleaned">Cleaned</option>
        </select>
      </div>
      
      <div className="dataset-metadata">
        <div className="metadata-item">
          <span className="metadata-label">Rows:</span>
          <span className="metadata-value">{metadata.rows.toLocaleString()}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Columns:</span>
          <span className="metadata-value">{metadata.columns}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Missing:</span>
          <span className="metadata-value">{metadata.missingPercentage}%</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Memory:</span>
          <span className="metadata-value">{metadata.memoryUsage}</span>
        </div>
      </div>
    </div>
  );
}
