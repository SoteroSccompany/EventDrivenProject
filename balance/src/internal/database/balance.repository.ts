import { Knex } from "knex";
import { BalanceGateway } from "../gateway/balance.gateway";
import BalanceEntity from "../entity/balance";



export default class BalanceRepository implements BalanceGateway {

    private _knex: Knex;

    constructor(knex: Knex) {
        this._knex = knex;
    }

    async saveBalance(balance: BalanceEntity): Promise<void> {
        await this._knex('balance').insert({
            id: balance.id,
            balance: balance.balance,
            accountID: balance.accountID,
            createdAt: balance.createdAt,
            updatedAt: balance.updatedAt
        });
    }

    async getBalance(accountID: string): Promise<BalanceEntity> {
        console.log("accountID: ", accountID)
        const balance = await this._knex('balance').where('accountID', accountID).first();
        if (!balance) return null;
        return new BalanceEntity({
            id: balance.id,
            balance: balance.balance,
            accountID: balance.accountID,
            createdAt: new Date(balance.createdAt),
            updatedAt: new Date(balance.updatedAt)
        });
    }

}