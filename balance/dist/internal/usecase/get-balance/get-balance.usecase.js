"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetBalanceUsecase {
    constructor(repository) {
        this._repository = repository;
    }
    async execute(input) {
        const balance = await this._repository.getBalance(input.id);
        if (!balance) {
            throw new Error('Balance not found');
        }
        return {
            id: balance.id,
            balance: balance.balance,
            accountID: balance.accountID,
            createdAt: balance.createdAt,
            updatedAt: balance.updatedAt
        };
    }
}
exports.default = GetBalanceUsecase;
