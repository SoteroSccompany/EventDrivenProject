"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const balance_1 = __importDefault(require("../entity/balance"));
const balance_repository_1 = __importDefault(require("./balance.repository"));
describe("BalanceRepository tests", () => {
    let connection;
    beforeEach(async () => {
        connection = (0, knex_1.default)({
            client: 'sqlite3',
            connection: {
                filename: ':memory:'
            },
            useNullAsDefault: true
        });
        await connection.schema.createTable('balance', (table) => {
            table.string('id').primary();
            table.integer('balance');
            table.string('accountID');
            table.dateTime('createdAt');
            table.dateTime('updatedAt');
        });
    });
    afterEach(async () => {
        await connection.schema.dropTable('balance');
        await connection.destroy();
    });
    it("should save balance", async () => {
        const balance = new balance_1.default({ balance: 0, accountID: '123' });
        const repository = new balance_repository_1.default(connection);
        await repository.saveBalance(balance);
        const database = await connection('balance').where('accountID', '123').first();
        expect(database.id).toBe(balance.id);
        expect(database.balance).toBe(balance.balance);
        expect(database.accountID).toBe(balance.accountID);
        expect(database.createdAt).toBeDefined();
        expect(database.updatedAt).toBeDefined();
    });
    it("should get balance", async () => {
        await connection('balance').insert({
            id: '123678',
            balance: 0,
            accountID: '123678',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const repository = new balance_repository_1.default(connection);
        const balance = await repository.getBalance('123678');
        expect(balance.id).toBe('123678');
        expect(balance.balance).toBe(0);
        expect(balance.accountID).toBe('123678');
        expect(balance.createdAt).toBeDefined();
        expect(balance.updatedAt).toBeDefined();
        expect(balance).toBeInstanceOf(balance_1.default);
    });
});
