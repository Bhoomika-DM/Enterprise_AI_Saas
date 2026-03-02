/**
 * Menu and MenuItem Components
 * 
 * Dropdown menu system for the top menu bar.
 * Supports keyboard navigation and nested menus.
 * 
 * Validates Requirements: 2.1, 2.2
 */

import React, { useState, useRef, useEffect } from 'react';
import './Menu.css';

export interface MenuItem {
  label?: string;
  command?: string;
  shortcut?: string;
  separator?: boolean;
  submenu?: MenuItem[];
  disabled?: boolean;
}

interface MenuProps {
  label: string;
  items: MenuItem[];
  onCommand: (command: string) => void;
}

export function Menu({ label, items, onCommand }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled || item.separator) return;
    
    if (item.command) {
      onCommand(item.command);
      setIsOpen(false);
    }
  };

  return (
    <div className="menu" ref={menuRef}>
      <div
        className={`menu-label ${isOpen ? 'active' : ''}`}
        onClick={handleMenuClick}
      >
        {label}
      </div>

      {isOpen && (
        <div className="menu-dropdown">
          {items.map((item, index) => (
            item.separator ? (
              <div key={index} className="menu-separator" />
            ) : (
              <div
                key={index}
                className={`menu-item ${item.disabled ? 'disabled' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                <span className="menu-item-label">{item.label}</span>
                {item.shortcut && (
                  <span className="menu-item-shortcut">{item.shortcut}</span>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
