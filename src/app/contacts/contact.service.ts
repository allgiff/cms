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

   sortAndSend() {
    this.contacts.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

   addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new Document is empty
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }

   deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
  
    const pos = this.contacts.findIndex(d => d.id === contact.id);
  
    if (pos < 0) {
      return;
    }
  
    // delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

   getContact(id: string) {
    return this.http.get<{ message: string, contact: Contact }>('http://localhost:3000/contacts/' + id);
   }

   getContacts() {
    this.http.get<{message: string, contacts: Contact[]}>('http://localhost:3000/contacts').subscribe(
      (contactData) => {
        this.contacts = contactData.contacts;
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
    .put("http://localhost:3000/contacts", contacts, {
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

    const pos = this.contacts.findIndex(d => d.id === originalContact.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new Document to the id of the old Document
  newContact.id = originalContact.id;
  newContact._id = originalContact._id;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // update database
  this.http.put('http://localhost:3000/contacts/' + originalContact.id,
    newContact, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      }
    );
}
}
