import { useState, useMemo } from 'react';
import { Document } from '../types/Document';

interface SearchMatch {
  text: string;
  index: number;
}

interface SearchResult {
  documentId: string;
  matches: SearchMatch[];
}

export function useSearch(documents: Document[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    documents.forEach(doc => {
      const content = doc.content.toLowerCase();
      const title = doc.title.toLowerCase();
      const matches: SearchMatch[] = [];

      // Search in title
      if (title.includes(query)) {
        const index = title.indexOf(query);
        const start = Math.max(0, index - 5);
        const end = Math.min(doc.title.length, index + query.length + 5);
        matches.push({
          text: doc.title.substring(start, end),
          index: start
        });
      }

      // Search in content
      let searchIndex = 0;
      while (searchIndex < content.length) {
        const foundIndex = content.indexOf(query, searchIndex);
        if (foundIndex === -1) break;

        // Get context around the match (5 characters before and after)
        const start = Math.max(0, foundIndex - 5);
        const end = Math.min(doc.content.length, foundIndex + query.length + 5);
        const matchText = doc.content.substring(start, end);

        // Avoid duplicate matches that are too close to each other
        const isDuplicate = matches.some(match => 
          Math.abs(match.index - foundIndex) < query.length + 10
        );

        if (!isDuplicate) {
          matches.push({
            text: matchText,
            index: foundIndex
          });
        }

        searchIndex = foundIndex + 1;

        // Limit matches per document to avoid performance issues
        if (matches.length >= 5) break;
      }

      if (matches.length > 0) {
        results.push({
          documentId: doc.id,
          matches
        });
      }
    });

    return results;
  }, [documents, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults
  };
}