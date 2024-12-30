import Knex, { Knex as Kn } from "knex";
import BalanceRepository from "../../database/balance.repository";
import GetBalanceUsecase from "./get-balance.usecase";

describe("SaveBalanceUsecase tests", () => {

    let connection: Kn;

    beforeEach(async () => {
        connection = Knex({
            client: 'sqlite3',
            connection: {
                filename: ':memory:'
            },
            useNullAsDefault: true
        })
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
        const repository = new BalanceRepository(connection);
        const usecase = new GetBalanceUsecase(repository);
        const balance = await usecase.execute({ id: '123678' });
        expect(balance.id).toBe('123678');
        expect(balance.balance).toBe(0);
        expect(balance.accountID).toBe('123678');
        expect(balance.createdAt).toBeDefined();
        expect(balance.updatedAt).toBeDefined();
    });


});