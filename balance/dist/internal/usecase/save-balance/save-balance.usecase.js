"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const balance_1 = __importDefault(require("../../entity/balance"));
class SaveBalanceUsecase {
    constructor(repository) {
        this._repository = repository;
    }
    async execute(input) {
        try {
            const balance = new balance_1.default(input);
            await this._repository.saveBalance(balance);
            return balance;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = SaveBalanceUsecase;
