import { EventHandlerInterface } from "../../../pkg/events/interfaces/event-handler.interface";
import { UsecaseGateway } from "../../gateway/usecase.gateway";
import BalanceUpdatedEvent from "../balance-updated.event";



export default class BalanceUpdatedHandler implements EventHandlerInterface {

    private usecase: UsecaseGateway;

    constructor(usecase: UsecaseGateway) {
        this.usecase = usecase;
    }

    async handle(event: BalanceUpdatedEvent): Promise<void> {
        console.log("evento disparo do handler de atualizacao de balance", event.payload)
        const accountFrom = {
            accountID: event.payload.account_id_from,
            balance: event.payload.balance_account_id_from
        }
        const accountTo = {
            accountID: event.payload.account_id_to,
            balance: event.payload.balance_account_id_to
        }
        await Promise.all([
            this.usecase.execute(accountFrom),
            this.usecase.execute(accountTo)
        ])
    }

}