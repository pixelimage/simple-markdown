import { useCallback } from 'react';
import { Document, DocumentState } from '../types/Document';
import { useLocalStorage } from './useLocalStorage';

const defaultDocument: Document = {
  id: 'default',
  title: 'シンプルマークダウンへようこそ！',
  content: `#シンプルマークダウンへようこそ！ 🚀

シンプルマークダウンは**リアルタイムMarkdownエディタ**です。左側で編集を始めると、右側に即座にプレビューが表示されます。

## 主な機能 ✨

- **リアルタイムプレビュー**: Markdownの内容を即座に確認
- **Monacoエディタ**: シンタックスハイライト付きのプロフェッショナルなエディタ
- **ダークモード**: 長時間の執筆でも目に優しい
- **レスポンシブデザイン**: デスクトップでもモバイルでも快適
- **エクスポート/インポート**: 作成した文書を\`.md\`ファイルで保存・読み込み
- **複数ドキュメント管理**: 複数の文書を整理して管理
- **自動保存**: 作業内容は自動的にローカルストレージに保存
- **ドラッグ＆ドロップ**: ドキュメントの並び替えが簡単

## Markdown記法サンプル

### テキスト装飾

- **太字**: \`**太字**\`
- *斜体*: \`*斜体*\`
- \`インラインコード\`: バッククォートで囲む
- \`~~取り消し線~~\`: \`~~テキスト~~\`

### リスト

1. 最初の項目
2. 2番目の項目
   - ネストされたリスト
   - さらにネスト

### コードブロック

### テーブル

| 機能         | 状態     | 優先度   |
|--------------|----------|----------|
| エディタ     | ✅ 完了   | 高       |
| プレビュー   | ✅ 完了   | 高       |
| エクスポート | ✅ 完了   | 中       |
| 並び替え     | ✅ 完了   | 中       |

### 引用

> "未来を予測する最良の方法は、それを創造することだ。"
> — ピーター・ドラッカー

### リンクと画像

[公式サイトを見る](https://example.com)

![サンプル画像](https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop)

---

楽しい執筆を！ 📝`,
  createdAt: Date.now(),
  updatedAt: Date.now()
};

export function useDocuments() {
  const [documentState, setDocumentState] = useLocalStorage<DocumentState>('splitmark-documents', {
    documents: [defaultDocument],
    activeDocumentId: defaultDocument.id
  });

  const documents = documentState.documents;
  const activeDocumentId = documentState.activeDocumentId;

  // Get active document
  const activeDocument = documents.find(doc => doc.id === activeDocumentId) || documents[0] || null;

  // Generate title from content (first line)
  const generateTitle = (content: string): string => {
    const firstLine = content.split('\n')[0].trim();
    if (!firstLine) return 'Untitled Document';
    
    // Remove markdown formatting from title
    const cleanTitle = firstLine
      .replace(/^#+\s*/, '') // Remove heading markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .trim();
    
    return cleanTitle || 'Untitled Document';
  };

  // Add new document
  const addDocument = useCallback(() => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      title: 'New Document',
      content: '# New Document\n\nStart writing here...',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setDocumentState(prev => ({
      documents: [...prev.documents, newDoc],
      activeDocumentId: newDoc.id
    }));
  }, [setDocumentState]);

  // Delete document
  const deleteDocument = useCallback((id: string) => {
    setDocumentState(prev => {
      const filtered = prev.documents.filter(doc => doc.id !== id);
      let newActiveId = prev.activeDocumentId;
      if (prev.activeDocumentId === id && filtered.length > 0) {
        newActiveId = filtered[0].id;
      } else if (filtered.length === 0) {
        newActiveId = null;
      }
      return {
        documents: filtered,
        activeDocumentId: newActiveId
      };
    });
  }, [setDocumentState]);

  // Update document content
  const updateDocument = useCallback((id: string, content: string) => {
    setDocumentState(prev => ({
      ...prev,
      documents: prev.documents.map(doc => {
        if (doc.id === id) {
          const title = generateTitle(content);
          return {
            ...doc,
            content,
            title,
            updatedAt: Date.now()
          };
        }
        return doc;
      })
    }));
  }, [setDocumentState]);

  // Reorder documents
  const reorderDocuments = useCallback((newDocuments: Document[]) => {
    setDocumentState(prev => ({
      ...prev,
      documents: newDocuments
    }));
  }, [setDocumentState]);

  // Select document
  const selectDocument = useCallback((id: string) => {
    setDocumentState(prev => ({
      ...prev,
      activeDocumentId: id
    }));
  }, [setDocumentState]);

  // Export document
  const exportDocument = useCallback((id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [documents]);

  // Import document
  const importDocument = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const title = generateTitle(content);
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        title,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setDocumentState(prev => ({
        documents: [...prev.documents, newDoc],
        activeDocumentId: newDoc.id
      }));
    };
    reader.readAsText(file);
  }, [setDocumentState]);

  return {
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
  };
}