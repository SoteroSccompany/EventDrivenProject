import express, { Express } from 'express';
import Knex, { Knex as Kn } from 'knex';
import BalanceRepository from '../../internal/database/balance.repository';
import { BalanceGateway } from '../../internal/gateway/balance.gateway';
import GetBalanceUsecase from '../../internal/usecase/get-balance/get-balance.usecase';
import SaveBalanceUsecase from '../../internal/usecase/save-balance/save-balance.usecase';
import BalanceHandler from '../../internal/web/balance_handler';
import { UsecaseGateway } from '../../internal/gateway/usecase.gateway';
import { populateBalanceTable } from '../../internal/database/populate';



export async function main() {
    let connection: Kn;
    try {
        const app: Express = express();
        app.use(express.json());

        connection = Knex({
            client: 'mysql2',
            connection: {
                host: 'localhost',
                port: 3307,
                database: 'balance',
                user: 'root',
                password: 'root'
            }
        });
        await populateBalanceTable(connection);
        const port: number = 3003;

        const balanceDb: BalanceGateway = new BalanceRepository(connection);
        const getBalanceUsecase: UsecaseGateway = new GetBalanceUsecase(balanceDb);
        const saveBalanceUsecase: UsecaseGateway = new SaveBalanceUsecase(balanceDb);
        const balanceHandle = new BalanceHandler({ GetBalanceUsecase: getBalanceUsecase });

        app.get('/balance/:clientId', (req, res) => balanceHandle.execute(req, res));

        /*
           2 - Aqui deve ser implementado o código para ouvir o kafka
           
        
        */


        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
        process.on('SIGINT', async () => {
            console.log('Shutting down...');
            await connection.destroy();
            process.exit(0);
        });
    } catch (error) {
        console.log("WebServer Error: ", error);
    }
}

main();