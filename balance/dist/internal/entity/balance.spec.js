"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const balance_1 = __importDefault(require("./balance"));
describe("Balance tests", () => {
    it("should throw error when balance is negative", () => {
        try {
            new balance_1.default({ balance: -1, accountID: '123' });
        }
        catch (error) {
            expect(error.message).toBe('Balance cannot be negative');
        }
    });
    it("should throw error when accountId is null", () => {
        try {
            new balance_1.default({ balance: 0, accountID: '' });
        }
        catch (error) {
            expect(error.message).toBe('Account ID cannot be empty');
        }
    });
    it("should create a valid balance", () => {
        expect(() => {
            new balance_1.default({ balance: 0, accountID: '123' });
        }).not.toThrow();
    });
});
