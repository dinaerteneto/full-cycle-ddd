import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer.repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        const { id, name, rewardPoints } = entity
        const { street, zipcode, city, country, number } = entity.Address
        await CustomerModel.create({
            id,
            name,
            street,
            zipcode,
            city,
            country,
            number,
            rewardPoints,
            active: entity.isActive()
        })
    }
    async update(entity: Customer): Promise<void> {
        const { id, name, rewardPoints } = entity
        const { street, zipcode, city, country, number } = entity.Address
        await CustomerModel.update(
            {
                id,
                name,
                street,
                zipcode,
                city,
                country,
                number,
                rewardPoints,
                active: entity.isActive()
            },
            {
                where: { id }
            }
        )
    }
    async find(id: string): Promise<Customer> {
        let customerModel
        try {
            customerModel = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true })
        } catch (error) {
            throw new Error("Customer not found")
        }

        const { name } = customerModel
        const { street, zipcode, country, city, number, rewardPoints } = customerModel
        const customer = new Customer(id, name)
        const address = new Address(street, zipcode, country, city, parseInt(number))
        customer.changeAddress(address)
        customer.addRewardPoint(rewardPoints)

        return customer

    }
    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll()
        return customerModels.map(
            customerModel => {
                const { id, name, rewardPoints } = customerModel
                const { street, zipcode, country, city, number } = customerModel
                const customer = new Customer(id, name)
                const address = new Address(street, zipcode, country, city, parseInt(number))
                customer.changeAddress(address)
                customer.addRewardPoint(rewardPoints)

                return customer
            }
        )
    }

}