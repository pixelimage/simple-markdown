import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface PreviewPaneProps {
  content: string;
  theme: 'light' | 'dark';
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ content, theme }) => {
  const sanitizedHtml = useMemo(() => {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false,
      pedantic: false,
      sanitize: false,
      silent: false,
      smartypants: true,
      xhtml: false,
    });

    // Parse markdown to HTML
    const rawHtml = marked(content);
    
    // Sanitize HTML to prevent XSS
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOW_ARIA_ATTR: true,
      ALLOW_DATA_ATTR: true,
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins',
        'ul', 'ol', 'li', 'dl', 'dt', 'dd',
        'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
        'a', 'img',
        'hr', 'div', 'span',
        'sub', 'sup',
        'details', 'summary',
        'mark', 'small',
        'abbr', 'cite', 'dfn', 'kbd', 'samp', 'var'
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'alt', 'src', 'width', 'height',
        'class', 'id', 'style',
        'target', 'rel',
        'align', 'valign',
        'rowspan', 'colspan',
        'start', 'type', 'reversed',
        'open'
      ],
      ALLOW_UNKNOWN_PROTOCOLS: false,
      FORBID_TAGS: ['script', 'object', 'embed', 'link', 'style', 'meta'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    });

    return cleanHtml;
  }, [content]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div 
          className={`p-4 prose max-w-none ${
            theme === 'dark' 
              ? 'prose-invert prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-gray-200 prose-code:text-gray-200 prose-pre:bg-gray-800 prose-pre:text-gray-200 prose-blockquote:text-gray-300 prose-blockquote:border-gray-600 prose-hr:border-gray-600 prose-a:text-blue-400 prose-a:hover:text-blue-300 prose-th:text-gray-200 prose-td:text-gray-300 prose-li:text-gray-300' 
              : 'prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-blockquote:text-gray-600 prose-blockquote:border-gray-300 prose-hr:border-gray-300 prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-th:text-gray-900 prose-td:text-gray-700 prose-li:text-gray-700'
          }`}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
    </div>
  );
};

export default PreviewPane;