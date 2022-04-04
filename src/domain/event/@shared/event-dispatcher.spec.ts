import EventDispatcher from "./event-dispatcher";
import SendEmailWherProcutIsCreatedEventHandler from "./product/handler/send-email-when-product-is-created.handler";

describe("Domain events tests", () => {

    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWherProcutIsCreatedEventHandler()
        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined()
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)
    });

    it("should unrgeister an event handle", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWherProcutIsCreatedEventHandler()
        eventDispatcher.register("ProductCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0)
    })

})