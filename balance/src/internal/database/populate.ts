import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

interface Balance {
    id?: string;
    balance: number;
    accountID: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export async function populateBalanceTable(knex: Knex): Promise<void> {
    try {
        console.log("Checking if balance table needs population...");

        const existTable = await knex.schema.hasTable('balance');
        if (!existTable) {
            console.log("Creating balance table...");
            await knex.schema.createTable('balance', (table) => {
                table.uuid('id').primary();
                table.decimal('balance').notNullable();
                table.string('accountID').notNullable();
                table.dateTime('createdAt').notNullable();
                table.dateTime('updatedAt').notNullable();
            });
            console.log("Balance table created successfully.");
        }

        // Verificar se já existem dados na tabela "balance"
        const existingBalances = await knex<Balance>('balance').select('*');
        const count = existingBalances.length;

        if (count > 0) {
            console.log("Balance table already populated. Skipping initialization.");
            return;
        }

        console.log("Populating balance table with initial data...");

        // Dados iniciais para a tabela "balance"
        const balances: Balance[] = [
            {
                id: uuidv4(),
                balance: 1000,
                accountID: 'account-id-1',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ];

        // Inserir os dados na tabela "balance"
        await knex('balance').insert(balances);

        console.log("Balance table populated successfully.");
    } catch (error) {
        console.error("Error populating balance table:", error);
        throw error;
    }
}