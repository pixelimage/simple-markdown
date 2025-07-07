import React, { useState } from 'react';
import { Plus, FileText, Trash2, GripVertical } from 'lucide-react';
import { Document } from '../types/Document';

interface DocumentSidebarProps {
  documents: Document[];
  activeDocumentId: string | null;
  onDocumentSelect: (id: string) => void;
  onDocumentAdd: () => void;
  onDocumentDelete: (id: string) => void;
  onDocumentReorder: (documents: Document[]) => void;
  theme: 'light' | 'dark';
  searchQuery: string;
  searchResults: Array<{
    documentId: string;
    matches: Array<{
      text: string;
      index: number;
    }>;
  }>;
}

const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  documents,
  activeDocumentId,
  onDocumentSelect,
  onDocumentAdd,
  onDocumentDelete,
  onDocumentReorder,
  theme,
  searchQuery,
  searchResults
}) => {
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);
  const [draggedDoc, setDraggedDoc] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('ja-JP', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    if (window.confirm('このドキュメントを削除しますか？')) {
      onDocumentDelete(docId);
    }
  };

  const handleDragStart = (e: React.DragEvent, docId: string) => {
    setDraggedDoc(docId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', docId);
  };

  const handleDragEnd = () => {
    setDraggedDoc(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedDoc) return;

    const draggedIndex = documents.findIndex(doc => doc.id === draggedDoc);
    if (draggedIndex === -1 || draggedIndex === dropIndex) return;

    const newDocuments = [...documents];
    const [draggedDocument] = newDocuments.splice(draggedIndex, 1);
    newDocuments.splice(dropIndex, 0, draggedDocument);

    onDocumentReorder(newDocuments);
    setDraggedDoc(null);
    setDragOverIndex(null);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className={`${
          theme === 'dark' 
            ? 'bg-yellow-600 text-yellow-100' 
            : 'bg-yellow-200 text-yellow-900'
        } px-0.5 rounded`}>
          {part}
        </mark>
      ) : part
    );
  };

  // Filter documents based on search
  const filteredDocuments = searchQuery 
    ? documents.filter(doc => 
        searchResults.some(result => result.documentId === doc.id)
      )
    : documents;

  const getSearchMatches = (docId: string) => {
    return searchResults.find(result => result.documentId === docId)?.matches || [];
  };

  return (
    <div className={`w-56 h-full border-r flex flex-col ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-3 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-xs font-semibold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {searchQuery ? '検索結果' : 'ドキュメント'}
          </h2>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            theme === 'dark' 
              ? 'bg-gray-700 text-gray-300' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {filteredDocuments.length}
          </span>
        </div>
        
        {!searchQuery && (
          <button
            onClick={onDocumentAdd}
            className={`w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Plus className="w-3 h-3" />
            新規作成
          </button>
        )}
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        {filteredDocuments.length === 0 ? (
          <div className={`p-3 text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <FileText className="w-6 h-6 mx-auto mb-1 opacity-50" />
            {searchQuery ? (
              <>
                <p className="text-xs">検索結果がありません</p>
                <p className="text-xs mt-0.5 opacity-75">別のキーワードで検索</p>
              </>
            ) : (
              <>
                <p className="text-xs">ドキュメントがありません</p>
                <p className="text-xs mt-0.5 opacity-75">新規作成してください</p>
              </>
            )}
          </div>
        ) : (
          <div className="p-1.5">
            {filteredDocuments.map((doc, index) => {
              const matches = getSearchMatches(doc.id);
              return (
                <div
                  key={doc.id}
                  draggable={!searchQuery}
                  onDragStart={(e) => !searchQuery && handleDragStart(e, doc.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => !searchQuery && handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => !searchQuery && handleDrop(e, index)}
                  className={`relative group cursor-pointer rounded p-2 mb-1.5 transition-all duration-200 ${
                    !searchQuery && dragOverIndex === index
                      ? theme === 'dark'
                        ? 'border-t-2 border-blue-500'
                        : 'border-t-2 border-blue-500'
                      : ''
                  } ${
                    !searchQuery && draggedDoc === doc.id
                      ? 'opacity-50 scale-95'
                      : ''
                  } ${
                    activeDocumentId === doc.id
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-200'
                        : 'hover:bg-white hover:shadow-sm text-gray-700'
                  }`}
                  onClick={() => onDocumentSelect(doc.id)}
                  onMouseEnter={() => setHoveredDoc(doc.id)}
                  onMouseLeave={() => setHoveredDoc(null)}
                >
                  <div className="flex items-start gap-2">
                    {/* Drag Handle - only show when not searching */}
                    {!searchQuery && (
                      <div className={`flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing ${
                        activeDocumentId === doc.id
                          ? 'text-blue-100'
                          : theme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-500'
                      }`}>
                        <GripVertical className="w-2.5 h-2.5" />
                      </div>
                    )}
                    
                    <div className="flex-shrink-0 mt-0.5">
                      <FileText className="w-3 h-3" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-medium truncate mb-1">
                        {searchQuery ? highlightText(doc.title, searchQuery) : doc.title}
                      </h3>
                      <p className={`text-xs truncate mb-1 ${
                        activeDocumentId === doc.id
                          ? 'text-blue-100'
                          : theme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-500'
                      }`}>
                        {searchQuery && matches.length > 0 && (
                          <span>
                            {highlightText(matches[0].text, searchQuery)}
                            {matches.length > 1 && (
                              <span className="ml-1 opacity-75">
                                +{matches.length - 1}件
                              </span>
                            )}
                          </span>
                        ) }
                      </p>
                      <div className={`text-xs ${
                        activeDocumentId === doc.id
                          ? 'text-blue-100'
                          : theme === 'dark'
                            ? 'text-gray-500'
                            : 'text-gray-400'
                      }`}>
                        {formatDate(doc.updatedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  {hoveredDoc === doc.id && documents.length > 1 && !searchQuery && (
                    <button
                      onClick={(e) => handleDeleteClick(e, doc.id)}
                      className={`absolute top-1 right-1 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                        activeDocumentId === doc.id
                          ? 'hover:bg-blue-700 text-blue-100'
                          : theme === 'dark'
                            ? 'hover:bg-gray-600 text-gray-300'
                            : 'hover:bg-gray-200 text-gray-600'
                      }`}
                      title="ドキュメントを削除"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSidebar;