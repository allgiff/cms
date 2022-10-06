import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1', 'Document 1', 'Description 1','https://www.fakeurl1', null),
    new Document('2', 'Document 2', 'Description 2','https://www.fakeurl2', null)
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelected(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
