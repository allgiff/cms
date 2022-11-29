import { Contact } from "../contacts/contact.model";

export class Message {
    constructor(
        public _id: string,
        public id: string,
        public subject: string,
        public msgText: string,
        public sender: Contact
    ){ }
}