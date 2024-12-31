"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const balance_1 = __importDefault(require("../entity/balance"));
class BalanceRepository {
    constructor(knex) {
        this._knex = knex;
    }
    async saveBalance(balance) {
        await this._knex('balance').insert({
            id: balance.id,
            balance: balance.balance,
            accountID: balance.accountID,
            createdAt: balance.createdAt,
            updatedAt: balance.updatedAt
        });
    }
    async getBalance(accountID) {
        console.log("accountID: ", accountID);
        const balance = await this._knex('balance').where('accountID', accountID).first();
        if (!balance)
            return null;
        return new balance_1.default({
            id: balance.id,
            balance: balance.balance,
            accountID: balance.accountID,
            createdAt: new Date(balance.createdAt),
            updatedAt: new Date(balance.updatedAt)
        });
    }
}
exports.default = BalanceRepository;
