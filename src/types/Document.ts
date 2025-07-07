export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface DocumentState {
  documents: Document[];
  activeDocumentId: string | null;
}