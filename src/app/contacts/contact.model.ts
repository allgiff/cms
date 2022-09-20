export class Contact {
    constructor (
        public id: string,
        public name: string,
        public email: string,
        public phone: string,
        public imageurl: string,
        public group: Contact[]
    ){}
}