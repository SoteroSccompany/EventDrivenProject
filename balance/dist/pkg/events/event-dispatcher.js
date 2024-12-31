"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventDispatcher {
    constructor() {
        this.eventsHandlers = {};
    }
    get getEventsHandlers() {
        return this.eventsHandlers;
    }
    register(eventName, eventHandler) {
        if (!this.eventsHandlers[eventName]) {
            this.eventsHandlers[eventName] = [];
        }
        this.eventsHandlers[eventName].push(eventHandler);
    }
    unregister(eventName, eventHandler) {
        if (this.eventsHandlers[eventName]) {
            const index = this.eventsHandlers[eventName].indexOf(eventHandler);
            if (index !== -1) {
                this.eventsHandlers[eventName].splice(index, 1);
            }
        }
    }
    unregisterAll() {
        this.eventsHandlers = {};
    }
    hasEvent(eventName, eventHandler) {
        const handlers = this.eventsHandlers[eventName];
        return handlers ? handlers.includes(eventHandler) : false;
    }
    notify(event) {
        const eventName = event.constructor.name;
        if (this.eventsHandlers[eventName]) {
            this.eventsHandlers[eventName].forEach((eventsHandler) => {
                eventsHandler.handle(event);
            });
        }
    }
}
exports.default = EventDispatcher;
