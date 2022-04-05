import faker from "@faker-js/faker"
import Address from "../../../domain/entity/address"
import Customer from "../../../domain/entity/customer"
import CustomerRepository from "../../../infra/repository/customer.repository"
import CustomerRepositoryEventDecorator from "./customer-repository-event.decorator"
import SendConsoleWhenProductIsCreatedEventHandler from "../../../domain/event/@shared/customer/handler/send-console-when-customer-is-created.handler"
import CustomerCreatedEvent from "../../../domain/event/@shared/customer/customer-created.event"
import { v4 as uuid } from "uuid"
import EventDispatcher from "../../../domain/event/@shared/event-dispatcher"

describe("Test Customer Event Decorator", () => {

    class CustomerStub extends Customer {
        async create(address: Address): Promise<void> {
            return Promise.resolve()
        }
    }
    class CustomerRepositoryStub implements CustomerRepository {
        async create(entity: Customer): Promise<void> {
            return Promise.resolve()
        }
        update(entity: Customer): Promise<void> {
            throw new Error("Method not implemented.")
        }
        find(id: string): Promise<Customer> {
            throw new Error("Method not implemented.")
        }
        findAll(): Promise<Customer[]> {
            throw new Error("Method not implemented.")
        }
    }

    const makeSut = () => {
        const customerMock = new CustomerStub(uuid(), faker.name.firstName())
        const customerRepository = new CustomerRepositoryStub()

        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendConsoleWhenProductIsCreatedEventHandler()
        const customerCreateEvent = new CustomerCreatedEvent(customerMock)

        const customerRepositoryDecorator = new CustomerRepositoryEventDecorator(
            customerRepository,
            [
                {
                    eventHandler,
                    event: customerCreateEvent,
                    eventDispatcher,
                    eventName: "EnviaConsoleLog1Handler"
                }
            ])

        return {
            customerMock,
            customerRepository,
            customerRepositoryDecorator,
            customerCreateEvent,
            eventHandler,
            eventDispatcher
        }
    }

    it("should call create CustomerRepository", async () => {
        const {
            customerMock,
            customerRepository,
            customerRepositoryDecorator
        } = makeSut()
        const createSpy = jest.spyOn(customerRepository, "create")
        await customerRepositoryDecorator.create(customerMock)
        expect(createSpy).toHaveBeenCalledWith(customerMock)
    })

    it("should call handle CustomerCreateEvent", async () => {
        const {
            customerMock,
            customerRepositoryDecorator,
            customerCreateEvent,
            eventHandler
        } = makeSut()
        const spyEventHandle = jest.spyOn(eventHandler, "handle")
        await customerRepositoryDecorator.create(customerMock)
        expect(spyEventHandle).toHaveBeenCalledWith(customerCreateEvent)
    })

    it("should call register EventDispatcher", async () => {
        const {
            customerMock,
            customerRepositoryDecorator,
            eventDispatcher
        } = makeSut()
        const spyEventDispatcher = jest.spyOn(eventDispatcher, "register")
        await customerRepositoryDecorator.create(customerMock)
        expect(spyEventDispatcher).toHaveBeenCalled()
    })

    it("should call notify EventDispatcher", async () => {
        const {
            customerMock,
            customerRepositoryDecorator,
            eventDispatcher
        } = makeSut()
        const spyEventDispatcher = jest.spyOn(eventDispatcher, "notify")
        await customerRepositoryDecorator.create(customerMock)
        expect(spyEventDispatcher).toHaveBeenCalled()
    })
})
