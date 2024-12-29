export default class Customer {
    id: number;
    code: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    gender: boolean;
    birthday: Date;
    totalExpense: number;
    numberOfOrder: number;
    // orders: Order[];
    createdOn: Date;
    updatedOn: Date;
    note: string;
    constructor(id: number, code: string, name: string, email: string, phoneNumber: string, address: string, gender: boolean, birthday: Date, totalExpense: number, numberOfOrder: number, createdOn: Date, updatedOn: Date, note: string) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.gender = gender;
        this.birthday = birthday;
        this.totalExpense = totalExpense;
        this.numberOfOrder = numberOfOrder;
        // this.orders = orders;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.note = note;
    }

    static fromJson(json: any): Customer {
        return new Customer(json.id, json.code, json.name, json.email, json.phoneNumber, json.address, json.gender, new Date(json.birthday), json.totalExpense, json.numberOfOrder, new Date(json.createdOn), new Date(json.updatedOn), json.note);
    }
}