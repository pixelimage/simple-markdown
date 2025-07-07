import React, { useState, useEffect } from 'react';
import EditorPane from './components/EditorPane';
import PreviewPane from './components/PreviewPane';
import Toolbar from './components/Toolbar';
import SplitPane from './components/SplitPane';
import DocumentSidebar from './components/DocumentSidebar';
import { useTheme } from './hooks/useTheme';
import { useDocuments } from './hooks/useDocuments';
import { useSearch } from './hooks/useSearch';

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    documents,
    activeDocument,
    activeDocumentId,
    addDocument,
    deleteDocument,
    updateDocument,
    reorderDocuments,
    selectDocument,
    exportDocument,
    importDocument
  } = useDocuments();

  const { searchQuery, setSearchQuery, searchResults } = useSearch(documents);

  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle markdown content change
  const handleMarkdownChange = (content: string) => {
    if (activeDocumentId) {
      updateDocument(activeDocumentId, content);
    }
  };

  // Handle export
  const handleExport = () => {
    if (activeDocumentId) {
      exportDocument(activeDocumentId);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-white'}`}>
      <Toolbar
        theme={theme}
        onThemeToggle={toggleTheme}
        isPreviewVisible={isPreviewVisible}
        onPreviewToggle={() => setIsPreviewVisible(!isPreviewVisible)}
        isFullscreen={isFullscreen}
        onFullscreenToggle={handleFullscreenToggle}
        onExport={handleExport}
        onImport={importDocument}
        activeDocumentTitle={activeDocument?.title || 'No Document'}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <SplitPane
          theme={theme}
          isPreviewVisible={isPreviewVisible}
          leftPane={
            <PreviewPane
              content={activeDocument?.content || ''}
              theme={theme}
            />
          }
          rightPane={
            <EditorPane
              value={activeDocument?.content || ''}
              onChange={handleMarkdownChange}
              theme={theme}
            />
          }
        />
        <DocumentSidebar
          documents={documents}
          activeDocumentId={activeDocumentId}
          onDocumentSelect={selectDocument}
          onDocumentAdd={addDocument}
          onDocumentDelete={deleteDocument}
          onDocumentReorder={reorderDocuments}
          theme={theme}
          searchQuery={searchQuery}
          searchResults={searchResults}
        />
        
      </div>
    </div>
  );
}

export default App;