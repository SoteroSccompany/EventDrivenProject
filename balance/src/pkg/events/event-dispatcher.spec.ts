import BalanceUpdatedEvent from "../../internal/event/balance-updated.event";
import BalanceUpdatedHandler from "../../internal/event/handler/balance-updated-handler";
import EventDispatcher from "./event-dispatcher";



describe("Event dispatcher test", () => {

    it("should register event", () => {
        const eventDispatcher = new EventDispatcher();

        // const eventBalanceUpdated = new BalanceUpdatedEvent({ data: { total: 100, amount: 20 }, msg: "Teste" })
        const eventBalanceUpdatedHandler = new BalanceUpdatedHandler();
        eventDispatcher.register("BalanceUpdatedEvent", eventBalanceUpdatedHandler)
        const events = eventDispatcher.getEventsHandlers
        expect(Object.keys(events).length).toBe(1)
        expect(events["BalanceUpdatedEvent"].length).toBe(1)

    });

    it("should unregister event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventBalanceUpdatedHandler = new BalanceUpdatedHandler();
        eventDispatcher.register("BalanceUpdatedEvent", eventBalanceUpdatedHandler)
        let events = eventDispatcher.getEventsHandlers
        expect(Object.keys(events).length).toBe(1)
        expect(events["BalanceUpdatedEvent"].length).toBe(1)
        eventDispatcher.unregister("BalanceUpdatedEvent", eventBalanceUpdatedHandler)
        events = eventDispatcher.getEventsHandlers
        expect(events["BalanceUpdatedEvent"].length).toBe(0)
    })

    it("should unregister  alll event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventBalanceUpdatedHandler = new BalanceUpdatedHandler();
        eventDispatcher.register("BalanceUpdatedEvent", eventBalanceUpdatedHandler)
        eventDispatcher.register("BalanceUpdatedEvent", eventBalanceUpdatedHandler)
        let events = eventDispatcher.getEventsHandlers
        expect(Object.keys(events).length).toBe(1)
        expect(events["BalanceUpdatedEvent"].length).toBe(2)
        eventDispatcher.unregisterAll();
        events = eventDispatcher.getEventsHandlers
        expect(Object.keys(events).length).toBe(0)
    });

    it("should check if event exist", () => {
        const eventDispatcher = new EventDispatcher();
        const eventBalanceUpdatedHandler = new BalanceUpdatedHandler();
        eventDispatcher.register("BalanceUpdatedEvent", eventBalanceUpdatedHandler)
        const hasBalanceUpdated = eventDispatcher.hasEvent("BalanceUpdatedEvent", eventBalanceUpdatedHandler)
        expect(hasBalanceUpdated).toBe(true)
    });


    it("should notify all Events", () => {
        const eventDispatcher = new EventDispatcher();
        const eventBalanceUpdatedHandler = new BalanceUpdatedHandler();
        eventDispatcher.register("BalanceUpdatedEvent", eventBalanceUpdatedHandler)
        const event = new BalanceUpdatedEvent({ data: { account_id: "123", total: 150 } })
        const spyHandler = jest.spyOn(eventBalanceUpdatedHandler, "handle")

        eventDispatcher.notify(event)
        expect(spyHandler).toHaveBeenCalled()

    });

});