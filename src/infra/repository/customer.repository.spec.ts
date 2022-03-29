import { Sequelize } from "sequelize-typescript"
import Address from "../../domain/entity/address"
import Customer from "../../domain/entity/customer"
import CustomerModel from "../db/sequelize/model/customer.model"
import CustomerRepository from "./customer.repository"

describe("Customer repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory',
            logging: false,
            sync: { force: true }
        })
        sequelize.addModels([CustomerModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository()
       
        const customer = new Customer("any customer id", "any customer name")
        customer.address = new Address("any address", "any zipcode", "any country", "any city", 100)
        await customerRepository.create(customer)
       
        const customerModel = await CustomerModel.findOne({ where: { id: "any customer id" } })
        const { id, name, rewardPoints} = customer
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
       
        const customer = new Customer("any customer id", "any customer name")
        customer.address = new Address("any address", "any zipcode", "any country", "any city", 100)
        await customerRepository.create(customer)

        customer.changeName("customer name updated")
        await customerRepository.update(customer)

        const customerModel = await CustomerModel.findOne({ where: { id: "any customer id" } })
        const { id, name, rewardPoints} = customer
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
       
        const customer = new Customer("any customer id", "any customer name")
        customer.address = new Address("any address", "any zipcode", "any country", "any city", 100)
        await customerRepository.create(customer)

        const foundCustomer = await customerRepository.find("any customer id")

        expect(customer).toStrictEqual(foundCustomer)
    })

    it("should find all customer", async () => {
        const customerRepository = new CustomerRepository()

        const customer1 = new Customer("any customer id", "any customer name")
        customer1.address = new Address("any address", "any zipcode", "any country", "any city", 100)
        const customer2 = new Customer("other customer id", "other customer name")
        customer2.address = new Address("other address", "other zipcode", "other country", "other city", 200)

        await customerRepository.create(customer1)
        await customerRepository.create(customer2)

        const foundCustomer = await customerRepository.findAll()
        const customers = [customer1, customer2]

        expect(customers).toEqual(foundCustomer)
    })

})