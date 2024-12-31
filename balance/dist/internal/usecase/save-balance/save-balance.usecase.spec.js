"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const balance_repository_1 = __importDefault(require("../../database/balance.repository"));
const save_balance_usecase_1 = __importDefault(require("./save-balance.usecase"));
describe("SaveBalanceUsecase tests", () => {
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
        const repository = new balance_repository_1.default(connection);
        const usecase = new save_balance_usecase_1.default(repository);
        const input = {
            balance: 10,
            accountID: '123'
        };
        const balance = await usecase.execute(input);
        const database = await connection('balance').where('accountID', '123').first();
        expect(database.id).toBe(balance.id);
        expect(database.balance).toBe(balance.balance);
        expect(database.accountID).toBe(balance.accountID);
        expect(database.createdAt).toBeDefined();
        expect(database.updatedAt).toBeDefined();
    });
});
