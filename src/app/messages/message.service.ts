import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
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

   sortAndSend() {
    //this.messages.sort((a, b) => a.subject > b.subject ? 1 : b.subject > a.subject ? -1 : 0);
    this.messageListChangedEvent.next(this.messages.slice());
  }

   getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
   }

   getMessages() {
    this.http.get<{message: string, messages: Message[]}>('http://localhost:3000/messages').subscribe(
      (messageData) => {
        this.messages = messageData.messages;
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
    .put("http://localhost:3000/messages", messages, {
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
    if (!message) {
      return;
    }

    // make sure id of the new message is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, newMessage: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {

        message._id = responseData.newMessage._id;
        message.id = responseData.newMessage.id;
          // add new document to documents
          this.messages.push(message);
          this.sortAndSend();
        }
      );
  }
}
