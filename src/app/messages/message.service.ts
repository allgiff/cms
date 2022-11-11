import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageListChangedEvent = new Subject<Message[]>();
  maxMessageID: number;

  constructor(private http: HttpClient) {
    this.maxMessageID = this.getMaxId();
   }

   getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
   }

   getMessages() {
    this.http.get("https://wdd-430-cms-7002e-default-rtdb.firebaseio.com/messages.json").subscribe(
      (messages: Message[] ) => {
        this.messages = messages;
        this.maxMessageID = this.getMaxId();
        this.messages.sort((a, b) => a.id > b.id ? 1 : b.id > a.id ? -1 : 0);
        this.messageListChangedEvent.next(this.messages.slice());
      });
  
      (error: any) => {
        console.log(error);
      }
  }

  storeMessages() {
    let messages = JSON.stringify(this.messages);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http
    .put("https://wdd-430-cms-7002e-default-rtdb.firebaseio.com/messages.json", messages, {
      headers: headers,
    })
    .subscribe(() => {
      this.messageListChangedEvent.next(this.messages.slice());
    });
  }


   getMaxId() {
    let maxId = 0;

    for (const message of this.messages) {
      let currentId = parseInt(message.id);

      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

   addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
   }
}
