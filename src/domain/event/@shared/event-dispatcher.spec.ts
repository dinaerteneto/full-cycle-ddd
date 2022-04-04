import EventDispatcher from "./event-dispatcher";
import SendEmailWherProcutIsCreatedEventHandler from "./product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "./product/product-created.event";

describe("Domain events tests", () => {

    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWherProcutIsCreatedEventHandler()
        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined()
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)
    });

    it("should unregister an event handle", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWherProcutIsCreatedEventHandler()
        eventDispatcher.register("ProductCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0)
    })

    it("should unregister all event handler", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWherProcutIsCreatedEventHandler()
        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)
        eventDispatcher.unregisterAll()
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined()
    })

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWherProcutIsCreatedEventHandler()
        const spyEventHandle = jest.spyOn(eventHandler, "handle")
        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 100
        })

        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler)

        eventDispatcher.notify(productCreatedEvent)
        expect(spyEventHandle).toHaveBeenCalled()
    })
})