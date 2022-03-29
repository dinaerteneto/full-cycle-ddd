import Order from "../../domain/entity/order"
import OrderItem from "../../domain/entity/order-item"
import OrderRepositoryInterface from "../../domain/repository/order.repository.interface"
import OrderItemModel from "../db/sequelize/model/order-item.model"
import OrderModel from "../db/sequelize/model/order.model"

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        const { id, customerId } = entity

        await OrderModel.create({
            id,
            customer_id: customerId,
            total: entity.total(),
            items: entity.items.map(
                item => ({
                    id: item.id,
                    order_id: id,
                    product_id: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })
            )
        },
            {
                include: [{ model: OrderItemModel }]
            })
    }

    async update(entity: Order): Promise<void> {
        const { id } = entity
        // remove all items
        await OrderItemModel.destroy({ where: { order_id: id } })
        // add new itens
        Promise.all(
            entity.items.map(item => {
                OrderItemModel.create({
                    id: item.id,
                    order_id: id,
                    product_id: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })
            })
        )
        // update order
        await OrderModel.update(
            { id, total: entity.total() },
            { where: { id } }
        )
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: { id }
        })
        const orderItemModel = await OrderItemModel.findAll({
            where: { order_id: id }
        })

        const items: OrderItem[] = []
        orderItemModel.map(item => {
            const { id, name, price, product_id, quantity } = item
            const orderItem = new OrderItem(id, name, price, product_id, quantity)
            items.push(orderItem)
        })

        const { customer_id } = orderModel
        const order = new Order(id, customer_id, items)

        return order
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({ include: [{ model: OrderItemModel }] })
        const orders: Order[] = []
        orderModels.map(orderModel => {
            const { id, customer_id } = orderModel
            const items: OrderItem[] = []
            orderModel.items.map(item => {
                const { id, name, price, product_id, quantity } = item
                const orderItem = new OrderItem(id, name, price, product_id, quantity)
                items.push(orderItem)
            })
            const order = new Order(id, customer_id, items)
            orders.push(order)
        })
        return orders
    }
}