"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const balance_repository_1 = __importDefault(require("../../database/balance.repository"));
const get_balance_usecase_1 = __importDefault(require("./get-balance.usecase"));
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
    it("should get balance by id", async () => {
        await connection('balance').insert({
            id: '123678',
            balance: 0,
            accountID: '123678',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const repository = new balance_repository_1.default(connection);
        const usecase = new get_balance_usecase_1.default(repository);
        const balance = await usecase.execute({ id: '123678' });
        expect(balance.id).toBe('123678');
        expect(balance.balance).toBe(0);
        expect(balance.accountID).toBe('123678');
        expect(balance.createdAt).toBeDefined();
        expect(balance.updatedAt).toBeDefined();
    });
});
