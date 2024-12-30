import Knex, { Knex as Kn } from "knex";
import BalanceRepository from "../../database/balance.repository";
import SaveBalanceUsecase from "./save-balance.usecase";


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

    it("should save balance", async () => {
        const repository = new BalanceRepository(connection);
        const usecase = new SaveBalanceUsecase(repository);

        const input = {
            balance: 10,
            accountID: '123'
        }
        const balance = await usecase.execute(input);
        const database = await connection('balance').where('accountID', '123').first();
        expect(database.id).toBe(balance.id);
        expect(database.balance).toBe(balance.balance);
        expect(database.accountID).toBe(balance.accountID);
        expect(database.createdAt).toBeDefined();
        expect(database.updatedAt).toBeDefined();

    });


});