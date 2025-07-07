import React from 'react';
import { Sun, Moon, FileText, Eye, Maximize2, Minimize2, Download, Upload, Search, X } from 'lucide-react';

interface ToolbarProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  isPreviewVisible: boolean;
  onPreviewToggle: () => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  activeDocumentTitle: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  theme,
  onThemeToggle,
  isPreviewVisible,
  onPreviewToggle,
  isFullscreen,
  onFullscreenToggle,
  onExport,
  onImport,
  activeDocumentTitle,
  searchQuery,
  onSearchChange
}) => {
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className={`flex items-center justify-between px-3 py-2 border-b ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <h1 className={`text-base font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            シンプルマークダウン
          </h1>
        </div>
        
        <div className="hidden sm:flex items-center space-x-2">
          <span className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            /
          </span>
          <span className={`text-sm font-medium truncate max-w-32 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {activeDocumentTitle}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-sm mx-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <Search className={`h-3 w-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <input
            type="text"
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`block w-full pl-7 pr-7 py-1.5 border rounded text-sm transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
            } focus:ring-1 focus:outline-none`}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className={`absolute inset-y-0 right-0 pr-2 flex items-center ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1">
{/*         
        <input
          type="file"
          accept=".md,.markdown,.txt"
          onChange={handleImport}
          className="hidden"
          id="file-import"
        />
        <label
          htmlFor="file-import"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Import Markdown file"
        >
          <Upload className="w-3.5 h-3.5" />
        </label>

        <button
          onClick={onExport}
          className={`p-1.5 rounded transition-colors ${
            theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Export as Markdown"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onPreviewToggle}
          className={`p-1.5 rounded transition-colors ${
            theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title={isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

*/}
        <button
          onClick={onFullscreenToggle}
          className={`p-1.5 rounded transition-colors ${
            theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={onThemeToggle}
          className={`p-1.5 rounded transition-colors ${
            theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button> 
      </div>
    </div>
  );
};

export default Toolbar;