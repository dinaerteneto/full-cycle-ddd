import EventHandlerInterface from "../../event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class SendConsoleWhenProductIsCreatedEventHandler implements EventHandlerInterface<CustomerCreatedEvent> {
    handle(event: CustomerCreatedEvent) {
        console.log(`"Esse é o primeiro console.log do evento: CustomerCreated: ${event.eventData.name} is created`)
    }
}