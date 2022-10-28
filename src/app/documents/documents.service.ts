import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { max, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentID: number;

  constructor() { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentID = this.getMaxId();
  }

  addDocument(newDocument: Document) {
    if(!newDocument) {
      return;
    }
      this.maxDocumentID++;
      newDocument.id = this.maxDocumentID.toString();
      this.documents.push(newDocument);
      const documentListClone = this.documents.slice();
      this.documentListChangedEvent.next(documentListClone);
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

    this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocument(id: string): Document {
    return this.documents.find((document) => document.id === id);
   }

   getDocuments(): Document[] {
    return this.documents.slice();
}

  getMaxId() {
    let maxId = 0;

    for (const document of this.documents) {
      let currentId = parseInt(document.id);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);

    if (pos > 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    const documentListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentListClone);
  }

}
