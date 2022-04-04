import EventHandlerInterface from "../../event-handler.interface";
import ProductCreatedEvent from "../product-created.event";

export default class SendEmailWherProcutIsCreatedEventHandler implements EventHandlerInterface<ProductCreatedEvent> {
    handle(event: ProductCreatedEvent) {
        console.log(`Send email to ${event.eventData.email} when product ${event.eventData.name} is created`)
    }
}