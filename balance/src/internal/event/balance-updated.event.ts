import { EventInterface } from "../../pkg/events/interfaces/event.interface";



export default class BalanceUpdatedEvent implements EventInterface {
    dataTimeOccured: Date;
    payload: any;

    constructor(eventData: any) {
        this.dataTimeOccured = new Date();
        this.payload = eventData;
    }
}