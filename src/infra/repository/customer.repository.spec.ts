import { Sequelize } from "sequelize-typescript"
import Address from "../../domain/entity/address"
import Customer from "../../domain/entity/customer"
import CustomerModel from "../db/sequelize/model/customer.model"
import CustomerRepository from "./customer.repository"
import { v4 as uuid } from "uuid"
import { faker as faker } from "@faker-js/faker"

describe("Customer repository test", () => {

    let sequelize: Sequelize

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory',
            logging: false,
            sync: { force: true }
        })
    })

    afterAll(async () => {
        await sequelize.dropAllSchemas({ logging: false })
        await sequelize.close()
    })

    beforeEach(async () => {
        sequelize.addModels([CustomerModel])
        await sequelize.sync()
    })

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository()

        const customer = new Customer(uuid(), faker.name.firstName())
        customer.address = new Address(faker.address.streetAddress(), faker.address.zipCode(), faker.address.country(), faker.address.city(), faker.datatype.number())
        await customerRepository.create(customer)

        const customerModel = await CustomerModel.findOne({ where: { id: customer.id } })
        const { id, name, rewardPoints } = customer
        const { street, zipcode, country, city } = customer.Address

        expect(customerModel.toJSON()).toStrictEqual({
            id,
            name,
            street,
            zipcode,
            country,
            city,
            rewardPoints,
            number: customer.Address.number.toString(),
            active: customer.isActive()
        })
    })

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository()

        const customer = new Customer(uuid(), faker.name.firstName())
        customer.address = new Address(faker.address.streetAddress(), faker.address.zipCode(), faker.address.country(), faker.address.city(), faker.datatype.number())
        await customerRepository.create(customer)

        customer.changeName(faker.name.firstName())
        await customerRepository.update(customer)

        const customerModel = await CustomerModel.findOne({ where: { id: customer.id } })
        const { id, name, rewardPoints } = customer
        const { street, zipcode, country, city } = customer.Address

        expect(customerModel.toJSON()).toStrictEqual({
            id,
            name,
            street,
            zipcode,
            country,
            city,
            rewardPoints,
            number: customer.Address.number.toString(),
            active: customer.isActive()
        })
    })

    it("should find a customer by id", async () => {
        const customerRepository = new CustomerRepository()

        const customer = new Customer(uuid(), faker.name.firstName())
        customer.address = new Address(faker.address.streetAddress(), faker.address.zipCode(), faker.address.country(), faker.address.city(), faker.datatype.number())
        await customerRepository.create(customer)

        const foundCustomer = await customerRepository.find(customer.id)

        expect(customer).toStrictEqual(foundCustomer)
    })

    it("should find all customer", async () => {
        const customerRepository = new CustomerRepository()

        const customer1 = new Customer(uuid(), faker.name.firstName())
        customer1.address = new Address(faker.address.streetAddress(), faker.address.zipCode(), faker.address.country(), faker.address.city(), faker.datatype.number())
        const customer2 = new Customer(uuid(), faker.name.firstName())
        customer2.address = new Address(faker.address.streetAddress(), faker.address.zipCode(), faker.address.country(), faker.address.city(), faker.datatype.number())

        await customerRepository.create(customer1)
        await customerRepository.create(customer2)

        const foundCustomer = await customerRepository.findAll()
        const customers = [customer1, customer2]

        expect(customers).toEqual(foundCustomer)
    })

})