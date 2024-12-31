"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BalanceUpdatedHandler {
    constructor(usecase) {
        this.usecase = usecase;
    }
    async handle(event) {
        console.log("evento disparo do handler de atualizacao de balance", event.payload);
        const accountFrom = {
            accountID: event.payload.account_id_from,
            balance: event.payload.balance_account_id_from
        };
        const accountTo = {
            accountID: event.payload.account_id_to,
            balance: event.payload.balance_account_id_to
        };
        await Promise.all([
            this.usecase.execute(accountFrom),
            this.usecase.execute(accountTo)
        ]);
    }
}
exports.default = BalanceUpdatedHandler;
