import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message('1', 'Subject 1', 'Message Text 1', 'Allie'),
    new Message('2', 'Subject 2', 'Message Text 2', 'Allie'),
    new Message('3', 'Subject 3', 'Message Text 3', 'Allie')
  ];
 
  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
