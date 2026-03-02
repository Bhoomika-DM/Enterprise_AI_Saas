/**
 * PanelTabBar Component
 * 
 * Tab bar for bottom panel (Terminal, Output, Problems, Logs).
 * Implements VS Code bottom panel tab styling.
 * 
 * Validates Requirements: 5.1, 6.2
 */

import React from 'react';
import './PanelTabBar.css';

type BottomTab = 'terminal' | 'system-terminal' | 'output' | 'problems' | 'logs';

interface PanelTabBarProps {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
}

export function PanelTabBar({ activeTab, onTabChange }: PanelTabBarProps) {
  const tabs: { id: BottomTab; label: string; icon?: string }[] = [
    { id: 'terminal', label: 'PYTHON', icon: '🐍' },
    { id: 'system-terminal', label: 'TERMINAL', icon: '>' },
    { id: 'output', label: 'OUTPUT' },
    { id: 'problems', label: 'PROBLEMS' },
    { id: 'logs', label: 'LOGS' },
  ];

  return (
    <div className="panel-tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`panel-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon && <span className="tab-icon">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
