import CustomerDetail from "./CustomerDetail.ts";

class NewCustomer {
    name: string;
    phoneNumber: string;
    totalExpense: number;
    numberOfOrder: number;
    gender: boolean;
    birthday: Date | null;
    email: string;
    address: string;
    note: string;

    constructor(
        name: string,
        phoneNumber: string,
        totalExpense: number,
        numberOfOrder: number,
        gender: boolean,
        birthday: Date | null,
        email: string,
        address: string,
        note: string
    ) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.totalExpense = totalExpense;
        this.numberOfOrder = numberOfOrder;
        this.gender = gender;
        this.birthday = birthday;
        this.email = email;
        this.address = address;
        this.note= note;
    }

    static fromJson(json: any): NewCustomer {
        return new NewCustomer(
            json.name,
            json.phoneNumber,
            json.totalExpense,
            json.numberOfOrder,
            json.gender,
            json.birthday ? new Date(json.birthday) : null,  // Xử lý nếu birthday có thể null
            json.email,
            json.address,
            json.note
        );
    }

    static fromCustomer(customer: CustomerDetail | null): NewCustomer {
        if(customer) {
            return new NewCustomer(
                customer.name,
                customer.phoneNumber,
                customer.totalExpense,
                customer.numberOfOrder,
                customer.gender,
                customer.birthday ? new Date(customer.birthday) : null,
                customer.email,
                customer.address,
                customer.note
            );
        }
        return new NewCustomer("", "", 0, 0, true, null, "", "", "");
    }
}

export default NewCustomer;
