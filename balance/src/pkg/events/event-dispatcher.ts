import { EventDispatcherInterface } from "./interfaces/event-dispatcher.interface";
import { EventHandlerInterface } from "./interfaces/event-handler.interface";
import { EventInterface } from "./interfaces/event.interface";




export default class EventDispatcher implements EventDispatcherInterface {

    private eventsHandlers: { [eventName: string]: EventHandlerInterface[] } = {};

    get getEventsHandlers(): { [eventName: string]: EventHandlerInterface[] } {
        return this.eventsHandlers;
    }


    register(eventName: string, eventHandler: EventHandlerInterface): void {
        if (!this.eventsHandlers[eventName]) {
            this.eventsHandlers[eventName] = [];
        }
        this.eventsHandlers[eventName].push(eventHandler)
    }

    unregister(eventName: string, eventHandler: EventHandlerInterface) {
        if (this.eventsHandlers[eventName]) {
            const index = this.eventsHandlers[eventName].indexOf(eventHandler)
            if (index !== -1) {
                this.eventsHandlers[eventName].splice(index, 1)
            }
        }
    }

    unregisterAll(): void {
        this.eventsHandlers = {};
    }


    hasEvent(eventName: string, eventHandler: EventHandlerInterface): boolean {
        const handlers = this.eventsHandlers[eventName];
        return handlers ? handlers.includes(eventHandler) : false;
    }


    notify(event: EventInterface): void {
        const eventName = event.constructor.name;
        if (this.eventsHandlers[eventName]) {
            this.eventsHandlers[eventName].forEach((eventsHandler: EventHandlerInterface) => {
                eventsHandler.handle(event)
            })
        }
    }

}