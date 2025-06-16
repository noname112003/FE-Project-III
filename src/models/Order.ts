export default class Order {
    id: number;
    code: string;
    creatorId: string;
    customerId: number;
    orderDetails: [];
    note: string;
    paymentType: string;
    totalQuantity: number;
    cashReceive: number;
    cashRepay: number;
    totalPayment: number;
    createdOn: Date;
    updatedTime: Date;
    constructor(id: number, code: string, creatorId: string, customerId: number, orderDetails: [], note: string, paymentType: string, totalQuantity: number, totalPayment: number, cashReceive: number, cashRepay: number, createdOn: Date, updatedTime: Date) {
        this.id = id;
        this.code = code;
        this.creatorId = creatorId;
        this.customerId = customerId;
        this.orderDetails = orderDetails;
        this.note = note;
        this.paymentType = paymentType;
        this.totalQuantity = totalQuantity;
        this.totalPayment = totalPayment;
        this.cashReceive = cashReceive;
        this.cashRepay = cashRepay;
        this.createdOn = createdOn;
        this.updatedTime = updatedTime;
    }

    static fromJson(json: any): Order {
        return new Order(json.id, json.code, json.creatorId, json.customerId, json.orderDetails, json.note, json.paymentType, json.totalQuantity, json.totalPayment, json.cashReceive, json.cashRepay, new Date(json.createdOn), new Date(json.updatedTime));
    }
}
