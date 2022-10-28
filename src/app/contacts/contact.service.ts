import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactID: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactID = this.getMaxId();
   }

   addContact(newContact: Contact) {
    if(!newContact) {
      return;
    }
      this.maxContactID++;
      newContact.id = this.maxContactID.toString();
      this.contacts.push(newContact);
      const contactListClone = this.contacts.slice();
      this.contactListChangedEvent.next(contactListClone);
  }

   deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);

    this.contactListChangedEvent.next(this.contacts.slice());

   }

   getContact(id: string): Contact {
    return this.contacts.find((contact) => contact.id === id);
   }

   getContacts(): Contact[] {
    return this.contacts
      .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
      .slice();
   }

   getMaxId() {
    let maxId = 0;

    for (const contact of this.contacts) {
      let currentId = parseInt(contact.id);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);

    if (pos > 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    const contactListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactListClone);
  }
}
