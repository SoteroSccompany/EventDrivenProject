import express, { Express } from 'express';
import Knex, { Knex as Kn } from 'knex';
import BalanceRepository from '../../internal/database/balance.repository';
import { BalanceGateway } from '../../internal/gateway/balance.gateway';
import GetBalanceUsecase from '../../internal/usecase/get-balance/get-balance.usecase';
import SaveBalanceUsecase from '../../internal/usecase/save-balance/save-balance.usecase';
import BalanceHandler from '../../internal/web/balance_handler';
import { UsecaseGateway } from '../../internal/gateway/usecase.gateway';
import { populateBalanceTable } from '../../internal/database/populate';
import { Kafka } from 'kafkajs';
import EventDispatcher from '../../pkg/events/event-dispatcher';
import BalanceUpdatedHandler from '../../internal/event/handler/balance-updated-handler';
import BalanceUpdatedEvent from '../../internal/event/balance-updated.event';



export async function main() {
    let connection: Kn;
    try {
        const app: Express = express();
        app.use(express.json());

        connection = Knex({
            client: 'mysql2',
            connection: {
                host: 'mysqlBalance',
                port: 3307,
                database: 'balance',
                user: 'root',
                password: 'root'
            }
        });
        await populateBalanceTable(connection);
        const port: number = 3003;
        const eventDispatcher = new EventDispatcher();
        const balanceDb: BalanceGateway = new BalanceRepository(connection);
        const getBalanceUsecase: UsecaseGateway = new GetBalanceUsecase(balanceDb);
        const saveBalanceUsecase: UsecaseGateway = new SaveBalanceUsecase(balanceDb);
        const eventBalanceUpdated = new BalanceUpdatedHandler(saveBalanceUsecase);
        eventDispatcher.register('BalanceUpdatedEvent', eventBalanceUpdated);
        const balanceHandle = new BalanceHandler({ GetBalanceUsecase: getBalanceUsecase });

        app.get('/balance/:clientId', (req, res) => balanceHandle.execute(req, res));

        const kafka = new Kafka({
            clientId: 'wallet-ts',
            brokers: ['kafka:29092']
        })

        const consumer = kafka.consumer({ groupId: 'wallet' })
        await consumer.connect()

        await consumer.subscribe({ topic: 'balances', fromBeginning: true })
        await consumer.subscribe({ topic: 'transactions', fromBeginning: true });
        console.log('Consumer connected and subscribed to balances topic')

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value?.toString();
                console.log(`Received message from topic ${topic}: ${value}`);

                if (topic === 'balances') {
                    // Lógica para mensagens do tópico "balances"
                    const data = JSON.parse(value || '{}');
                    const event = new BalanceUpdatedEvent(data.Payload);
                    eventDispatcher.notify(event);
                } else if (topic === 'transactions') {
                    // Lógica para mensagens do tópico "transactions"
                    const data = JSON.parse(value || '{}');
                    console.log(`Processing transaction: ${data.transactionID}`);
                    // Adicione lógica de transações aqui
                }
            },
        });



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