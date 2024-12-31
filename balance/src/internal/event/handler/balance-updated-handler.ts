import { EventHandlerInterface } from "../../../pkg/events/interfaces/event-handler.interface";
import BalanceUpdatedEvent from "../balance-updated.event";



export default class BalanceUpdatedHandler implements EventHandlerInterface {


    handle(event: BalanceUpdatedEvent): void {
        console.log("evento disparo do handler de atualizacao de balance", event)
    }

}