import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})

export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  subsription: Subscription;
  term: string;

  constructor(private contactService: ContactService) { }

  ngOnInit() {
   this.subsription = this.contactService.contactListChangedEvent.subscribe(
    (contacts: Contact[]) => {
      this.contacts = contacts;
    }
   );

   this.contactService.getContacts();
  }

  ngOnDestroy() {
    this.subsription.unsubscribe();
  }

  search(value: string) {
    this.term = value;
  }
}
