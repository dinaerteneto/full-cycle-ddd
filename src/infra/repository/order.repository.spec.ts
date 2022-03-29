import { Sequelize } from "sequelize-typescript"
import Address from "../../domain/entity/address"
import Customer from "../../domain/entity/customer"
import Order from "../../domain/entity/order"
import OrderItem from "../../domain/entity/order-item"
import Product from "../../domain/entity/product"
import CustomerModel from "../db/sequelize/model/customer.model"
import OrderItemModel from "../db/sequelize/model/order-item.model"
import OrderModel from "../db/sequelize/model/order.model"
import ProductModel from "../db/sequelize/model/product.model"
import CustomerRepository from "./customer.repository"
import OrderRepository from "./order.repository"
import ProductRepository from "./product.repository"
import { v4 as uuid } from "uuid"
import faker from "@faker-js/faker"

describe("Order repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize.addModels([
            CustomerModel,
            ProductModel,
            OrderModel,
            OrderItemModel
        ])
        await sequelize.sync()
    })

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

    const makeSut = async () => {
        //create customer
        const customerRepository = new CustomerRepository()
        const customer = new Customer(uuid(), faker.name.firstName())
        const address = new Address(faker.address.streetAddress(), faker.address.zipCode(), faker.address.country(), faker.address.city(), faker.datatype.number())

        customer.changeAddress(address)
        await customerRepository.create(customer)

        //create product
        const productRepository = new ProductRepository()
        const product = new Product(uuid(), faker.commerce.product(), parseFloat(faker.commerce.price()))
        await productRepository.create(product)

        //create items for order
        const item = new OrderItem(uuid(), product.name, product.price, product.id, 1)
        const order = new Order(uuid(), customer.id, [item])

        //create order
        const orderRepository = new OrderRepository()
        await orderRepository.create(order)

        return { customer, product, item, order, orderRepository }
    }

    it("should create a order", async () => {
        const { order, item, customer } = await makeSut()
        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: item.id,
                    order_id: order.id,
                    product_id: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                }
            ]
        })

    })

    it("should update a order", async () => {
        const { customer, order, orderRepository } = await makeSut()
        // change attribute product
        const productRepository = new ProductRepository()
        const product = new Product(uuid(), faker.commerce.product(), parseFloat(faker.commerce.price()))
        await productRepository.create(product)

        // remove all itens and add new item
        order.removeAllItems()
        const item = new OrderItem(uuid(), product.name, product.price, product.id, faker.datatype.number())
        order.addItem(item)

        // update order with new item
        await orderRepository.update(order)

        // get order after changes
        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        })

        // test
        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: item.id,
                    order_id: order.id,
                    product_id: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                }
            ]
        })
    })

    it("should find a order", async () => {
        const { order, orderRepository } = await makeSut()
        const foundOrder = await orderRepository.find(order.id)
        expect(order).toStrictEqual(foundOrder)
    })

    it("should find all orders", async () => {
        const orders = [
            await (await makeSut()).order,
            await (await makeSut()).order,
            await (await makeSut()).order
        ]
        const orderRepository = new OrderRepository()
        const foundOrders = await orderRepository.findAll()
        expect(orders).toEqual(foundOrders)
    })
})