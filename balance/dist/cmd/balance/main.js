"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const express_1 = __importDefault(require("express"));
const knex_1 = __importDefault(require("knex"));
const balance_repository_1 = __importDefault(require("../../internal/database/balance.repository"));
const get_balance_usecase_1 = __importDefault(require("../../internal/usecase/get-balance/get-balance.usecase"));
const save_balance_usecase_1 = __importDefault(require("../../internal/usecase/save-balance/save-balance.usecase"));
const balance_handler_1 = __importDefault(require("../../internal/web/balance_handler"));
const populate_1 = require("../../internal/database/populate");
const kafkajs_1 = require("kafkajs");
const event_dispatcher_1 = __importDefault(require("../../pkg/events/event-dispatcher"));
const balance_updated_handler_1 = __importDefault(require("../../internal/event/handler/balance-updated-handler"));
const balance_updated_event_1 = __importDefault(require("../../internal/event/balance-updated.event"));
async function main() {
    let connection;
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        connection = (0, knex_1.default)({
            client: 'mysql2',
            connection: {
                host: 'mysqlBalance',
                port: 3306,
                database: 'balance',
                user: 'root',
                password: 'root'
            }
        });
        await (0, populate_1.populateBalanceTable)(connection);
        const port = 3003;
        const eventDispatcher = new event_dispatcher_1.default();
        const balanceDb = new balance_repository_1.default(connection);
        const getBalanceUsecase = new get_balance_usecase_1.default(balanceDb);
        const saveBalanceUsecase = new save_balance_usecase_1.default(balanceDb);
        const eventBalanceUpdated = new balance_updated_handler_1.default(saveBalanceUsecase);
        eventDispatcher.register('BalanceUpdatedEvent', eventBalanceUpdated);
        const balanceHandle = new balance_handler_1.default({ GetBalanceUsecase: getBalanceUsecase });
        app.get('/balance/:clientId', (req, res) => balanceHandle.execute(req, res));
        const kafka = new kafkajs_1.Kafka({
            clientId: 'wallet-ts',
            brokers: ['kafka:29092']
        });
        const consumer = kafka.consumer({ groupId: 'wallet' });
        await consumer.connect();
        await consumer.subscribe({ topic: 'balances', fromBeginning: true });
        await consumer.subscribe({ topic: 'transactions', fromBeginning: true });
        console.log('Consumer connected and subscribed to balances topic');
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value?.toString();
                console.log(`Received message from topic ${topic}: ${value}`);
                if (topic === 'balances') {
                    // Lógica para mensagens do tópico "balances"
                    const data = JSON.parse(value || '{}');
                    const event = new balance_updated_event_1.default(data.Payload);
                    eventDispatcher.notify(event);
                }
                else if (topic === 'transactions') {
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
    }
    catch (error) {
        console.log("WebServer Error: ", error);
    }
}
main();
