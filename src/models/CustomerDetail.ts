import OrderDto from "./OrderDto.ts";

export default class CustomerDetail {
    id: number;
    code: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    gender: boolean;
    birthday: Date | null;
    totalExpense: number;
    numberOfOrder: number;
    orders: OrderDto[];
    createdOn: Date;
    updatedOn: Date;
    note: string;
    earliestOrderDate: Date | null;
    latestOrderDate: Date | null;
    constructor(id: number, code: string, name: string, email: string, phoneNumber: string, address: string, gender: boolean, birthday: Date | null, totalExpense: number, numberOfOrder: number, createdOn: Date, updatedOn: Date, note: string, orders: OrderDto[], earliestOrderDate: Date | null, latestOrderDate: Date | null ) {
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
        this.orders = orders;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.note = note;
        this.earliestOrderDate = earliestOrderDate;
        this.latestOrderDate = latestOrderDate;
    }

    static fromJson(json: any): CustomerDetail {
        return new CustomerDetail(json.id, json.code, json.name, json.email, json.phoneNumber, json.address, json.gender, json.birthday ? new Date(json.birthday) : null, json.totalExpense, json.numberOfOrder, new Date(json.createdOn), new Date(json.updatedOn), json.note, json.orders, json.earliestOrderDate ? new Date(json.earliestOrderDate) : null, json.latestOrderDate ? new Date(json.latestOrderDate) : null);
    }
}