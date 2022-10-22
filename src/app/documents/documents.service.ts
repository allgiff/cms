import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();

  constructor() { 
    this.documents = MOCKDOCUMENTS;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);

    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);

    this.documentChangedEvent.emit(this.documents.slice());
  }

  getDocument(id: string): Document {
    return this.documents.find((document) => document.id === id);
   }

   getDocuments(): Document[] {
    return this.documents.slice();
}
}
