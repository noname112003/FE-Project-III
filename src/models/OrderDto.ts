export default class OrderDto {
    id: number;
    code: string;
    totalQuantity: number;
    totalPayment: number;
    createdOn: Date;
    constructor(id: number, code: string, totalQuantity: number, totalPayment: number,  createdOn: Date) {
        this.id = id;
        this.code = code;
        this.totalQuantity = totalQuantity;
        this.totalPayment = totalPayment;
        this.createdOn = createdOn;
    }

    static fromJson(json: any): OrderDto {
        return new OrderDto(json.id, json.code, json.totalQuantity, json.totalPayment, new Date(json.createdOn));
    }
}