export class Contact {
    subscribe(arg0: (contactData: any) => void) {
      throw new Error('Method not implemented.');
    }
    constructor (
        public id: string,
        public name: string,
        public email: string,
        public phone: string,
        public imageUrl: string,
        public group: Contact[]
    ){}
}