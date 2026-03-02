/**
 * EditorDemo Page
 * 
 * Demo page showcasing the Data Scientist Editor with sample files.
 */

import React, { useEffect } from 'react';
import { DataScientistEditor } from '../components/DataScientistEditor';
import { useEditor } from '../contexts/EditorContext';

function EditorDemoContent() {
  const { openFile } = useEditor();

  useEffect(() => {
    // Open sample Python file
    openFile({
      id: 'sample-py',
      name: 'analysis.py',
      path: '/analysis.py',
      language: 'python',
      content: `# Data Analysis Script
import pandas as pd
import numpy as np

# Load dataset
df = pd.read_csv('data.csv')

# Basic statistics
print(df.describe())

# Data cleaning
df_cleaned = df.dropna()

# Feature engineering
df_cleaned['new_feature'] = df_cleaned['col1'] * df_cleaned['col2']

print("Analysis complete!")
`,
      isDirty: false,
    });

    // Open sample SQL file
    openFile({
      id: 'sample-sql',
      name: 'query.sql',
      path: '/query.sql',
      language: 'sql',
      content: `-- Sample SQL Query
SELECT 
    user_id,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount
FROM transactions
WHERE date >= '2024-01-01'
GROUP BY user_id
HAVING COUNT(*) > 5
ORDER BY total_amount DESC
LIMIT 100;
`,
      isDirty: false,
    });
  }, [openFile]);

  return null;
}

export function EditorDemo() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <DataScientistEditor />
      <EditorDemoContent />
    </div>
  );
}
