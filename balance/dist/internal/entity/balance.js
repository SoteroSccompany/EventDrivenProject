"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class BalanceEntity {
    constructor(props) {
        this._id = props.id ? props.id : (0, uuid_1.v4)();
        this._balance = props.balance;
        this._accountID = props.accountID;
        this._createdAt = new Date();
        this._updatedAt = new Date();
        this.validate();
    }
    validate() {
        let error = false;
        let message = '';
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
exports.default = BalanceEntity;
