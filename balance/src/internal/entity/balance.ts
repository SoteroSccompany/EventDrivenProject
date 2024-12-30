import { v4 as uuidv4 } from 'uuid';



type BalanceProps = {
    id?: string;
    balance: number;
    accountID: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export default class BalanceEntity {

    private _id: string;
    private _balance: number;
    private _accountID: string;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: BalanceProps) {
        this._id = props.id ? props.id : uuidv4();
        this._balance = props.balance;
        this._accountID = props.accountID;
        this._createdAt = new Date();
        this._updatedAt = new Date();
        this.validate();
    }

    validate() {
        let error: boolean = false;
        let message: string = '';

        if (this._balance < 0) {
            error = true;
            message = 'Balance cannot be negative';
        }
        if (this._accountID === '') {
            error = true;
            message += 'Account ID cannot be empty';
        }
        if (error) {
            throw new Error(message);
        }

    }

    get id() {
        return this._id;
    }

    get balance() {
        return this._balance;
    }

    get accountID() {
        return this._accountID;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }


}