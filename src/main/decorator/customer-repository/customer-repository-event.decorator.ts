import customer from "../../../domain/entity/customer";
import CustomerCreatedEvent from "../../../domain/event/@shared/customer/customer-created.event";
import EventDispatcherInterface from "../../../domain/event/@shared/event-dispatcher.interface";
import EventHandlerInterface from "../../../domain/event/@shared/event-handler.interface";
import EventInterface from "../../../domain/event/@shared/event.interface";
import CustomerRepositoryInterface from "../../../domain/repository/customer.repository.interface";

type Events = {
    eventDispatcher: EventDispatcherInterface,
    event: EventInterface,
    eventHandler: EventHandlerInterface,
    eventName: string
}

export default class CustomerRepositoryDecorator implements CustomerRepositoryInterface {

    constructor(
        private readonly customerRepository: CustomerRepositoryInterface,
        private readonly events: [Events]) { }

    async create(entity: customer): Promise<void> {
        await this.customerRepository.create(entity);

        if (this.events.length <= 0) { return }
        this.events.forEach(event => {
            if (event.event instanceof CustomerCreatedEvent) {
                event.eventHandler.handle(event.event);
                event.eventDispatcher.register(event.eventName, event.eventHandler)
                event.eventDispatcher.notify(event.event)
            }
        })
    }
    update(entity: customer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    find(id: string): Promise<customer> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<customer[]> {
        throw new Error("Method not implemented.");
    }
}