"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BalanceUpdatedEvent {
    constructor(eventData) {
        this.dataTimeOccured = new Date();
        this.payload = eventData;
    }
}
exports.default = BalanceUpdatedEvent;
