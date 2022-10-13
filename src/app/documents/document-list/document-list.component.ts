import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentsService } from '../documents.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  contacts: Document[] = [];

  constructor(private documentsService: DocumentsService) { }

  ngOnInit() {
    this.contacts = this.documentsService.getDocuments();
  }

  onSelected(document: Document) {
   
  }

}
