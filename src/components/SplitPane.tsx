import React, { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface SplitPaneProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  theme: 'light' | 'dark';
  isPreviewVisible: boolean;
}

const SplitPane: React.FC<SplitPaneProps> = ({ leftPane, rightPane, theme, isPreviewVisible }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Constrain the position between 20% and 80%
    const constrainedPosition = Math.min(Math.max(newPosition, 20), 80);
    setSplitPosition(constrainedPosition);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  if (!isPreviewVisible) {
    return (
      <div className="flex-1 overflow-hidden">
        {leftPane}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 flex overflow-hidden"
    >
      {/* Left Pane */}
      <div 
        className="overflow-hidden"
        style={{ width: `${splitPosition}%` }}
      >
        {leftPane}
      </div>

      {/* Resizer */}
      <div
        className={`relative w-1 cursor-col-resize group ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`}
        onMouseDown={startResizing}
      >
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
        }`}>
          <GripVertical className="w-3 h-3 text-gray-500" />
        </div>
        <div className={`absolute inset-0 w-1 transition-colors ${
          isResizing 
            ? (theme === 'dark' ? 'bg-blue-500' : 'bg-blue-500')
            : 'group-hover:bg-gray-400'
        }`} />
      </div>

      {/* Right Pane */}
      <div 
        className="overflow-hidden"
        style={{ width: `${100 - splitPosition}%` }}
      >
        {rightPane}
      </div>
    </div>
  );
};

export default SplitPane;