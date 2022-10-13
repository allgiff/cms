import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];

  messageChangedEvent = new EventEmitter<Message[]>();

  constructor() {
    this.messages = MOCKMESSAGES;
   }

   getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
   }

   getMessages(): Message[] {
    return this.messages.slice();
   }

   addMessage(message: Message) {
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
   }
}
