import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactID: number;

  constructor(private http: HttpClient) {
    this.maxContactID = this.getMaxId();
   }

   addContact(newContact: Contact) {
    if(!newContact) {
      return;
    }
      this.maxContactID++;
      newContact.id = this.maxContactID.toString();
      this.contacts.push(newContact);
      
      this.storeContacts();
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

    this.storeContacts();

   }

   getContact(id: string): Contact {
    return this.contacts.find((contact) => contact.id === id);
   }

   getContacts() {
    this.http.get<Contact[]>('https://wdd-430-cms-7002e-default-rtdb.firebaseio.com/contacts.json').subscribe(
      (contacts: Contact[] ) => {
        this.contacts = contacts;
        this.maxContactID = this.getMaxId();
        this.contacts.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  
      (error: any) => {
        console.log(error);
      }
   }

   storeContacts() {
    let contacts = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http
    .put("https://wdd-430-cms-7002e-default-rtdb.firebaseio.com/contacts.json", contacts, {
      headers: headers,
    })
    .subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice());
    });
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

    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;

    this.storeContacts();
  }
}
