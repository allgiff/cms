import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentID: number;

  constructor(private http: HttpClient) { 
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

      this.storeDocuments();
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

    this.storeDocuments();
  }

  getDocument(id: string): Document {
    return this.documents.find((document) => document.id === id);
   }

  getDocuments() {
    this.http.get<Document[]>('https://wdd-430-cms-7002e-default-rtdb.firebaseio.com/documents.json').subscribe(
      (documents: Document[] ) => {
        this.documents = documents;
        this.maxDocumentID = this.getMaxId();
        this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
        this.documentListChangedEvent.next(this.documents.slice());
      });
  
      (error: any) => {
        console.log(error);
      }
  }

  storeDocuments() {
    let documents = JSON.stringify(this.documents);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http
    .put("https://wdd-430-cms-7002e-default-rtdb.firebaseio.com/documents.json", documents, {
      headers: headers,
    })
    .subscribe(() => {
      this.documentListChangedEvent.next(this.documents.slice());
    });
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
    
    this.storeDocuments();
  }

}
