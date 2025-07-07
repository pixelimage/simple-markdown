import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  theme: 'light' | 'dark';
}

const EditorPane: React.FC<EditorPaneProps> = ({ value, onChange, theme }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
    
    // Add keyboard shortcuts
    editorInstance.addCommand(
      // Ctrl+B for bold
      2048 | 32, // monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB
      () => {
        const selection = editorInstance.getSelection();
        if (selection) {
          const selectedText = editorInstance.getModel()?.getValueInRange(selection) || '';
          const boldText = selectedText ? `**${selectedText}**` : '**bold text**';
          editorInstance.executeEdits('bold', [{
            range: selection,
            text: boldText
          }]);
        }
      }
    );
    
    // Ctrl+I for italic
    editorInstance.addCommand(
      2048 | 39, // monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI
      () => {
        const selection = editorInstance.getSelection();
        if (selection) {
          const selectedText = editorInstance.getModel()?.getValueInRange(selection) || '';
          const italicText = selectedText ? `*${selectedText}*` : '*italic text*';
          editorInstance.executeEdits('italic', [{
            range: selection,
            text: italicText
          }]);
        }
      }
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={value}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
            fontSize: 16,
            fontFamily: 'SF Mono, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderLineHighlight: 'gutter',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            folding: true,
            foldingHighlight: true,
            showFoldingControls: 'mouseover',
            matchBrackets: 'always',
            theme: theme === 'dark' ? 'vs-dark' : 'light',
            padding: { top: 16, bottom: 16 },
            lineHeight: 24,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: 'selection',
            renderControlCharacters: false,
            renderFinalNewline: true,
            rulers: [80, 120],
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
              arrowSize: 12,
              useShadows: true,
              verticalHasArrows: false,
              horizontalHasArrows: false,
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showText: true,
              showWords: true,
            },
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: 'smart',
            tabCompletion: 'on',
            wordBasedSuggestions: true,
            parameterHints: {
              enabled: true,
            },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoSurround: 'languageDefined',
            formatOnType: true,
            formatOnPaste: true,
            dragAndDrop: true,
            links: true,
            find: {
              cursorMoveOnType: true,
              seedSearchStringFromSelection: true,
              autoFindInSelection: 'never',
            },
          }}
        />
      </div>
    </div>
  );
};

export default EditorPane;